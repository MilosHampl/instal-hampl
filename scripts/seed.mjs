/**
 * Seeds the Contentful space with placeholder content mirroring the site's
 * fallback (real Czech copy, no images — add those in the CMS later).
 *
 * Idempotent: entries use deterministic IDs and are upserted (update if present,
 * else create) and re-published, so it's safe to re-run.
 *
 * Run:  npm run cf:seed   (loads .env.local via dotenv-cli)
 * Needs: CONTENTFUL_SPACE_ID, CONTENTFUL_ENVIRONMENT, CONTENTFUL_MANAGEMENT_TOKEN
 */

import { createClient } from "contentful-management";

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;

if (!SPACE || !TOKEN) {
  console.error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_MANAGEMENT_TOKEN. Fill .env.local.");
  process.exit(1);
}

// ── entry registry ─────────────────────────────────────────────────────────
const registry = new Map(); // id -> { id, contentType, fields }

const slug = (s) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 58);

const linkTo = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });

function reg(contentType, id, fields) {
  if (!registry.has(id)) registry.set(id, { id, contentType, fields });
  return linkTo(id);
}

const doc = (...paras) => ({
  nodeType: "document",
  data: {},
  content: paras.map((t) => ({
    nodeType: "paragraph",
    data: {},
    content: [{ nodeType: "text", value: t, marks: [], data: {} }],
  })),
});

// ── builders (return a Link, register the entry once) ────────────────────────
const cta = (label, type, { value, style, eventName } = {}) =>
  reg("cta", `cta-${slug(`${type}-${label}-${value || ""}`)}`, {
    label,
    type,
    ...(value ? { value } : {}),
    ...(style ? { style } : {}),
    ...(eventName ? { eventName } : {}),
  });

const service = (title, { description, icon, bullets, ctaLink } = {}) =>
  reg("service", `svc-${slug(title)}`, {
    title,
    ...(description ? { description } : {}),
    ...(icon ? { icon } : {}),
    ...(bullets ? { bullets } : {}),
    ...(ctaLink ? { cta: ctaLink } : {}),
  });

const product = (pageKey, name, { description, specs, badge } = {}) =>
  reg("product", `prod-${pageKey}-${slug(name)}`, {
    name,
    ...(description ? { description } : {}),
    ...(specs ? { specs } : {}),
    ...(badge ? { badge } : {}),
  });

const feature = (title, text, icon) =>
  reg("feature", `feat-${slug(title)}`, { title, ...(text ? { text } : {}), ...(icon ? { icon } : {}) });

const faqItem = (question, answer) =>
  reg("faqItem", `faq-${slug(question)}`, { question, answer });

const seo = (pageKey, metaTitle, metaDescription) =>
  reg("seo", `seo-${pageKey}`, { metaTitle, metaDescription });

// reusable CTAs
const callCta = () => cta("Zavolat 603 206 370", "call", { style: "primary" });
const navigateCta = () => cta("Navigovat do prodejny", "navigate", { style: "secondary" });
const emailCta = () => cta("Napsat e-mail", "email", { style: "ghost" });
const moreCta = (href) => cta("Více informací", "link", { value: href, style: "secondary" });
const contactCta = () => cta("Kontakt a mapa", "link", { value: "/kontakt", style: "secondary" });

const sharedContact = () =>
  reg("sectionContactMap", "sec-contactmap-shared", {
    heading: "Najdete nás v Nymburce",
    showForm: true,
  });

