import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth";
import { slugify } from "@/lib/slug";
import { ensureQr } from "@/lib/qr";
import { audit } from "@/lib/audit";

const url = z.string().trim().max(300).refine((v) => v === "" || /^https?:\/\/\S+$/i.test(v), "Links must start with http:// or https://");

const Profile = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(60),
  lastName: z.string().trim().max(60),
  pronouns: z.string().trim().max(30),
  title: z.string().trim().max(100),
  jobRole: z.string().trim().max(40),
  officeId: z.string().trim().max(40),
  phone: z.string().trim().max(40),
  mobile: z.string().trim().max(40),
  bio: z.string().trim().max(600),
  photo: z.string().max(400_000).refine((v) => v === "" || v.startsWith("data:image/"), "Bad photo"),
  website: url,
  linkedin: url,
  calendarUrl: url,
  slug: z.string().trim().min(3, "Your link name needs at least 3 characters").max(40),
  links: z.array(z.object({ label: z.string().trim().min(1).max(40), url })).max(10),
});

export async function PATCH(req: Request) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const parsed = Profile.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Check the form" }, { status: 400 });
  const p = parsed.data;
  const slug = slugify(p.slug);
  if (slug.length < 3) return NextResponse.json({ error: "Your link name needs at least 3 letters or numbers." }, { status: 400 });
  if (slug !== user.slug) {
    const taken = await db.user.findUnique({ where: { slug }, select: { id: true } });
    if (taken) return NextResponse.json({ error: "That link name is taken. Try another." }, { status: 409 });
  }
  if (p.officeId) {
    const office = await db.office.findUnique({ where: { id: p.officeId }, select: { id: true } });
    if (!office) return NextResponse.json({ error: "Pick an office from the list." }, { status: 400 });
  }
  const n = (v: string) => (v === "" ? null : v);
  await db.user.update({
    where: { id: user.id },
    data: {
      firstName: p.firstName,
      lastName: p.lastName,
      pronouns: n(p.pronouns),
      title: n(p.title),
      jobRole: n(p.jobRole),
      officeId: n(p.officeId),
      phone: n(p.phone),
      mobile: n(p.mobile),
      bio: n(p.bio),
      photo: n(p.photo),
      website: n(p.website),
      linkedin: n(p.linkedin),
      calendarUrl: n(p.calendarUrl),
      links: p.links.filter((l) => l.url),
      slug,
    },
  });
  if (slug !== user.slug) {
    await audit("card.slug_changed", { actorId: user.id, targetUserId: user.id, details: { from: user.slug, to: slug } });
  }
  // Build the QR right away so it is ready on the share page.
  await ensureQr(user.id).catch((e) => console.error(e));
  return NextResponse.json({ ok: true, slug });
}
