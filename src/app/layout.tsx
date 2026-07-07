import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StickyCallBar } from "@/components/layout/StickyCallBar";
import { Analytics } from "@/components/analytics/Analytics";
import { ConsentBanner } from "@/components/analytics/ConsentBanner";
import { JsonLd } from "@/components/JsonLd";
import { getSiteSettings } from "@/lib/contentful/queries";
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

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <html lang="cs" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {/* Site-wide structured data */}
        <JsonLd data={[localBusinessLd(), websiteLd()]} />

        <Analytics />
        <Header nav={settings.navigation} />
        <main className="flex-1">{children}</main>
        <Footer nav={settings.navigation} />

        {/* extra bottom padding on mobile so the sticky bar never covers content */}
        <div aria-hidden className="h-16 md:hidden" />
        <StickyCallBar />
        <ConsentBanner />
      </body>
    </html>
  );
}
