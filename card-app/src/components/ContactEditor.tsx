"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type EditorContact = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  website: string;
  address: string;
  notes: string;
  rawText: string;
  kind: "CANDIDATE" | "CLIENT" | "OTHER";
  tags: string[];
  scanImage: string;
  status: string;
  source: string;
  sfError: string;
  sfUrl: string;
};

type Step = "edit" | "review-check" | "are-you-sure" | "sending";

export function ContactEditor({ initial, uncertain = [] }: { initial: EditorContact; uncertain?: string[] }) {
  const router = useRouter();
  const [c, setC] = useState(initial);
  const [step, setStep] = useState<Step>("edit");
  const [msg, setMsg] = useState<{ kind: "ok" | "err" | "warn" | ""; text: string }>(
    uncertain.length ? { kind: "warn", text: `Double check these. The scan wasn't sure about: ${uncertain.join(", ")}.` } : { kind: "", text: "" },
  );
  const [saving, setSaving] = useState(false);
  const [tagText, setTagText] = useState(initial.tags.join(", "));
  const firstField = useRef<HTMLInputElement>(null);
  const set = <K extends keyof EditorContact>(k: K, v: EditorContact[K]) => setC((p) => ({ ...p, [k]: v }));
  const warn = (k: string) => (uncertain.includes(k) ? "field-warn" : "");

  const fields = () => ({
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    company: c.company,
    title: c.title,
    website: c.website,
    address: c.address,
    notes: c.notes,
    rawText: c.rawText,
    kind: c.kind,
    tags: tagText.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 20),
  });

  async function saveDraft() {
    setSaving(true);
    const r = await fetch(`/api/contacts/${c.id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify(fields()) });
    setSaving(false);
    setMsg(r.ok ? { kind: "ok", text: "Saved. Nothing was sent to Salesforce." } : { kind: "err", text: "Could not save. Try again." });
  }

  function startSend() {
    if (!c.firstName && !c.lastName) return setMsg({ kind: "err", text: "Add at least a name before sending." });
    if (!c.email && !c.phone) return setMsg({ kind: "err", text: "Add an email or phone number before sending." });
    setStep("review-check");
  }

  // Warning 1 answered "No": send them back to the form to fix things.
  function goBackToFix() {
    setStep("edit");
    setMsg({ kind: "warn", text: "Go through each field and compare it to the photo. Fix anything that's off, then send again." });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => firstField.current?.focus(), 300);
  }

  async function send() {
    setStep("sending");
    const r = await fetch(`/api/contacts/${c.id}/send`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fields: fields(), reviewed: true, confirmed: true }),
    });
    const j = await r.json().catch(() => ({}));
    setStep("edit");
    if (!r.ok) {
      setMsg({ kind: "err", text: `Not sent to Salesforce: ${j.error || "unknown error"}. Your edits are saved. Try again.` });
      set("status", "FAILED");
      return;
    }
    set("status", "SYNCED");
    setMsg({ kind: "ok", text: "Sent to Salesforce." });
    router.refresh();
  }

  async function remove() {
    if (!confirm("Delete this contact from RHM Cards? This does not delete it from Salesforce.")) return;
    await fetch(`/api/contacts/${c.id}`, { method: "DELETE" });
    router.push("/contacts");
    router.refresh();
  }

  const name = `${c.firstName} ${c.lastName}`.trim() || "this contact";
  const synced = c.status === "SYNCED";

  return (
    <div className="grid" style={{ gridTemplateColumns: c.scanImage ? "repeat(auto-fit,minmax(300px,1fr))" : "1fr", gap: 24, alignItems: "start" }}>
      {c.scanImage && (
        <div className="card stack-sm" style={{ position: "sticky", top: 16 }}>
          <span className="small" style={{ fontWeight: 600, color: "var(--text-strong)" }}>Original photo</span>
          <img src={c.scanImage} alt="Scanned document" style={{ width: "100%", borderRadius: 8, border: "1px solid var(--border-subtle)" }} />
          <span className="tiny muted">Compare each field to the photo before you send.</span>
        </div>
      )}
      <div className="card stack" style={{ maxWidth: 760 }}>
        <div className="row between">
          <div className="row">
            <span className={`badge ${synced ? "ok" : c.status === "FAILED" ? "err" : "warn"}`}>
              {synced ? "In Salesforce" : c.status === "FAILED" ? "Not sent, error" : "Draft, not in Salesforce"}
            </span>
            {c.sfUrl && <a className="small" href={c.sfUrl} target="_blank">Open in Salesforce</a>}
          </div>
          <span className="tiny muted">{c.source === "SCAN" ? "From a scan" : c.source === "SHARED_BACK" ? "Shared from your card" : "Entered by hand"}</span>
        </div>
        {c.sfError && c.status === "FAILED" && <div className="alert err small">{c.sfError}</div>}
        {msg.text && <div className={`alert ${msg.kind}`}>{msg.text}</div>}

        <div className="grid g2" style={{ gap: 12 }}>
          <label className={warn("firstName")}>First name<input ref={firstField} value={c.firstName} onChange={(e) => set("firstName", e.target.value)} /></label>
          <label className={warn("lastName")}>Last name<input value={c.lastName} onChange={(e) => set("lastName", e.target.value)} /></label>
          <label className={warn("email")}>Email<input type="email" value={c.email} onChange={(e) => set("email", e.target.value)} /></label>
          <label className={warn("phone")}>Phone<input type="tel" value={c.phone} onChange={(e) => set("phone", e.target.value)} /></label>
          <label className={warn("company")}>Company<input value={c.company} onChange={(e) => set("company", e.target.value)} /></label>
          <label className={warn("title")}>Job title<input value={c.title} onChange={(e) => set("title", e.target.value)} /></label>
          <label className={warn("website")}>Website<input value={c.website} onChange={(e) => set("website", e.target.value)} /></label>
          <label>
            Type
            <select value={c.kind} onChange={(e) => set("kind", e.target.value as EditorContact["kind"])}>
              <option value="CANDIDATE">Candidate / job seeker</option>
              <option value="CLIENT">Client / hiring contact</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
        </div>
        <label className={warn("address")}>Address<input value={c.address} onChange={(e) => set("address", e.target.value)} /></label>
        <label className={warn("notes")}>Notes<textarea value={c.notes} onChange={(e) => set("notes", e.target.value)} /></label>
        <label>Tags <span className="hint">Comma separated, like forklift, 2nd shift</span><input value={tagText} onChange={(e) => setTagText(e.target.value)} /></label>
        {(c.rawText || c.source === "SCAN") && (
          <label>
            Full text from the scan <span className="hint">Fix any misread words. This goes into the Salesforce description.</span>
            <textarea value={c.rawText} onChange={(e) => set("rawText", e.target.value)} style={{ minHeight: 180, fontSize: 14 }} />
          </label>
        )}

        <div className="row between" style={{ marginTop: 8 }}>
          <button type="button" className="btn ghost sm" onClick={remove} style={{ color: "var(--red-500)" }}>Delete</button>
          <div className="row">
            <button type="button" className="btn secondary" onClick={saveDraft} disabled={saving || step === "sending"}>{saving ? "Saving..." : "Save draft"}</button>
            <button type="button" className="btn" onClick={startSend} disabled={step === "sending"}>
              {step === "sending" ? "Sending..." : synced ? "Update in Salesforce" : "Send to Salesforce"}
            </button>
          </div>
        </div>
      </div>

      {step === "review-check" && (
        <div className="scrim" role="dialog" aria-modal="true" aria-labelledby="w1">
          <div className="dialog stack">
            <h2 id="w1">Did you review and fix any mistakes?</h2>
            <p className="muted">Check every field against the photo. Names, emails and phone numbers are easy for a scan to get wrong.</p>
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn secondary" onClick={goBackToFix} autoFocus>No, take me back</button>
              <button className="btn" onClick={() => setStep("are-you-sure")}>Yes</button>
            </div>
          </div>
        </div>
      )}
      {step === "are-you-sure" && (
        <div className="scrim" role="dialog" aria-modal="true" aria-labelledby="w2">
          <div className="dialog stack">
            <h2 id="w2">Are you sure?</h2>
            <p className="muted">This sends {name} to Salesforce under your name.</p>
            <div className="card tint small" style={{ padding: 12 }}>
              <div><strong>{name}</strong></div>
              {c.title || c.company ? <div>{[c.title, c.company].filter(Boolean).join(", ")}</div> : null}
              {c.email && <div>{c.email}</div>}
              {c.phone && <div>{c.phone}</div>}
            </div>
            <div className="row" style={{ justifyContent: "flex-end" }}>
              <button className="btn secondary" onClick={() => setStep("edit")} autoFocus>Go back</button>
              <button className="btn" onClick={send}>Yes, send it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
