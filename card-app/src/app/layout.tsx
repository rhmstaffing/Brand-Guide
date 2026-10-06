import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RHM Cards",
  description: "Digital business cards for RHM Staffing Solutions",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/brand/icon-32.png", apple: "/brand/icon-180.png" },
  appleWebApp: { capable: true, title: "RHM Cards", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#02195C", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))}`,
          }}
        />
      </body>
    </html>
  );
}
