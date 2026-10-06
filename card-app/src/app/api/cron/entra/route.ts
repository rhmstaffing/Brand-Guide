import { NextResponse } from "next/server";
import { runEntraSync } from "@/lib/entra";
import { safeEqual } from "@/lib/crypto";

export const maxDuration = 300;

// Run on a schedule (every 15 to 60 minutes). Vercel Cron sends "Authorization: Bearer <CRON_SECRET>".
// Azure (Logic App, Function timer) or any scheduler can call it the same way.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET || "";
  const auth = req.headers.get("authorization") || "";
  if (!secret || !safeEqual(auth, `Bearer ${secret}`)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await runEntraSync("cron");
  return NextResponse.json(result, { status: result.errors.length ? 500 : 200 });
}
