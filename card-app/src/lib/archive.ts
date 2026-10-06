import { strToU8, zipSync } from "fflate";
import { db } from "./db";
import { toCsv } from "./csv";
import { revokeAllSessions } from "./auth";
import { audit } from "./audit";
import { adminEmails, appUrl } from "./config";
import { sendNotice } from "./email";

export type ArchiveReason = "admin" | "entra-disabled" | "entra-deleted" | "export";

/** Builds a ZIP of everything saved in an account and stores it in the database. */
export async function buildArchive(userId: string, reason: ArchiveReason, createdById?: string | null) {
  const u = await db.user.findUniqueOrThrow({ where: { id: userId }, include: { office: true } });
  const [contacts, events, logs, sessions] = await Promise.all([
    db.contact.findMany({ where: { ownerId: userId }, orderBy: { createdAt: "asc" } }),
    db.cardEvent.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
    db.auditLog.findMany({
      where: { OR: [{ targetUserId: userId }, { actorId: userId }] },
      orderBy: { createdAt: "asc" },
      include: { actor: { select: { email: true } } },
    }),
    db.session.findMany({ where: { userId }, orderBy: { createdAt: "asc" } }),
  ]);

  const files: Record<string, Uint8Array> = {};
  const now = new Date();
  files["README.txt"] = strToU8(
    [
      `RHM Cards account archive`,
      `Person: ${u.firstName} ${u.lastName} <${u.email}>`,
      `Made: ${now.toISOString()}`,
      `Reason: ${reason}`,
      ``,
      `contacts.csv       every contact this person saved (open in Excel)`,
      `contacts.json      the same contacts with every field, including scanned text`,
      `scans/             the photo kept from each scanned document`,
      `card-activity.csv  every open, scan, click and save of their card`,
      `account-log.csv    logins, sign outs and admin changes`,
      `sessions.csv       devices they signed in on`,
      `profile.json       their card details`,
      `qr-code.png        their QR code`,
    ].join("\n"),
  );
  const { qrPng, photo, ...profile } = u;
  files["profile.json"] = strToU8(JSON.stringify({ ...profile, hasPhoto: Boolean(photo) }, null, 2));
  if (qrPng) files["qr-code.png"] = new Uint8Array(qrPng);
  if (photo?.startsWith("data:image/jpeg;base64,")) files["photo.jpg"] = Buffer.from(photo.split(",")[1], "base64");

  files["contacts.csv"] = strToU8(
    toCsv(
      ["First name", "Last name", "Email", "Phone", "Company", "Title", "Website", "Address", "Type", "Source", "Status", "Salesforce object", "Salesforce ID", "Tags", "Notes", "Created", "Sent to Salesforce"],
      contacts.map((c) => [c.firstName, c.lastName, c.email, c.phone, c.company, c.title, c.website, c.address, c.kind, c.source, c.status, c.sfObject, c.sfId, c.tags.join("; "), c.notes, c.createdAt, c.syncedAt]),
    ),
  );
  files["contacts.json"] = strToU8(JSON.stringify(contacts.map(({ scanImage, ...c }) => ({ ...c, scanFile: scanImage ? `scans/${c.id}.jpg` : null })), null, 2));
  for (const c of contacts) {
    const m = c.scanImage && /^data:image\/\w+;base64,(.+)$/.exec(c.scanImage);
    if (m) files[`scans/${c.id}.jpg`] = Buffer.from(m[1], "base64");
  }
  files["card-activity.csv"] = strToU8(toCsv(["When", "Type", "Target", "Source", "Visitor", "Device"], events.map((e) => [e.createdAt, e.type, e.target, e.source, e.visitor, e.userAgent])));
  files["account-log.csv"] = strToU8(toCsv(["When", "Action", "By", "Details"], logs.map((l) => [l.createdAt, l.action, l.actor?.email ?? "", l.details ? JSON.stringify(l.details) : ""])));
  files["sessions.csv"] = strToU8(toCsv(["Signed in", "Last seen", "Signed out", "IP", "Device"], sessions.map((s) => [s.createdAt, s.lastSeenAt, s.revokedAt, s.ip, s.userAgent])));

  const folder = `${u.slug}-${now.toISOString().slice(0, 10)}`;
  const zip = zipSync(Object.fromEntries(Object.entries(files).map(([k, v]) => [`${folder}/${k}`, v])), { level: 6 });
  return db.accountArchive.create({
    data: { userId, reason, createdById: createdById ?? null, contactCount: contacts.length, eventCount: events.length, sizeBytes: zip.length, zip },
    select: { id: true, sizeBytes: true, contactCount: true },
  });
}

/**
 * Archives an account: saves a downloadable copy of everything first, then locks the person out,
 * signs out every device and takes their public card offline. Contacts stay in the database too,
 * so company dashboards keep their history.
 */
export async function archiveUser(userId: string, reason: Exclude<ArchiveReason, "export">, actorId?: string | null) {
  const u = await db.user.findUniqueOrThrow({ where: { id: userId } });
  if (u.status === "ARCHIVED") return null;
  const archive = await buildArchive(userId, reason, actorId);
  await db.user.update({ where: { id: userId }, data: { status: "ARCHIVED", archivedAt: new Date(), archiveReason: reason } });
  const r = await revokeAllSessions(userId, actorId ?? reason);
  await audit("account.archived", { actorId: actorId ?? null, targetUserId: userId, details: { reason, archiveId: archive.id, sessions: r.count, contacts: archive.contactCount } });
  const name = `${u.firstName} ${u.lastName}`.trim() || u.email;
  for (const to of adminEmails()) {
    await sendNotice(
      to,
      `${name}'s RHM Cards account was archived`,
      [
        `${name} (${u.email}) was archived${reason.startsWith("entra") ? " because their Microsoft account was turned off" : ""}.`,
        `They are signed out and locked out, and their card is offline. ${archive.contactCount} contacts were saved in the archive.`,
      ],
      { href: `${appUrl()}/admin/users/${userId}`, label: "Download the archive" },
    ).catch((e) => console.error("notice failed", e));
  }
  return archive;
}

export async function restoreUser(userId: string, actorId?: string | null, via = "admin") {
  await db.user.update({ where: { id: userId }, data: { status: "ACTIVE", archivedAt: null, archiveReason: null } });
  await audit("account.restored", { actorId: actorId ?? null, targetUserId: userId, details: { via } });
}
