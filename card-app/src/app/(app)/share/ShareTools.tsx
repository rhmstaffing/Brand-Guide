"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";
import { CopyButton } from "@/components/CopyButton";

type Props = { url: string; slug: string; name: string; title: string; phone: string; email: string; office: string; photo: string; apple: boolean; google: boolean };

const log = (channel: string) =>
  fetch("/api/me/event", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ channel }) }).catch(() => {});

export default function ShareTools(props: Props) {
  let p = props;
  const [qrKey, setQrKey] = useState(0);
  const [source, setSource] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [canNfc, setCanNfc] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("other");
  const [sig, setSig] = useState("");

  useEffect(() => {
    setCanShare(typeof navigator.share === "function");
    setCanNfc("NDEFReader" in window);
    const ua = navigator.userAgent;
    setPlatform(/iPhone|iPad|Macintosh/.test(ua) ? "ios" : /Android/.test(ua) ? "android" : "other");
    setSig(signatureHtml());
    fetch("/api/me/qr", { method: "HEAD" }).then((r) => setSource(r.headers.get("x-qr-source") || ""));
  }, [qrKey]);

  const smsBody = encodeURIComponent(`Hi, it's ${p.name} with RHM Staffing Solutions. Here's my contact card: ${p.url}`);
  const mailSubject = encodeURIComponent(`${p.name} | RHM Staffing Solutions`);
  const mailBody = encodeURIComponent(`Hi,\n\nGreat connecting with you. Here's my digital business card so you have my info:\n${p.url}\n\nYou can also share your info with me from that page.\n\n${p.name}\n${p.title}`);

  async function regenerate() {
    setBusy(true);
    const r = await fetch("/api/me/qr", { method: "POST" });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    setNote(j.source === "qrcode-monkey" ? "New QR code made." : "QR Code Monkey didn't answer, so a basic QR was made. We'll retry automatically.");
    setQrKey((k) => k + 1);
  }

  async function writeNfc() {
    try {
      // @ts-expect-error Web NFC is Chrome on Android only
      const reader = new NDEFReader();
      setNote("Hold an NFC tag or sticker to the back of your phone...");
      await reader.write({ records: [{ recordType: "url", data: `${p.url}?s=nfc` }] });
      setNote("Done. Anyone who taps that tag will open your card.");
      log("nfc-write");
    } catch (e) {
      setNote(`NFC write failed: ${(e as Error).message}`);
    }
  }

  function signatureHtml() {
    const e = (v: string) => v.replace(/[<>&"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" })[c]!);
    p = { ...p, name: e(p.name), title: e(p.title), office: e(p.office), phone: e(p.phone), email: e(p.email) };
    const qr = `${location.origin}/api/public/qr/${p.slug}`;
    return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#363E49"><tr>
<td style="padding-right:14px;border-right:2px solid #084FA3;vertical-align:top"><a href="${p.url}?s=sig"><img src="${qr}" width="84" height="84" alt="My digital card" style="display:block"></a></td>
<td style="padding-left:14px;vertical-align:top">
<div style="font-size:16px;font-weight:bold;color:#02195C">${p.name}</div>
<div>${p.title}${p.office ? ` · ${p.office}` : ""}</div>
<div style="margin-top:6px">${p.phone ? `${p.phone} · ` : ""}<a href="mailto:${p.email}" style="color:#084FA3">${p.email}</a></div>
<div style="margin-top:6px"><a href="${p.url}?s=sig" style="color:#084FA3;font-weight:bold">View my digital card</a></div>
<div style="margin-top:8px;color:#02195C;font-weight:bold;letter-spacing:1px">RHM STAFFING SOLUTIONS</div>
</td></tr></table>`;
  }

  async function copySignature() {
    const html = signatureHtml();
    try {
      await navigator.clipboard.write([new ClipboardItem({ "text/html": new Blob([html], { type: "text/html" }), "text/plain": new Blob([`${p.name}\n${p.title}\n${p.phone}\n${p.email}\n${p.url}`], { type: "text/plain" }) })]);
      setNote("Signature copied. Paste it into Outlook: Settings, Mail, Compose and reply, Email signature.");
      log("signature");
    } catch {
      setNote("Your browser blocked copying. Select the preview below and copy it by hand.");
    }
  }

  async function makeBackground() {
    setBusy(true);
    const load = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = rej; i.src = src; });
    const [bg, logo, wave, qr] = await Promise.all([load("/brand/card-bg.jpg"), load("/brand/rhm-horizontal-white.png"), load("/brand/wave-white.png"), load(`/api/me/qr?t=${Date.now()}`)]);
    const c = document.createElement("canvas");
    c.width = 1920;
    c.height = 1080;
    const x = c.getContext("2d")!;
    const s = Math.max(1920 / bg.width, 1080 / bg.height);
    x.drawImage(bg, (1920 - bg.width * s) / 2, (1080 - bg.height * s) / 2, bg.width * s, bg.height * s);
    const g = x.createLinearGradient(0, 0, 1920, 0);
    g.addColorStop(0, "rgba(6,15,26,.88)");
    g.addColorStop(0.55, "rgba(2,25,92,.55)");
    g.addColorStop(1, "rgba(2,25,92,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 1920, 1080);
    x.globalAlpha = 0.35;
    x.drawImage(wave, 1920 - 1100, 1080 - 520, 1200, (1200 * wave.height) / wave.width);
    x.globalAlpha = 1;
    x.drawImage(logo, 80, 70, 420, (420 * logo.height) / logo.width);
    // Bottom-left keeps the speaker's head clear. The QR plate sits top right.
    await document.fonts.ready;
    x.fillStyle = "#fff";
    x.font = "600 54px 'Josefin Sans', sans-serif";
    x.fillText(p.name, 80, 920);
    x.font = "400 30px 'Google Sans', sans-serif";
    x.fillStyle = "#C9D6E6";
    x.fillText([p.title, p.office].filter(Boolean).join("  ·  "), 80, 970);
    x.fillText(p.email, 80, 1015);
    x.fillStyle = "#fff";
    x.fillRect(1920 - 80 - 240, 70, 240, 240);
    x.drawImage(qr, 1920 - 80 - 228, 82, 216, 216);
    x.font = "500 22px 'Google Sans', sans-serif";
    x.textAlign = "center";
    x.fillText("Scan for my card", 1920 - 80 - 120, 345);
    const a = document.createElement("a");
    a.download = `${p.slug}-teams-background.png`;
    a.href = c.toDataURL("image/png");
    a.click();
    setBusy(false);
    log("background");
  }

  return (
    <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, alignItems: "start" }}>
      <div className="card stack" style={{ alignItems: "center", textAlign: "center" }}>
        <img key={qrKey} src={`/api/me/qr?v=${qrKey}`} alt="My QR code" className="qr-img" />
        <p className="small muted">Have someone point their phone camera at this. No app needed.</p>
        {source === "local" && <div className="alert warn small">This is a backup QR. The branded one will be made when QR Code Monkey is reachable.</div>}
        <div className="row" style={{ justifyContent: "center" }}>
          <a className="btn secondary sm" href="/api/me/qr?download=1"><Icon name="download" size={16} /> Download PNG</a>
          <button className="btn ghost sm" onClick={regenerate} disabled={busy}>Remake QR</button>
        </div>
        <div className="stack-sm" style={{ width: "100%" }}>
          <span className="small" style={{ fontWeight: 600, color: "var(--text-strong)" }}>Add to your phone wallet</span>
          <p className="tiny muted">Your QR lives in your wallet so you can show it fast, even from the lock screen.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            {(platform !== "android" || !p.google) && (
              <a className="btn sm" href={p.apple ? "/api/wallet/apple" : undefined} aria-disabled={!p.apple} style={p.apple ? { background: "#000" } : { opacity: 0.45, pointerEvents: "none", background: "#000" }}>
                <Icon name="wallet" size={16} /> Add to Apple Wallet
              </a>
            )}
            {(platform !== "ios" || !p.apple) && (
              <a className="btn sm" href={p.google ? "/api/wallet/google" : undefined} aria-disabled={!p.google} style={p.google ? { background: "#000" } : { opacity: 0.45, pointerEvents: "none", background: "#000" }}>
                <Icon name="wallet" size={16} /> Add to Google Wallet
              </a>
            )}
          </div>
          {!p.apple && !p.google && <p className="tiny muted">Wallet passes turn on once an admin adds the Apple and Google wallet keys.</p>}
        </div>
      </div>

      <div className="stack">
        <div className="card stack-sm">
          <h2>Send your link</h2>
          <p className="small muted" style={{ wordBreak: "break-all" }}>{p.url}</p>
          <div className="row" style={{ marginTop: 8 }}>
            <CopyButton text={p.url} />
            <a className="btn secondary sm" href={`sms:?&body=${smsBody}`} onClick={() => log("sms")}><Icon name="message" size={16} /> Text</a>
            <a className="btn secondary sm" href={`mailto:?subject=${mailSubject}&body=${mailBody}`} onClick={() => log("email")}><Icon name="mail" size={16} /> Email</a>
            {canShare && (
              <button className="btn sm" onClick={() => { navigator.share({ title: p.name, text: "My contact card", url: p.url }).then(() => log("native")).catch(() => {}); }}>
                <Icon name="share" size={16} /> More
              </button>
            )}
          </div>
        </div>

        <div className="card stack-sm">
          <h2>NFC tag or sticker</h2>
          <p className="small muted">Write your card to an NFC sticker or card. People tap it with their phone to open your card.</p>
          {canNfc ? (
            <button className="btn secondary sm" style={{ alignSelf: "flex-start", marginTop: 8 }} onClick={writeNfc}><Icon name="nfc" size={16} /> Write to NFC tag</button>
          ) : (
            <p className="tiny muted">Writing tags works in Chrome on Android. On iPhone, use a free app like NFC Tools and paste: {p.url}?s=nfc</p>
          )}
        </div>

        <div className="card stack-sm">
          <h2>Email signature</h2>
          <p className="small muted">Adds your QR and a link to your card under every email you send.</p>
          <div style={{ border: "1px dashed var(--border-strong)", borderRadius: 8, padding: 12, overflowX: "auto", background: "#fff" }} dangerouslySetInnerHTML={{ __html: sig }} />
          <button className="btn secondary sm" style={{ alignSelf: "flex-start" }} onClick={copySignature}>Copy signature</button>
        </div>

        <div className="card stack-sm">
          <h2>Video call background</h2>
          <p className="small muted">A branded Teams or Zoom background with your name and QR code.</p>
          <button className="btn secondary sm" style={{ alignSelf: "flex-start", marginTop: 8 }} onClick={makeBackground} disabled={busy}><Icon name="download" size={16} /> Download background</button>
        </div>

        {note && <div className="alert">{note}</div>}
      </div>
    </div>
  );
}
