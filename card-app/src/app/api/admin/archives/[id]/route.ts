import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { audit } from "@/lib/audit";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const me = await apiUser();
  if (!me || me.role !== "ADMIN") return NextResponse.json({ error: "Admins only" }, { status: 403 });
  const a = await db.accountArchive.findUnique({ where: { id: (await params).id }, include: { user: { select: { slug: true } } } });
  if (!a) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await audit("admin.archive_downloaded", { actorId: me.id, targetUserId: a.userId, details: { archiveId: a.id } });
  return new NextResponse(new Uint8Array(a.zip), {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${a.user.slug}-archive-${a.createdAt.toISOString().slice(0, 10)}.zip"`,
      "cache-control": "no-store",
    },
  });
}
