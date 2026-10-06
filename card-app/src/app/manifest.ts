import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RHM Cards",
    short_name: "RHM Cards",
    description: "Digital business cards for RHM Staffing Solutions",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#02195C",
    theme_color: "#02195C",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
