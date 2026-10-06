"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { resizeImage } from "@/components/image";

const MAX_PAGES = 5;
const MAX_SIDE = 2000;

export default function Scanner() {
  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [live, setLive] = useState(false);
  const [pages, setPages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => () => stopCamera(), []);

  async function startCamera() {
    setError("");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" }, width: { ideal: 2560 }, height: { ideal: 1440 } },
        audio: false,
      });
      stream.current = s;
      setLive(true);
      requestAnimationFrame(() => {
        if (video.current) {
          video.current.srcObject = s;
          video.current.play().catch(() => {});
        }
      });
    } catch {
      setError("We couldn't open the camera. Allow camera access, or use Upload a photo instead.");
    }
  }

  function stopCamera() {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setLive(false);
  }

  function snap() {
    const v = video.current;
    if (!v || !v.videoWidth) return;
    const scale = Math.min(1, MAX_SIDE / Math.max(v.videoWidth, v.videoHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(v.videoWidth * scale);
    c.height = Math.round(v.videoHeight * scale);
    c.getContext("2d")!.drawImage(v, 0, 0, c.width, c.height);
    const shot = c.toDataURL("image/jpeg", 0.88);
    setPages((p) => {
      const next = [...p, shot].slice(0, MAX_PAGES);
      if (next.length >= MAX_PAGES) stopCamera();
      return next;
    });
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []).slice(0, MAX_PAGES - pages.length);
    const shots = await Promise.all(files.map((f) => resizeImage(f, MAX_SIDE, 0.88)));
    setPages((p) => [...p, ...shots].slice(0, MAX_PAGES));
    e.target.value = "";
  }

  async function read() {
    setBusy(true);
    setError("");
    stopCamera();
    const r = await fetch("/api/contacts/scan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ images: pages }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setBusy(false);
      setError(j.error || "Scan failed. Try again.");
      return;
    }
    const u = (j.uncertain as string[] | undefined)?.join(",") || "";
    router.push(`/contacts/${j.id}${u ? `?u=${encodeURIComponent(u)}` : ""}`);
  }

  return (
    <div className="stack" style={{ maxWidth: 760 }}>
      <div className="card stack">
        {live ? (
          <div className="stack">
            <div style={{ position: "relative", background: "#000", borderRadius: 8, overflow: "hidden" }}>
              <video ref={video} playsInline muted style={{ width: "100%", display: "block", maxHeight: "60vh", objectFit: "contain" }} />
              <div style={{ position: "absolute", inset: "8%", border: "2px solid rgba(82,192,228,.8)", borderRadius: 8, pointerEvents: "none" }} />
            </div>
            <div className="row" style={{ justifyContent: "center" }}>
              <button className="btn" onClick={snap} style={{ minWidth: 160 }}><Icon name="camera" /> Take photo</button>
              <button className="btn secondary" onClick={stopCamera}>Done</button>
            </div>
            <p className="tiny muted" style={{ textAlign: "center" }}>Fill the box with the page. Good light, no glare. Take one photo per page.</p>
          </div>
        ) : (
          <div className="row" style={{ justifyContent: "center", padding: "16px 0" }}>
            <button className="btn" onClick={startCamera} disabled={pages.length >= MAX_PAGES}><Icon name="camera" /> Open camera</button>
            <label className="btn secondary" style={{ flexDirection: "row", cursor: "pointer" }}>
              <Icon name="download" /> Upload a photo
              <input type="file" accept="image/*" capture="environment" multiple onChange={onFiles} style={{ display: "none" }} />
            </label>
          </div>
        )}
      </div>

      {pages.length > 0 && (
        <div className="card stack">
          <div className="row between">
            <strong>{pages.length} {pages.length === 1 ? "page" : "pages"}</strong>
            <span className="tiny muted">Up to {MAX_PAGES} pages of the same document</span>
          </div>
          <div className="row" style={{ alignItems: "flex-start" }}>
            {pages.map((p, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={p} alt={`Page ${i + 1}`} style={{ width: 110, height: 140, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border-subtle)" }} />
                <button aria-label="Remove page" onClick={() => setPages(pages.filter((_, j) => j !== i))} style={{ position: "absolute", top: 4, right: 4, width: 26, height: 26, borderRadius: 13, border: 0, background: "rgba(6,15,26,.7)", color: "#fff", cursor: "pointer" }}>x</button>
              </div>
            ))}
          </div>
          {error && <div className="alert err">{error}</div>}
          <button className="btn block" onClick={read} disabled={busy}>{busy ? "Reading the text and handwriting..." : "Read it"}</button>
          {busy && <p className="tiny muted" style={{ textAlign: "center" }}>This takes about 10 to 30 seconds.</p>}
        </div>
      )}
      {pages.length === 0 && error && <div className="alert err">{error}</div>}
    </div>
  );
}
