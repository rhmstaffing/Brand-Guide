import type { Prisma, User } from "@prisma/client";
import { db } from "./db";
import { appUrl, isAllowedEmail } from "./config";
import { uniqueSlug } from "./slug";
import { audit } from "./audit";
import { archiveUser, restoreUser } from "./archive";
import { ensureQr } from "./qr";
import { sendNotice } from "./email";
import { getState, setState, tryLock, unlock } from "./syncState";

// Microsoft Entra ID (Azure AD) sync through Microsoft Graph.
//
// - New hires in Entra get a card automatically. If their Employee hire date is in the future,
//   the account waits as PENDING and turns on that day.
// - When an Entra account is disabled or deleted, the card account is archived: a ZIP of everything
//   is saved for admins, then the person is signed out, locked out, and their card goes offline.
// - If the same Entra account is turned back on (rehire), the card account is restored.
//
// Changes arrive two ways: Graph change notifications (near real time) and a scheduled sync
// (catches anything a notification missed, starts new hires on their start date, renews the
// notification subscription). Both run the same delta sync.

const GRAPH = () => (process.env.GRAPH_BASE_URL || "https://graph.microsoft.com/v1.0").replace(/\/$/, "");
const AUTHORITY = () => (process.env.ENTRA_AUTHORITY || "https://login.microsoftonline.com").replace(/\/$/, "");
const USER_FIELDS = "id,accountEnabled,mail,userPrincipalName,userType,givenName,surname,displayName,jobTitle,mobilePhone,businessPhones,officeLocation,department,employeeHireDate";
const LOCK = "entra:lock";

export function entraConfigured(): boolean {
  return Boolean(process.env.ENTRA_TENANT_ID && process.env.ENTRA_CLIENT_ID && process.env.ENTRA_CLIENT_SECRET);
}

/** When true, only people created by the Entra sync can sign in. */
export function entraOnly(): boolean {
  return entraConfigured() && process.env.ENTRA_ONLY_SYNCED_USERS === "true";
}

let token: { value: string; expires: number } | null = null;

async function graphToken(): Promise<string> {
  if (token && token.expires > Date.now()) return token.value;
  const res = await fetch(`${AUTHORITY()}/${process.env.ENTRA_TENANT_ID}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.ENTRA_CLIENT_ID!,
      client_secret: process.env.ENTRA_CLIENT_SECRET!,
      scope: "https://graph.microsoft.com/.default",
    }),
  });
  if (!res.ok) throw new Error(`Microsoft sign in failed (${res.status}): ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: j.access_token, expires: Date.now() + (j.expires_in - 120) * 1000 };
  return token.value;
}

