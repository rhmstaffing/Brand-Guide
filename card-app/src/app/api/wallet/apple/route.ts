import { NextResponse } from "next/server";
import { apiUser } from "@/lib/auth";
import { appleWalletConfigured, applePass } from "@/lib/wallet";
import { track } from "@/lib/events";

export async function GET() {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!appleWalletConfigured()) {
    return NextResponse.json({ error: "Apple Wallet is not set up yet. An admin needs to add the Apple pass certificate." }, { status: 501 });
  }
  const pass = await applePass(user);
  await track(user.id, "WALLET_ADD", { target: "apple" });
  return new NextResponse(new Uint8Array(pass), {
    headers: {
      "content-type": "application/vnd.apple.pkpass",
      "content-disposition": `attachment; filename="${user.slug}.pkpass"`,
      "cache-control": "no-store",
    },
  });
}
