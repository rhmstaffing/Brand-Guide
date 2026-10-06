import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ALLOWED_DOMAIN, isAllowedEmail } from "@/lib/config";
import { hashCode, newCode } from "@/lib/crypto";
import { sendLoginCode } from "@/lib/email";
import { clientInfo } from "@/lib/request";

export async function POST(req: Request) {
  const { email: raw } = (await req.json().catch(() => ({}))) as { email?: string };
  const email = (raw || "").trim().toLowerCase();
  if (!isAllowedEmail(email)) {
    return NextResponse.json({ error: `Use your @${ALLOWED_DOMAIN} email address.` }, { status: 400 });
  }
  const user = await db.user.findUnique({ where: { email }, select: { status: true } });
  if (user?.status === "TERMINATED") {
    return NextResponse.json({ error: "This account is turned off. Talk to your manager or marketing." }, { status: 403 });
  }
  const recent = await db.loginCode.count({ where: { email, createdAt: { gte: new Date(Date.now() - 15 * 60_000) } } });
  if (recent >= 5) {
    return NextResponse.json({ error: "Too many codes requested. Wait 15 minutes and try again." }, { status: 429 });
  }
  const code = newCode();
  const { ip } = await clientInfo();
  await db.loginCode.create({
    data: { email, codeHash: hashCode(email, code), expiresAt: new Date(Date.now() + 10 * 60_000), ip },
  });
  try {
    await sendLoginCode(email, code);
  } catch (e) {
    console.error("send code failed", e);
    return NextResponse.json({ error: "We couldn't send the email. Try again in a minute." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
