import { db } from "./db";
import type { EventType } from "./events";

export const RANGES = { "7": 7, "30": 30, "90": 90, "365": 365 } as const;
export type RangeKey = keyof typeof RANGES;

export function parseRange(v: string | undefined): { key: RangeKey; days: number; since: Date } {
  const key = (v && v in RANGES ? v : "30") as RangeKey;
  const days = RANGES[key];
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (days - 1));
  return { key, days, since };
}

// "Giving their info away" = every time someone else opened, scanned, saved or tapped their card.
export const GIVEAWAY_TYPES: EventType[] = ["VIEW", "QR_SCAN", "VCARD_SAVE", "WALLET_ADD", "NFC_TAP", "SHARE"];

export async function personalStats(userId: string, since: Date, days: number) {
  const [byType, events, topLinks, contacts, contactsBySource] = await Promise.all([
    db.cardEvent.groupBy({ by: ["type"], where: { userId, createdAt: { gte: since } }, _count: { _all: true } }),
    db.cardEvent.findMany({
      where: { userId, createdAt: { gte: since }, type: { in: ["VIEW", "QR_SCAN", "LINK_CLICK"] } },
      select: { type: true, createdAt: true, visitor: true },
    }),
    db.cardEvent.groupBy({
      by: ["target"],
      where: { userId, createdAt: { gte: since }, type: "LINK_CLICK" },
      _count: { _all: true },
      orderBy: { _count: { target: "desc" } },
      take: 8,
    }),
    db.contact.count({ where: { ownerId: userId, createdAt: { gte: since } } }),
    db.contact.groupBy({ by: ["source"], where: { ownerId: userId, createdAt: { gte: since } }, _count: { _all: true } }),
  ]);
  const counts: Record<string, number> = {};
  for (const r of byType) counts[r.type] = r._count._all;

  const dayKeys: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    dayKeys.push(d.toISOString().slice(0, 10));
  }
  const opens = Object.fromEntries(dayKeys.map((k) => [k, 0]));
  const clicks = Object.fromEntries(dayKeys.map((k) => [k, 0]));
  const visitors = new Set<string>();
  for (const e of events) {
    const k = e.createdAt.toISOString().slice(0, 10);
    if (e.type === "LINK_CLICK") {
      if (k in clicks) clicks[k]++;
    } else {
      if (k in opens) opens[k]++;
      if (e.visitor) visitors.add(e.visitor);
    }
  }
  return {
    counts,
    uniqueVisitors: visitors.size,
    opensSeries: dayKeys.map((k) => ({ date: k, value: opens[k] })),
    clicksSeries: dayKeys.map((k) => ({ date: k, value: clicks[k] })),
    topLinks: topLinks.map((r) => ({ target: r.target || "unknown", count: r._count._all })),
    contacts,
    contactsBySource: Object.fromEntries(contactsBySource.map((r) => [r.source, r._count._all])),
  };
}

export type LeaderRow = {
  id: string;
  name: string;
  email: string;
  office: string;
  officeId: string | null;
  jobRole: string | null;
  contactsSaved: number;
  synced: number;
  infoShared: number;
  qrScans: number;
  linkClicks: number;
};

export async function teamStats(since: Date, officeId?: string) {
  const users = await db.user.findMany({
    where: { status: "ACTIVE", ...(officeId ? { officeId } : {}) },
    select: { id: true, firstName: true, lastName: true, email: true, officeId: true, jobRole: true, office: { select: { name: true } } },
  });
  const ids = users.map((u) => u.id);
  const [contactCounts, syncedCounts, eventCounts] = await Promise.all([
    db.contact.groupBy({ by: ["ownerId"], where: { ownerId: { in: ids }, createdAt: { gte: since } }, _count: { _all: true } }),
    db.contact.groupBy({
      by: ["ownerId"],
      where: { ownerId: { in: ids }, createdAt: { gte: since }, status: "SYNCED" },
      _count: { _all: true },
    }),
    db.cardEvent.groupBy({ by: ["userId", "type"], where: { userId: { in: ids }, createdAt: { gte: since } }, _count: { _all: true } }),
  ]);
  const cMap = new Map(contactCounts.map((r) => [r.ownerId, r._count._all]));
  const sMap = new Map(syncedCounts.map((r) => [r.ownerId, r._count._all]));
  const eMap = new Map<string, Record<string, number>>();
  for (const r of eventCounts) {
    const m = eMap.get(r.userId) ?? {};
    m[r.type] = r._count._all;
    eMap.set(r.userId, m);
  }
  const rows: LeaderRow[] = users.map((u) => {
    const e = eMap.get(u.id) ?? {};
    return {
      id: u.id,
      name: `${u.firstName} ${u.lastName}`.trim() || u.email,
      email: u.email,
      office: u.office?.name ?? "No office",
      officeId: u.officeId,
      jobRole: u.jobRole,
      contactsSaved: cMap.get(u.id) ?? 0,
      synced: sMap.get(u.id) ?? 0,
      infoShared: GIVEAWAY_TYPES.reduce((n, t) => n + (e[t] ?? 0), 0),
      qrScans: e.QR_SCAN ?? 0,
      linkClicks: e.LINK_CLICK ?? 0,
    };
  });

  const officeMap = new Map<string, { office: string; officeId: string | null; people: number; contactsSaved: number; infoShared: number; qrScans: number; linkClicks: number }>();
  for (const r of rows) {
    const k = r.officeId ?? "none";
    const o = officeMap.get(k) ?? { office: r.office, officeId: r.officeId, people: 0, contactsSaved: 0, infoShared: 0, qrScans: 0, linkClicks: 0 };
    o.people++;
    o.contactsSaved += r.contactsSaved;
    o.infoShared += r.infoShared;
    o.qrScans += r.qrScans;
    o.linkClicks += r.linkClicks;
    officeMap.set(k, o);
  }
  const offices = [...officeMap.values()].sort((a, b) => b.contactsSaved + b.infoShared - (a.contactsSaved + a.infoShared));
  const totals = rows.reduce(
    (t, r) => ({
      contactsSaved: t.contactsSaved + r.contactsSaved,
      synced: t.synced + r.synced,
      infoShared: t.infoShared + r.infoShared,
      qrScans: t.qrScans + r.qrScans,
      linkClicks: t.linkClicks + r.linkClicks,
    }),
    { contactsSaved: 0, synced: 0, infoShared: 0, qrScans: 0, linkClicks: 0 },
  );
  return { rows, offices, totals, people: rows.length };
}
