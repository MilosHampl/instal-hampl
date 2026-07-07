/**
 * Single source of truth for the business's NAP (Name / Address / Phone) and
 * static facts. Used for:
 *   - JSON-LD structured data (LocalBusiness / Plumber)
 *   - hard-coded fallbacks when Contentful is not configured or an entry is missing
 *   - the header/footer contact details
 *
 * Anything editorial (hero copy, sections, product cards) comes from Contentful.
 * Keep this in sync with the Google Business Profile & Firmy.cz listing.
 */

export const siteConfig = {
  name: "Instalatérství Hampl",
  legalName: "Miloš Hampl",
  // Short tagline used as a metadata fallback.
  tagline: "Vše pro vodu, topení a koupelny na jednom místě",
  description:
    "Instalatérství Hampl Nymburk – prodej instalatérského materiálu, vybavení koupelen, čištění a revize kanalizace a půjčovna strojů. Od roku 1993.",

  // Resolved from NEXT_PUBLIC_SITE_URL at runtime; this is the fallback for local dev.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.instal-hampl.net",

  contact: {
    phone: "+420603206370",
    phoneDisplay: "603 206 370",
    email: "info@instal-hampl.net",
  },

  address: {
    street: "Maršála Koněva 1069/24",
    city: "Nymburk",
    postalCode: "288 02",
    country: "CZ",
    // Approx coordinates for Nymburk store — refine with the exact GBP pin.
    lat: 50.1861,
    lng: 15.0413,
  },

  // Po–Pá 8:00–12:00, 13:00–16:00 (per Firmy.cz). Schema.org opening-hours spec.
  openingHours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "12:00" },
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "13:00", closes: "16:00" },
  ],
  openingHoursDisplay: [
    { label: "Pondělí – Pátek", value: "8:00 – 12:00, 13:00 – 16:00" },
    { label: "Sobota – Neděle", value: "Zavřeno" },
  ],

  social: {
    facebook: "https://www.facebook.com/instalhampl/",
  },

  founded: "1993",
} as const;

/** Fully-qualified https URL for a canonical/absolute path. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Google Maps "search" URL that opens turn-by-turn navigation to the shop. */
export function mapsDirectionsUrl(): string {
  const q = encodeURIComponent(
    `${siteConfig.name}, ${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`,
  );
  return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

/** Embeddable Google Maps iframe src (no API key required). */
export function mapsEmbedUrl(): string {
  const q = encodeURIComponent(
    `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`,
  );
  return `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
}
