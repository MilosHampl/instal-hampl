import { BLOCKS, type Document } from "@contentful/rich-text-types";
import type { CtaData, PageData, SiteSettingsData } from "./types";

/**
 * Static default content used when Contentful is not configured, when a fetch
 * fails, or before the CMS is populated. Once editors create the matching
 * `page` entries in Contentful, this is ignored. It also serves as living
 * documentation of what each section expects.
 *
 * All copy is derived from the real business (Firmy.cz + legacy site), with the
 * ChatGPT "DUDEK" boilerplate discarded per the brief.
 */

const doc = (...paragraphs: string[]): Document =>
  ({
    nodeType: BLOCKS.DOCUMENT,
    data: {},
    content: paragraphs.map((text) => ({
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [{ nodeType: "text", value: text, marks: [], data: {} }],
    })),
  }) as Document;

// Reusable CTAs (value omitted → falls back to site-config phone/email/FB/map).
const callCta: CtaData = { label: "Zavolat 603 206 370", type: "call", style: "primary" };
const navigateCta: CtaData = { label: "Navigovat do prodejny", type: "navigate", style: "secondary" };
const emailCta: CtaData = { label: "Napsat e-mail", type: "email", style: "ghost" };
const contactCta: CtaData = { label: "Kontakt a mapa", type: "link", value: "/kontakt", style: "secondary" };

const contactSection = { _type: "contactMap" as const, heading: "Najdete nás v Nymburce", showForm: true };

const home: PageData = {
  slug: "/",
  title: "Instalatérství Hampl Nymburk",
  isIndexable: true,
  seo: {
    metaTitle: "Instalatérství Hampl Nymburk – materiál, koupelny, čištění kanalizace",
    metaDescription:
      "Prodej instalatérského materiálu, vybavení koupelen, čištění a revize kanalizace a půjčovna strojů v Nymburce. Rodinná firma od roku 1993. Zavolejte 603 206 370.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Instalatérství Hampl · Nymburk · od roku 1993",
      heading: "Vše pro vodu, topení a koupelny na jednom místě",
      subheading:
        "Prodejna instalatérského materiálu, vybavení koupelen a profesionální čištění kanalizace. Poradíme s výběrem a najdeme řešení.",
      bullets: [
        "Instalatérský materiál a nářadí skladem",
        "Vybavení koupelen na míru",
        "Čištění a revize kanalizace, půjčovna strojů",
      ],
      primaryCta: callCta,
      secondaryCta: navigateCta,
    },
    {
      _type: "featureStrip",
      features: [
        { icon: "shield", title: "Spolehlivost", text: "Dlouholeté zkušenosti a kvalitní produkty od ověřených značek." },
        { icon: "thumbsup", title: "Odborný přístup", text: "Poradíme s výběrem a společně najdeme nejlepší řešení." },
        { icon: "pin", title: "Na jednom místě", text: "Vše, co potřebujete pro dům, byt i firmu — v jedné prodejně." },
      ],
    },
    {
      _type: "serviceGrid",
      heading: "Naše služby a sortiment",
      subheading: "Od materiálu přes vybavení koupelny až po servis kanalizace.",
      services: [
        {
          title: "Prodej instalatérského materiálu",
          icon: "wrench",
          description: "Široký sortiment pro vodu, topení, kanalizaci a plyn.",
          bullets: ["Trubky, tvarovky, armatury", "Ventily, čerpadla, ohřívače", "Nářadí a příslušenství"],
          cta: { label: "Více informací", type: "link", value: "/prodejna", style: "secondary" },
        },
        {
          title: "Vybavení koupelen",
          icon: "bath",
          description: "Kompletní vybavení pro moderní koupelny.",
          bullets: ["Sanitární keramika", "Baterie a sprchy", "Vany, sprchové kouty, doplňky"],
          cta: { label: "Více informací", type: "link", value: "/sortiment/vodovodni-baterie", style: "secondary" },
        },
        {
          title: "Čištění kanalizace",
          icon: "drain",
          description: "Mechanické i tlakové čištění potrubí, havarijní zásahy.",
          bullets: ["Strojní čištění", "Havarijní výjezdy", "Profi technika Rothenberger"],
          cta: { label: "Více informací", type: "link", value: "/sluzby/cisteni-kanalizace", style: "secondary" },
        },
        {
          title: "Revize a videoinspekce",
          icon: "camera",
          description: "Kontrola stavu potrubí kamerou s videozáznamem.",
          bullets: ["Kamerový průzkum", "Lokalizace poruch", "Podklad pro opravu"],
          cta: { label: "Více informací", type: "link", value: "/sluzby/revize-kanalizace", style: "secondary" },
        },
        {
          title: "Zamražování potrubí",
          icon: "snowflake",
          description: "Oprava bez vypouštění celé soustavy.",
          bullets: ["Bez odstávky systému", "Rychlý zásah", "Úspora nákladů"],
          cta: { label: "Více informací", type: "link", value: "/sluzby/zamrazovani-potrubi", style: "secondary" },
        },
        {
          title: "Půjčovna strojů",
          icon: "rental",
          description: "Profesionální technika pro čištění potrubí a kanalizace.",
          bullets: ["R600 – potrubí Ø 20–150 mm", "R750 – potrubí Ø 20–200 mm", "Ruční čistička EXTOL Ø 32–50 mm"],
          cta: { label: "Více informací", type: "link", value: "/sluzby/cisteni-kanalizace", style: "secondary" },
        },
      ],
    },
    {
      _type: "ctaBanner",
      variant: "brand",
      heading: "Potřebujete poradit nebo řešíte havárii?",
      text: "Zavolejte nám nebo se stavte v prodejně v Nymburce. Rádi pomůžeme.",
      ctas: [callCta, navigateCta, emailCta],
    },
    contactSection,
  ],
};