// ── page definitions ─────────────────────────────────────────────────────────
function buildHome() {
  const hero = reg("hero", "hero-home", {
    eyebrow: "Instalatérství Hampl · Nymburk · od roku 1993",
    heading: "Vše pro vodu, topení a koupelny na jednom místě",
    subheading:
      "Prodejna instalatérského materiálu, vybavení koupelen a profesionální čištění kanalizace. Poradíme s výběrem a najdeme řešení.",
    bullets: [
      "Instalatérský materiál a nářadí skladem",
      "Vybavení koupelen na míru",
      "Čištění a revize kanalizace, půjčovna strojů",
    ],
    primaryCta: callCta(),
    secondaryCta: navigateCta(),
  });

  const strip = reg("sectionFeatureStrip", "sec-featurestrip-home", {
    internalName: "Domů — výhody",
    features: [
      feature("Spolehlivost", "Dlouholeté zkušenosti a kvalitní produkty od ověřených značek.", "shield"),
      feature("Odborný přístup", "Poradíme s výběrem a společně najdeme nejlepší řešení.", "thumbsup"),
      feature("Na jednom místě", "Vše, co potřebujete pro dům, byt i firmu — v jedné prodejně.", "pin"),
    ],
  });

  const grid = reg("sectionServiceGrid", "sec-servicegrid-home", {
    heading: "Naše služby a sortiment",
    subheading: "Od materiálu přes vybavení koupelny až po servis kanalizace.",
    services: [
      service("Prodej instalatérského materiálu", {
        icon: "wrench",
        description: "Široký sortiment pro vodu, topení, kanalizaci a plyn.",
        bullets: ["Trubky, tvarovky, armatury", "Ventily, čerpadla, ohřívače", "Nářadí a příslušenství"],
        ctaLink: moreCta("/prodejna"),
      }),
      service("Vybavení koupelen", {
        icon: "bath",
        description: "Kompletní vybavení pro moderní koupelny.",
        bullets: ["Sanitární keramika", "Baterie a sprchy", "Vany, sprchové kouty, doplňky"],
        ctaLink: moreCta("/sortiment/vodovodni-baterie"),
      }),
      service("Čištění kanalizace", {
        icon: "drain",
        description: "Mechanické i tlakové čištění potrubí, havarijní zásahy.",
        bullets: ["Strojní čištění", "Havarijní výjezdy", "Profi technika Rothenberger"],
        ctaLink: moreCta("/sluzby/cisteni-kanalizace"),
      }),
      service("Revize a videoinspekce", {
        icon: "camera",
        description: "Kontrola stavu potrubí kamerou s videozáznamem.",
        bullets: ["Kamerový průzkum", "Lokalizace poruch", "Podklad pro opravu"],
        ctaLink: moreCta("/sluzby/revize-kanalizace"),
      }),
      service("Zamražování potrubí", {
        icon: "snowflake",
        description: "Oprava bez vypouštění celé soustavy.",
        bullets: ["Bez odstávky systému", "Rychlý zásah", "Úspora nákladů"],
        ctaLink: moreCta("/sluzby/zamrazovani-potrubi"),
      }),
      service("Půjčovna strojů", {
        icon: "rental",
        description: "Profesionální technika pro čištění potrubí a kanalizace.",
        bullets: ["R600 – potrubí Ø 20–150 mm", "R750 – potrubí Ø 20–200 mm", "Ruční čistička EXTOL Ø 32–50 mm"],
        ctaLink: moreCta("/sluzby/pujcovna-stroju"),
      }),
    ],
  });

  const banner = reg("sectionCtaBanner", "sec-ctabanner-home", {
    heading: "Potřebujete poradit nebo řešíte havárii?",
    text: "Zavolejte nám nebo se stavte v prodejně v Nymburce. Rádi pomůžeme.",
    variant: "brand",
    ctas: [callCta(), navigateCta(), emailCta()],
  });

  return reg("page", "page-home", {
    internalName: "Domů",
    title: "Instalatérství Hampl Nymburk",
    slug: "home",
    isIndexable: true,
    seo: seo(
      "home",
      "Instalatérství Hampl Nymburk – materiál, koupelny, čištění kanalizace",
      "Prodej instalatérského materiálu, vybavení koupelen, čištění a revize kanalizace a půjčovna strojů v Nymburce. Rodinná firma od roku 1993. Zavolejte 603 206 370.",
    ),
    sections: [hero, strip, grid, banner, sharedContact()],
  });
}

