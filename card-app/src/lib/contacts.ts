import { z } from "zod";
import { db } from "./db";
import type { SessionUser } from "./auth";

export const ContactFields = z.object({
  firstName: z.string().trim().max(80),
  lastName: z.string().trim().max(80),
  email: z.string().trim().max(160),
  phone: z.string().trim().max(60),
  company: z.string().trim().max(160),
  title: z.string().trim().max(160),
  website: z.string().trim().max(300),
  address: z.string().trim().max(400),
  notes: z.string().trim().max(8000),
  rawText: z.string().max(30000),
  kind: z.enum(["CANDIDATE", "CLIENT", "OTHER"]),
  tags: z.array(z.string().trim().min(1).max(30)).max(20),
});
export type ContactFields = z.infer<typeof ContactFields>;

export function toData(f: ContactFields) {
  const n = (v: string) => (v === "" ? null : v);
  return {
    firstName: f.firstName,
    lastName: f.lastName,
    email: n(f.email),
    phone: n(f.phone),
    company: n(f.company),
    title: n(f.title),
    website: n(f.website),
    address: n(f.address),
    notes: n(f.notes),
    rawText: n(f.rawText),
    kind: f.kind,
    tags: f.tags,
  };
}

/** Owner or admin can see and change a contact. */
export async function contactFor(user: SessionUser, id: string) {
  const c = await db.contact.findUnique({ where: { id } });
  if (!c) return null;
  if (c.ownerId !== user.id && user.role !== "ADMIN") return null;
  return c;
}
