"use client";
import { useState } from "react";

export default function LoginForm() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  async function post(url: string, body: object) {
    const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Something went wrong. Try again.");
    return json;
  }

  async function sendCode(e?: React.FormEvent) {
    e?.preventDefault();
    setError("");
    setNote("");
    if (!email.trim().toLowerCase().endsWith("@rhmstaffing.net")) {
      setError("Use your @rhmstaffing.net email address.");
      return;
    }
    setBusy(true);
    try {
      await post("/api/auth/request", { email });
      setStep("code");
      setNote(`We sent a 6 digit code to ${email}.`);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const j = await post("/api/auth/verify", { email, code });
      window.location.href = j.next || "/dashboard";
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  if (step === "email") {
    return (
      <form onSubmit={sendCode} className="stack">
        <div>
          <p className="eyebrow">RHM Cards</p>
          <h1 style={{ marginTop: 6 }}>Sign in</h1>
          <p className="muted small" style={{ marginTop: 6 }}>We'll email you a code. No password needed.</p>
        </div>
        <label>
          Work email
          <input type="email" autoComplete="email" inputMode="email" placeholder="you@rhmstaffing.net" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        {error && <div className="alert err">{error}</div>}
        <button className="btn block" disabled={busy}>{busy ? "Sending..." : "Email me a code"}</button>
      </form>
    );
  }
  return (
    <form onSubmit={verify} className="stack">
      <div>
        <p className="eyebrow">Check your email</p>
        <h1 style={{ marginTop: 6 }}>Enter your code</h1>
      </div>
      {note && <div className="alert">{note}</div>}
      <label>
        6 digit code
        <input
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          style={{ fontSize: 28, letterSpacing: ".4em", textAlign: "center" }}
          required
          autoFocus
        />
      </label>
      {error && <div className="alert err">{error}</div>}
      <button className="btn block" disabled={busy || code.length !== 6}>{busy ? "Checking..." : "Sign in"}</button>
      <div className="row between small">
        <button type="button" className="btn ghost sm" onClick={() => { setStep("email"); setCode(""); setError(""); }}>Use a different email</button>
        <button type="button" className="btn ghost sm" onClick={() => sendCode()} disabled={busy}>Send a new code</button>
      </div>
    </form>
  );
}
