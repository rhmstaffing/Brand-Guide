import type { User } from "@prisma/client";
import { cardUrl } from "./config";

const esc = (v: string) => v.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

export function buildVCard(u: User & { office: { name: string; address: string | null } | null }): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(u.lastName)};${esc(u.firstName)};;;`,
    `FN:${esc(`${u.firstName} ${u.lastName}`.trim() || u.email)}`,
    "ORG:RHM Staffing Solutions",
  ];
  if (u.title) lines.push(`TITLE:${esc(u.title)}`);
  lines.push(`EMAIL;TYPE=INTERNET,WORK:${u.email}`);
  if (u.mobile) lines.push(`TEL;TYPE=CELL:${u.mobile}`);
  if (u.phone) lines.push(`TEL;TYPE=WORK,VOICE:${u.phone}`);
  if (u.office?.address) lines.push(`ADR;TYPE=WORK:;;${esc(u.office.address)};;;;`);
  lines.push(`URL:${cardUrl(u.slug)}`);
  if (u.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${u.linkedin}`);
  if (u.photo?.startsWith("data:image/jpeg;base64,")) {
    lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${u.photo.slice("data:image/jpeg;base64,".length)}`);
  }
  if (u.bio) lines.push(`NOTE:${esc(u.bio)}`);
  lines.push("END:VCARD");
  return lines.join("\r\n");
}
