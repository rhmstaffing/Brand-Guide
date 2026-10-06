import { NextResponse } from "next/server";
import { loadPublicCard } from "@/lib/publicCard";
import { buildVCard } from "@/lib/vcard";
import { isBot, track } from "@/lib/events";
import { clientInfo } from "@/lib/request";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const u = await loadPublicCard((await params).slug);
  if (!u) return new NextResponse("Not found", { status: 404 });
  const { ip, userAgent } = await clientInfo();
  if (!isBot(userAgent)) await track(u.id, "VCARD_SAVE", { target: "vcard", ip, userAgent });
  const name = `${u.firstName}-${u.lastName}`.replace(/[^\w-]/g, "") || "contact";
  return new NextResponse(buildVCard(u), {
    headers: {
      "content-type": "text/vcard; charset=utf-8",
      "content-disposition": `attachment; filename="${name}.vcf"`,
      "cache-control": "no-store",
    },
  });
}
