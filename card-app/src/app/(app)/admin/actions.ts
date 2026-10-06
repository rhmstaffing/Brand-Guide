"use server";
import { revalidatePath } from "next/cache";
import type { Role } from "@prisma/client";
import { db } from "@/lib/db";
import { requireRole, revokeAllSessions } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { isAllowedEmail } from "@/lib/config";
import { uniqueSlug } from "@/lib/slug";
import { archiveUser, buildArchive, restoreUser } from "@/lib/archive";
import { runEntraSync } from "@/lib/entra";

async function admin() {
  return requireRole("ADMIN");
}

function refresh(userId?: string) {
  revalidatePath("/admin");
  if (userId) revalidatePath(`/admin/users/${userId}`);
}

export async function signOutEverywhere(form: FormData) {
  const me = await admin();
  const userId = String(form.get("userId"));
  const r = await revokeAllSessions(userId, me.id);
  await audit("admin.sign_out_everywhere", { actorId: me.id, targetUserId: userId, details: { sessions: r.count } });
  refresh(userId);
}

export async function revokeSession(form: FormData) {
  const me = await admin();
  const sessionId = String(form.get("sessionId"));
  const s = await db.session.update({ where: { id: sessionId }, data: { revokedAt: new Date(), revokedBy: me.id } });
  await audit("admin.revoke_session", { actorId: me.id, targetUserId: s.userId, details: { sessionId } });
  refresh(s.userId);
}

// Archiving saves a downloadable copy of the account, signs out every device,
// blocks login and takes their public card offline.
export async function archive(form: FormData) {
  const me = await admin();
  const userId = String(form.get("userId"));
  if (userId === me.id) throw new Error("You can't archive your own account.");
  await archiveUser(userId, "admin", me.id);
  refresh(userId);
}

export async function restore(form: FormData) {
  const me = await admin();
  const userId = String(form.get("userId"));
  await restoreUser(userId, me.id);
  refresh(userId);
}

// A copy of everything in the account, without locking it.
export async function exportAccount(form: FormData) {
  const me = await admin();
  const userId = String(form.get("userId"));
  const a = await buildArchive(userId, "export", me.id);
  await audit("admin.export_account", { actorId: me.id, targetUserId: userId, details: { archiveId: a.id } });
  refresh(userId);
}

export async function syncEntraNow() {
  const me = await admin();
  await runEntraSync("admin");
  await audit("admin.entra_sync", { actorId: me.id });
  refresh();
}

export async function setRole(form: FormData) {
  const me = await admin();
  const userId = String(form.get("userId"));
  const role = String(form.get("role")) as Role;
  if (!["USER", "MANAGER", "ADMIN"].includes(role)) return;
  if (userId === me.id && role !== "ADMIN") throw new Error("You can't remove your own admin access.");
  await db.user.update({ where: { id: userId }, data: { role } });
  await audit("admin.set_role", { actorId: me.id, targetUserId: userId, details: { role } });
  refresh(userId);
}

export async function setOffice(form: FormData) {
  const me = await admin();
  const userId = String(form.get("userId"));
  const officeId = String(form.get("officeId") || "") || null;
  await db.user.update({ where: { id: userId }, data: { officeId } });
  await audit("admin.set_office", { actorId: me.id, targetUserId: userId, details: { officeId } });
  refresh(userId);
}

// Pre-create someone so they show up on dashboards before their first login.
export async function inviteUser(form: FormData) {
  const me = await admin();
  const email = String(form.get("email") || "").trim().toLowerCase();
  if (!isAllowedEmail(email)) throw new Error("Only @rhmstaffing.net emails can be added.");
  const exists = await db.user.findUnique({ where: { email } });
  if (exists) return;
  const local = email.split("@")[0];
  const [first = "", last = ""] = local.split(/[._-]/);
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const u = await db.user.create({
    data: { email, slug: await uniqueSlug(local.replace(/[._]/g, "-")), firstName: cap(first), lastName: cap(last), officeId: String(form.get("officeId") || "") || null },
  });
  await audit("admin.add_user", { actorId: me.id, targetUserId: u.id });
  refresh();
}

export async function saveOffice(form: FormData) {
  const me = await admin();
  const id = String(form.get("id") || "");
  const data = {
    name: String(form.get("name") || "").trim(),
    address: String(form.get("address") || "").trim() || null,
    phone: String(form.get("phone") || "").trim() || null,
  };
  if (!data.name) return;
  if (id) await db.office.update({ where: { id }, data });
  else await db.office.create({ data });
  await audit(id ? "admin.update_office" : "admin.add_office", { actorId: me.id, details: data });
  refresh();
}

export async function deleteOffice(form: FormData) {
  const me = await admin();
  const id = String(form.get("id"));
  await db.user.updateMany({ where: { officeId: id }, data: { officeId: null } });
  await db.office.delete({ where: { id } });
  await audit("admin.delete_office", { actorId: me.id, details: { id } });
  refresh();
}

export async function transferContacts(form: FormData) {
  const me = await admin();
  const from = String(form.get("userId"));
  const to = String(form.get("toUserId") || "");
  if (!to || to === from) return;
  const r = await db.contact.updateMany({ where: { ownerId: from }, data: { ownerId: to } });
  await audit("admin.transfer_contacts", { actorId: me.id, targetUserId: from, details: { to, count: r.count } });
  refresh(from);
}
