import { NextResponse } from "next/server";
import { apiUser } from "@/lib/auth";
import { track } from "@/lib/events";

// Lets the share page log "I sent my card by text/email/AirDrop" so it shows on the dashboards.
export async function POST(req: Request) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { channel } = (await req.json().catch(() => ({}))) as { channel?: string };
  const allowed = ["sms", "email", "native", "copy", "nfc-write", "signature", "background"];
  if (!channel || !allowed.includes(channel)) return NextResponse.json({ error: "Unknown channel" }, { status: 400 });
  await track(user.id, "SHARE", { target: channel });
  return NextResponse.json({ ok: true });
}
