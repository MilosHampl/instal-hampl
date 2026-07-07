import type { Section } from "@/lib/contentful/types";
import { Hero } from "@/components/sections/Hero";
import { FeatureStrip } from "@/components/sections/FeatureStrip";
import { ServiceGrid } from "@/components/sections/ServiceGrid";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { RichTextSection } from "@/components/sections/RichTextSection";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { ContactMap } from "@/components/sections/ContactMap";

/**
 * Maps a normalized Contentful section (discriminated on `_type`) to its React
 * component. Adding a new section type = add a `case` here + a normalizer entry.
 * `index` lets the first Hero render as the page's <h1>.
 */
export function SectionRenderer({ section, index }: { section: Section; index: number }) {
  switch (section._type) {
    case "hero":
      return <Hero data={section} isFirst={index === 0} />;
    case "featureStrip":
      return <FeatureStrip data={section} />;
    case "serviceGrid":
      return <ServiceGrid data={section} />;
    case "productGrid":
      return <ProductGrid data={section} />;
    case "richText":
      return <RichTextSection data={section} />;
    case "faq":
      return <Faq data={section} />;
    case "ctaBanner":
      return <CtaBanner data={section} />;
    case "logoStrip":
      return <LogoStrip data={section} />;
    case "contactMap":
      return <ContactMap data={section} />;
    default:
      return null;
  }
}
