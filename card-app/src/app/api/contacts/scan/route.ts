import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { ocrConfigured, scanImages } from "@/lib/ocr";
import { audit } from "@/lib/audit";

export const maxDuration = 120;

const TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
type MediaType = (typeof TYPES)[number];

// Takes 1 to 5 photos, reads printed text and handwriting, and saves a DRAFT contact.
// Nothing goes to Salesforce until the user reviews it and confirms twice.
export async function POST(req: Request) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!ocrConfigured()) return NextResponse.json({ error: "Scanning is not set up yet. An admin needs to add the ANTHROPIC_API_KEY." }, { status: 501 });
  const { images } = (await req.json().catch(() => ({}))) as { images?: string[] };
  if (!Array.isArray(images) || images.length === 0 || images.length > 5) {
    return NextResponse.json({ error: "Add 1 to 5 photos." }, { status: 400 });
  }
  const parts: { data: string; mediaType: MediaType }[] = [];
  for (const img of images) {
    const m = /^data:(image\/[a-z]+);base64,(.+)$/.exec(img || "");
    if (!m || !TYPES.includes(m[1] as MediaType) || m[2].length > 7_000_000) {
      return NextResponse.json({ error: "One of the photos could not be read. Use JPG or PNG." }, { status: 400 });
    }
    parts.push({ mediaType: m[1] as MediaType, data: m[2] });
  }
  let r;
  try {
    r = await scanImages(parts);
  } catch (e) {
    console.error("scan failed", e);
    return NextResponse.json({ error: (e as Error).message || "Scan failed. Try again." }, { status: 502 });
  }
  const c = await db.contact.create({
    data: {
      ownerId: user.id,
      source: "SCAN",
      status: "DRAFT",
      kind: r.kind,
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email || null,
      phone: r.phone || null,
      company: r.company || null,
      title: r.title || null,
      website: r.website || null,
      address: r.address || null,
      notes: r.notes || null,
      rawText: r.fullText || null,
      scanImage: images[0].length < 600_000 ? images[0] : null,
    },
  });
  await audit("contact.scanned", { actorId: user.id, targetUserId: user.id, details: { contactId: c.id, pages: images.length } });
  return NextResponse.json({ ok: true, id: c.id, uncertain: r.uncertain });
}
