import { createHash, randomBytes, randomInt, timingSafeEqual } from "crypto";

export function sha256(v: string): string {
  return createHash("sha256").update(v).digest("hex");
}

export function newToken(): string {
  return randomBytes(32).toString("base64url");
}

export function newCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

export function hashCode(email: string, code: string): string {
  return sha256(`${process.env.AUTH_SECRET || "dev"}:${email}:${code}`);
}

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function visitorHash(ip: string, ua: string): string {
  return sha256(`${process.env.AUTH_SECRET || "dev"}:${ip}:${ua}`).slice(0, 24);
}
