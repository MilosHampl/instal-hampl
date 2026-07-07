import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SectionRenderer } from "@/components/SectionRenderer";
import { JsonLd } from "@/components/JsonLd";
import {
  getAllPagePaths,
  getPage,
  pathFromSlugParam,
} from "@/lib/contentful/queries";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/seo/structured-data";

/**
 * Optional catch-all that renders EVERY page — home ("/") and all Contentful
 * landing pages ("/sluzby/cisteni-kanalizace", …). Pages are statically
 * generated at build (generateStaticParams) and revalidated on-demand via the
 * Contentful webhook; unknown-at-build paths are rendered on first request.
 */

// Render paths not returned by generateStaticParams on demand, then cache them.
export const dynamicParams = true;

type Params = { slug?: string[] };

export async function generateStaticParams(): Promise<Params[]> {
  const paths = await getAllPagePaths();
  return paths.map((p) => ({
    slug: p === "/" ? [] : p.replace(/^\//, "").split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const path = pathFromSlugParam(slug);
  const { isEnabled: preview } = await draftMode();
  const page = await getPage(path, preview);
  return buildMetadata(page, path);
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const path = pathFromSlugParam(slug);
  const { isEnabled: preview } = await draftMode();
  const page = await getPage(path, preview);

  if (!page) notFound();

  // Structured data assembled from the page's content.
  // Skip a single-node breadcrumb on the homepage (adds no value / can be flagged).
  const structured: object[] = [];
  if (page.slug !== "/") structured.push(breadcrumbLd(page.slug, page.title));
  if (page.slug.startsWith("/sluzby/")) structured.push(serviceLd(page));
  const faqSection = page.sections.find((s) => s._type === "faq");
  if (faqSection && faqSection._type === "faq" && faqSection.items.length) {
    structured.push(faqLd(faqSection.items));
  }

  return (
    <>
      <JsonLd data={structured} />
      {page.sections.map((section, i) => (
        <SectionRenderer key={`${section._type}-${i}`} section={section} index={i} />
      ))}
    </>
  );
}
