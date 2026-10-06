import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseRange, teamStats, type LeaderRow } from "@/lib/stats";
import { RangePicker } from "@/components/RangePicker";

export const metadata = { title: "Company dashboard | RHM Cards" };

const SORTS: Record<string, [keyof LeaderRow, string]> = {
  contacts: ["contactsSaved", "Contacts saved"],
  shared: ["infoShared", "Info shared"],
  qr: ["qrScans", "QR scans"],
  clicks: ["linkClicks", "Link clicks"],
};

export default async function Team({ searchParams }: { searchParams: Promise<{ range?: string; office?: string; sort?: string }> }) {
  const user = await requireUser();
  const sp = await searchParams;
  const { key, since } = parseRange(sp.range);
  const officeId = sp.office || undefined;
  const sort = sp.sort && sp.sort in SORTS ? sp.sort : "contacts";
  const [offices, s] = await Promise.all([db.office.findMany({ orderBy: { name: "asc" } }), teamStats(since, officeId)]);
  const officeName = offices.find((o) => o.id === officeId)?.name;
  const [sortKey] = SORTS[sort];
  const people = [...s.rows].sort((a, b) => (b[sortKey] as number) - (a[sortKey] as number));
  const topContacts = [...s.rows].sort((a, b) => b.contactsSaved - a.contactsSaved).slice(0, 5);
  const topShared = [...s.rows].sort((a, b) => b.infoShared - a.infoShared).slice(0, 5);
  const isAdmin = user.role === "ADMIN";
  const extra = `${officeId ? `&office=${officeId}` : ""}&sort=${sort}`;
  const q = (o: Record<string, string | undefined>) => {
    const p = new URLSearchParams({ range: key, sort, ...(officeId ? { office: officeId } : {}) });
    for (const [k, v] of Object.entries(o)) v ? p.set(k, v) : p.delete(k);
    return `/team?${p}`;
  };
  const maxOff = Math.max(1, ...s.offices.map((o) => Math.max(o.contactsSaved, o.infoShared)));
  const maxPeople = Math.max(1, ...people.map((p) => p[sortKey] as number));

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <p className="eyebrow">Company dashboard</p>
          <h1 style={{ marginTop: 6 }}>{officeName ?? "All offices"}</h1>
        </div>
        <div className="row">
          <form action="/team" className="row">
            <input type="hidden" name="range" value={key} />
            <input type="hidden" name="sort" value={sort} />
            <select name="office" defaultValue={officeId ?? ""} style={{ width: "auto" }}>
              <option value="">All offices</option>
              {offices.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <button className="btn secondary sm">Go</button>
          </form>
          <RangePicker current={key} base="/team" extra={extra} />
        </div>
      </div>

      <div className="grid g4">
        <Tile v={s.totals.contactsSaved} l="Contacts saved" />
        <Tile v={s.totals.synced} l="Sent to Salesforce" />
        <Tile v={s.totals.infoShared} l="Times info was shared" />
        <Tile v={s.totals.qrScans} l="QR scans" />
        <Tile v={s.totals.linkClicks} l="Link clicks" />
        <Tile v={s.people} l="Active people" />
      </div>

      <div className="grid g2">
        <Leader title="Saving the most contacts" rows={topContacts} pick={(r) => r.contactsSaved} />
        <Leader title="Giving their info away the most" rows={topShared} pick={(r) => r.infoShared} />
      </div>

      {!officeId && (
        <section className="stack-sm">
          <h2>Office by office</h2>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Office</th><th className="num">People</th><th className="num">Contacts saved</th><th className="num">Info shared</th><th className="num hide-sm">QR scans</th><th className="num hide-sm">Link clicks</th></tr></thead>
              <tbody>
                {s.offices.map((o) => (
                  <tr key={o.officeId ?? "none"}>
                    <td>{o.officeId ? <Link href={q({ office: o.officeId })}>{o.office}</Link> : o.office}</td>
                    <td className="num">{o.people}</td>
                    <td className="num"><Bar v={o.contactsSaved} max={maxOff} /></td>
                    <td className="num"><Bar v={o.infoShared} max={maxOff} /></td>
                    <td className="num hide-sm">{o.qrScans}</td>
                    <td className="num hide-sm">{o.linkClicks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="stack-sm">
        <div className="row between">
          <h2>Everyone</h2>
          <div className="seg">
            {Object.entries(SORTS).map(([k, [, l]]) => <Link key={k} href={q({ sort: k })} className={sort === k ? "on" : ""}>{l}</Link>)}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Name</th><th className="hide-sm">Office</th><th className="num">Contacts saved</th><th className="num">Info shared</th><th className="num hide-sm">QR scans</th><th className="num hide-sm">Link clicks</th></tr></thead>
            <tbody>
              {people.map((p, i) => (
                <tr key={p.id} style={p.id === user.id ? { background: "var(--blue-50)" } : undefined}>
                  <td className="muted">{i + 1}</td>
                  <td>
                    {isAdmin ? <Link href={`/admin/users/${p.id}`}>{p.name}</Link> : p.name}
                    {p.jobRole && <div className="tiny muted">{p.jobRole}</div>}
                  </td>
                  <td className="hide-sm">{p.office}</td>
                  <td className="num">{sort === "contacts" ? <Bar v={p.contactsSaved} max={maxPeople} /> : p.contactsSaved}</td>
                  <td className="num">{sort === "shared" ? <Bar v={p.infoShared} max={maxPeople} /> : p.infoShared}</td>
                  <td className="num hide-sm">{p.qrScans}</td>
                  <td className="num hide-sm">{p.linkClicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="tiny muted">Info shared counts card opens, QR scans, contact saves, wallet adds, NFC taps and shares sent.</p>
      </section>
    </div>
  );
}

function Tile({ v, l }: { v: number; l: string }) {
  return <div className="stat"><div className="v">{v.toLocaleString()}</div><div className="l">{l}</div></div>;
}

function Bar({ v, max }: { v: number; max: number }) {
  return (
    <div className="bar-cell">
      <span className="track"><span className="fill" style={{ width: `${(v / max) * 100}%` }} /></span>
      <span style={{ minWidth: 28 }}>{v}</span>
    </div>
  );
}

function Leader({ title, rows, pick }: { title: string; rows: LeaderRow[]; pick: (r: LeaderRow) => number }) {
  const max = Math.max(1, ...rows.map(pick));
  return (
    <div className="card stack-sm">
      <h3>{title}</h3>
      {rows.every((r) => pick(r) === 0) ? (
        <p className="small muted">Nothing yet in this range.</p>
      ) : (
        <table>
          <tbody>
            {rows.filter((r) => pick(r) > 0).map((r, i) => (
              <tr key={r.id}>
                <td style={{ paddingLeft: 0, width: 24 }} className="muted">{i + 1}</td>
                <td>{r.name}<div className="tiny muted">{r.office}</div></td>
                <td className="num" style={{ paddingRight: 0 }}><Bar v={pick(r)} max={max} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
