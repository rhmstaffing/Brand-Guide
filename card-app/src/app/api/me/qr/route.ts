import { NextResponse } from "next/server";
import { apiUser } from "@/lib/auth";
import { ensureQr } from "@/lib/qr";

export async function GET(req: Request) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const download = new URL(req.url).searchParams.has("download");
  const { png, source } = await ensureQr(user.id);
  return new NextResponse(new Uint8Array(png), {
    headers: {
      "content-type": "image/png",
      "cache-control": "private, max-age=60",
      "x-qr-source": source,
      ...(download ? { "content-disposition": `attachment; filename="${user.slug}-qr.png"` } : {}),
    },
  });
}

export async function POST() {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const { source } = await ensureQr(user.id, true);
  return NextResponse.json({ ok: true, source });
}
