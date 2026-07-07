import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import type { PageData } from "@/lib/contentful/types";

/**
 * Builds Next.js Metadata for a CMS page, layering the page's SEO entry over
 * sensible site-wide defaults. Handles canonical URLs, Open Graph, Twitter
 * cards and the robots directive (noindex for non-indexable/draft pages).
 */
export function buildMetadata(page: PageData | null, path: string): Metadata {
  const seo = page?.seo;
  const title = seo?.metaTitle || page?.title || siteConfig.name;
  const description = seo?.metaDescription || siteConfig.description;
  const canonical = seo?.canonicalUrl || absoluteUrl(path);
  const indexable = (page?.isIndexable ?? true) && !seo?.noIndex;
  const ogImage = seo?.ogImage?.url;

  return {
    title,
    description,
    keywords: seo?.keywords,
    alternates: { canonical },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      locale: "cs_CZ",
      url: canonical,
      siteName: siteConfig.name,
      title,
      description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}
