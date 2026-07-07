import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

// Default social/link-preview image for the whole site (Facebook ads, sharing).
// Next inherits this for every route that doesn't define its own.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;

// Inter (latin-ext) so Czech diacritics render. Fetched at generation time;
// if the CDN is unreachable we fall back to the built-in font so builds never break.
async function loadFonts() {
  const url = (w: number) =>
    `https://cdn.jsdelivr.net/npm/@fontsource/inter/files/inter-latin-ext-${w}-normal.woff`;
  try {
    const [bold, medium] = await Promise.all([
      fetch(url(800)).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())),
      fetch(url(500)).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())),
    ]);
    return [
      { name: "Inter", data: bold, weight: 800 as const, style: "normal" as const },
      { name: "Inter", data: medium, weight: 500 as const, style: "normal" as const },
    ];
  } catch {
    return undefined;
  }
}

export default async function OpengraphImage() {
  const fonts = await loadFonts();
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          color: "white",
          fontFamily: "Inter, sans-serif",
          background: "linear-gradient(135deg, #14224f 0%, #1f3a93 55%, #2ea6e6 125%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 500, opacity: 0.9 }}>
          <div style={{ width: 14, height: 14, borderRadius: 99, background: "#34d399" }} />
          Instalatérství · Nymburk · od 1993
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            <div>Vše pro vodu, topení</div>
            <div>a koupelny</div>
          </div>
          <div style={{ marginTop: 24, fontSize: 34, fontWeight: 500, opacity: 0.92 }}>
            Prodej materiálu · vybavení koupelen · čištění kanalizace
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 36, fontWeight: 800 }}>
          <div>Instalatérství Hampl</div>
          <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.16)", padding: "14px 30px", borderRadius: 999, fontSize: 34 }}>
            Volejte {siteConfig.contact.phoneDisplay}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
