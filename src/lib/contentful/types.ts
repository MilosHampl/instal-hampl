import type { Document } from "@contentful/rich-text-types";

/**
 * Clean domain types the React components consume. Raw Contentful entries are
 * mapped into these by `normalize.ts`, so components never touch `.fields`/`.sys`.
 */

export interface ImageData {
  url: string;
  width?: number;
  height?: number;
  alt: string;
}

export type CtaType =
  | "call" // tel: link — value = phone (defaults to site phone)
  | "email" // mailto: — value = email (defaults to site email)
  | "facebook" // opens the FB page (defaults to site social)
  | "map" // scrolls to / opens the map
  | "navigate" // Google Maps directions to the shop
  | "link" // internal or external URL — value = href
  | "anchor"; // in-page anchor — value = #id

export interface CtaData {
  label: string;
  type: CtaType;
  value?: string;
  style?: "primary" | "secondary" | "ghost";
  /** GA4 / Pixel event override. Falls back to a default per `type`. */
  eventName?: string;
}

export interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogImage?: ImageData;
  noIndex?: boolean;
  keywords?: string[];
}

export interface HeroData {
  _type: "hero";
  heading: string;
  subheading?: string;
  eyebrow?: string;
  bullets?: string[];
  image?: ImageData;
  primaryCta?: CtaData;
  secondaryCta?: CtaData;
}

export interface ServiceItem {
  title: string;
  description?: string;
  icon?: string; // icon key (see components/icons) or emoji
  bullets?: string[];
  image?: ImageData;
  cta?: CtaData;
}

export interface ServiceGridData {
  _type: "serviceGrid";
  heading?: string;
  subheading?: string;
  services: ServiceItem[];
}

export interface ProductItem {
  name: string;
  description?: string;
  image?: ImageData;
  specs?: string[];
  badge?: string;
}

export interface ProductGridData {
  _type: "productGrid";
  heading?: string;
  subheading?: string;
  products: ProductItem[];
  cta?: CtaData;
}

export interface FeatureItem {
  title: string;
  text?: string;
  icon?: string;
}

export interface FeatureStripData {
  _type: "featureStrip";
  features: FeatureItem[];
}

export interface RichTextData {
  _type: "richText";
  heading?: string;
  body: Document;
}

export interface FaqItemData {
  question: string;
  answer: Document | string;
}

export interface FaqData {
  _type: "faq";
  heading?: string;
  items: FaqItemData[];
}

export interface CtaBannerData {
  _type: "ctaBanner";
  heading: string;
  text?: string;
  ctas: CtaData[];
  variant?: "brand" | "accent" | "light";
}

export interface LogoStripData {
  _type: "logoStrip";
  heading?: string;
  logos: ImageData[];
}

export interface ContactMapData {
  _type: "contactMap";
  heading?: string;
  showForm?: boolean;
}

export type Section =
  | HeroData
  | ServiceGridData
  | ProductGridData
  | FeatureStripData
  | RichTextData
  | FaqData
  | CtaBannerData
  | LogoStripData
  | ContactMapData;

export interface PageData {
  slug: string;
  title: string;
  seo?: SeoData;
  sections: Section[];
  breadcrumbLabel?: string;
  isIndexable: boolean;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteSettingsData {
  navigation: NavItem[];
  footerNote?: string;
  announcement?: string;
}
