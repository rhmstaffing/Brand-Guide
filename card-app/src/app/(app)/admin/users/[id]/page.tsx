import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { cardUrl } from "@/lib/config";
import { parseRange, personalStats } from "@/lib/stats";
import { EVENT_LABELS, type EventType } from "@/lib/events";
import { BarChart } from "@/components/BarChart";
import { RangePicker } from "@/components/RangePicker";
import { ConfirmButton } from "../../ConfirmButton";
import { archive, exportAccount, restore, revokeSession, setOffice, setRole, signOutEverywhere, transferContacts } from "../../actions";
import { StatusBadge } from "../../StatusBadge";

export const metadata = { title: "Person | Admin | RHM Cards" };

function device(ua: string | null) {
  if (!ua) return "Unknown device";
  const os = /iPhone/.test(ua) ? "iPhone" : /iPad/.test(ua) ? "iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : "Other";
  const br = /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : /Firefox\//.test(ua) ? "Firefox" : "App";
  return `${os}, ${br}`;
}

export default async function AdminUser({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ range?: string }> }) {
  const me = await requireRole("ADMIN");
  const u = await db.user.findUnique({ where: { id: (await params).id }, include: { office: true } });
  if (!u) notFound();
  const { key, days, since } = parseRange((await searchParams).range);
  const [stats, sessions, events, contacts, logs, offices, others, archives] = await Promise.all([
    personalStats(u.id, since, days),
    db.session.findMany({ where: { userId: u.id }, orderBy: { lastSeenAt: "desc" }, take: 20 }),
    db.cardEvent.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, take: 50 }),
    db.contact.findMany({ where: { ownerId: u.id }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.auditLog.findMany({ where: { OR: [{ targetUserId: u.id }, { actorId: u.id }] }, orderBy: { createdAt: "desc" }, take: 50, include: { actor: { select: { email: true } } } }),
    db.office.findMany({ orderBy: { name: "asc" } }),
    db.user.findMany({ where: { status: "ACTIVE", id: { not: u.id } }, orderBy: { lastName: "asc" }, select: { id: true, firstName: true, lastName: true, email: true } }),
    db.accountArchive.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, select: { id: true, reason: true, createdAt: true, contactCount: true, eventCount: true, sizeBytes: true } }),
  ]);
  const now = new Date();
  const live = sessions.filter((s) => !s.revokedAt && s.expiresAt > now);
  const c = (k: string) => stats.counts[k] ?? 0;
  const name = `${u.firstName} ${u.lastName}`.trim() || u.email;

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <Link href="/admin" className="small">Back to admin</Link>
          <h1 style={{ marginTop: 6 }}>{name}</h1>
          <p className="muted small">{u.email} · {u.title || "No title"} · {u.office?.name || "No office"}</p>
        </div>
        <div className="row">
          <StatusBadge status={u.status} date={u.status === "PENDING" ? u.startsAt : u.archivedAt} />
          {u.entraId && <span className="badge info">Synced from Microsoft</span>}
          {u.status === "ACTIVE" && <a className="btn secondary sm" href={cardUrl(u.slug)} target="_blank">View card</a>}
        </div>
      </div>

      <div className="card stack">
        <h2>Access</h2>
        <div className="row">
          {u.status !== "ARCHIVED" ? (
            <>
              <form action={signOutEverywhere}><input type="hidden" name="userId" value={u.id} /><ConfirmButton className="btn secondary" message={`Sign ${u.email} out of all ${live.length} devices?`}>Sign out of all devices ({live.length})</ConfirmButton></form>
              {u.id !== me.id && (
                <form action={archive}><input type="hidden" name="userId" value={u.id} /><ConfirmButton className="btn danger" message={`Archive ${u.email}? A copy of all their contacts and activity is saved for you to download. Then they're signed out everywhere, can't log in, and their card goes offline.`}>Archive account</ConfirmButton></form>
              )}
            </>
          ) : (
            <form action={restore}><input type="hidden" name="userId" value={u.id} /><ConfirmButton className="btn" message={`Restore ${u.email}? They can sign in again and their card goes back online.`}>Restore account</ConfirmButton></form>
          )}
          <form action={setRole} className="row">
            <input type="hidden" name="userId" value={u.id} />
            <select name="role" defaultValue={u.role} style={{ width: "auto" }}>
              <option value="USER">User</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button className="btn secondary sm">Set role</button>
          </form>
          <form action={setOffice} className="row">
            <input type="hidden" name="userId" value={u.id} />
            <select name="officeId" defaultValue={u.officeId ?? ""} style={{ width: "auto" }}>
              <option value="">No office</option>
              {offices.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <button className="btn secondary sm">Set office</button>
          </form>
        </div>
        {contacts.length > 0 && (
          <form action={transferContacts} className="row">
            <input type="hidden" name="userId" value={u.id} />
            <span className="small">Move all {contacts.length} contacts to</span>
            <select name="toUserId" required style={{ width: "auto" }}>
              <option value="">Pick a person</option>
              {others.map((o) => <option key={o.id} value={o.id}>{`${o.firstName} ${o.lastName}`.trim() || o.email}</option>)}
            </select>
            <ConfirmButton className="btn secondary sm" message="Move all of this person's contacts? Salesforce ownership does not change.">Move</ConfirmButton>
          </form>
        )}
        <div className="table-wrap">
          <table>
            <thead><tr><th>Device</th><th className="hide-sm">IP</th><th>Signed in</th><th>Last seen</th><th></th></tr></thead>
            <tbody>
              {sessions.length === 0 && <tr><td colSpan={5} className="muted">Never signed in.</td></tr>}
              {sessions.map((s) => {
                const on = !s.revokedAt && s.expiresAt > now;
                return (
                  <tr key={s.id}>
                    <td>{device(s.userAgent)}</td>
                    <td className="hide-sm small muted">{s.ip}</td>
                    <td className="small">{s.createdAt.toLocaleString()}</td>
                    <td className="small">{s.lastSeenAt.toLocaleString()}</td>
                    <td>
                      {on ? (
                        <form action={revokeSession}><input type="hidden" name="sessionId" value={s.id} /><button className="btn ghost sm">Sign out</button></form>
                      ) : (
                        <span className="badge">{s.revokedAt ? "Signed out" : "Expired"}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <section id="archives" className="card stack-sm">
        <div className="row between">
          <h2>Archives and exports</h2>
          <form action={exportAccount}><input type="hidden" name="userId" value={u.id} /><button className="btn secondary sm">Make an export now</button></form>
        </div>
        <p className="small muted">Each download is a ZIP with their contacts (Excel and full detail), scanned photos, card activity, account log, profile and QR code.</p>
        {u.status === "ARCHIVED" && u.archiveReason && (
          <p className="small">Archived {u.archivedAt?.toLocaleString()} {u.archiveReason.startsWith("entra") ? "because their Microsoft account was turned off" : "by an admin"}.</p>
        )}
        {archives.length === 0 ? (
          <p className="small muted">No archives yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Made</th><th>Why</th><th className="num">Contacts</th><th className="num hide-sm">Events</th><th className="num hide-sm">Size</th><th></th></tr></thead>
              <tbody>
                {archives.map((a) => (
                  <tr key={a.id}>
                    <td className="small">{a.createdAt.toLocaleString()}</td>
                    <td className="small">{{ admin: "Archived by admin", "entra-disabled": "Turned off in Microsoft", "entra-deleted": "Deleted in Microsoft", export: "Export" }[a.reason] ?? a.reason}</td>
                    <td className="num">{a.contactCount}</td>
                    <td className="num hide-sm">{a.eventCount}</td>
                    <td className="num hide-sm">{a.sizeBytes > 1e6 ? `${(a.sizeBytes / 1e6).toFixed(1)} MB` : `${Math.ceil(a.sizeBytes / 1e3)} KB`}</td>
                    <td><a className="btn secondary sm" href={`/api/admin/archives/${a.id}`}>Download</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="row between">
        <h2>Card activity</h2>
        <RangePicker current={key} base={`/admin/users/${u.id}`} />
      </div>
      <div className="grid g4">
        {[["Card opens", c("VIEW") + c("QR_SCAN")], ["Link clicks", c("LINK_CLICK")], ["QR scans", c("QR_SCAN")], ["Contact saves", c("VCARD_SAVE")], ["Info shared back", c("SHARED_BACK")], ["Contacts saved", stats.contacts]].map(([l, v]) => (
          <div key={l as string} className="stat"><div className="v">{(v as number).toLocaleString()}</div><div className="l">{l}</div></div>
        ))}
      </div>
      <div className="card"><BarChart data={stats.opensSeries} label="Card opens per day" /></div>

      <section className="stack-sm">
        <h2>Contacts ({contacts.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Name</th><th className="hide-sm">Company</th><th>Source</th><th>Status</th><th className="hide-sm">Added</th></tr></thead>
            <tbody>
              {contacts.map((r) => (
                <tr key={r.id}>
                  <td><Link href={`/contacts/${r.id}`}>{`${r.firstName} ${r.lastName}`.trim() || "No name"}</Link><div className="tiny muted">{r.email || r.phone}</div></td>
                  <td className="hide-sm">{r.company}</td>
                  <td className="small">{r.source.replace("_", " ").toLowerCase()}</td>
                  <td><span className={`badge ${r.status === "SYNCED" ? "ok" : r.status === "FAILED" ? "err" : "warn"}`}>{r.status.toLowerCase()}</span></td>
                  <td className="hide-sm small muted">{r.createdAt.toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid g2">
        <section className="stack-sm">
          <h2>Latest card events</h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {events.map((e) => (
                  <tr key={e.id}>
                    <td className="small muted" style={{ whiteSpace: "nowrap" }}>{e.createdAt.toLocaleString()}</td>
                    <td className="small">{EVENT_LABELS[e.type as EventType] ?? e.type}</td>
                    <td className="small muted" style={{ wordBreak: "break-all" }}>{e.target || e.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="stack-sm">
          <h2>Account log</h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id}>
                    <td className="small muted" style={{ whiteSpace: "nowrap" }}>{l.createdAt.toLocaleString()}</td>
                    <td className="small">{l.action.replace(/[._]/g, " ")}</td>
                    <td className="small muted">{l.actor?.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
