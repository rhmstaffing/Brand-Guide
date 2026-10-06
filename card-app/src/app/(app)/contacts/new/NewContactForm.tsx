"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewContactForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const r = await fetch("/api/contacts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ firstName: f.firstName, lastName: f.lastName, email: f.email, phone: f.phone, company: f.company, title: f.title, website: "", address: "", notes: f.notes, rawText: "", kind: f.kind, tags: [] }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok) router.push(`/contacts/${j.id}`);
    else setBusy(false);
  }
  return (
    <form className="card stack" style={{ maxWidth: 640 }} onSubmit={submit}>
      <div className="grid g2" style={{ gap: 12 }}>
        <label>First name<input name="firstName" required /></label>
        <label>Last name<input name="lastName" /></label>
        <label>Email<input name="email" type="email" /></label>
        <label>Phone<input name="phone" type="tel" /></label>
        <label>Company<input name="company" /></label>
        <label>Job title<input name="title" /></label>
      </div>
      <label>
        Type
        <select name="kind" defaultValue="CANDIDATE">
          <option value="CANDIDATE">Candidate / job seeker</option>
          <option value="CLIENT">Client / hiring contact</option>
          <option value="OTHER">Other</option>
        </select>
      </label>
      <label>Notes<textarea name="notes" /></label>
      <button className="btn" disabled={busy}>{busy ? "Saving..." : "Save and review"}</button>
    </form>
  );
}