const prodejna: PageData = {
  slug: "/prodejna",
  title: "Prodejna instalatérského materiálu",
  isIndexable: true,
  seo: {
    metaTitle: "Prodejna instalatérského materiálu Nymburk | Instalatérství Hampl",
    metaDescription:
      "Prodejna instalatérského materiálu v Nymburce: baterie, čerpadla, domácí vodárny, sanitární keramika, nářadí. Poradíme s výběrem.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Prodejna Nymburk",
      heading: "Instalatérský materiál a vybavení koupelen",
      subheading:
        "Široký sortiment skladem pro vodu, topení, kanalizaci a plyn — pro domácnosti i firmy. Přijďte se poradit osobně.",
      bullets: ["Materiál skladem", "Osobní poradenství", "Značková technika"],
      primaryCta: navigateCta,
      secondaryCta: callCta,
    },
    {
      _type: "productGrid",
      heading: "Co u nás najdete",
      subheading: "Výběr z hlavních kategorií sortimentu.",
      products: [
        { name: "Vodovodní baterie", badge: "200+ modelů", description: "Pákové i klasické baterie do koupelny i kuchyně." },
        { name: "Čerpadla a domácí vodárny", description: "Čerpadla, domácí vodárny a technika pro závlahy." },
        { name: "Sanitární keramika", description: "Umyvadla, WC, bidety a doplňky do koupelny." },
        { name: "Trubky, tvarovky, armatury", description: "Vše pro rozvody vody, topení a kanalizace." },
        { name: "Ohřívače a topení", description: "Bojlery, ohřívače vody a komponenty topných soustav." },
        { name: "Nářadí a příslušenství", description: "Ruční i aku nářadí pro instalatérské práce." },
      ],
      cta: contactCta,
    },
    {
      _type: "ctaBanner",
      variant: "accent",
      heading: "Nevíte si rady s výběrem?",
      text: "Zastavte se v prodejně nebo zavolejte — pomůžeme vybrat správně napoprvé.",
      ctas: [callCta, navigateCta],
    },
    contactSection,
  ],
};

