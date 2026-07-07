/**
 * Contentful content model as code — applied with the Contentful CLI:
 *
 *   npm i -g contentful-cli
 *   contentful login
 *   contentful space use --space-id <SPACE_ID>
 *   contentful space migration --environment-id master model/content-model.js
 *
 * (or `npm run cf:migrate` after `contentful space use`).
 *
 * This is idempotent-friendly for the FIRST apply. On re-runs Contentful errors
 * if a type/field already exists; use `editContentType`/`editField` or a new
 * migration file for incremental changes. The IDs here MUST match
 * `src/lib/contentful/normalize.ts` (the `CT` map) and the field accessors.
 *
 * See docs/CONTENTFUL-MODEL.md for the human-readable spec.
 */

module.exports = function (migration) {
  const arrSymbol = { type: "Symbol" };
  const arrLinkTo = (...types) => ({
    type: "Array",
    items: {
      type: "Link",
      linkType: "Entry",
      validations: types.length ? [{ linkContentType: types }] : [],
    },
  });

  // ── leaf types (created first so links resolve) ──────────────────────────

  // cta
  const cta = migration.createContentType("cta").name("CTA").displayField("label");
  cta.createField("label").name("Label").type("Symbol").required(true);
  cta
    .createField("type")
    .name("Type")
    .type("Symbol")
    .required(true)
    .validations([{ in: ["call", "email", "facebook", "map", "navigate", "link", "anchor"] }]);
  cta.createField("value").name("Value (phone / email / URL / #anchor)").type("Symbol");
  cta
    .createField("style")
    .name("Style")
    .type("Symbol")
    .validations([{ in: ["primary", "secondary", "ghost"] }]);
  cta.createField("eventName").name("GA4 event name override").type("Symbol");

  // navItem
  const navItem = migration.createContentType("navItem").name("Nav item").displayField("label");
  navItem.createField("label").name("Label").type("Symbol").required(true);
  navItem.createField("href").name("Href").type("Symbol").required(true);

  // seo
  const seo = migration.createContentType("seo").name("SEO metadata").displayField("metaTitle");
  seo.createField("metaTitle").name("Meta title").type("Symbol");
  seo.createField("metaDescription").name("Meta description").type("Text");
  seo.createField("canonicalUrl").name("Canonical URL").type("Symbol");
  seo.createField("ogImage").name("OG image").type("Link").linkType("Asset");
  seo.createField("noIndex").name("No index").type("Boolean");
  seo.createField("keywords").name("Keywords").type("Array").items(arrSymbol);

  // service
  const service = migration.createContentType("service").name("Service").displayField("title");
  service.createField("title").name("Title").type("Symbol").required(true);
  service.createField("description").name("Description").type("Text");
  service.createField("icon").name("Icon key").type("Symbol");
  service.createField("bullets").name("Bullets").type("Array").items(arrSymbol);
  service.createField("image").name("Image").type("Link").linkType("Asset");
  service.createField("cta").name("CTA").type("Link").linkType("Entry").validations([{ linkContentType: ["cta"] }]);

  // product
  const product = migration.createContentType("product").name("Product").displayField("name");
  product.createField("name").name("Name").type("Symbol").required(true);
  product.createField("description").name("Description").type("Text");
  product.createField("image").name("Image").type("Link").linkType("Asset");
  product.createField("specs").name("Specs").type("Array").items(arrSymbol);
  product.createField("badge").name("Badge").type("Symbol");

  // feature
  const feature = migration.createContentType("feature").name("Feature").displayField("title");
  feature.createField("title").name("Title").type("Symbol").required(true);
  feature.createField("text").name("Text").type("Text");
  feature.createField("icon").name("Icon key").type("Symbol");

  // faqItem
  const faqItem = migration.createContentType("faqItem").name("FAQ item").displayField("question");
  faqItem.createField("question").name("Question").type("Symbol").required(true);
  faqItem.createField("answer").name("Answer").type("Text");

  // ── section types ────────────────────────────────────────────────────────

  // hero
  const hero = migration.createContentType("hero").name("Section · Hero").displayField("heading");
  hero.createField("eyebrow").name("Eyebrow").type("Symbol");
  hero.createField("heading").name("Heading").type("Symbol").required(true);
  hero.createField("subheading").name("Subheading").type("Text");
  hero.createField("bullets").name("Bullets").type("Array").items(arrSymbol);
  hero.createField("image").name("Image").type("Link").linkType("Asset");
  hero.createField("primaryCta").name("Primary CTA").type("Link").linkType("Entry").validations([{ linkContentType: ["cta"] }]);
  hero.createField("secondaryCta").name("Secondary CTA").type("Link").linkType("Entry").validations([{ linkContentType: ["cta"] }]);

  // sectionServiceGrid
  const serviceGrid = migration
    .createContentType("sectionServiceGrid")
    .name("Section · Service grid")
    .displayField("heading");
  serviceGrid.createField("heading").name("Heading").type("Symbol");
  serviceGrid.createField("subheading").name("Subheading").type("Text");
  serviceGrid.createField("services").name("Services").type("Array").items(arrLinkTo("service").items);

  // sectionProductGrid
  const productGrid = migration
    .createContentType("sectionProductGrid")
    .name("Section · Product grid")
    .displayField("heading");
  productGrid.createField("heading").name("Heading").type("Symbol");
  productGrid.createField("subheading").name("Subheading").type("Text");
  productGrid.createField("products").name("Products").type("Array").items(arrLinkTo("product").items);
  productGrid.createField("cta").name("CTA").type("Link").linkType("Entry").validations([{ linkContentType: ["cta"] }]);

  // sectionFeatureStrip
  const featureStrip = migration
    .createContentType("sectionFeatureStrip")
    .name("Section · Feature strip")
    .displayField("internalName");
  featureStrip.createField("internalName").name("Internal name").type("Symbol");
  featureStrip.createField("features").name("Features").type("Array").items(arrLinkTo("feature").items);

  // sectionRichText
  const richText = migration
    .createContentType("sectionRichText")
    .name("Section · Rich text")
    .displayField("heading");
  richText.createField("heading").name("Heading").type("Symbol");
  richText.createField("body").name("Body").type("RichText").required(true);

  // sectionFaq
  const faq = migration.createContentType("sectionFaq").name("Section · FAQ").displayField("heading");
  faq.createField("heading").name("Heading").type("Symbol");
  faq.createField("items").name("Items").type("Array").items(arrLinkTo("faqItem").items);

  // sectionCtaBanner
  const ctaBanner = migration
    .createContentType("sectionCtaBanner")
    .name("Section · CTA banner")
    .displayField("heading");
  ctaBanner.createField("heading").name("Heading").type("Symbol").required(true);
  ctaBanner.createField("text").name("Text").type("Text");
  ctaBanner.createField("ctas").name("CTAs").type("Array").items(arrLinkTo("cta").items);
  ctaBanner
    .createField("variant")
    .name("Variant")
    .type("Symbol")
    .validations([{ in: ["brand", "accent", "light"] }]);

  // sectionLogoStrip
  const logoStrip = migration
    .createContentType("sectionLogoStrip")
    .name("Section · Logo strip")
    .displayField("heading");
  logoStrip.createField("heading").name("Heading").type("Symbol");
  logoStrip
    .createField("logos")
    .name("Logos")
    .type("Array")
    .items({ type: "Link", linkType: "Asset" });

  // sectionContactMap
  const contactMap = migration
    .createContentType("sectionContactMap")
    .name("Section · Contact & map")
    .displayField("heading");
  contactMap.createField("heading").name("Heading").type("Symbol");
  contactMap.createField("showForm").name("Show lead form").type("Boolean");

  // ── top-level types (reference the sections) ──────────────────────────────

  const SECTION_TYPES = [
    "hero",
    "sectionServiceGrid",
    "sectionProductGrid",
    "sectionFeatureStrip",
    "sectionRichText",
    "sectionFaq",
    "sectionCtaBanner",
    "sectionLogoStrip",
    "sectionContactMap",
  ];

  // page
  const page = migration.createContentType("page").name("Page").displayField("title");
  page.createField("internalName").name("Internal name").type("Symbol");
  page.createField("title").name("Title").type("Symbol").required(true);
  page
    .createField("slug")
    .name("Slug (path)")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);
  page.createField("seo").name("SEO").type("Link").linkType("Entry").validations([{ linkContentType: ["seo"] }]);
  page
    .createField("sections")
    .name("Sections")
    .type("Array")
    .items({ type: "Link", linkType: "Entry", validations: [{ linkContentType: SECTION_TYPES }] });
  page.createField("breadcrumbLabel").name("Breadcrumb label").type("Symbol");
  page.createField("isIndexable").name("Indexable").type("Boolean");

  // siteSettings (singleton — create one entry)
  const siteSettings = migration
    .createContentType("siteSettings")
    .name("Site settings")
    .displayField("internalName");
  siteSettings.createField("internalName").name("Internal name").type("Symbol");
  siteSettings
    .createField("navigation")
    .name("Navigation")
    .type("Array")
    .items(arrLinkTo("navItem").items);
  siteSettings.createField("footerNote").name("Footer note").type("Text");
  siteSettings.createField("announcement").name("Announcement").type("Symbol");
};
