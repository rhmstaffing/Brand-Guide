import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { loadPublicCard } from "@/lib/publicCard";
import { track } from "@/lib/events";
import { clientInfo } from "@/lib/request";
import { visitorHash } from "@/lib/crypto";
import { syncContact } from "@/lib/salesforce";
import { sendNotice } from "@/lib/email";
import { appUrl } from "@/lib/config";

const Body = z.object({
  slug: z.string().max(60),
  firstName: z.string().trim().min(1, "Add your first name").max(60),
  lastName: z.string().trim().min(1, "Add your last name").max(60),
  email: z.string().trim().max(120).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  company: z.string().trim().max(120).optional().default(""),
  title: z.string().trim().max(120).optional().default(""),
  notes: z.string().trim().max(1000).optional().default(""),
  kind: z.enum(["CANDIDATE", "CLIENT", "OTHER"]).default("OTHER"),
  consent: z.boolean(),
  website: z.string().optional(), // honeypot
});

// A visitor shares their info back from someone's public card.
// The contact is saved to the card owner and sent to Salesforce right away.
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check the form" }, { status: 400 });
  const b = parsed.data;
  if (b.website) return NextResponse.json({ ok: true }); // bot
  if (!b.consent) return NextResponse.json({ error: "Check the box so we can contact you." }, { status: 400 });
  if (!b.email && !b.phone) return NextResponse.json({ error: "Add an email or a phone number." }, { status: 400 });
  if (b.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });

  const owner = await loadPublicCard(b.slug);
  if (!owner) return NextResponse.json({ error: "This card is no longer active." }, { status: 404 });

  const { ip, userAgent } = await clientInfo();
  const visitor = visitorHash(ip, userAgent);
  const recent = await db.cardEvent.count({
    where: { type: "SHARED_BACK", visitor, createdAt: { gte: new Date(Date.now() - 60 * 60_000) } },
  });
  if (recent >= 5) return NextResponse.json({ error: "Too many tries. Wait a bit and try again." }, { status: 429 });

  const contact = await db.contact.create({
    data: {
      ownerId: owner.id,
      source: "SHARED_BACK",
      status: "READY",
      kind: b.kind,
      firstName: b.firstName,
      lastName: b.lastName,
      email: b.email || null,
      phone: b.phone || null,
      company: b.company || null,
      title: b.title || null,
      notes: b.notes || null,
      consent: true,
      reviewedAt: new Date(),
    },
  });
  await track(owner.id, "SHARED_BACK", { ip, userAgent, target: contact.id });
  const sync = await syncContact(contact.id);
  await sendNotice(
    owner.email,
    `${b.firstName} ${b.lastName} shared their info with you`,
    [
      `${b.firstName} ${b.lastName} shared their info from your digital card.`,
      [b.email, b.phone, b.company].filter(Boolean).join(" · "),
      sync.ok ? "It's already in Salesforce under your name." : "It did not reach Salesforce yet. Open the contact to retry.",
    ],
    { href: `${appUrl()}/contacts/${contact.id}`, label: "Open contact" },
  ).catch((e) => console.error("notice failed", e));
  return NextResponse.json({ ok: true });
}
