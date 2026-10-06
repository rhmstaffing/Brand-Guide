import { NextResponse } from "next/server";
import { allowedTargets, loadPublicCard, toCardData } from "@/lib/publicCard";
import { isBot, track } from "@/lib/events";
import { clientInfo } from "@/lib/request";
import { cardUrl } from "@/lib/config";

// Counts a click on a card button, then sends the visitor on. Only the card's own links are allowed.
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const to = new URL(req.url).searchParams.get("to") || "";
  const u = await loadPublicCard(slug);
  if (!u) return new NextResponse("Not found", { status: 404 });
  if (!allowedTargets(toCardData(u)).has(to)) return NextResponse.redirect(cardUrl(slug), 302);
  const { ip, userAgent } = await clientInfo();
  if (!isBot(userAgent)) await track(u.id, "LINK_CLICK", { target: to, ip, userAgent });
  return new NextResponse(null, { status: 302, headers: { location: to, "cache-control": "no-store" } });
}
