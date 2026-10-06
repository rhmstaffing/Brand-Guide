import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiUser } from "@/lib/auth";

const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s; // stop spreadsheet formula injection
  return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export async function GET(req: Request) {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const all = new URL(req.url).searchParams.get("all") === "1" && user.role === "ADMIN";
  const rows = await db.contact.findMany({
    where: all ? {} : { ownerId: user.id },
    include: { owner: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
  });
  const head = ["First name", "Last name", "Email", "Phone", "Company", "Title", "Type", "Source", "Status", "Salesforce ID", "Owner", "Created", "Notes"];
  const lines = [head.join(",")].concat(
    rows.map((r) =>
      [r.firstName, r.lastName, r.email, r.phone, r.company, r.title, r.kind, r.source, r.status, r.sfId, r.owner.email, r.createdAt.toISOString(), r.notes].map(cell).join(","),
    ),
  );
  return new NextResponse(lines.join("\n"), {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="contacts${all ? "-all" : ""}.csv"` },
  });
}
