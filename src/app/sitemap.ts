import type { MetadataRoute } from "next";
import { getAllPages } from "@/lib/contentful/queries";
import { absoluteUrl } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllPages();
  return pages
    .filter((p) => p.isIndexable)
    .map((p) => ({
      url: absoluteUrl(p.slug),
      changeFrequency: p.slug === "/" ? "weekly" : "monthly",
      priority: p.slug === "/" ? 1 : 0.7,
    }));
}
