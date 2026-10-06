import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPublicCard, toCardData } from "@/lib/publicCard";
import { isBot, track } from "@/lib/events";
import { clientInfo } from "@/lib/request";
import { getSession } from "@/lib/auth";
import { CardView } from "@/components/CardView";
import ShareBack from "./ShareBack";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const u = await loadPublicCard((await params).slug);
  if (!u) return { title: "RHM Staffing Solutions" };
  const name = `${u.firstName} ${u.lastName}`.trim();
  return {
    title: `${name} | RHM Staffing Solutions`,
    description: `${u.title || "RHM Staffing Solutions"}. Save my contact or share yours.`,
    openGraph: { title: name, description: u.title || "RHM Staffing Solutions", images: ["/brand/icon-512.png"] },
    robots: { index: false },
  };
}

export default async function PublicCard({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ s?: string }> }) {
  const { slug } = await params;
  const { s } = await searchParams;
  const u = await loadPublicCard(slug);
  if (!u) notFound();

  const { ip, userAgent } = await clientInfo();
  const viewer = await getSession();
  if (!isBot(userAgent) && viewer?.user.id !== u.id) {
    const source = ["qr", "nfc", "sig", "wallet", "bg", "sms", "email"].includes(s || "") ? s! : "link";
    await track(u.id, source === "qr" || source === "wallet" || source === "bg" ? "QR_SCAN" : source === "nfc" ? "NFC_TAP" : "VIEW", { source, ip, userAgent });
  }
  const data = toCardData(u);
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface-subtle)", display: "flex", justifyContent: "center", padding: "0 0 32px" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div style={{ boxShadow: "var(--shadow-md)" }}>
          <CardView data={data} slug={u.slug} />
        </div>
        <div style={{ padding: "24px 16px 0" }}>
          <ShareBack slug={u.slug} firstName={u.firstName} />
          <p className="tiny muted" style={{ textAlign: "center", marginTop: 24 }}>
            RHM Staffing Solutions · Connecting passionate people with unlimited opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}
