# Contentful content model

Build these content types in Contentful (**Content model → Add content type**). The
**API Identifier** (Contentful auto-generates it from the name — verify it matches) must
equal the IDs below, because the code maps them 1:1 (`src/lib/contentful/normalize.ts`,
constant `CT`). Field IDs must also match exactly.

> Until these exist (or `CONTENTFUL_*` env vars are set) the site renders the static
> fallback content in `src/lib/contentful/fallback.ts`, so you can build the model
> incrementally.

Legend: **Symbol** = short text, **Text** = long text, **RichText** = rich text,
**Media** = one asset, **Ref → X** = reference (link) to entry of type X.

---

## Structural types

### `page`  — a routable landing page (incl. the homepage)
| Field ID | Type | Req | Notes |
|---|---|---|---|
| `internalName` | Symbol | – | Editor-only label |
| `title` | Symbol | ✓ | Used as `<h1>`/breadcrumb & metadata fallback |
| `slug` | Symbol | ✓ | **Unique.** Path w/o domain. `home` or empty ⇒ `/`. Nested ok: `sluzby/cisteni-kanalizace` |
| `seo` | Ref → `seo` | – | Per-page SEO overrides |
| `sections` | Array&lt;Ref → *section types*&gt; | ✓ | Ordered page content (see section types below) |
| `breadcrumbLabel` | Symbol | – | Overrides breadcrumb text |
| `isIndexable` | Boolean | – | Default **true**. false ⇒ `noindex` + excluded from sitemap |

`sections` accepts: `hero`, `sectionServiceGrid`, `sectionProductGrid`,
`sectionFeatureStrip`, `sectionRichText`, `sectionFaq`, `sectionCtaBanner`,
`sectionLogoStrip`, `sectionContactMap`.

### `siteSettings` — singleton (create exactly one entry)
| Field ID | Type | Notes |
|---|---|---|
| `navigation` | Array&lt;Ref → `navItem`&gt; | Header + footer links |
| `footerNote` | Text | Optional |
| `announcement` | Symbol | Optional top-bar text |

### `navItem`
| Field ID | Type | Req |
|---|---|---|
| `label` | Symbol | ✓ |
| `href` | Symbol | ✓ (e.g. `/prodejna`) |

### `seo`
| Field ID | Type | Notes |
|---|---|---|
| `metaTitle` | Symbol | ≤ 60 chars ideal |
| `metaDescription` | Text | ≤ 155 chars ideal |
| `canonicalUrl` | Symbol | Optional absolute URL override |
| `ogImage` | Media | Optional (1200×630) |
| `noIndex` | Boolean | Default false |
| `keywords` | Array&lt;Symbol&gt; | Optional |

### `cta` — a tracked call-to-action button
| Field ID | Type | Req | Notes |
|---|---|---|---|
| `label` | Symbol | ✓ | Button text |
| `type` | Symbol | ✓ | **Validation → accept only:** `call`, `email`, `facebook`, `map`, `navigate`, `link`, `anchor` |
| `value` | Symbol | – | Phone / email / URL / `#anchor`. Empty ⇒ uses site defaults |
| `style` | Symbol | – | `primary` \| `secondary` \| `ghost` (default `secondary`) |
| `eventName` | Symbol | – | Overrides the GA4 event name |

**CTA type behaviour** (auto-resolved href): `call`→`tel:` · `email`→`mailto:` ·
`facebook`→FB page · `navigate`→Google Maps directions · `map`→scroll to `#mapa` ·
`link`→internal/external URL · `anchor`→in-page `#id`.

---

## Section types

### `hero`
| Field ID | Type | Notes |
|---|---|---|
| `eyebrow` | Symbol | Small label above heading |
| `heading` | Symbol ✓ | First hero on a page renders as `<h1>` |
| `subheading` | Text | |
| `bullets` | Array&lt;Symbol&gt; | Checklist |
| `image` | Media | Optional side image |
| `primaryCta` | Ref → `cta` | |
| `secondaryCta` | Ref → `cta` | |

