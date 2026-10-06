export const ALLOWED_DOMAIN = "rhmstaffing.net";

export function appUrl(): string {
  return (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedEmail(email: string): boolean {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf("@");
  if (at < 1) return false;
  return e.slice(at + 1) === ALLOWED_DOMAIN && /^[a-z0-9._%+-]+$/.test(e.slice(0, at));
}

export function cardUrl(slug: string): string {
  return `${appUrl()}/c/${slug}`;
}

// The QR points at the card with ?s=qr so scans are counted separately from link opens.
export function qrTarget(slug: string): string {
  return `${cardUrl(slug)}?s=qr`;
}
