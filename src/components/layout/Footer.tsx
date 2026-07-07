import Link from "next/link";
import { Icon } from "@/components/Icon";
import { siteConfig } from "@/lib/site-config";
import type { NavItem } from "@/lib/contentful/types";

export function Footer({ pages }: { pages: NavItem[] }) {
  const year = new Date().getFullYear(); // current year (re-evaluated on build/revalidate)
  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Kontakt</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Icon name="phone" size={16} className="text-accent" />
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:underline">{siteConfig.contact.phoneDisplay}</a>
            </li>
            <li className="flex items-center gap-2">
              <Icon name="mail" size={16} className="text-accent" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">{siteConfig.contact.email}</a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="pin" size={16} className="mt-0.5 text-accent" />
              <span>{siteConfig.address.street}<br />{siteConfig.address.postalCode} {siteConfig.address.city}</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Otevírací doba</h2>
          <ul className="space-y-2 text-sm">
            {siteConfig.openingHoursDisplay.map((h) => (
              <li key={h.label}>{h.label}<br /><span className="text-white/60">{h.value}</span></li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Stránky</h2>
          <ul className="space-y-2 text-sm">
            {pages.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Sledujte nás</h2>
          <a
            href={siteConfig.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:underline"
          >
            <Icon name="facebook" size={18} className="text-accent" />
            Facebook
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-white/50 sm:px-6">
          © {year} {siteConfig.name} · {siteConfig.legalName} · Nymburk. Všechna práva vyhrazena.
        </div>
      </div>
    </footer>
  );
}
