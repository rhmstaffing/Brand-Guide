import { readFile } from "fs/promises";
import path from "path";
import { importPKCS8, SignJWT } from "jose";
import type { User } from "@prisma/client";
import { appUrl, cardUrl, qrTarget } from "./config";

function fullName(u: User) {
  return `${u.firstName} ${u.lastName}`.trim() || u.email;
}

function b64env(name: string): string | undefined {
  const v = process.env[name];
  return v ? Buffer.from(v, "base64").toString("utf8") : undefined;
}

// ---------- Apple Wallet (.pkpass) ----------

export function appleWalletConfigured(): boolean {
  return Boolean(
    process.env.APPLE_PASS_TYPE_ID &&
      process.env.APPLE_TEAM_ID &&
      process.env.APPLE_WWDR_PEM_B64 &&
      process.env.APPLE_SIGNER_CERT_PEM_B64 &&
      process.env.APPLE_SIGNER_KEY_PEM_B64,
  );
}

export async function applePass(u: User & { office: { name: string } | null }): Promise<Buffer> {
  const { PKPass } = await import("passkit-generator");
  const dir = path.join(process.cwd(), "wallet");
  const files: Record<string, Buffer> = {};
  for (const f of ["icon.png", "icon@2x.png", "icon@3x.png", "logo.png", "logo@2x.png"]) {
    files[f] = await readFile(path.join(dir, f));
  }
  files["pass.json"] = Buffer.from(
    JSON.stringify({
      formatVersion: 1,
      passTypeIdentifier: process.env.APPLE_PASS_TYPE_ID,
      teamIdentifier: process.env.APPLE_TEAM_ID,
      organizationName: "RHM Staffing Solutions",
      description: `${fullName(u)} business card`,
      logoText: "RHM Staffing Solutions",
      foregroundColor: "rgb(255,255,255)",
      backgroundColor: "rgb(2,25,92)",
      labelColor: "rgb(82,192,228)",
      generic: {},
    }),
  );
  const pass = new PKPass(
    files,
    {
      wwdr: b64env("APPLE_WWDR_PEM_B64")!,
      signerCert: b64env("APPLE_SIGNER_CERT_PEM_B64")!,
      signerKey: b64env("APPLE_SIGNER_KEY_PEM_B64")!,
      signerKeyPassphrase: process.env.APPLE_SIGNER_KEY_PASSPHRASE,
    },
    { serialNumber: `${u.id}-${(u.updatedAt ?? new Date()).getTime()}` },
  );
  pass.primaryFields.push({ key: "name", label: u.title || "RHM Staffing", value: fullName(u) });
  if (u.office) pass.secondaryFields.push({ key: "office", label: "Office", value: u.office.name });
  if (u.mobile || u.phone) pass.secondaryFields.push({ key: "phone", label: "Phone", value: u.mobile || u.phone || "" });
  pass.auxiliaryFields.push({ key: "email", label: "Email", value: u.email });
  pass.backFields.push({ key: "card", label: "Digital card", value: cardUrl(u.slug) });
  pass.setBarcodes({ message: qrTarget(u.slug), format: "PKBarcodeFormatQR", messageEncoding: "iso-8859-1", altText: "Scan to save my info" });
  return pass.getAsBuffer();
}

// ---------- Google Wallet (Android) ----------

export function googleWalletConfigured(): boolean {
  return Boolean(process.env.GOOGLE_WALLET_ISSUER_ID && process.env.GOOGLE_WALLET_SA_EMAIL && process.env.GOOGLE_WALLET_SA_KEY_B64);
}

export async function googleSaveUrl(u: User & { office: { name: string } | null }): Promise<string> {
  const issuer = process.env.GOOGLE_WALLET_ISSUER_ID!;
  const classId = `${issuer}.rhm_business_card`;
  const version = (u.updatedAt ?? new Date()).getTime();
  const objectId = `${issuer}.${u.id.replace(/[^\w.-]/g, "_")}_${version}`;
  const t = (value: string) => ({ defaultValue: { language: "en-US", value } });
  const text = [
    u.mobile || u.phone ? { id: "phone", header: "Phone", body: u.mobile || u.phone } : null,
    { id: "email", header: "Email", body: u.email },
    u.office ? { id: "office", header: "Office", body: u.office.name } : null,
  ].filter(Boolean);
  const claims = {
    iss: process.env.GOOGLE_WALLET_SA_EMAIL,
    aud: "google",
    typ: "savetowallet",
    origins: [appUrl()],
    payload: {
      genericClasses: [{ id: classId }],
      genericObjects: [
        {
          id: objectId,
          classId,
          state: "ACTIVE",
          cardTitle: t("RHM Staffing Solutions"),
          header: t(fullName(u)),
          subheader: t(u.title || "RHM Staffing Solutions"),
          hexBackgroundColor: "#02195C",
          logo: { sourceUri: { uri: `${appUrl()}/brand/icon-192.png` }, contentDescription: t("RHM") },
          textModulesData: text,
          barcode: { type: "QR_CODE", value: qrTarget(u.slug), alternateText: "Scan to save my info" },
          linksModuleData: { uris: [{ uri: cardUrl(u.slug), description: "My digital card", id: "card" }] },
        },
      ],
    },
  };
  const key = await importPKCS8(b64env("GOOGLE_WALLET_SA_KEY_B64")!, "RS256");
  const jwt = await new SignJWT(claims as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuedAt()
    .sign(key);
  return `https://pay.google.com/gp/v/save/${jwt}`;
}
