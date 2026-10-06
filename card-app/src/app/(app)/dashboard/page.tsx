import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { parseRange, personalStats } from "@/lib/stats";
import { cardUrl } from "@/lib/config";
import { BarChart } from "@/components/BarChart";
import { RangePicker } from "@/components/RangePicker";
import { Icon } from "@/components/Icon";
import { CopyButton } from "@/components/CopyButton";

export const metadata = { title: "My dashboard | RHM Cards" };

function linkLabel(target: string) {
  if (target.startsWith("tel:")) return "Call";
  if (target.startsWith("sms:")) return "Text";
  if (target.startsWith("mailto:")) return "Email";
  if (target === "vcard") return "Save contact";
  try {
    const u = new URL(target);
    return u.hostname.replace(/^www\./, "") + (u.pathname.length > 1 ? u.pathname : "");
  } catch {
    return target;
  }
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const user = await requireUser();
  const { key, days, since } = parseRange((await searchParams).range);
  const s = await personalStats(user.id, since, days);
  const c = (k: string) => s.counts[k] ?? 0;
  const url = cardUrl(user.slug);
  const maxLink = Math.max(1, ...s.topLinks.map((l) => l.count));
  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <div>
          <p className="eyebrow">My dashboard</p>
          <h1 style={{ marginTop: 6 }}>Hi {user.firstName || "there"}</h1>
        </div>
        <RangePicker current={key} base="/dashboard" />
      </div>

      <div className="card tint row between">
        <div className="stack-sm" style={{ minWidth: 0 }}>
          <span className="small muted">Your card link</span>
          <a href={url} target="_blank" style={{ fontWeight: 600, wordBreak: "break-all" }}>{url}</a>
        </div>
        <div className="row">
          <CopyButton text={url} />
          <Link href="/share" className="btn sm"><Icon name="qr" size={16} /> Show my QR</Link>
        </div>
      </div>

      <div className="grid g4">
        <Stat v={c("VIEW") + c("QR_SCAN")} l="Card opens" />
        <Stat v={c("LINK_CLICK")} l="Link clicks" />
        <Stat v={c("QR_SCAN")} l="QR scans" />
        <Stat v={s.uniqueVisitors} l="Unique visitors" />
        <Stat v={c("VCARD_SAVE")} l="Saved to phone" />
        <Stat v={c("SHARED_BACK")} l="People shared their info" />
        <Stat v={s.contacts} l="Contacts I saved" />
        <Stat v={c("WALLET_ADD") + c("NFC_TAP")} l="Wallet and NFC" />
      </div>

      <div className="card stack">
        <BarChart data={s.opensSeries} label="Card opens per day (link + QR)" />
      </div>
      <div className="grid g2">
        <div className="card stack">
          <BarChart data={s.clicksSeries} label="Link clicks per day" height={150} />
        </div>
        <div className="card stack-sm">
          <span className="small" style={{ fontWeight: 600, color: "var(--text-strong)" }}>What people clicked</span>
          {s.topLinks.length === 0 && <p className="muted small">No clicks yet in this range. Share your link to get started.</p>}
          {s.topLinks.length > 0 && (
            <table>
              <tbody>
                {s.topLinks.map((l) => (
                  <tr key={l.target}>
                    <td style={{ paddingLeft: 0, wordBreak: "break-all" }}>{linkLabel(l.target)}</td>
                    <td className="num" style={{ paddingRight: 0 }}>
                      <div className="bar-cell">
                        <span className="track"><span className="fill" style={{ width: `${(l.count / maxLink) * 100}%` }} /></span>
                        {l.count}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ v, l }: { v: number; l: string }) {
  return (
    <div className="stat">
      <div className="v">{v.toLocaleString()}</div>
      <div className="l">{l}</div>
    </div>
  );
}
