import type { Contact, User } from "@prisma/client";
import { db } from "./db";

// Server to server connection using an External Client App / Connected App with the
// OAuth 2.0 Client Credentials flow. One integration user creates the records and
// sets OwnerId to the matching Salesforce user (matched by email), so each record
// lands in the recruiter's or AE's name.

const API_VERSION = process.env.SF_API_VERSION || "v62.0";

type Token = { access_token: string; instance_url: string; expires: number };
let cached: Token | null = null;

export function salesforceConfigured(): boolean {
  return Boolean(process.env.SF_CLIENT_ID && process.env.SF_CLIENT_SECRET && process.env.SF_LOGIN_URL);
}

async function token(): Promise<Token> {
  if (cached && cached.expires > Date.now()) return cached;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: process.env.SF_CLIENT_ID!,
    client_secret: process.env.SF_CLIENT_SECRET!,
  });
  const res = await fetch(`${process.env.SF_LOGIN_URL!.replace(/\/$/, "")}/services/oauth2/token`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!res.ok) throw new Error(`Salesforce auth failed (${res.status}): ${await res.text()}`);
  const j = (await res.json()) as { access_token: string; instance_url: string };
  cached = { ...j, expires: Date.now() + 50 * 60_000 };
  return cached;
}

async function sf(pathname: string, init: RequestInit = {}) {
  const t = await token();
  const res = await fetch(`${t.instance_url}/services/data/${API_VERSION}${pathname}`, {
    ...init,
    headers: { authorization: `Bearer ${t.access_token}`, "content-type": "application/json", ...(init.headers || {}) },
  });
  if (res.status === 401) cached = null;
  const text = await res.text();
  const json = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = Array.isArray(json) ? json.map((e: { message: string }) => e.message).join("; ") : text;
    throw new Error(`Salesforce ${res.status}: ${msg}`);
  }
  return json;
}

async function ownerIdFor(user: User): Promise<string | undefined> {
  if (user.sfUserId) return user.sfUserId;
  const email = user.email.replace(/'/g, "\\'");
  const q = await sf(`/query?q=${encodeURIComponent(`SELECT Id FROM User WHERE Email = '${email}' AND IsActive = true LIMIT 1`)}`);
  const id = q?.records?.[0]?.Id as string | undefined;
  if (id) await db.user.update({ where: { id: user.id }, data: { sfUserId: id } });
  return id;
}

function objectFor(contact: Contact): string {
  // Candidates and clients can go to different objects, e.g. SF_OBJECT_CANDIDATE=Contact.
  if (contact.kind === "CANDIDATE" && process.env.SF_OBJECT_CANDIDATE) return process.env.SF_OBJECT_CANDIDATE;
  if (contact.kind === "CLIENT" && process.env.SF_OBJECT_CLIENT) return process.env.SF_OBJECT_CLIENT;
  return process.env.SF_OBJECT || "Lead";
}

function sourceLabel(c: Contact): string {
  return c.source === "SHARED_BACK" ? "Shared from digital business card" : c.source === "SCAN" ? "Scanned document" : "Entered manually";
}

function payload(obj: string, c: Contact, owner: User, ownerId?: string) {
  const description = [
    `${sourceLabel(c)} via RHM Cards by ${owner.firstName} ${owner.lastName} (${owner.email}).`,
    c.notes ? `Notes: ${c.notes}` : "",
    c.rawText ? `Scanned text:\n${c.rawText}` : "",
  ]
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 32000);
  const base: Record<string, unknown> = {
    FirstName: c.firstName || undefined,
    LastName: c.lastName || c.firstName || "Unknown",
    Email: c.email || undefined,
    Phone: c.phone || undefined,
    Title: c.title || undefined,
    Description: description,
  };
  if (ownerId) base.OwnerId = ownerId;
  if (obj === "Lead") {
    base.Company = c.company || "Unknown";
    base.Website = c.website || undefined;
    base.LeadSource = process.env.SF_LEAD_SOURCE || "Digital Business Card";
    if (c.address) base.Street = c.address;
  } else if (obj === "Contact") {
    base.LeadSource = process.env.SF_LEAD_SOURCE || "Digital Business Card";
    if (c.address) base.MailingStreet = c.address;
  }
  return base;
}

/** Pushes a contact to Salesforce and records the result on the row. */
export async function syncContact(contactId: string): Promise<{ ok: boolean; error?: string; sfId?: string }> {
  const c = await db.contact.findUniqueOrThrow({ where: { id: contactId }, include: { owner: true } });
  if (!salesforceConfigured()) {
    const error = "Salesforce is not connected yet. An admin needs to add the SF_* settings.";
    await db.contact.update({ where: { id: c.id }, data: { status: "FAILED", sfError: error } });
    return { ok: false, error };
  }
  const obj = objectFor(c);
  try {
    const ownerId = await ownerIdFor(c.owner).catch(() => undefined);
    const data = payload(obj, c, c.owner, ownerId);
    let res: { id: string };
    if (c.sfId && c.sfObject === obj) {
      await sf(`/sobjects/${obj}/${c.sfId}`, { method: "PATCH", body: JSON.stringify(data) });
      res = { id: c.sfId };
    } else {
      res = await sf(`/sobjects/${obj}`, {
        method: "POST",
        body: JSON.stringify(data),
        // Let the record save even when a duplicate rule only warns.
        headers: { "Sforce-Duplicate-Rule-Header": "allowSave=true" },
      });
    }
    await db.contact.update({
      where: { id: c.id },
      data: { status: "SYNCED", sfObject: obj, sfId: res.id, sfError: null, syncedAt: new Date() },
    });
    return { ok: true, sfId: res.id };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    await db.contact.update({ where: { id: c.id }, data: { status: "FAILED", sfError: error.slice(0, 2000) } });
    return { ok: false, error };
  }
}

export function sfRecordUrl(c: Pick<Contact, "sfId">): string | null {
  if (!c.sfId || !process.env.SF_INSTANCE_URL) return null;
  return `${process.env.SF_INSTANCE_URL.replace(/\/$/, "")}/${c.sfId}`;
}
