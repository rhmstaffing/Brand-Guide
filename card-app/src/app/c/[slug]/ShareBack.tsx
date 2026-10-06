"use client";
import { useState } from "react";

export default function ShareBack({ slug, firstName }: { slug: string; firstName: string }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/public/share-back", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...body, slug, consent: body.consent === "on" }),
    });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(j.error || "Something went wrong. Try again.");
    setDone(true);
  }

  if (done) {
    return (
      <div className="card stack-sm" style={{ textAlign: "center" }}>
        <h2>Thanks. {firstName} has your info.</h2>
        <p className="muted small">Expect to hear back soon. Save {firstName}'s contact so you know who's calling.</p>
        <a href={`/c/${slug}/vcard`} className="btn block" style={{ marginTop: 8 }}>Save {firstName}'s contact</a>
      </div>
    );
  }
  if (!open) {
    return (
      <div className="card stack-sm" style={{ textAlign: "center" }}>
        <h2>Share your info with {firstName}</h2>
        <p className="muted small">Takes 20 seconds. {firstName} will reach out.</p>
        <button className="btn block" onClick={() => setOpen(true)} style={{ marginTop: 8 }}>Share my info</button>
      </div>
    );
  }
  return (
    <form className="card stack" onSubmit={submit}>
      <h2>Share your info with {firstName}</h2>
      <div className="grid g2" style={{ gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        <label>First name<input name="firstName" required autoComplete="given-name" /></label>
        <label>Last name<input name="lastName" required autoComplete="family-name" /></label>
      </div>
      <label>Email<input name="email" type="email" autoComplete="email" /></label>
      <label>Phone<input name="phone" type="tel" autoComplete="tel" /></label>
      <label>
        I am
        <select name="kind" defaultValue="CANDIDATE">
          <option value="CANDIDATE">Looking for work</option>
          <option value="CLIENT">Hiring or looking for staff</option>
          <option value="OTHER">Something else</option>
        </select>
      </label>
      <div className="grid g2" style={{ gap: 12, gridTemplateColumns: "1fr 1fr" }}>
        <label>Company <span className="hint">Optional</span><input name="company" autoComplete="organization" /></label>
        <label>Job title <span className="hint">Optional</span><input name="title" autoComplete="organization-title" /></label>
      </div>
      <label>Note <span className="hint">Optional</span><textarea name="notes" maxLength={1000} style={{ minHeight: 72 }} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999, width: 1, height: 1 }} aria-hidden />
      <label style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, fontWeight: 400 }}>
        <input type="checkbox" name="consent" required style={{ marginTop: 4 }} />
        <span className="small">I agree that RHM Staffing Solutions can contact me by phone, text or email.</span>
      </label>
      {error && <div className="alert err">{error}</div>}
      <button className="btn block" disabled={busy}>{busy ? "Sending..." : "Send my info"}</button>
    </form>
  );
}
