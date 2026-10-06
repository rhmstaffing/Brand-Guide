import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { ContactFields, contactFor, toData } from "@/lib/contacts";
import { syncContact } from "@/lib/salesforce";
import { audit } from "@/lib/audit";

const Body = z.object({
  fields: ContactFields,
  // Both warnings in the app must be answered "yes" before anything is sent.
  reviewed: z.literal(true),
  confirmed: z.literal(true),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const c = await contactFor(user, (await params).id);
  if (!c) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Review the contact and confirm before sending." }, { status: 400 });
  const f = parsed.data.fields;
  if (!f.lastName && !f.firstName) return NextResponse.json({ error: "Add at least a name before sending." }, { status: 400 });
  if (!f.email && !f.phone) return NextResponse.json({ error: "Add an email or phone number before sending." }, { status: 400 });
  await db.contact.update({ where: { id: c.id }, data: { ...toData(f), status: "READY", reviewedAt: new Date() } });
  const r = await syncContact(c.id);
  await audit(r.ok ? "contact.sent_to_salesforce" : "contact.salesforce_failed", {
    actorId: user.id,
    targetUserId: c.ownerId,
    details: { contactId: c.id, sfId: r.sfId ?? null, error: r.error ?? null },
  });
  if (!r.ok) return NextResponse.json({ error: r.error }, { status: 502 });
  return NextResponse.json({ ok: true, sfId: r.sfId });
}