const baterie: PageData = {
  slug: "/sortiment/vodovodni-baterie",
  title: "Vodovodní baterie",
  isIndexable: true,
  seo: {
    metaTitle: "Vodovodní baterie Nymburk – přes 200 modelů | Instalatérství Hampl",
    metaDescription:
      "Pákové a klasické vodovodní baterie do koupelny i kuchyně, přes 200 vystavených modelů. Prohlédněte si je osobně v prodejně v Nymburce.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Sortiment",
      heading: "Vodovodní baterie — přes 200 modelů vystaveno",
      subheading: "Vyberte si baterii, kterou si můžete osobně prohlédnout a osahat přímo v prodejně.",
      primaryCta: navigateCta,
      secondaryCta: callCta,
    },
    {
      _type: "richText",
      heading: "Baterie pro každou koupelnu i kuchyň",
      body: doc(
        "V naší prodejně v Nymburce najdete širokou nabídku vodovodních baterií — od pákových přes klasické až po sprchové sety a termostatické baterie.",
        "Rádi vám poradíme s výběrem podle typu rozvodu, designu a rozpočtu. Baterie i doplňky máme běžně skladem.",
      ),
    },
    {
      _type: "productGrid",
      heading: "Typy baterií",
      products: [
        { name: "Umyvadlové baterie", description: "Pákové i dvoukohoutkové do koupelny." },
        { name: "Dřezové baterie", description: "Do kuchyně, s výsuvnou sprškou i bez." },
        { name: "Sprchové a vanové baterie", description: "Nástěnné baterie a kompletní sprchové sety." },
        { name: "Termostatické baterie", description: "Stálá teplota vody a úspora energie." },
      ],
      cta: contactCta,
    },
    { _type: "ctaBanner", variant: "brand", heading: "Přijďte si vybrat osobně", text: "Vystavené modely si prohlédnete na jednom místě.", ctas: [navigateCta, callCta] },
    contactSection,
  ],
};

const cisteni: PageData = {
  slug: "/sluzby/cisteni-kanalizace",
  title: "Čištění kanalizace",
  isIndexable: true,
  seo: {
    metaTitle: "Čištění kanalizace Nymburk a okolí | Instalatérství Hampl",
    metaDescription:
      "Strojní a tlakové čištění kanalizace, havarijní výjezdy a půjčovna čistících strojů v Nymburce a okolí. Zavolejte 603 206 370.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Služby",
      heading: "Čištění kanalizace a odpadů",
      subheading:
        "Ucpaný odpad nebo havárie? Provádíme strojní i tlakové čištění potrubí. Máme profesionální techniku Rothenberger.",
      bullets: ["Strojní i tlakové čištění", "Havarijní zásahy", "Půjčovna strojů R600 / R750 / EXTOL"],
      primaryCta: callCta,
      secondaryCta: navigateCta,
    },
    {
      _type: "richText",
      heading: "Jak čištění probíhá",
      body: doc(
        "Nejprve zprůchodníme potrubí strojní spirálou nebo tlakovou vodou podle typu ucpání. Pro potrubí od Ø 20 do 200 mm používáme stroje Rothenberger R600 a R750, pro menší průměry ruční čističku EXTOL.",
        "V případě opakovaných problémů doporučíme kamerovou revizi, která odhalí příčinu — prasklinu, prosednutí nebo kořeny.",
      ),
    },
    {
      _type: "faq",
      heading: "Časté dotazy",
      items: [
        { question: "Jak rychle přijedete?", answer: "U havárií se snažíme vyjet co nejdříve. Zavolejte na 603 206 370 a domluvíme termín." },
        { question: "Vyčistíte i venkovní kanalizaci?", answer: "Ano, čistíme domovní i venkovní přípojky a hlavní svody v rámci Nymburka a okolí." },
        { question: "Půjčujete stroje na čištění?", answer: "Ano. Nabízíme k zapůjčení stroje R600, R750 i ruční čističku EXTOL. Podmínky sdělíme v prodejně." },
      ],
    },
    { _type: "ctaBanner", variant: "accent", heading: "Řešíte ucpaný odpad?", text: "Zavolejte a domluvíme rychlý zásah.", ctas: [callCta, emailCta] },
    contactSection,
  ],
};

