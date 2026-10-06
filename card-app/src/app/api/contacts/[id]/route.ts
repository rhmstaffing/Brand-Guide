import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { ContactFields, contactFor, toData } from "@/lib/contacts";
import { audit } from "@/lib/audit";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const c = await contactFor(user, (await params).id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = ContactFields.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Check the form" }, { status: 400 });
  await db.contact.update({ where: { id: c.id }, data: toData(parsed.data) });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const c = await contactFor(user, (await params).id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.contact.delete({ where: { id: c.id } });
  await audit("contact.deleted", { actorId: user.id, targetUserId: c.ownerId, details: { contactId: c.id, name: `${c.firstName} ${c.lastName}` } });
  return NextResponse.json({ ok: true });
}
