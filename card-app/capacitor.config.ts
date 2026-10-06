import type { CapacitorConfig } from "@capacitor/cli";

// The native iOS and Android apps are thin shells around the hosted site,
// so every feature (login, scanning, dashboards) stays in one codebase.
// Set APP_URL to your production URL before running `npx cap sync`.
const config: CapacitorConfig = {
  appId: "net.rhmstaffing.cards",
  appName: "RHM Cards",
  webDir: "public",
  server: {
    url: process.env.APP_URL || "https://cards.rhmstaffing.net",
    cleartext: false,
  },
  ios: { contentInset: "always" },
  android: { allowMixedContent: false },
};

export default config;
