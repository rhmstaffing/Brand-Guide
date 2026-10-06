import { NextResponse } from "next/server";
import { apiUser } from "@/lib/auth";
import { googleSaveUrl, googleWalletConfigured } from "@/lib/wallet";
import { track } from "@/lib/events";

export async function GET() {
  const user = await apiUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  if (!googleWalletConfigured()) {
    return NextResponse.json({ error: "Google Wallet is not set up yet. An admin needs to add the Google Wallet issuer account." }, { status: 501 });
  }
  const url = await googleSaveUrl(user);
  await track(user.id, "WALLET_ADD", { target: "google" });
  return NextResponse.redirect(url, 302);
}