function buildProdejna() {
  const hero = reg("hero", "hero-prodejna", {
    eyebrow: "Prodejna Nymburk",
    heading: "Instalatérský materiál a vybavení koupelen",
    subheading:
      "Široký sortiment skladem pro vodu, topení, kanalizaci a plyn — pro domácnosti i firmy. Přijďte se poradit osobně.",
    bullets: ["Materiál skladem", "Osobní poradenství", "Značková technika"],
    primaryCta: navigateCta(),
    secondaryCta: callCta(),
  });

  const grid = reg("sectionProductGrid", "sec-productgrid-prodejna", {
    heading: "Co u nás najdete",
    subheading: "Výběr z hlavních kategorií sortimentu.",
    products: [
      product("prodejna", "Vodovodní baterie", { badge: "200+ modelů", description: "Pákové i klasické baterie do koupelny i kuchyně." }),
      product("prodejna", "Čerpadla a domácí vodárny", { description: "Čerpadla, domácí vodárny a technika pro závlahy." }),
      product("prodejna", "Sanitární keramika", { description: "Umyvadla, WC, bidety a doplňky do koupelny." }),
      product("prodejna", "Trubky, tvarovky, armatury", { description: "Vše pro rozvody vody, topení a kanalizace." }),
      product("prodejna", "Ohřívače a topení", { description: "Bojlery, ohřívače vody a komponenty topných soustav." }),
      product("prodejna", "Nářadí a příslušenství", { description: "Ruční i aku nářadí pro instalatérské práce." }),
    ],
    cta: contactCta(),
  });

  const banner = reg("sectionCtaBanner", "sec-ctabanner-prodejna", {
    heading: "Nevíte si rady s výběrem?",
    text: "Zastavte se v prodejně nebo zavolejte — pomůžeme vybrat správně napoprvé.",
    variant: "accent",
    ctas: [callCta(), navigateCta()],
  });

  return reg("page", "page-prodejna", {
    internalName: "Prodejna",
    title: "Prodejna instalatérského materiálu",
    slug: "prodejna",
    isIndexable: true,
    seo: seo(
      "prodejna",
      "Prodejna instalatérského materiálu Nymburk | Instalatérství Hampl",
      "Prodejna instalatérského materiálu v Nymburce: baterie, čerpadla, domácí vodárny, sanitární keramika, nářadí. Poradíme s výběrem.",
    ),
    sections: [hero, grid, banner, sharedContact()],
  });
}

function buildBaterie() {
  const hero = reg("hero", "hero-baterie", {
    eyebrow: "Sortiment",
    heading: "Vodovodní baterie — přes 200 modelů vystaveno",
    subheading: "Vyberte si baterii, kterou si můžete osobně prohlédnout a osahat přímo v prodejně.",
    primaryCta: navigateCta(),
    secondaryCta: callCta(),
  });

  const rich = reg("sectionRichText", "sec-richtext-baterie", {
    heading: "Baterie pro každou koupelnu i kuchyň",
    body: doc(
      "V naší prodejně v Nymburce najdete širokou nabídku vodovodních baterií — od pákových přes klasické až po sprchové sety a termostatické baterie.",
      "Rádi vám poradíme s výběrem podle typu rozvodu, designu a rozpočtu. Baterie i doplňky máme běžně skladem.",
    ),
  });

  const grid = reg("sectionProductGrid", "sec-productgrid-baterie", {
    heading: "Typy baterií",
    products: [
      product("baterie", "Umyvadlové baterie", { description: "Pákové i dvoukohoutkové do koupelny." }),
      product("baterie", "Dřezové baterie", { description: "Do kuchyně, s výsuvnou sprškou i bez." }),
      product("baterie", "Sprchové a vanové baterie", { description: "Nástěnné baterie a kompletní sprchové sety." }),
      product("baterie", "Termostatické baterie", { description: "Stálá teplota vody a úspora energie." }),
    ],
    cta: contactCta(),
  });

  const banner = reg("sectionCtaBanner", "sec-ctabanner-baterie", {
    heading: "Přijďte si vybrat osobně",
    text: "Vystavené modely si prohlédnete na jednom místě.",
    variant: "brand",
    ctas: [navigateCta(), callCta()],
  });

  return reg("page", "page-baterie", {
    internalName: "Vodovodní baterie",
    title: "Vodovodní baterie",
    slug: "sortiment/vodovodni-baterie",
    isIndexable: true,
    seo: seo(
      "baterie",
      "Vodovodní baterie Nymburk – přes 200 modelů | Instalatérství Hampl",
      "Pákové a klasické vodovodní baterie do koupelny i kuchyně, přes 200 vystavených modelů. Prohlédněte si je osobně v prodejně v Nymburce.",
    ),
    sections: [hero, rich, grid, banner, sharedContact()],
  });
}

