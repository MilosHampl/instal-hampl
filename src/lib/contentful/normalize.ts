import type { Document } from "@contentful/rich-text-types";
import type {
  CtaData,
  CtaType,
  FaqItemData,
  FeatureItem,
  ImageData,
  PageData,
  ProductItem,
  Section,
  SeoData,
  ServiceItem,
  SiteSettingsData,
} from "./types";

/**
 * Maps loosely-typed Contentful CDA responses into the clean domain types.
 * Contentful's SDK returns `fields` as an untyped bag, so we read through
 * small typed accessors instead of sprinkling `any` everywhere.
 */

type Fields = Record<string, unknown>;

interface RawAsset {
  fields?: {
    title?: unknown;
    description?: unknown;
    file?: {
      url?: unknown;
      details?: { image?: { width?: number; height?: number } };
    };
  };
}

interface RawEntry {
  sys?: { contentType?: { sys?: { id?: string } } };
  fields?: Fields;
}

/** Contentful content type IDs — must match the CMS model (see docs/CONTENTFUL-MODEL.md). */
export const CT = {
  page: "page",
  siteSettings: "siteSettings",
  seo: "seo",
  cta: "cta",
  hero: "hero",
  serviceGrid: "sectionServiceGrid",
  service: "service",
  productGrid: "sectionProductGrid",
  product: "product",
  featureStrip: "sectionFeatureStrip",
  feature: "feature",
  richText: "sectionRichText",
  faq: "sectionFaq",
  faqItem: "faqItem",
  ctaBanner: "sectionCtaBanner",
  logoStrip: "sectionLogoStrip",
  contactMap: "sectionContactMap",
} as const;

// ── primitive accessors ────────────────────────────────────────────────
const isEntry = (v: unknown): v is RawEntry =>
  typeof v === "object" && v !== null && "fields" in v;

const str = (f: Fields, k: string): string | undefined =>
  typeof f[k] === "string" ? (f[k] as string) : undefined;

const bool = (f: Fields, k: string): boolean | undefined =>
  typeof f[k] === "boolean" ? (f[k] as boolean) : undefined;

const strArr = (f: Fields, k: string): string[] | undefined => {
  const v = f[k];
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : undefined;
};

const entryArr = (f: Fields, k: string): RawEntry[] => {
  const v = f[k];
  return Array.isArray(v) ? v.filter(isEntry) : [];
};

const typeId = (e: RawEntry): string | undefined => e.sys?.contentType?.sys?.id;

// ── media ───────────────────────────────────────────────────────────────
export function img(v: unknown): ImageData | undefined {
  const a = v as RawAsset | undefined;
  const url = a?.fields?.file?.url;
  if (typeof url !== "string") return undefined;
  const image = a?.fields?.file?.details?.image;
  const alt =
    (typeof a?.fields?.description === "string" && a.fields.description) ||
    (typeof a?.fields?.title === "string" && a.fields.title) ||
    "";
  return {
    url: url.startsWith("//") ? `https:${url}` : url,
    width: image?.width,
    height: image?.height,
    alt,
  };
}

// ── cta ───────────────────────────────────────────────────────────────
function cta(v: unknown): CtaData | undefined {
  if (!isEntry(v) || !v.fields) return undefined;
  const f = v.fields;
  const label = str(f, "label");
  const type = str(f, "type") as CtaType | undefined;
  if (!label || !type) return undefined;
  return {
    label,
    type,
    value: str(f, "value"),
    style: str(f, "style") as CtaData["style"],
    eventName: str(f, "eventName"),
  };
}

// ── sections ─────────────────────────────────────────────────────────────
function service(v: unknown): ServiceItem | null {
  if (!isEntry(v) || !v.fields) return null;
  const f = v.fields;
  const title = str(f, "title");
  if (!title) return null;
  return {
    title,
    description: str(f, "description"),
    icon: str(f, "icon"),
    bullets: strArr(f, "bullets"),
    image: img(f.image),
    cta: cta(f.cta),
  };
}

function product(v: unknown): ProductItem | null {
  if (!isEntry(v) || !v.fields) return null;
  const f = v.fields;
  const name = str(f, "name");
  if (!name) return null;
  return {
    name,
    description: str(f, "description"),
    image: img(f.image),
    specs: strArr(f, "specs"),
    badge: str(f, "badge"),
  };
}

function feature(v: unknown): FeatureItem | null {
  if (!isEntry(v) || !v.fields) return null;
  const f = v.fields;
  const title = str(f, "title");
  if (!title) return null;
  return { title, text: str(f, "text"), icon: str(f, "icon") };
}