class GraphError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function graph<T>(pathOrUrl: string, init: RequestInit = {}): Promise<T> {
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${GRAPH()}${pathOrUrl}`;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, {
      ...init,
      headers: { authorization: `Bearer ${await graphToken()}`, "content-type": "application/json", ...(init.headers || {}) },
    });
    if ((res.status === 429 || res.status >= 500) && attempt < 3) {
      const wait = Number(res.headers.get("retry-after") || 2 ** attempt * 2);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    if (res.status === 204) return undefined as T;
    const text = await res.text();
    if (!res.ok) throw new GraphError(res.status, `Graph ${res.status}: ${text.slice(0, 500)}`);
    return (text ? JSON.parse(text) : undefined) as T;
  }
}

type GraphUser = {
  id: string;
  accountEnabled?: boolean;
  mail?: string | null;
  userPrincipalName?: string | null;
  userType?: string | null;
  givenName?: string | null;
  surname?: string | null;
  displayName?: string | null;
  jobTitle?: string | null;
  mobilePhone?: string | null;
  businessPhones?: string[];
  officeLocation?: string | null;
  department?: string | null;
  employeeHireDate?: string | null;
  "@removed"?: { reason: string };
};

type Counts = { created: number; updated: number; archived: number; restored: number; activated: number; skipped: number; errors: string[] };
const newCounts = (): Counts => ({ created: 0, updated: 0, archived: 0, restored: 0, activated: 0, skipped: 0, errors: [] });

async function groupMembers(): Promise<Set<string> | null> {
  const gid = process.env.ENTRA_GROUP_ID;
  if (!gid) return null;
  const ids = new Set<string>();
  let next: string | undefined = `/groups/${gid}/transitiveMembers/microsoft.graph.user?$select=id&$top=999`;
  while (next) {
    const page: { value: { id: string }[]; "@odata.nextLink"?: string } = await graph(next);
    page.value.forEach((m) => ids.add(m.id));
    next = page["@odata.nextLink"];
  }
  return ids;
}

function guessJobRole(title: string | null | undefined): string | null {
  const t = (title || "").toLowerCase();
  if (t.includes("recruit") || t.includes("talent")) return "Recruiter";
  if (t.includes("account executive") || t.includes("business development") || /\bae\b/.test(t)) return "Account Executive";
  if (t.includes("branch manager")) return "Branch Manager";
  return null;
}

async function officeFor(location: string | null | undefined): Promise<string | null> {
  const loc = (location || "").trim();
  if (!loc) return null;
  const hit = await db.office.findFirst({ where: { OR: [{ name: { equals: loc, mode: "insensitive" } }, { entraNames: { has: loc } }] } });
  if (hit) return hit.id;
  if (process.env.ENTRA_CREATE_OFFICES === "false") return null;
  const created = await db.office.upsert({ where: { name: loc }, update: {}, create: { name: loc, entraNames: [loc] } });
  await audit("entra.office_created", { details: { name: loc } });
  return created.id;
}

type EntraValues = { firstName: string; lastName: string; title: string | null; mobile: string | null; phone: string | null; officeId: string | null; jobRole: string | null };

async function valuesFrom(g: GraphUser): Promise<EntraValues> {
  const [dFirst = "", ...dRest] = (g.displayName || "").split(" ");
  return {
    firstName: (g.givenName || dFirst || "").trim(),
    lastName: (g.surname || dRest.join(" ") || "").trim(),
    title: g.jobTitle?.trim() || null,
    mobile: g.mobilePhone?.trim() || null,
    phone: g.businessPhones?.[0]?.trim() || null,
    officeId: await officeFor(g.officeLocation),
    jobRole: guessJobRole(g.jobTitle),
  };
}

function startDate(g: GraphUser): Date | null {
  if (!g.employeeHireDate) return null;
  const d = new Date(g.employeeHireDate);
  return isNaN(d.getTime()) ? null : d;
}

async function welcome(u: Pick<User, "email" | "firstName" | "slug">) {
  await sendNotice(
    u.email,
    "Your RHM digital business card is ready",
    [
      `Hi ${u.firstName || "there"}, welcome to RHM Staffing Solutions.`,
      "Your digital business card and QR code are set up. Sign in with this email to add your photo, check your details, and add the QR to your phone wallet.",
      `Your card: ${appUrl()}/c/${u.slug}`,
    ],
    { href: `${appUrl()}/login`, label: "Sign in to RHM Cards" },
  ).catch((e) => console.error("welcome email failed", e));
}

/** Applies one Entra user to the card accounts. */
async function applyUser(g: GraphUser, members: Set<string> | null, c: Counts) {
  const email = (g.mail || g.userPrincipalName || "").trim().toLowerCase();
  const existing =
    (await db.user.findUnique({ where: { entraId: g.id } })) ?? (email ? await db.user.findUnique({ where: { email } }) : null);

  // Turned off in Entra: archive.
  if (g.accountEnabled === false) {
    if (existing && existing.status !== "ARCHIVED") {
      await archiveUser(existing.id, "entra-disabled");
      c.archived++;
    } else c.skipped++;
    return;
  }

  if (!isAllowedEmail(email) || (g.userType && g.userType !== "Member")) {
    c.skipped++;
    return;
  }
  const inScope = !members || members.has(g.id);
  if (!existing && !inScope) {
    c.skipped++;
    return;
  }

  const v = await valuesFrom(g);
  const starts = startDate(g);
  const notStarted = Boolean(starts && starts.getTime() > Date.now());

  if (!existing) {
    const u = await db.user.create({
      data: {
        email,
        slug: await uniqueSlug(`${v.firstName}-${v.lastName}`.trim() || email.split("@")[0]),
        status: notStarted ? "PENDING" : "ACTIVE",
        startsAt: starts,
        entraId: g.id,
        entraSyncedAt: new Date(),
        entraValues: v as Prisma.InputJsonValue,
        ...v,
      },
    });
    await audit("entra.card_created", { targetUserId: u.id, details: { status: u.status, startsAt: starts?.toISOString() ?? null } });
    c.created++;
    if (u.status === "ACTIVE") {
      await ensureQr(u.id).catch(() => {});
      await welcome(u);
    }
    return;
  }

  // Existing account: copy Entra changes into fields the person hasn't changed themselves.
  const prev = (existing.entraValues as Partial<EntraValues> | null) ?? {};
  const data: Prisma.UserUpdateInput = { entraId: g.id, entraSyncedAt: new Date(), entraValues: v as Prisma.InputJsonValue, startsAt: starts };
  for (const k of Object.keys(v) as (keyof EntraValues)[]) {
    const cur = existing[k] ?? null;
    if (cur === null || cur === "" || cur === (prev[k] ?? null)) {
      if (k === "officeId") data.office = v.officeId ? { connect: { id: v.officeId } } : { disconnect: true };
      else (data as Record<string, unknown>)[k] = v[k];
    }
  }
  if (email !== existing.email && isAllowedEmail(email)) {
    const clash = await db.user.findUnique({ where: { email } });
    if (!clash) data.email = email;
  }
  await db.user.update({ where: { id: existing.id }, data });
  c.updated++;

  if (existing.status === "ARCHIVED" && existing.archiveReason?.startsWith("entra")) {
    // Turned back on in Entra (rehire). Accounts an admin archived by hand stay archived.
    if (notStarted) await db.user.update({ where: { id: existing.id }, data: { status: "PENDING", archivedAt: null, archiveReason: null } });
    else await restoreUser(existing.id, null, "entra");
    c.restored++;
  } else if (existing.status === "PENDING" && !notStarted) {
    await db.user.update({ where: { id: existing.id }, data: { status: "ACTIVE" } });
    await audit("entra.start_date_reached", { targetUserId: existing.id });
    await ensureQr(existing.id).catch(() => {});
    await welcome(existing);
    c.activated++;
  }
}

/** Turns on PENDING accounts whose start date has arrived. */
async function activatePending(c: Counts) {
  const due = await db.user.findMany({ where: { status: "PENDING", OR: [{ startsAt: null }, { startsAt: { lte: new Date() } }] } });
  for (const u of due) {
    await db.user.update({ where: { id: u.id }, data: { status: "ACTIVE" } });
    await audit("entra.start_date_reached", { targetUserId: u.id });
    await ensureQr(u.id).catch(() => {});
    await welcome(u);
    c.activated++;
  }
}

async function getUser(id: string): Promise<GraphUser | null> {
  try {
    return await graph<GraphUser>(`/users/${id}?$select=${USER_FIELDS}`);
  } catch (e) {
    if (e instanceof GraphError && e.status === 404) return null;
    throw e;
  }
}

async function deltaSync(c: Counts) {
  const members = await groupMembers();
  let url: string | undefined = (await getState<string>("entra:deltaLink")) ?? `/users/delta?$select=id,accountEnabled,mail,userPrincipalName,userType`;
  const changed = new Map<string, GraphUser>();
  try {
    while (url) {
      const page: { value: GraphUser[]; "@odata.nextLink"?: string; "@odata.deltaLink"?: string } = await graph(url);
      for (const u of page.value) changed.set(u.id, u);
      if (page["@odata.deltaLink"]) await setState("entra:pendingDeltaLink", page["@odata.deltaLink"]);
      url = page["@odata.nextLink"];
    }
  } catch (e) {
    // An expired delta token means start over with a full read.
    if (e instanceof GraphError && (e.status === 410 || /syncStateNotFound|resyncRequired/i.test(e.message))) {
      await setState("entra:deltaLink", null);
      return deltaSync(c);
    }
    throw e;
  }

  const ids = [...changed.keys()];
  for (let i = 0; i < ids.length; i += 5) {
    await Promise.all(
      ids.slice(i, i + 5).map(async (id) => {
        try {
          const d = changed.get(id)!;
          const full = d["@removed"] ? null : await getUser(id);
          if (!full) {
            const existing = await db.user.findUnique({ where: { entraId: id } });
            if (existing && existing.status !== "ARCHIVED") {
              await archiveUser(existing.id, "entra-deleted");
              c.archived++;
            } else c.skipped++;
            return;
          }
          await applyUser(full, members, c);
        } catch (e) {
          c.errors.push(`${id}: ${(e as Error).message}`.slice(0, 300));
        }
      }),
    );
  }
  // Only move the bookmark forward once every change was handled.
  const next = await getState<string>("entra:pendingDeltaLink");
  if (next && c.errors.length === 0) await setState("entra:deltaLink", next);
}

type Sub = { id: string; expires: string };

/** Keeps a Graph change notification subscription alive so Entra changes arrive within minutes. */
async function ensureSubscription() {
  const secret = process.env.ENTRA_WEBHOOK_SECRET;
  if (!secret || !appUrl().startsWith("https://")) return "off";
  const expires = new Date(Date.now() + 28 * 864e5).toISOString(); // Graph allows up to ~29 days for users
  const sub = await getState<Sub>("entra:subscription");
  if (sub && new Date(sub.expires).getTime() - Date.now() > 3 * 864e5) return "ok";
  if (sub) {
    try {
      await graph(`/subscriptions/${sub.id}`, { method: "PATCH", body: JSON.stringify({ expirationDateTime: expires }) });
      await setState("entra:subscription", { id: sub.id, expires });
      return "renewed";
    } catch (e) {
      if (!(e instanceof GraphError && e.status === 404)) throw e;
    }
  }
  const created = await graph<{ id: string }>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      changeType: "updated,deleted",
      notificationUrl: `${appUrl()}/api/integrations/entra/notify`,
      resource: "users",
      expirationDateTime: expires,
      clientState: secret,
    }),
  });
  await setState("entra:subscription", { id: created.id, expires });
  return "created";
}

export type SyncResult = Counts & { at: string; trigger: string; ms: number; subscription?: string; busy?: boolean };

export async function runEntraSync(trigger: "cron" | "webhook" | "admin"): Promise<SyncResult> {
  const started = Date.now();
  const c = newCounts();
  if (!entraConfigured()) return { ...c, errors: ["Microsoft Entra is not connected."], at: new Date().toISOString(), trigger, ms: 0 };
  if (!(await tryLock(LOCK, 600))) {
    await setState("entra:rerun", true); // the running sync will go again when it finishes
    return { ...c, busy: true, at: new Date().toISOString(), trigger, ms: 0 };
  }
  let subscription: string | undefined;
  try {
    await activatePending(c);
    for (let pass = 0; pass < 3; pass++) {
      await setState("entra:rerun", false);
      await deltaSync(c);
      if (!(await getState<boolean>("entra:rerun"))) break;
    }
    if (trigger !== "webhook") subscription = await ensureSubscription().catch((e) => `error: ${(e as Error).message}`);
  } catch (e) {
    c.errors.push((e as Error).message.slice(0, 500));
  } finally {
    await unlock(LOCK);
  }
  const result: SyncResult = { ...c, errors: c.errors.slice(0, 20), at: new Date().toISOString(), trigger, ms: Date.now() - started, subscription };
  await setState("entra:lastRun", result);
  if (c.created || c.archived || c.restored || c.activated || c.errors.length) {
    await audit("entra.sync", { details: { trigger, created: c.created, archived: c.archived, restored: c.restored, activated: c.activated, errors: c.errors.length } });
  }
  return result;
}

export async function entraStatus() {
  const [lastRun, sub, delta] = await Promise.all([
    getState<SyncResult>("entra:lastRun"),
    getState<Sub>("entra:subscription"),
    getState<string>("entra:deltaLink"),
  ]);
  const linked = await db.user.count({ where: { entraId: { not: null } } });
  return { configured: entraConfigured(), lastRun, subscription: sub, initialSyncDone: Boolean(delta), linked, group: process.env.ENTRA_GROUP_ID || null };
}
