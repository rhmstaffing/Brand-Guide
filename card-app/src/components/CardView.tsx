import { Icon } from "./Icon";

export type CardData = {
  firstName: string;
  lastName: string;
  pronouns: string;
  title: string;
  office: string;
  phone: string;
  mobile: string;
  bio: string;
  photo: string;
  website: string;
  linkedin: string;
  calendarUrl: string;
  email: string;
  links: { label: string; url: string }[];
};

// The business card itself. Used on the public page and as the live preview in the editor.
// On the public page every button goes through /r/<slug> so clicks are counted.
export function CardView({ data, slug, preview = false }: { data: CardData; slug?: string; preview?: boolean }) {
  const name = `${data.firstName} ${data.lastName}`.trim() || "Your name";
  const go = (to: string) => (preview || !slug ? to : `/r/${slug}?to=${encodeURIComponent(to)}`);
  const tel = (v: string) => `tel:${v.replace(/[^\d+]/g, "")}`;
  const actions = [
    data.mobile && { icon: "phone", label: "Call", href: tel(data.mobile) },
    data.mobile && { icon: "message", label: "Text", href: `sms:${data.mobile.replace(/[^\d+]/g, "")}` },
    { icon: "mail", label: "Email", href: `mailto:${data.email}` },
    data.calendarUrl && { icon: "calendar", label: "Book time", href: data.calendarUrl },
  ].filter(Boolean) as { icon: string; label: string; href: string }[];
  const rows = [
    data.mobile && { icon: "phone", label: data.mobile, sub: "Mobile", href: tel(data.mobile) },
    data.phone && { icon: "phone", label: data.phone, sub: "Office", href: tel(data.phone) },
    { icon: "mail", label: data.email, sub: "Email", href: `mailto:${data.email}` },
    data.linkedin && { icon: "linkedin", label: "LinkedIn", sub: "Connect with me", href: data.linkedin },
    data.website && { icon: "globe", label: data.website.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), sub: "Website", href: data.website },
    ...data.links.filter((l) => l.url).map((l) => ({ icon: "link", label: l.label || l.url, sub: l.url.replace(/^https?:\/\/(www\.)?/, "").slice(0, 40), href: l.url })),
  ].filter(Boolean) as { icon: string; label: string; sub: string; href: string }[];
  const ext = (h: string) => (/^https?:/.test(h) ? { target: "_blank", rel: "noopener" } : {});

  return (
    <div style={{ background: "#fff" }}>
      <div
        style={{
          position: "relative",
          background: "url(/brand/card-bg.jpg) center/cover, var(--gradient-deep)",
          padding: "28px 24px 72px",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "var(--gradient-protect, linear-gradient(90deg,rgba(6,15,26,.88),rgba(2,25,92,.55) 55%,rgba(2,25,92,0)))" }} />
        <img src="/brand/wave-white.png" alt="" style={{ position: "absolute", right: -80, bottom: -30, width: 420, opacity: 0.35, pointerEvents: "none" }} />
        <img src="/brand/rhm-horizontal-white.png" alt="RHM Staffing Solutions" style={{ position: "relative", width: 200 }} />
      </div>
      <div style={{ padding: "0 24px 24px", marginTop: -48, position: "relative" }}>
        {data.photo ? (
          <img src={data.photo} alt={name} style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", border: "4px solid #fff", boxShadow: "var(--shadow-md)", background: "#fff" }} />
        ) : (
          <div style={{ width: 96, height: 96, borderRadius: "50%", border: "4px solid #fff", background: "var(--blue-100)", display: "grid", placeItems: "center", fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 600, color: "var(--rhm-navy)", boxShadow: "var(--shadow-md)" }}>
            {(data.firstName[0] || "R").toUpperCase()}
            {(data.lastName[0] || "").toUpperCase()}
          </div>
        )}
        <h1 style={{ fontSize: 28, marginTop: 12 }}>
          {name} {data.pronouns && <span className="muted" style={{ fontSize: 15, fontFamily: "var(--font-body)", fontWeight: 400 }}>({data.pronouns})</span>}
        </h1>
        {data.title && <p style={{ fontWeight: 500, color: "var(--text-strong)", marginTop: 4 }}>{data.title}</p>}
        <p className="muted small">RHM Staffing Solutions{data.office ? ` · ${data.office}` : ""}</p>
        {data.bio && <p style={{ marginTop: 12 }}>{data.bio}</p>}

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${actions.length}, 1fr)`, gap: 8, marginTop: 20 }}>
          {actions.map((a) => (
            <a key={a.label} href={go(a.href)} {...ext(a.href)} className="btn sm" style={{ flexDirection: "column", height: 64, gap: 4, padding: 0, fontSize: 13 }}>
              <Icon name={a.icon} size={20} />
              {a.label}
            </a>
          ))}
        </div>

        {slug && !preview && (
          <a href={`/c/${slug}/vcard`} className="btn accent block" style={{ marginTop: 12 }}>
            <Icon name="download" size={18} /> Save my contact
          </a>
        )}

        <div style={{ marginTop: 20, borderTop: "1px solid var(--border-subtle)" }}>
          {rows.map((r, i) => (
            <a key={i} href={go(r.href)} {...ext(r.href)} style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: "1px solid var(--gray-100)", color: "var(--text-strong)", textDecoration: "none" }}>
              <span style={{ width: 40, height: 40, borderRadius: 8, background: "var(--blue-50)", color: "var(--rhm-blue)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <Icon name={r.icon} size={20} />
              </span>
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
                <span className="tiny muted">{r.sub}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
