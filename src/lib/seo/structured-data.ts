import { absoluteUrl, siteConfig } from "@/lib/site-config";
import type { FaqItemData, PageData } from "@/lib/contentful/types";

/**
 * schema.org JSON-LD builders. Rich structured data is a major ranking &
 * rich-result lever for a local business — it powers the Google knowledge
 * panel, "opening hours", the map pack and FAQ rich snippets.
 */

const businessId = () => `${siteConfig.url.replace(/\/$/, "")}/#business`;

/** LocalBusiness / Plumber — the core entity for the whole site. */
export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Plumber",
    "@id": businessId(),
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    image: absoluteUrl("/logo.png"),
    priceRange: "$$",
    foundingDate: siteConfig.founded,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.address.lat,
      longitude: siteConfig.address.lng,
    },
    openingHoursSpecification: siteConfig.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    sameAs: Object.values(siteConfig.social),
    areaServed: { "@type": "City", name: "Nymburk" },
  };
}

/** WebSite entity — enables the sitelinks search box eligibility & site identity. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url.replace(/\/$/, "")}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    inLanguage: "cs-CZ",
    publisher: { "@id": businessId() },
  };
}

/** A single Service offered by the business (use on service landing pages). */
export function serviceLd(page: PageData) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.seo?.metaDescription || undefined,
    url: absoluteUrl(page.slug),
    provider: { "@id": businessId() },
    areaServed: { "@type": "City", name: "Nymburk" },
  };
}

/** FAQPage — eligible for the FAQ rich result. Answers are flattened to text. */
export function faqLd(items: FaqItemData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: typeof it.answer === "string" ? it.answer : faqAnswerToText(it.answer),
      },
    })),
  };
}

/** BreadcrumbList from a "/a/b/c" path. */
export function breadcrumbLd(path: string, title: string) {
  const parts = path.split("/").filter(Boolean);
  const items = [{ name: "Úvod", url: absoluteUrl("/") }];
  let acc = "";
  parts.forEach((part, i) => {
    acc += `/${part}`;
    const isLast = i === parts.length - 1;
    items.push({ name: isLast ? title : humanize(part), url: absoluteUrl(acc) });
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

function humanize(slug: string): string {
  return slug.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

/** Best-effort plain-text extraction from a Contentful rich-text Document. */
function faqAnswerToText(doc: unknown): string {
  const parts: string[] = [];
  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    const n = node as { value?: unknown; content?: unknown[] };
    if (typeof n.value === "string") parts.push(n.value);
    if (Array.isArray(n.content)) n.content.forEach(walk);
  };
  walk(doc);
  return parts.join(" ").trim();
}
