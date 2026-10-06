import { requireUser } from "@/lib/auth";
import { cardUrl } from "@/lib/config";
import { appleWalletConfigured, googleWalletConfigured } from "@/lib/wallet";
import ShareTools from "./ShareTools";

export const metadata = { title: "Share | RHM Cards" };

export default async function SharePage() {
  const u = await requireUser();
  return (
    <div>
      <div className="page-head">
        <div>
          <p className="eyebrow">Share and QR</p>
          <h1 style={{ marginTop: 6 }}>Share your card</h1>
        </div>
      </div>
      <ShareTools
        url={cardUrl(u.slug)}
        slug={u.slug}
        name={`${u.firstName} ${u.lastName}`.trim()}
        title={u.title ?? ""}
        phone={u.mobile || u.phone || ""}
        email={u.email}
        office={u.office?.name ?? ""}
        photo={u.photo ?? ""}
        apple={appleWalletConfigured()}
        google={googleWalletConfigured()}
      />
    </div>
  );
}
