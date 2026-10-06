"use client";
import { useState } from "react";
import { CardView, type CardData } from "@/components/CardView";
import { resizeImage } from "@/components/image";

type Form = Omit<CardData, "office"> & { officeId: string; jobRole: string; slug: string };

export default function CardForm({ initial, offices, base }: { initial: Form; offices: { id: string; name: string }[]; base: string }) {
  const [f, setF] = useState<Form>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((p) => ({ ...p, [k]: v }));
  const office = offices.find((o) => o.id === f.officeId)?.name ?? "";

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    set("photo", await resizeImage(file, 400, 0.85, true));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { email: _email, ...body } = f;
    const res = await fetch("/api/me", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMsg({ kind: "err", text: j.error || "Could not save. Try again." });
    set("slug", j.slug);
    setMsg({ kind: "ok", text: "Saved. Your card, link and QR code are up to date." });
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", alignItems: "start", gap: 24 }}>
      <form onSubmit={save} className="card stack">
        <div className="row" style={{ alignItems: "center" }}>
          {f.photo ? <img src={f.photo} alt="" className="avatar" style={{ width: 64, height: 64 }} /> : <span className="avatar" style={{ width: 64, height: 64 }}>{(f.firstName[0] || "?").toUpperCase()}</span>}
          <label style={{ flex: 1 }}>
            Photo
            <input type="file" accept="image/*" onChange={onPhoto} />
          </label>
          {f.photo && <button type="button" className="btn ghost sm" onClick={() => set("photo", "")}>Remove</button>}
        </div>
        <div className="grid g2" style={{ gap: 12 }}>
          <label>First name<input value={f.firstName} onChange={(e) => set("firstName", e.target.value)} required /></label>
          <label>Last name<input value={f.lastName} onChange={(e) => set("lastName", e.target.value)} /></label>
          <label>Job title<input value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="Senior Recruiter" /></label>
          <label>Pronouns <span className="hint">Optional</span><input value={f.pronouns} onChange={(e) => set("pronouns", e.target.value)} /></label>
          <label>
            Role
            <select value={f.jobRole} onChange={(e) => set("jobRole", e.target.value)}>
              <option value="">Pick one</option>
              <option>Recruiter</option>
              <option>Account Executive</option>
              <option>Branch Manager</option>
              <option>Leadership</option>
              <option>Other</option>
            </select>
          </label>
          <label>
            Office
            <select value={f.officeId} onChange={(e) => set("officeId", e.target.value)}>
              <option value="">Pick your office</option>
              {offices.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </label>
          <label>Mobile<input type="tel" value={f.mobile} onChange={(e) => set("mobile", e.target.value)} placeholder="(555) 555-5555" /></label>
          <label>Office phone<input type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></label>
        </div>
        <label>About me <span className="hint">One or two short lines</span><textarea value={f.bio} onChange={(e) => set("bio", e.target.value)} maxLength={600} /></label>
        <div className="grid g2" style={{ gap: 12 }}>
          <label>LinkedIn<input value={f.linkedin} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." /></label>
          <label>Booking link<input value={f.calendarUrl} onChange={(e) => set("calendarUrl", e.target.value)} placeholder="https://calendly.com/..." /></label>
          <label>Website<input value={f.website} onChange={(e) => set("website", e.target.value)} placeholder="https://rhmstaffing.com/jobs" /></label>
        </div>

        <div className="stack-sm">
          <span style={{ fontWeight: 500, fontSize: 14, color: "var(--text-strong)" }}>More links</span>
          {f.links.map((l, i) => (
            <div key={i} className="row" style={{ flexWrap: "nowrap" }}>
              <input aria-label="Label" placeholder="Label" value={l.label} style={{ flex: "0 0 35%" }} onChange={(e) => set("links", f.links.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
              <input aria-label="URL" placeholder="https://" value={l.url} onChange={(e) => set("links", f.links.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)))} />
              <button type="button" className="btn ghost sm" onClick={() => set("links", f.links.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
          {f.links.length < 10 && (
            <button type="button" className="btn ghost sm" style={{ alignSelf: "flex-start" }} onClick={() => set("links", [...f.links, { label: "", url: "" }])}>+ Add a link</button>
          )}
        </div>

        <label>
          Your link
          <div className="row" style={{ flexWrap: "nowrap", gap: 0 }}>
            <span className="small muted" style={{ padding: "0 8px 0 0", whiteSpace: "nowrap" }}>{base}</span>
            <input value={f.slug} onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} />
          </div>
          <span className="hint">Changing this makes a new QR code. Old printed QR codes will stop working.</span>
        </label>

        {msg && <div className={`alert ${msg.kind}`}>{msg.text}</div>}
        <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save my card"}</button>
      </form>

      <div className="stack" style={{ position: "sticky", top: 24 }}>
        <span className="small muted">Preview</span>
        <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "var(--shadow-lg)", maxWidth: 420 }}>
          <CardView data={{ ...f, office }} preview />
        </div>
      </div>
    </div>
  );
}
