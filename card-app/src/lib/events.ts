import { db } from "./db";
import { visitorHash } from "./crypto";

export const EVENT_TYPES = ["VIEW", "QR_SCAN", "LINK_CLICK", "VCARD_SAVE", "SHARE", "WALLET_ADD", "NFC_TAP", "SHARED_BACK"] as const;
export type EventType = (typeof EVENT_TYPES)[number];

export const EVENT_LABELS: Record<EventType, string> = {
  VIEW: "Link opens",
  QR_SCAN: "QR scans",
  LINK_CLICK: "Link clicks",
  VCARD_SAVE: "Contact saves",
  SHARE: "Shares sent",
  WALLET_ADD: "Wallet adds",
  NFC_TAP: "NFC taps",
  SHARED_BACK: "Info shared back",
};

export async function track(
  userId: string,
  type: EventType,
  opts: { target?: string; source?: string; ip?: string; userAgent?: string } = {},
) {
  await db.cardEvent
    .create({
      data: {
        userId,
        type,
        target: opts.target?.slice(0, 300),
        source: opts.source?.slice(0, 40),
        userAgent: opts.userAgent?.slice(0, 300),
        visitor: opts.ip ? visitorHash(opts.ip, opts.userAgent || "") : undefined,
      },
    })
    .catch((e) => console.error("track failed", e));
}

const BOT = /bot|crawl|spider|preview|slurp|facebookexternalhit|whatsapp|slackbot|linkedinbot|embedly|discord|telegram/i;
export const isBot = (ua: string) => BOT.test(ua);
