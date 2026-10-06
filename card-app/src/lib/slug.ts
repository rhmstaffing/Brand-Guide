import { db } from "./db";

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export async function uniqueSlug(base: string, excludeUserId?: string): Promise<string> {
  const root = slugify(base) || "card";
  for (let i = 0; i < 50; i++) {
    const candidate = i === 0 ? root : `${root}-${i + 1}`;
    const hit = await db.user.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!hit || hit.id === excludeUserId) return candidate;
  }
  return `${root}-${Date.now().toString(36)}`;
}
