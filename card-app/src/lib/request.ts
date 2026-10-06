import { headers } from "next/headers";

export async function clientInfo() {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || h.get("x-real-ip") || "").split(",")[0].trim() || "unknown";
  return { ip, userAgent: h.get("user-agent") || "" };
}
