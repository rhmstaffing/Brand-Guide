import { Prisma } from "@prisma/client";
import { db } from "./db";

export async function audit(
  action: string,
  opts: { actorId?: string | null; targetUserId?: string | null; details?: Prisma.InputJsonValue; ip?: string } = {},
) {
  await db.auditLog
    .create({
      data: {
        action,
        actorId: opts.actorId ?? null,
        targetUserId: opts.targetUserId ?? null,
        details: opts.details,
        ip: opts.ip,
      },
    })
    .catch((e) => console.error("audit failed", e));
}
