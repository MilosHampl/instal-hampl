import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCallBar } from "@/components/layout/StickyCallBar";
import { Analytics } from "@/components/analytics/Analytics";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { JsonLd } from "@/components/JsonLd";
import { getAllPages, getSiteSettings } from "@/lib/contentful/queries";
import { localBusinessLd, websiteLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/site-config";

// latin-ext covers Czech diacritics (č, ř, ž, ě…).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} Nymburk`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  formatDetection: { telephone: true },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

// Footer link order: home first, contact last, everything else keeps CMS order.
const footerRank = (href: string) => (href === "/" ? 0 : href === "/kontakt" ? 99 : 50);

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, pages] = await Promise.all([getSiteSettings(), getAllPages()]);

  // Full sitemap-style footer link list so every page (incl. the homepage) links
  // to all important pages. Reuse curated nav labels where available.
  const navLabel = new Map(settings.navigation.map((n) => [n.href, n.label]));
  const footerLinks = pages
    .filter((p) => p.isIndexable)
    .map((p) => ({ href: p.slug, label: navLabel.get(p.slug) ?? p.breadcrumbLabel ?? p.title }))
    .sort((a, b) => footerRank(a.href) - footerRank(b.href));

  return (
    <html lang="cs" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* Site-wide structured data */}
        <JsonLd data={[localBusinessLd(), websiteLd()]} />

        <Analytics />
        <Header nav={settings.navigation} />
        <main className="flex-1">{children}</main>
        <Footer pages={footerLinks} />

        {/* extra bottom padding on mobile so the sticky bar never covers content */}
        <div aria-hidden className="h-16 md:hidden" />
        <StickyCallBar />
        <ConsentBanner />
      </body>
    </html>
  );
}