function buildCisteni() {
  const hero = reg("hero", "hero-cisteni", {
    eyebrow: "Služby",
    heading: "Čištění kanalizace a odpadů",
    subheading:
      "Ucpaný odpad nebo havárie? Provádíme strojní i tlakové čištění potrubí. Máme profesionální techniku Rothenberger.",
    bullets: ["Strojní i tlakové čištění", "Havarijní zásahy", "Půjčovna strojů R600 / R750 / EXTOL"],
    primaryCta: callCta(),
    secondaryCta: navigateCta(),
  });

  const rich = reg("sectionRichText", "sec-richtext-cisteni", {
    heading: "Jak čištění probíhá",
    body: doc(
      "Nejprve zprůchodníme potrubí strojní spirálou nebo tlakovou vodou podle typu ucpání. Pro potrubí od Ø 20 do 200 mm používáme stroje Rothenberger R600 a R750, pro menší průměry ruční čističku EXTOL.",
      "V případě opakovaných problémů doporučíme kamerovou revizi, která odhalí příčinu — prasklinu, prosednutí nebo kořeny.",
    ),
  });

  const faq = reg("sectionFaq", "sec-faq-cisteni", {
    heading: "Časté dotazy",
    items: [
      faqItem("Jak rychle přijedete?", "U havárií se snažíme vyjet co nejdříve. Zavolejte na 603 206 370 a domluvíme termín."),
      faqItem("Vyčistíte i venkovní kanalizaci?", "Ano, čistíme domovní i venkovní přípojky a hlavní svody v rámci Nymburka a okolí."),
      faqItem("Půjčujete stroje na čištění?", "Ano. Nabízíme k zapůjčení stroje R600, R750 i ruční čističku EXTOL. Podmínky sdělíme v prodejně."),
    ],
  });

  const banner = reg("sectionCtaBanner", "sec-ctabanner-cisteni", {
    heading: "Řešíte ucpaný odpad?",
    text: "Zavolejte a domluvíme rychlý zásah.",
    variant: "accent",
    ctas: [callCta(), emailCta()],
  });

  return reg("page", "page-cisteni", {
    internalName: "Čištění kanalizace",
    title: "Čištění kanalizace",
    slug: "sluzby/cisteni-kanalizace",
    isIndexable: true,
    seo: seo(
      "cisteni",
      "Čištění kanalizace Nymburk a okolí | Instalatérství Hampl",
      "Strojní a tlakové čištění kanalizace, havarijní výjezdy a půjčovna čistících strojů v Nymburce a okolí. Zavolejte 603 206 370.",
    ),
    sections: [hero, rich, faq, banner, sharedContact()],
  });
}

function buildRevize() {
  const hero = reg("hero", "hero-revize", {
    eyebrow: "Služby",
    heading: "Revize kanalizace kamerou",
    subheading:
      "Kamerovým průzkumem s videozáznamem přesně zjistíme stav a příčinu problému v potrubí — bez zbytečného kopání.",
    primaryCta: callCta(),
    secondaryCta: navigateCta(),
  });

  const rich = reg("sectionRichText", "sec-richtext-revize", {
    heading: "Co videoinspekce odhalí",
    body: doc(
      "Speciální kamerou projedeme potrubí a na záznamu uvidíte skutečný stav — praskliny, prosednutí, zarostlé kořeny nebo usazeniny.",
      "Na základě revize navrhneme nejvhodnější řešení, ať už jde o čištění, bodovou opravu nebo výměnu úseku.",
    ),
  });

  const banner = reg("sectionCtaBanner", "sec-ctabanner-revize", {
    heading: "Objednejte revizi",
    text: "Zavolejte a domluvíme termín kamerové prohlídky.",
    variant: "brand",
    ctas: [callCta(), emailCta()],
  });

  return reg("page", "page-revize", {
    internalName: "Revize kanalizace",
    title: "Revize a videoinspekce kanalizace",
    slug: "sluzby/revize-kanalizace",
    isIndexable: true,
    seo: seo(
      "revize",
      "Revize kanalizace kamerou Nymburk | Instalatérství Hampl",
      "Kamerová revize a videoinspekce kanalizace v Nymburce. Zjistíme příčinu ucpání, lokalizujeme poruchu a připravíme podklad pro opravu.",
    ),
    sections: [hero, rich, banner, sharedContact()],
  });
}

