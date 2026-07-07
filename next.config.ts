import type { NextConfig } from "next";

/**
 * 301 redirects from the legacy Web Site X5 pages (`*.html`) to the new
 * URL structure. Preserves the link equity of the pages Google has indexed.
 * `permanent: true` emits HTTP 308 (permanent) which Google treats as a 301.
 *
 * Verified indexed legacy URLs (site:instal-hampl.net):
 *   /index.html, /obchod.html, /e-shop.html, /vodovodni-baterie.html,
 *   /-ist-ni-kanalizace.html, /revize-kanalizace.html, /zamrazovani-.html,
 *   /kontakty.html
 */
const legacyRedirects = [
  { source: "/index.html", destination: "/", permanent: true },
  { source: "/obchod.html", destination: "/prodejna", permanent: true },
  // No e-shop in the new site → route shoppers to the physical store page.
  { source: "/e-shop.html", destination: "/prodejna", permanent: true },
  { source: "/vodovodni-baterie.html", destination: "/sortiment/vodovodni-baterie", permanent: true },
  { source: "/-ist-ni-kanalizace.html", destination: "/sluzby/cisteni-kanalizace", permanent: true },
  { source: "/revize-kanalizace.html", destination: "/sluzby/revize-kanalizace", permanent: true },
  { source: "/zamrazovani-.html", destination: "/sluzby/zamrazovani-potrubi", permanent: true },
  { source: "/kontakty.html", destination: "/kontakt", permanent: true },
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Pin the workspace root so an unrelated parent lockfile doesn't misdirect it.
  turbopack: { root: process.cwd() },
  images: {
    // Contentful serves assets from images.ctfassets.net.
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "assets.ctfassets.net" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return legacyRedirects;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
