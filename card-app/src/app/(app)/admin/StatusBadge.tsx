import type { UserStatus } from "@prisma/client";

export function StatusBadge({ status, date }: { status: UserStatus; date?: Date | null }) {
  const d = date ? ` ${date.toLocaleDateString("en-US", { timeZone: "UTC" })}` : "";
  if (status === "ACTIVE") return <span className="badge ok">Active</span>;
  if (status === "PENDING") return <span className="badge info">Starts{d || " soon"}</span>;
  return <span className="badge err">Archived{d}</span>;
}
