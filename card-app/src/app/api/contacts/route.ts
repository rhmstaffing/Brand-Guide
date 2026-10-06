import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { ContactFields, toData } from "@/lib/contacts";

// Manual entry. Saved as a draft until the user reviews and sends it.
export async function POST(req: Request) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const parsed = ContactFields.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Check the form" }, { status: 400 });
  const c = await db.contact.create({ data: { ownerId: user.id, source: "MANUAL", status: "DRAFT", ...toData(parsed.data) } });
  return NextResponse.json({ ok: true, id: c.id });
}
