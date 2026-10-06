import { after, NextResponse } from "next/server";
import { runEntraSync } from "@/lib/entra";
import { safeEqual } from "@/lib/crypto";

// Microsoft Graph calls this when a user changes in Entra ID.
// Graph needs an answer within a few seconds, so the sync runs after the response.
export async function POST(req: Request) {
  const validationToken = new URL(req.url).searchParams.get("validationToken");
  if (validationToken) {
    return new NextResponse(validationToken, { headers: { "content-type": "text/plain" } });
  }
  const secret = process.env.ENTRA_WEBHOOK_SECRET || "";
  const body = (await req.json().catch(() => ({}))) as { value?: { clientState?: string }[] };
  const valid = Boolean(secret) && (body.value || []).some((n) => n.clientState && safeEqual(n.clientState, secret));
  if (!valid) return NextResponse.json({ error: "Bad clientState" }, { status: 401 });
  after(() => runEntraSync("webhook").catch((e) => console.error("entra webhook sync failed", e)));
  return new NextResponse(null, { status: 202 });
}
