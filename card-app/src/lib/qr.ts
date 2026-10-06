import { readFile } from "fs/promises";
import path from "path";
import QRCode from "qrcode";
import { db } from "./db";
import { qrTarget } from "./config";

// QR codes come from the QR Code Monkey API (https://www.qrcode-monkey.com/qr-code-api-with-logo/)
// with the "edge-cut" body shape and the RHM mark in the middle. The PNG is stored on the
// user row so it never has to be regenerated unless their link changes.
// If the API is down, a plain local QR is stored and retried on the next request.

const MONKEY_BASE = process.env.QR_MONKEY_RAPIDAPI_KEY
  ? "https://qrcode-monkey.p.rapidapi.com"
  : "https://api.qrcode-monkey.com";

function monkeyHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const h: Record<string, string> = { ...extra };
  if (process.env.QR_MONKEY_RAPIDAPI_KEY) {
    h["x-rapidapi-key"] = process.env.QR_MONKEY_RAPIDAPI_KEY;
    h["x-rapidapi-host"] = "qrcode-monkey.p.rapidapi.com";
  }
  return h;
}

let uploadedLogo: string | null = null;

async function monkeyLogo(): Promise<string | undefined> {
  if (process.env.QR_LOGO_URL) return process.env.QR_LOGO_URL;
  if (uploadedLogo) return uploadedLogo;
  const file = await readFile(path.join(process.cwd(), "public/brand/qr-logo.png"));
  const form = new FormData();
  form.append("file", new Blob([new Uint8Array(file)], { type: "image/png" }), "qr-logo.png");
  const res = await fetch(`${MONKEY_BASE}/qr/uploadimage`, { method: "POST", body: form, headers: monkeyHeaders() });
  if (!res.ok) return undefined;
  const json = (await res.json()) as { file?: string };
  uploadedLogo = json.file ?? null;
  return uploadedLogo ?? undefined;
}

export async function fetchMonkeyQr(data: string): Promise<Buffer> {
  const logo = await monkeyLogo().catch(() => undefined);
  const body = {
    data,
    config: {
      body: "edge-cut",
      eye: "frame0",
      eyeBall: "ball0",
      bodyColor: "#02195C",
      bgColor: "#FFFFFF",
      eye1Color: "#084FA3",
      eye2Color: "#084FA3",
      eye3Color: "#084FA3",
      eyeBall1Color: "#02195C",
      eyeBall2Color: "#02195C",
      eyeBall3Color: "#02195C",
      gradientOnEyes: false,
      logo,
      logoMode: "clean",
    },
    size: 1000,
    download: "imageUrl",
    file: "png",
  };
  const res = await fetch(`${MONKEY_BASE}/qr/custom`, {
    method: "POST",
    headers: monkeyHeaders({ "content-type": "application/json" }),
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`QR Code Monkey ${res.status}: ${await res.text().catch(() => "")}`);
  if ((res.headers.get("content-type") || "").startsWith("image/")) {
    return Buffer.from(await res.arrayBuffer());
  }
  const json = (await res.json()) as { imageUrl?: string };
  if (!json.imageUrl) throw new Error("QR Code Monkey returned no image");
  const url = json.imageUrl.startsWith("//") ? `https:${json.imageUrl}` : json.imageUrl;
  const img = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!img.ok) throw new Error(`QR image download failed ${img.status}`);
  return Buffer.from(await img.arrayBuffer());
}

export async function localQr(data: string): Promise<Buffer> {
  return QRCode.toBuffer(data, {
    type: "png",
    width: 1000,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#02195C", light: "#FFFFFF" },
  });
}

/** Returns the stored QR for a user, generating it when missing, stale or a fallback. */
export async function ensureQr(userId: string, force = false): Promise<{ png: Buffer; source: string }> {
  const u = await db.user.findUniqueOrThrow({
    where: { id: userId },
    select: { slug: true, qrPng: true, qrTarget: true, qrSource: true, qrUpdatedAt: true },
  });
  const target = qrTarget(u.slug);
  const fresh = u.qrPng && u.qrTarget === target;
  const retryFallback =
    u.qrSource === "local" && (!u.qrUpdatedAt || Date.now() - u.qrUpdatedAt.getTime() > 10 * 60_000);
  if (fresh && !force && !retryFallback) return { png: Buffer.from(u.qrPng!), source: u.qrSource || "local" };

  let png: Buffer;
  let source = "qrcode-monkey";
  try {
    png = await fetchMonkeyQr(target);
  } catch (e) {
    console.error("QR Code Monkey failed, using local QR", e);
    if (fresh) return { png: Buffer.from(u.qrPng!), source: u.qrSource || "local" };
    png = await localQr(target);
    source = "local";
  }
  await db.user.update({
    where: { id: userId },
    data: { qrPng: new Uint8Array(png), qrTarget: target, qrSource: source, qrUpdatedAt: new Date() },
  });
  return { png, source };
}