const revize: PageData = {
  slug: "/sluzby/revize-kanalizace",
  title: "Revize a videoinspekce kanalizace",
  isIndexable: true,
  seo: {
    metaTitle: "Revize kanalizace kamerou Nymburk | Instalatérství Hampl",
    metaDescription:
      "Kamerová revize a videoinspekce kanalizace v Nymburce. Zjistíme příčinu ucpání, lokalizujeme poruchu a připravíme podklad pro opravu.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Služby",
      heading: "Revize kanalizace kamerou",
      subheading:
        "Kamerovým průzkumem s videozáznamem přesně zjistíme stav a příčinu problému v potrubí — bez zbytečného kopání.",
      primaryCta: callCta,
      secondaryCta: navigateCta,
    },
    {
      _type: "richText",
      heading: "Co videoinspekce odhalí",
      body: doc(
        "Speciální kamerou projedeme potrubí a na záznamu uvidíte skutečný stav — praskliny, prosednutí, zarostlé kořeny nebo usazeniny.",
        "Na základě revize navrhneme nejvhodnější řešení, ať už jde o čištění, bodovou opravu nebo výměnu úseku.",
      ),
    },
    { _type: "ctaBanner", variant: "brand", heading: "Objednejte revizi", text: "Zavolejte a domluvíme termín kamerové prohlídky.", ctas: [callCta, emailCta] },
    contactSection,
  ],
};

const zamrazovani: PageData = {
  slug: "/sluzby/zamrazovani-potrubi",
  title: "Zamražování potrubí",
  isIndexable: true,
  seo: {
    metaTitle: "Zamražování potrubí Nymburk | Instalatérství Hampl",
    metaDescription:
      "Zamražování potrubí umožní opravu bez vypuštění celé soustavy. Rychlý zásah a úspora nákladů. Instalatérství Hampl Nymburk.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Služby",
      heading: "Zamražování potrubí",
      subheading:
        "Potřebujete opravit úsek bez vypouštění celého systému? Zamražením vytvoříme dočasnou zátku a opravu provedeme rychle a čistě.",
      primaryCta: callCta,
      secondaryCta: navigateCta,
    },
    {
      _type: "richText",
      heading: "Kdy zamražování využít",
      body: doc(
        "Zamražování je ideální tam, kde není uzávěr nebo by vypuštění soustavy bylo nákladné a zdlouhavé. Vytvoříme ledovou zátku a v klidu provedeme potřebnou opravu.",
      ),
    },
    { _type: "ctaBanner", variant: "accent", heading: "Poradíme, zda je zamražení vhodné", text: "Zavolejte a popište situaci.", ctas: [callCta] },
    contactSection,
  ],
};

const kontakt: PageData = {
  slug: "/kontakt",
  title: "Kontakt",
  isIndexable: true,
  seo: {
    metaTitle: "Kontakt – Instalatérství Hampl Nymburk",
    metaDescription:
      "Kontakt na Instalatérství Hampl v Nymburce: Maršála Koněva 1069/24. Telefon 603 206 370, e-mail info@instal-hampl.net. Otevírací doba a mapa.",
  },
  sections: [
    {
      _type: "hero",
      eyebrow: "Kontakt",
      heading: "Ozvěte se nám nebo se stavte",
      subheading: "Rádi poradíme s výběrem materiálu i se službami. Najdete nás v Nymburce.",
      primaryCta: callCta,
      secondaryCta: emailCta,
    },
    { _type: "contactMap", heading: "Kde nás najdete", showForm: true },
  ],
};

export const fallbackPages: PageData[] = [
  home,
  prodejna,
  baterie,
  cisteni,
  revize,
  zamrazovani,
  kontakt,
];

export const fallbackSiteSettings: SiteSettingsData = {
  navigation: [
    { label: "Úvod", href: "/" },
    { label: "Prodejna", href: "/prodejna" },
    { label: "Čištění kanalizace", href: "/sluzby/cisteni-kanalizace" },
    { label: "Kontakt", href: "/kontakt" },
  ],
};
