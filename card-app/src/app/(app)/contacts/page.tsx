import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Icon } from "@/components/Icon";

export const metadata = { title: "Contacts | RHM Cards" };

const STATUS: Record<string, [string, string]> = {
  DRAFT: ["Needs review", "warn"],
  READY: ["Sending", "info"],
  SYNCED: ["In Salesforce", "ok"],
  FAILED: ["Not sent", "err"],
};
const SOURCE: Record<string, string> = { SHARED_BACK: "Shared from card", SCAN: "Scan", MANUAL: "Typed in" };

export default async function Contacts({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  const user = await requireUser();
  const { q = "", status = "" } = await searchParams;
  const where: Prisma.ContactWhereInput = { ownerId: user.id };
  if (status && status in STATUS) where.status = status as Prisma.EnumContactStatusFilter["equals"];
  if (q) {
    where.OR = ["firstName", "lastName", "email", "phone", "company"].map((f) => ({ [f]: { contains: q, mode: "insensitive" } }));
  }
  const [rows, drafts] = await Promise.all([
    db.contact.findMany({ where, orderBy: { createdAt: "desc" }, take: 200 }),
    db.contact.count({ where: { ownerId: user.id, status: { in: ["DRAFT", "FAILED"] } } }),
  ]);
  return (
    <div className="stack">
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <p className="eyebrow">Contacts</p>
          <h1 style={{ marginTop: 6 }}>My contacts</h1>
        </div>
        <div className="row">
          <a className="btn secondary sm" href="/api/contacts/export">Export CSV</a>
          <Link className="btn secondary sm" href="/contacts/new"><Icon name="plus" size={16} /> Add</Link>
          <Link className="btn sm" href="/contacts/scan"><Icon name="scan" size={16} /> Scan</Link>
        </div>
      </div>
      {drafts > 0 && (
        <Link href="/contacts?status=DRAFT" className="alert warn" style={{ display: "block" }}>
          {drafts} {drafts === 1 ? "contact needs" : "contacts need"} your review before going to Salesforce.
        </Link>
      )}
      <form className="row">
        <input name="q" defaultValue={q} placeholder="Search name, email, phone, company" style={{ flex: 1, minWidth: 200 }} />
        <select name="status" defaultValue={status} style={{ width: "auto" }}>
          <option value="">All</option>
          {Object.entries(STATUS).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
        </select>
        <button className="btn secondary">Search</button>
      </form>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th className="hide-sm">Company</th><th className="hide-sm">From</th><th>Status</th><th className="hide-sm">Added</th></tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="muted" style={{ padding: 24, textAlign: "center" }}>No contacts yet. Scan a card or share your QR to get started.</td></tr>
            )}
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <Link href={`/contacts/${r.id}`} style={{ fontWeight: 500 }}>{`${r.firstName} ${r.lastName}`.trim() || "No name"}</Link>
                  <div className="tiny muted">{r.email || r.phone}</div>
                </td>
                <td className="hide-sm">{r.company}</td>
                <td className="hide-sm">{SOURCE[r.source]}</td>
                <td><span className={`badge ${STATUS[r.status][1]}`}>{STATUS[r.status][0]}</span></td>
                <td className="hide-sm muted">{r.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
