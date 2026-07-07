# SEO migration & redirects

## Current site audit (instal-hampl.net)
The legacy site is a **Web Site X5** static export (`*.html` pages). Two issues to fix at launch:
- ⚠️ **Expired TLS certificate** on `https://www.instal-hampl.net` — browsers show a
  security warning and it hurts trust & rankings. The new Vercel deployment gets
  auto-managed HTTPS, resolving this.
- Old URLs are flat `.html` files; the new site uses clean, hierarchical paths.

### Indexed pages found (`site:instal-hampl.net` + on-page links)
| Legacy URL | Topic | 301 → new URL |
|---|---|---|
| `/index.html` | Homepage | `/` |
| `/obchod.html` | Obchod / prodejna | `/prodejna` |
| `/e-shop.html` | E-shop (5 160 položek) | `/prodejna` *(no e-shop on new site)* |
| `/vodovodni-baterie.html` | Vodovodní baterie | `/sortiment/vodovodni-baterie` |
| `/-ist-ni-kanalizace.html` | Čištění kanalizace | `/sluzby/cisteni-kanalizace` |
| `/revize-kanalizace.html` | Revize kanalizace | `/sluzby/revize-kanalizace` |
| `/zamrazovani-.html` | Zamražování | `/sluzby/zamrazovani-potrubi` |
| `/kontakty.html` | Kontakt | `/kontakt` |

These are implemented as **permanent (308/301) redirects** in
[`next.config.ts`](../next.config.ts) → `redirects()`. Update `destination`s if you
change slugs.

> The old `?output=embed` maps, ShinyStat tracking and EET/COVID banners are dropped.

## Launch checklist
- [ ] Point the domain at Vercel; set `NEXT_PUBLIC_SITE_URL` to the final origin.
- [ ] Confirm HTTPS + HSTS active (headers set in `next.config.ts`).
- [ ] Verify each legacy URL 301s to the right new page (curl `-I` or browser).
- [ ] Google **Search Console**: verify the property (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`),
      submit `https://<domain>/sitemap.xml`, use *Removals*/*Change of Address* if the
      domain changes.
- [ ] Bing Webmaster Tools: submit sitemap.
- [ ] Rich Results Test on `/` and a `/sluzby/*` page → confirm `Plumber`,
      `BreadcrumbList`, `Service`, `FAQPage` parse.
- [ ] Google Business Profile: match NAP exactly to `src/lib/site-config.ts`; add the
      new website URL.
- [ ] Update the Facebook page + any ad landing links to the new URLs.
- [ ] PageSpeed / Lighthouse pass (target 90+ mobile).

## On-page SEO baked in
- Per-page `<title>`, meta description, canonical, Open Graph & Twitter (from the `seo` entry).
- One `<h1>` per page (first hero); section headings are `<h2>`.
- `lang="cs"`, `latin-ext` font subset for correct Czech diacritics.
- JSON-LD structured data (see PLAN.md).
- Auto `sitemap.xml` (indexable pages only) + `robots.txt` pointing at it.
- `noindex` per page via `seo.noIndex` or `page.isIndexable = false`.

## NAP consistency (must match everywhere)
```
Instalatérství Hampl
Maršála Koněva 1069/24, 288 02 Nymburk
+420 603 206 370 · info@instal-hampl.net
Po–Pá 8:00–12:00, 13:00–16:00
```
> ⚠️ Confirm exact opening hours & map pin with the owner before launch — the legacy
> site and the ChatGPT mockup disagreed. Source of truth: `src/lib/site-config.ts`.