function buildZamrazovani() {
  const hero = reg("hero", "hero-zamrazovani", {
    eyebrow: "Služby",
    heading: "Zamražování potrubí",
    subheading:
      "Potřebujete opravit úsek bez vypouštění celého systému? Zamražením vytvoříme dočasnou zátku a opravu provedeme rychle a čistě.",
    primaryCta: callCta(),
    secondaryCta: navigateCta(),
  });

  const rich = reg("sectionRichText", "sec-richtext-zamrazovani", {
    heading: "Kdy zamražování využít",
    body: doc(
      "Zamražování je ideální tam, kde není uzávěr nebo by vypuštění soustavy bylo nákladné a zdlouhavé. Vytvoříme ledovou zátku a v klidu provedeme potřebnou opravu.",
    ),
  });

  const banner = reg("sectionCtaBanner", "sec-ctabanner-zamrazovani", {
    heading: "Poradíme, zda je zamražení vhodné",
    text: "Zavolejte a popište situaci.",
    variant: "accent",
    ctas: [callCta()],
  });

  return reg("page", "page-zamrazovani", {
    internalName: "Zamražování potrubí",
    title: "Zamražování potrubí",
    slug: "sluzby/zamrazovani-potrubi",
    isIndexable: true,
    seo: seo(
      "zamrazovani",
      "Zamražování potrubí Nymburk | Instalatérství Hampl",
      "Zamražování potrubí umožní opravu bez vypuštění celé soustavy. Rychlý zásah a úspora nákladů. Instalatérství Hampl Nymburk.",
    ),
    sections: [hero, rich, banner, sharedContact()],
  });
}

function buildKontakt() {
  const hero = reg("hero", "hero-kontakt", {
    eyebrow: "Kontakt",
    heading: "Ozvěte se nám nebo se stavte",
    subheading: "Rádi poradíme s výběrem materiálu i se službami. Najdete nás v Nymburce.",
    primaryCta: callCta(),
    secondaryCta: emailCta(),
  });

  const contact = reg("sectionContactMap", "sec-contactmap-kontakt", {
    heading: "Kde nás najdete",
    showForm: true,
  });

  return reg("page", "page-kontakt", {
    internalName: "Kontakt",
    title: "Kontakt",
    slug: "kontakt",
    isIndexable: true,
    seo: seo(
      "kontakt",
      "Kontakt – Instalatérství Hampl Nymburk",
      "Kontakt na Instalatérství Hampl v Nymburce: Maršála Koněva 1069/24. Telefon 603 206 370, e-mail info@instal-hampl.net. Otevírací doba a mapa.",
    ),
    sections: [hero, contact],
  });
}

function buildPujcovna() {
  const hero = reg("hero", "hero-pujcovna", {
    eyebrow: "Půjčovna",
    heading: "Půjčovna strojů na čištění potrubí a kanalizace",
    subheading:
      "Vše, co potřebujete pro dokonalé čištění potrubí. Profesionální i ruční stroje k zapůjčení — krátkodobě i dlouhodobě, pro domácnosti i firmy.",
    bullets: ["Profi technika Rothenberger", "Krátkodobý i dlouhodobý pronájem", "Pro domácnosti i firmy"],
    primaryCta: callCta(),
    secondaryCta: navigateCta(),
  });

  const grid = reg("sectionProductGrid", "sec-productgrid-pujcovna", {
    heading: "Stroje k zapůjčení",
    subheading: "Vyberte stroj podle průměru potrubí a rozsahu prací.",
    products: [
      product("pujcovna", "R 600", {
        badge: "ROTHENBERGER",
        description: "Výkonný stroj na čištění kanalizace.",
        specs: ["Pro potrubí Ø 20 – 150 mm", "Elektrický pohon 230 V", "Ideální pro domácnosti"],
      }),
      product("pujcovna", "R 750", {
        badge: "ROTHENBERGER",
        description: "Výkonný stroj na čištění kanalizace.",
        specs: ["Pro potrubí Ø 20 – 200 mm", "Elektrický pohon 230 V", "Vhodný pro domácnosti i firmy"],
      }),
      product("pujcovna", "Ruční čistička EXTOL Craft", {
        badge: "RUČNÍ ČISTIČKA",
        description: "Na menší ucpávky, rychle a bez elektřiny.",
        specs: ["Pro potrubí Ø 32 – 50 mm", "Ruční pohon", "Snadné a rychlé použití", "Na menší ucpávky"],
      }),
    ],
    cta: contactCta(),
  });

  const strip = reg("sectionFeatureStrip", "sec-featurestrip-pujcovna", {
    internalName: "Půjčovna — výhody",
    features: [
      feature("Účinné čištění", "Zprůchodní potrubí i kanalizaci.", "drain"),
      feature("Prověřená kvalita a výkon", "Značkové stroje Rothenberger.", "shield"),
      feature("Krátkodobý i dlouhodobý pronájem", "Půjčíme na den i na týdny.", "clock"),
      feature("Pro domácnosti i firmy", "Profi technika pro každého.", "thumbsup"),
    ],
  });

  const banner = reg("sectionCtaBanner", "sec-ctabanner-pujcovna", {
    heading: "Potřebujete stroj hned?",
    text: "Zavolejte a domluvíme zapůjčení, nebo se stavte v prodejně.",
    variant: "brand",
    ctas: [callCta(), navigateCta()],
  });

  return reg("page", "page-pujcovna", {
    internalName: "Půjčovna strojů",
    title: "Půjčovna strojů na čištění kanalizace",
    slug: "sluzby/pujcovna-stroju",
    isIndexable: true,
    seo: seo(
      "pujcovna",
      "Půjčovna strojů na čištění kanalizace Nymburk | Instalatérství Hampl",
      "Půjčovna profesionálních strojů na čištění potrubí a kanalizace v Nymburce – Rothenberger R600, R750 a ruční čistička EXTOL. Krátkodobý i dlouhodobý pronájem.",
    ),
    sections: [hero, grid, strip, banner, sharedContact()],
  });
}

