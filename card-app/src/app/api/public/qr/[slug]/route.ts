import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureQr } from "@/lib/qr";

// Public QR image so it can be used in email signatures and printed material.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const u = await db.user.findUnique({ where: { slug: (await params).slug }, select: { id: true, status: true } });
  if (!u || u.status !== "ACTIVE") return new NextResponse("Not found", { status: 404 });
  const { png } = await ensureQr(u.id);
  return new NextResponse(new Uint8Array(png), { headers: { "content-type": "image/png", "cache-control": "public, max-age=3600" } });
}