function faqItem(v: unknown): FaqItemData | null {
  if (!isEntry(v) || !v.fields) return null;
  const f = v.fields;
  const question = str(f, "question");
  if (!question) return null;
  const answer = f.answer;
  return {
    question,
    answer: typeof answer === "string" ? answer : (answer as Document),
  };
}

function section(e: RawEntry): Section | null {
  const f = e.fields;
  if (!f) return null;
  switch (typeId(e)) {
    case CT.hero:
      return {
        _type: "hero",
        heading: str(f, "heading") ?? "",
        subheading: str(f, "subheading"),
        eyebrow: str(f, "eyebrow"),
        bullets: strArr(f, "bullets"),
        image: img(f.image),
        primaryCta: cta(f.primaryCta),
        secondaryCta: cta(f.secondaryCta),
      };
    case CT.serviceGrid:
      return {
        _type: "serviceGrid",
        heading: str(f, "heading"),
        subheading: str(f, "subheading"),
        services: entryArr(f, "services").map(service).filter((x): x is ServiceItem => x !== null),
      };
    case CT.productGrid:
      return {
        _type: "productGrid",
        heading: str(f, "heading"),
        subheading: str(f, "subheading"),
        products: entryArr(f, "products").map(product).filter((x): x is ProductItem => x !== null),
        cta: cta(f.cta),
      };
    case CT.featureStrip:
      return {
        _type: "featureStrip",
        features: entryArr(f, "features").map(feature).filter((x): x is FeatureItem => x !== null),
      };
    case CT.richText:
      return {
        _type: "richText",
        heading: str(f, "heading"),
        body: f.body as Document,
      };
    case CT.faq:
      return {
        _type: "faq",
        heading: str(f, "heading"),
        items: entryArr(f, "items").map(faqItem).filter((x): x is FaqItemData => x !== null),
      };
    case CT.ctaBanner:
      return {
        _type: "ctaBanner",
        heading: str(f, "heading") ?? "",
        text: str(f, "text"),
        ctas: entryArr(f, "ctas").map(cta).filter((x): x is CtaData => x !== undefined),
        variant: str(f, "variant") as "brand" | "accent" | "light" | undefined,
      };
    case CT.logoStrip:
      return {
        _type: "logoStrip",
        heading: str(f, "heading"),
        logos: (Array.isArray(f.logos) ? f.logos : [])
          .map(img)
          .filter((x): x is ImageData => x !== undefined),
      };
    case CT.contactMap:
      return {
        _type: "contactMap",
        heading: str(f, "heading"),
        showForm: bool(f, "showForm"),
      };
    default:
      return null;
  }
}

function seo(v: unknown): SeoData | undefined {
  if (!isEntry(v) || !v.fields) return undefined;
  const f = v.fields;
  return {
    metaTitle: str(f, "metaTitle"),
    metaDescription: str(f, "metaDescription"),
    canonicalUrl: str(f, "canonicalUrl"),
    ogImage: img(f.ogImage),
    noIndex: bool(f, "noIndex"),
    keywords: strArr(f, "keywords"),
  };
}

// ── top-level ─────────────────────────────────────────────────────────────
export function normalizePage(e: RawEntry): PageData | null {
  const f = e.fields;
  if (!f) return null;
  const slug = str(f, "slug");
  const title = str(f, "title");
  if (slug === undefined || !title) return null;
  return {
    slug: normalizeSlug(slug),
    title,
    seo: seo(f.seo),
    sections: entryArr(f, "sections").map(section).filter((x): x is Section => x !== null),
    breadcrumbLabel: str(f, "breadcrumbLabel"),
    isIndexable: bool(f, "isIndexable") ?? true,
  };
}

export function normalizeSiteSettings(e: RawEntry): SiteSettingsData {
  const f = e.fields ?? {};
  const nav = entryArr(f, "navigation")
    .map((n) => {
      const nf = n.fields ?? {};
      const label = str(nf, "label");
      const href = str(nf, "href");
      return label && href ? { label, href } : null;
    })
    .filter((x): x is { label: string; href: string } => x !== null);
  return {
    navigation: nav,
    footerNote: str(f, "footerNote"),
    announcement: str(f, "announcement"),
  };
}

/** Normalize a CMS slug into a leading-slash path. "" or "home" → "/". */
export function normalizeSlug(slug: string): string {
  const s = slug.trim().replace(/^\/+|\/+$/g, "");
  if (s === "" || s === "home") return "/";
  return `/${s}`;
}