function buildSiteSettings() {
  const navItem = (label, href) => reg("navItem", `nav-${slug(href)}`, { label, href });
  return reg("siteSettings", "siteSettings", {
    internalName: "Nastavení webu",
    navigation: [
      navItem("Úvod", "/"),
      navItem("Prodejna", "/prodejna"),
      navItem("Čištění kanalizace", "/sluzby/cisteni-kanalizace"),
      navItem("Půjčovna", "/sluzby/pujcovna-stroju"),
      navItem("Kontakt", "/kontakt"),
    ],
    footerNote: "Rodinná firma z Nymburka od roku 1993.",
  });
}

// ── run ──────────────────────────────────────────────────────────────────────
const TYPE_ORDER = [
  "cta", "navItem", "seo", "service", "product", "feature", "faqItem",
  "hero", "sectionServiceGrid", "sectionProductGrid", "sectionFeatureStrip",
  "sectionRichText", "sectionFaq", "sectionCtaBanner", "sectionLogoStrip",
  "sectionContactMap", "page", "siteSettings",
];

function localize(fields, locale) {
  const out = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    out[k] = { [locale]: v };
  }
  return out;
}

async function upsert(client, item, locale) {
  const fields = localize(item.fields, locale);
  let entity;
  try {
    const existing = await client.entry.get({ entryId: item.id });
    // Merge over existing fields (don't replace wholesale) so fields the seed
    // doesn't manage — e.g. images uploaded manually in Contentful — survive re-seeds.
    entity = await client.entry.update(
      { entryId: item.id },
      { ...existing, fields: { ...existing.fields, ...fields } },
    );
  } catch {
    entity = await client.entry.createWithId(
      { contentTypeId: item.contentType, entryId: item.id },
      { fields },
    );
  }
  await client.entry.publish({ entryId: item.id }, entity);
}

async function main() {
  // Build the graph (registration order doesn't matter; we publish by TYPE_ORDER).
  buildHome();
  buildProdejna();
  buildBaterie();
  buildCisteni();
  buildRevize();
  buildZamrazovani();
  buildPujcovna();
  buildKontakt();
  buildSiteSettings();

  const client = createClient(
    { accessToken: TOKEN },
    { type: "plain", defaults: { spaceId: SPACE, environmentId: ENVIRONMENT } },
  );

  const locales = await client.locale.getMany({});
  const locale = (locales.items.find((l) => l.default) || locales.items[0]).code;
  console.log(`Seeding ${registry.size} entries into ${SPACE}/${ENVIRONMENT} (locale ${locale})…`);

  const items = [...registry.values()].sort(
    (a, b) => TYPE_ORDER.indexOf(a.contentType) - TYPE_ORDER.indexOf(b.contentType),
  );

  let ok = 0;
  for (const item of items) {
    try {
      await upsert(client, item, locale);
      ok++;
      console.log(`  ✓ ${item.contentType}/${item.id}`);
    } catch (e) {
      console.error(`  ✗ ${item.contentType}/${item.id}: ${e.message?.split("\n")[0] || e}`);
    }
  }
  console.log(`\nDone: ${ok}/${items.length} entries published.`);
  if (ok < items.length) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
