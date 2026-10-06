import { db } from "./db";
import type { CardData } from "@/components/CardView";

export async function loadPublicCard(slug: string) {
  const u = await db.user.findUnique({ where: { slug }, include: { office: { select: { name: true, address: true } } } });
  if (!u || u.status !== "ACTIVE") return null;
  return u;
}

export function toCardData(u: NonNullable<Awaited<ReturnType<typeof loadPublicCard>>>): CardData {
  return {
    firstName: u.firstName,
    lastName: u.lastName,
    pronouns: u.pronouns ?? "",
    title: u.title ?? "",
    office: u.office?.name ?? "",
    phone: u.phone ?? "",
    mobile: u.mobile ?? "",
    bio: u.bio ?? "",
    photo: u.photo ?? "",
    website: u.website ?? "",
    linkedin: u.linkedin ?? "",
    calendarUrl: u.calendarUrl ?? "",
    email: u.email,
    links: (u.links as { label: string; url: string }[]) ?? [],
  };
}

/** Every destination a card is allowed to redirect to. Anything else is refused (no open redirects). */
export function allowedTargets(d: CardData): Set<string> {
  const s = new Set<string>([`mailto:${d.email}`]);
  for (const p of [d.mobile, d.phone]) {
    if (p) {
      const n = p.replace(/[^\d+]/g, "");
      s.add(`tel:${n}`);
      s.add(`sms:${n}`);
    }
  }
  for (const u of [d.website, d.linkedin, d.calendarUrl, ...d.links.map((l) => l.url)]) if (u) s.add(u);
  return s;
}
