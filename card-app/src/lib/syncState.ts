import { Prisma } from "@prisma/client";
import { db } from "./db";

export async function getState<T>(key: string): Promise<T | null> {
  const row = await db.syncState.findUnique({ where: { key } });
  return (row?.value as T) ?? null;
}

export async function setState(key: string, value: unknown) {
  const v = value as Prisma.InputJsonValue;
  await db.syncState.upsert({ where: { key }, create: { key, value: v }, update: { value: v } });
}

/** A simple database lock so two syncs (cron + webhook) never run at once. */
export async function tryLock(key: string, seconds: number): Promise<boolean> {
  const now = new Date();
  const until = new Date(now.getTime() + seconds * 1000);
  await db.syncState.upsert({ where: { key }, create: { key, lockedUntil: null }, update: {} });
  const r = await db.syncState.updateMany({
    where: { key, OR: [{ lockedUntil: null }, { lockedUntil: { lt: now } }] },
    data: { lockedUntil: until },
  });
  return r.count === 1;
}

export async function unlock(key: string) {
  await db.syncState.update({ where: { key }, data: { lockedUntil: null } }).catch(() => {});
}
