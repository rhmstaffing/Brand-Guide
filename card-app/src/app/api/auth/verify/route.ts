import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminEmails, isAllowedEmail } from "@/lib/config";
import { hashCode, safeEqual } from "@/lib/crypto";
import { createSession } from "@/lib/auth";
import { uniqueSlug } from "@/lib/slug";
import { audit } from "@/lib/audit";
import { clientInfo } from "@/lib/request";
import { entraOnly } from "@/lib/entra";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { email?: string; code?: string };
  const email = (body.email || "").trim().toLowerCase();
  const code = (body.code || "").replace(/\D/g, "");
  if (!isAllowedEmail(email) || code.length !== 6) {
    return NextResponse.json({ error: "Enter the 6 digit code from your email." }, { status: 400 });
  }
  const row = await db.loginCode.findFirst({
    where: { email, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
  if (!row || row.attempts >= 5) {
    return NextResponse.json({ error: "That code expired. Request a new one." }, { status: 400 });
  }
  if (!safeEqual(row.codeHash, hashCode(email, code))) {
    await db.loginCode.update({ where: { id: row.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ error: "That code doesn't match. Check the email and try again." }, { status: 400 });
  }
  await db.loginCode.update({ where: { id: row.id }, data: { usedAt: new Date() } });

  const { ip, userAgent } = await clientInfo();
  let user = await db.user.findUnique({ where: { email } });
  const isAdmin = adminEmails().includes(email);
  if (!user && entraOnly() && !adminEmails().includes(email)) {
    return NextResponse.json({ error: "We don't have a card for this email yet. Talk to your manager or marketing." }, { status: 403 });
  }
  if (!user) {
    const local = email.split("@")[0];
    const [first = "", last = ""] = local.split(/[._-]/);
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    user = await db.user.create({
      data: {
        email,
        slug: await uniqueSlug(local.replace(/[._]/g, "-")),
        firstName: cap(first),
        lastName: cap(last),
        role: isAdmin ? "ADMIN" : "USER",
      },
    });
    await audit("user.created", { actorId: user.id, targetUserId: user.id, ip });
  } else if (isAdmin && user.role !== "ADMIN") {
    user = await db.user.update({ where: { id: user.id }, data: { role: "ADMIN" } });
  }
  if (user.status !== "ACTIVE") {
    return NextResponse.json({ error: "This account is turned off. Talk to your manager or marketing." }, { status: 403 });
  }
  await createSession(user.id, userAgent, ip);
  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await audit("auth.login", { actorId: user.id, targetUserId: user.id, ip, details: { userAgent } });
  const needsSetup = !user.title || !user.officeId;
  return NextResponse.json({ ok: true, next: needsSetup ? "/card?welcome=1" : "/dashboard" });
}