### `sectionServiceGrid`
| Field ID | Type |
|---|---|
| `heading` | Symbol |
| `subheading` | Text |
| `services` | Array&lt;Ref → `service`&gt; |

### `service`
| Field ID | Type | Notes |
|---|---|---|
| `title` | Symbol ✓ | |
| `description` | Text | |
| `icon` | Symbol | Icon key (see list) or shown as image if `image` set |
| `bullets` | Array&lt;Symbol&gt; | |
| `image` | Media | Optional; replaces icon |
| `cta` | Ref → `cta` | |

### `sectionProductGrid`
| Field ID | Type |
|---|---|
| `heading` | Symbol |
| `subheading` | Text |
| `products` | Array&lt;Ref → `product`&gt; |
| `cta` | Ref → `cta` |

### `product`
| Field ID | Type | Notes |
|---|---|---|
| `name` | Symbol ✓ | |
| `description` | Text | |
| `image` | Media | |
| `specs` | Array&lt;Symbol&gt; | Bullet specs |
| `badge` | Symbol | e.g. "200+ modelů" |

### `sectionFeatureStrip`
| Field ID | Type |
|---|---|
| `features` | Array&lt;Ref → `feature`&gt; |

### `feature`
| Field ID | Type |
|---|---|
| `title` | Symbol ✓ |
| `text` | Text |
| `icon` | Symbol (icon key) |

### `sectionRichText`
| Field ID | Type |
|---|---|
| `heading` | Symbol |
| `body` | RichText ✓ |

### `sectionFaq`
| Field ID | Type |
|---|---|
| `heading` | Symbol |
| `items` | Array&lt;Ref → `faqItem`&gt; |

### `faqItem`  (powers FAQ rich-result structured data)
| Field ID | Type | Notes |
|---|---|---|
| `question` | Symbol ✓ | |
| `answer` | Text **or** RichText | Both handled |

### `sectionCtaBanner`
| Field ID | Type | Notes |
|---|---|---|
| `heading` | Symbol ✓ | |
| `text` | Text | |
| `ctas` | Array&lt;Ref → `cta`&gt; | |
| `variant` | Symbol | `brand` \| `accent` \| `light` |

### `sectionLogoStrip`
| Field ID | Type |
|---|---|
| `heading` | Symbol |
| `logos` | Array&lt;Media&gt; |

### `sectionContactMap`
| Field ID | Type | Notes |
|---|---|---|
| `heading` | Symbol | |
| `showForm` | Boolean | Show the lead form alongside NAP + map |

---

## Icon keys
For `icon` fields on `service` / `feature`:

`shield`, `thumbsup`, `pin`, `wrench`, `bath`, `drain`, `camera`, `snowflake`,
`rental`, `phone`, `mail`, `facebook`, `map`, `navigate`, `clock`, `check`, `arrow`.

Add more in `src/components/Icon.tsx`.

---

## Recommended first entries (mirror the fallback content)
Create `page` entries with these slugs so the 301 redirects land on real pages:

| slug | purpose |
|---|---|
| `home` | Homepage |
| `prodejna` | Prodejna / sortiment overview |
| `sortiment/vodovodni-baterie` | Vodovodní baterie category |
| `sluzby/cisteni-kanalizace` | Čištění kanalizace service |
| `sluzby/revize-kanalizace` | Revize / videoinspekce |
| `sluzby/zamrazovani-potrubi` | Zamražování potrubí |
| `kontakt` | Contact + map |

---

## Webhooks (in Contentful → Settings → Webhooks)
1. **Revalidate on publish** — Triggers: *Publish* + *Unpublish* on Entries & Assets.
   URL: `POST https://<domain>/api/revalidate?secret=<CONTENTFUL_REVALIDATE_SECRET>`
2. **Preview URL** (Content preview) — `https://<domain>/api/draft?secret=<CONTENTFUL_PREVIEW_SECRET>&slug={entry.fields.slug}`
