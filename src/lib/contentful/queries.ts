import { unstable_cache } from "next/cache";
import { getClient } from "./client";
import { CT, normalizePage, normalizeSiteSettings, normalizeSlug } from "./normalize";
import type { PageData, SiteSettingsData } from "./types";
import { fallbackPages, fallbackSiteSettings } from "./fallback";

/**
 * Query layer. All published content is cached with the `contentful` tag and a
 * time-based fallback; the /api/revalidate webhook calls revalidateTag("contentful")
 * on publish/unpublish so edits go live within seconds without a redeploy.
 *
 * The site is small (a handful of landing pages), so we fetch all pages once and
 * match by slug in code — this sidesteps slug-encoding edge cases and powers
 * generateStaticParams for free.
 */

export const CONTENTFUL_TAG = "contentful";
const REVALIDATE_SECONDS = 300;

interface RawEntry {
  sys?: { contentType?: { sys?: { id?: string } } };
  fields?: Record<string, unknown>;
}

async function fetchAllPagesUncached(preview: boolean): Promise<PageData[]> {
  const client = getClient(preview);
  if (!client) return fallbackPages;
  try {
    const res = await client.getEntries({
      content_type: CT.page,
      include: 5,
      limit: 200,
    });
    const pages = (res.items as unknown as RawEntry[])
      .map(normalizePage)
      .filter((p): p is PageData => p !== null);
    return pages.length > 0 ? pages : fallbackPages;
  } catch (err) {
    console.error("[contentful] getEntries(page) failed:", err);
    return fallbackPages;
  }
}

async function fetchSiteSettingsUncached(preview: boolean): Promise<SiteSettingsData> {
  const client = getClient(preview);
  if (!client) return fallbackSiteSettings;
  try {
    const res = await client.getEntries({
      content_type: CT.siteSettings,
      include: 2,
      limit: 1,
    });
    const entry = res.items[0] as unknown as RawEntry | undefined;
    return entry ? normalizeSiteSettings(entry) : fallbackSiteSettings;
  } catch (err) {
    console.error("[contentful] getEntries(siteSettings) failed:", err);
    return fallbackSiteSettings;
  }
}

const getCachedPages = unstable_cache(() => fetchAllPagesUncached(false), ["all-pages"], {
  tags: [CONTENTFUL_TAG],
  revalidate: REVALIDATE_SECONDS,
});

const getCachedSiteSettings = unstable_cache(
  () => fetchSiteSettingsUncached(false),
  ["site-settings"],
  { tags: [CONTENTFUL_TAG], revalidate: REVALIDATE_SECONDS },
);

export async function getAllPages(preview = false): Promise<PageData[]> {
  return preview ? fetchAllPagesUncached(true) : getCachedPages();
}

export async function getSiteSettings(preview = false): Promise<SiteSettingsData> {
  return preview ? fetchSiteSettingsUncached(true) : getCachedSiteSettings();
}

export async function getPage(path: string, preview = false): Promise<PageData | null> {
  const target = normalizeSlug(path);
  const pages = await getAllPages(preview);
  return pages.find((p) => p.slug === target) ?? null;
}

/** All indexable page paths, for generateStaticParams & sitemap. */
export async function getAllPagePaths(): Promise<string[]> {
  const pages = await getAllPages(false);
  return pages.filter((p) => p.isIndexable).map((p) => p.slug);
}

/** Convert an optional catch-all [[...slug]] param into a "/foo/bar" path. */
export function pathFromSlugParam(slug?: string[]): string {
  if (!slug || slug.length === 0) return "/";
  return `/${slug.join("/")}`;
}
