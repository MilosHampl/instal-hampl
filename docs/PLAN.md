# instal-hampl.net — project plan

A modern, fast, SEO-first website for **Instalatérství Hampl** (Nymburk) that turns
Facebook-ad and organic traffic into **phone calls, e-mails, shop visits and
navigation clicks**. No e-shop — the site is a conversion funnel to a physical shop.

## Goals
1. **Convert** ad + organic visitors → call / e-mail / visit / navigate (soft conversions).
2. **Rank** locally for plumbing, drain-cleaning and bathroom terms around Nymburk.
3. **Editable** by non-developers via Contentful (homepage + unlimited landing pages).
4. **Measurable** — GA4 + Meta Pixel with Consent Mode v2, every CTA a tracked event.

## Stack
| Concern | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router, RSC)** | Static generation + ISR, first-class SEO, Vercel-native |
| Language | TypeScript (strict) | Safety across the CMS boundary |
| Styling | Tailwind CSS v4 | Fast, tokenised brand theme in CSS `@theme` |
| CMS | **Contentful** (CDA + Preview) | Structured content, webhooks, preview, CLI-migratable model |
| Rich text | `@contentful/rich-text-react-renderer` | Safe, styled rendering |
| Analytics | GA4 (gtag) + Meta Pixel | Ad performance + conversion import |
| Consent | Google Consent Mode v2 + banner | GDPR/Czech compliance, keeps modeling signals |
| Hosting | Vercel | Edge CDN, ISR, on-demand revalidation, preview deploys |

## Rendering & caching
- Every route is served by an **optional catch-all** `src/app/[[...slug]]/page.tsx`
  (home `/` + all landing pages).
- `generateStaticParams` pre-renders known pages at build; unknown paths render on
  first request (`dynamicParams`) then cache.
- Contentful reads are wrapped in `unstable_cache` tagged `contentful` with a 5-min
  fallback TTL; the **`/api/revalidate` webhook** busts the tag on publish → edits
  go live in seconds, no redeploy.
- **Graceful degradation:** with no Contentful env vars the site renders rich static
  fallback content (`src/lib/contentful/fallback.ts`) — deployable on day one.

## SEO & structured data
- Per-page `<title>`/description/canonical/OG via `buildMetadata` from the `seo` entry.
- JSON-LD: site-wide `Plumber` (LocalBusiness) + `WebSite`; per-page `BreadcrumbList`,
  `Service` (on `/sluzby/*`), `FAQPage` (when a FAQ section exists).
- `sitemap.xml` + `robots.txt` generated from CMS content.
- **301 redirects** from all legacy `.html` URLs (see SEO-REDIRECTS.md).
- `lang="cs"`, Inter font with `latin-ext` for correct diacritics.

## Conversion design
- **Primary CTA = Call.** Sticky mobile call/navigate bar, hero call button, call in header.
- All CTA types implemented: `call` (tel:), `email` (mailto:), `facebook`, `navigate`
  (Google Maps directions), `map` (scroll to embed), internal `link`, `anchor`.
- Every click fires a GA4 event + Meta Pixel event (taxonomy in `src/lib/analytics/events.ts`).
- Lead form composes a `mailto:` (no backend) and fires `generate_lead` / `Lead`.

## Content components (CMS-driven sections)
Hero · Feature strip · Service grid · Product grid · Rich text · FAQ (accordion) ·
CTA banner · Logo strip · Contact + map. Composed per page via the `sections` array.

## Roadmap
1. **MVP (this repo)** — scaffold, components, tracking, SEO, redirects, fallback content. ✅
2. **Contentful** — apply `model/content-model.js`, create `siteSettings` + `page` entries,
   migrate real copy & photos, wire webhooks.
3. **Analytics** — create GA4 property + Meta Pixel, mark Key Events, import to Google Ads /
   Meta as conversions, verify with the debuggers.
4. **Launch** — point domain at Vercel, set `NEXT_PUBLIC_SITE_URL`, submit sitemap to
   Search Console, verify redirects & rich results.
5. **Iterate** — real product photography, more landing pages per ad campaign, reviews,
   optional server-side lead delivery (Resend/Formspree) and Conversions API.

## Post-MVP / nice-to-haves
- Meta **Conversions API** (server-side) for iOS-resilient attribution.
- GA4 ↔ Google Ads link + offline conversion import for phone calls.
- Real logo SVG + OG image template; product photography.
- `/ochrana-osobnich-udaju` (privacy policy) page — referenced by the consent banner.
