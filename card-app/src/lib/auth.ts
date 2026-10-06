import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Role, User } from "@prisma/client";
import { db } from "./db";
import { newToken, sha256 } from "./crypto";

export const SESSION_COOKIE = "rhm_session";
const SESSION_DAYS = 30;

export type SessionUser = User & { office: { id: string; name: string } | null };

export async function createSession(userId: string, userAgent: string, ip: string) {
  const token = newToken();
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await db.session.create({ data: { tokenHash: sha256(token), userId, userAgent, ip, expiresAt } });
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// Every request re-checks the session row and the user status, so a remote
// sign out or an archive takes effect on the very next click.
export async function getSession(): Promise<{ user: SessionUser; sessionId: string } | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const s = await db.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: { include: { office: { select: { id: true, name: true } } } } },
  });
  if (!s || s.revokedAt || s.expiresAt < new Date() || s.user.status !== "ACTIVE") return null;
  if (Date.now() - s.lastSeenAt.getTime() > 5 * 60_000) {
    await db.session.update({ where: { id: s.id }, data: { lastSeenAt: new Date() } }).catch(() => {});
  }
  return { user: s.user, sessionId: s.id };
}

export async function requireUser(): Promise<SessionUser> {
  const s = await getSession();
  if (!s) redirect("/login");
  return s.user;
}

export async function requireRole(...roles: Role[]): Promise<SessionUser> {
  const u = await requireUser();
  if (!roles.includes(u.role)) redirect("/dashboard");
  return u;
}

export async function destroyCurrentSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) {
    await db.session.updateMany({ where: { tokenHash: sha256(token) }, data: { revokedAt: new Date() } });
  }
  jar.delete(SESSION_COOKIE);
}

export async function revokeAllSessions(userId: string, revokedBy: string) {
  return db.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date(), revokedBy },
  });
}

// For API route handlers: returns null instead of redirecting.
export async function apiUser(): Promise<SessionUser | null> {
  const s = await getSession();
  return s?.user ?? null;
}
