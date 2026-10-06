import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { salesforceConfigured } from "@/lib/salesforce";
import { ocrConfigured } from "@/lib/ocr";
import { appleWalletConfigured, googleWalletConfigured } from "@/lib/wallet";
import { inviteUser, saveOffice, deleteOffice, signOutEverywhere, terminate, reactivate } from "./actions";
import { ConfirmButton } from "./ConfirmButton";

export const metadata = { title: "Admin | RHM Cards" };

export default async function Admin({ searchParams }: { searchParams: Promise<{ q?: string; status?: string }> }) {
  await requireRole("ADMIN");
  const { q = "", status = "" } = await searchParams;
  const where: Prisma.UserWhereInput = {};
  if (status === "ACTIVE" || status === "TERMINATED") where.status = status;
  if (q) where.OR = ["email", "firstName", "lastName"].map((f) => ({ [f]: { contains: q, mode: "insensitive" } }));
  const since = new Date(Date.now() - 30 * 864e5);
  const [users, offices, sessions, contacts, logs] = await Promise.all([
    db.user.findMany({ where, include: { office: true }, orderBy: [{ status: "asc" }, { lastName: "asc" }] }),
    db.office.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { users: true } } } }),
    db.session.groupBy({ by: ["userId"], where: { revokedAt: null, expiresAt: { gt: new Date() } }, _count: { _all: true } }),
    db.contact.groupBy({ by: ["ownerId"], where: { createdAt: { gte: since } }, _count: { _all: true } }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 40, include: { actor: { select: { email: true } }, target: { select: { email: true } } } }),
  ]);
  const sMap = new Map(sessions.map((s) => [s.userId, s._count._all]));
  const cMap = new Map(contacts.map((s) => [s.ownerId, s._count._all]));
  const checks: [string, boolean][] = [
    ["Salesforce", salesforceConfigured()],
    ["Scanning (Claude)", ocrConfigured()],
    ["Apple Wallet", appleWalletConfigured()],
    ["Google Wallet", googleWalletConfigured()],
    ["Email (SMTP)", Boolean(process.env.SMTP_HOST)],
    ["QR Code Monkey", true],
  ];

  return (
    <div className="stack" style={{ gap: 28 }}>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <p className="eyebrow">Admin</p>
          <h1 style={{ marginTop: 6 }}>People and access</h1>
        </div>
        <a className="btn secondary sm" href="/api/contacts/export?all=1">Export all contacts</a>
      </div>

      <div className="row">
        {checks.map(([l, ok]) => <span key={l} className={`badge ${ok ? "ok" : "warn"}`}>{l}: {ok ? "connected" : "not set up"}</span>)}
      </div>

      <section className="stack-sm">
        <div className="row between">
          <h2>Everyone ({users.length})</h2>
          <form className="row">
            <input name="q" defaultValue={q} placeholder="Search" style={{ width: 200 }} />
            <select name="status" defaultValue={status} style={{ width: "auto" }}>
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="TERMINATED">Terminated</option>
            </select>
            <button className="btn secondary sm">Filter</button>
          </form>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th className="hide-sm">Office</th><th>Status</th><th className="num hide-sm">Devices</th><th className="num hide-sm">Contacts 30d</th><th className="hide-sm">Last login</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <Link href={`/admin/users/${u.id}`} style={{ fontWeight: 500 }}>{`${u.firstName} ${u.lastName}`.trim() || u.email}</Link>
                    <div className="tiny muted">{u.email}{u.role !== "USER" ? ` · ${u.role.toLowerCase()}` : ""}</div>
                  </td>
                  <td className="hide-sm">{u.office?.name ?? <span className="muted">None</span>}</td>
                  <td><span className={`badge ${u.status === "ACTIVE" ? "ok" : "err"}`}>{u.status === "ACTIVE" ? "Active" : "Terminated"}</span></td>
                  <td className="num hide-sm">{sMap.get(u.id) ?? 0}</td>
                  <td className="num hide-sm">{cMap.get(u.id) ?? 0}</td>
                  <td className="hide-sm muted small">{u.lastLoginAt ? u.lastLoginAt.toLocaleString() : "Never"}</td>
                  <td>
                    <div className="row" style={{ justifyContent: "flex-end", flexWrap: "nowrap" }}>
                      {u.status === "ACTIVE" ? (
                        <>
                          <form action={signOutEverywhere}><input type="hidden" name="userId" value={u.id} /><ConfirmButton className="btn secondary sm" message={`Sign ${u.email} out of every device?`}>Sign out</ConfirmButton></form>
                          <form action={terminate}><input type="hidden" name="userId" value={u.id} /><ConfirmButton className="btn danger sm" message={`Terminate ${u.email}? They are signed out everywhere, can't log in, and their card goes offline.`}>Terminate</ConfirmButton></form>
                        </>
                      ) : (
                        <form action={reactivate}><input type="hidden" name="userId" value={u.id} /><button className="btn secondary sm">Reactivate</button></form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form action={inviteUser} className="row card" style={{ padding: 12 }}>
          <strong className="small">Add a person</strong>
          <input name="email" type="email" placeholder="name@rhmstaffing.net" required style={{ flex: 1, minWidth: 200 }} />
          <select name="officeId" style={{ width: "auto" }}>
            <option value="">Office</option>
            {offices.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <button className="btn sm">Add</button>
        </form>
      </section>

      <section className="stack-sm">
        <h2>Offices</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th className="hide-sm">Address</th><th className="hide-sm">Phone</th><th className="num">People</th><th></th></tr></thead>
            <tbody>
              {offices.map((o) => (
                <tr key={o.id}>
                  <td colSpan={3}>
                    <form action={saveOffice} className="row" style={{ flexWrap: "nowrap" }}>
                      <input type="hidden" name="id" value={o.id} />
                      <input name="name" defaultValue={o.name} aria-label="Office name" />
                      <input name="address" defaultValue={o.address ?? ""} placeholder="Address" className="hide-sm" />
                      <input name="phone" defaultValue={o.phone ?? ""} placeholder="Phone" className="hide-sm" />
                      <button className="btn secondary sm">Save</button>
                    </form>
                  </td>
                  <td className="num">{o._count.users}</td>
                  <td>
                    <form action={deleteOffice}><input type="hidden" name="id" value={o.id} /><ConfirmButton className="btn ghost sm" message={`Delete ${o.name}? People in it will have no office.`}>Delete</ConfirmButton></form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form action={saveOffice} className="row card" style={{ padding: 12 }}>
          <strong className="small">New office</strong>
          <input name="name" placeholder="Office name" required style={{ flex: 1, minWidth: 160 }} />
          <input name="address" placeholder="Address" style={{ flex: 2, minWidth: 200 }} />
          <input name="phone" placeholder="Phone" style={{ width: 160 }} />
          <button className="btn sm">Add office</button>
        </form>
      </section>

      <section className="stack-sm">
        <h2>Recent activity</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>When</th><th>What</th><th>Who</th><th className="hide-sm">About</th></tr></thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td className="small muted" style={{ whiteSpace: "nowrap" }}>{l.createdAt.toLocaleString()}</td>
                  <td>{l.action.replace(/[._]/g, " ")}</td>
                  <td className="small">{l.actor?.email ?? "visitor"}</td>
                  <td className="small hide-sm">{l.target?.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
