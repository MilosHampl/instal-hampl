# instalHampl — instalatérství Hampl Nymburk

Modern marketing & conversion website for **Instalatérství Hampl** (Nymburk) — a
plumbing-supply shop and drain-cleaning service. Built to turn Facebook-ad and
organic traffic into **calls, e-mails, shop visits and navigation clicks**. No e-shop.

- **Stack:** Next.js 16 (App Router / RSC) · TypeScript · Tailwind CSS v4 · Contentful · Vercel
- **Content:** homepage + unlimited catch-all landing pages, all editable in Contentful
- **Tracking:** GA4 + Meta Pixel with Google Consent Mode v2 (GDPR)
- **SEO:** per-page metadata, JSON-LD (Plumber/Service/FAQ/Breadcrumb), sitemap, robots, 301s

📁 **Docs:** [PLAN](docs/PLAN.md) · [Contentful model](docs/CONTENTFUL-MODEL.md) ·
[SEO & redirects](docs/SEO-REDIRECTS.md) · [Content model as code](model/README.md)

## Quick start
```bash
npm install
cp .env.example .env.local   # fill in what you have (works empty — see below)
npm run dev                  # http://localhost:3000
```

**Runs with zero config.** Without Contentful/analytics env vars, the site renders
rich static fallback content (`src/lib/contentful/fallback.ts`) and skips the tags —
so you can develop and deploy immediately, then wire the CMS incrementally.

## Environment variables
Full list & descriptions in [`.env.example`](.env.example). Summary:

| Variable | Scope | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | client | Canonical origin (sitemap, canonical, OG) |
| `CONTENTFUL_SPACE_ID` | server | Contentful space |
| `CONTENTFUL_ENVIRONMENT` | server | Env id (default `master`) |
| `CONTENTFUL_DELIVERY_TOKEN` | server | Content Delivery API token |
| `CONTENTFUL_PREVIEW_TOKEN` | server | Preview API token (draft mode) |
| `CONTENTFUL_REVALIDATE_SECRET` | server | Secret for the `/api/revalidate` webhook |
| `CONTENTFUL_PREVIEW_SECRET` | server | Secret for the `/api/draft` preview route |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | client | GA4 `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_FB_PIXEL_ID` | client | Meta Pixel id |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | client | Search Console verification (optional) |

## Set up Contentful
1. Create a space + a **Content Delivery** and **Content Preview** API key.
2. Apply the content model: see [`model/README.md`](model/README.md) → `npm run cf:migrate`.
3. Create one `siteSettings` entry and the `page` entries (slugs in the docs).
4. Add the **publish webhook** → `POST /api/revalidate?secret=…` and the **preview URL**
   → `/api/draft?secret=…&slug={entry.fields.slug}`.

## Scripts
| Script | Does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run cf:migrate` | Apply the Contentful content model (needs `contentful-cli` + `contentful space use`) |

## Project structure
```
model/                     Contentful content model as a CLI migration
docs/                      Plan, CMS model spec, SEO/redirect audit
src/
  app/
    [[...slug]]/page.tsx   Catch-all: home + every CMS landing page (SSG + ISR)
    api/revalidate/        Contentful publish webhook → revalidateTag
    api/draft/             Draft-mode preview
    sitemap.ts, robots.ts, layout.tsx, not-found.tsx
  components/
    sections/              Hero, ServiceGrid, ProductGrid, RichText, Faq, CtaBanner, LogoStrip, ContactMap
    layout/                Header, Footer, StickyCallBar, Logo
    analytics/             Analytics (GA+Pixel+ConsentMode), ConsentBanner
    CtaButton, SectionRenderer, Icon, JsonLd, Container, ...
  lib/
    contentful/            client, queries (ISR-cached), normalize, types, fallback
    seo/                   metadata, structured-data (JSON-LD)
    analytics/             consent (Consent Mode v2), events (conversion taxonomy)
    site-config.ts         NAP / business facts (single source of truth)
```

## Deploy to Vercel
1. Import the repo in Vercel (framework auto-detected: Next.js).
2. Add the env vars above (Production + Preview).
3. Deploy, then point the domain and set `NEXT_PUBLIC_SITE_URL` to it.
4. Submit `sitemap.xml` to Search Console; verify the 301s and rich results.

> Analytics tuning worth your attention: the CTA→GA4/Pixel conversion taxonomy lives
> in [`src/lib/analytics/events.ts`](src/lib/analytics/events.ts) — adjust which actions
> are hard conversions to match your Google Ads / Meta setup.
