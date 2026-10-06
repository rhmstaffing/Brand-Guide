import { NextResponse } from "next/server";
import { destroyCurrentSession, getSession } from "@/lib/auth";
import { audit } from "@/lib/audit";

export async function POST(req: Request) {
  const s = await getSession();
  await destroyCurrentSession();
  if (s) await audit("auth.logout", { actorId: s.user.id, targetUserId: s.user.id });
  return NextResponse.redirect(new URL("/login", req.url), 303);
}
