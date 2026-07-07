import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CtaButton } from "@/components/CtaButton";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { OpenStatus } from "@/components/OpenStatus";
import { mapsEmbedUrl, siteConfig } from "@/lib/site-config";
import type { ContactMapData } from "@/lib/contentful/types";

const callCta = { label: `Zavolat ${siteConfig.contact.phoneDisplay}`, type: "call" as const, style: "primary" as const };
const navigateCta = { label: "Navigovat", type: "navigate" as const, style: "secondary" as const };
const emailCta = { label: "E-mail", type: "email" as const, style: "ghost" as const };
const fbCta = { label: "Facebook", type: "facebook" as const, style: "ghost" as const };

const rows = [
  { icon: "pin", label: "Adresa", value: `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}` },
  { icon: "phone", label: "Telefon", value: siteConfig.contact.phoneDisplay, href: `tel:${siteConfig.contact.phone}` },
  { icon: "mail", label: "E-mail", value: siteConfig.contact.email, href: `mailto:${siteConfig.contact.email}` },
];

/** Anchor id="mapa" lets any `map`-type CTA scroll here. */
export function ContactMap({ data }: { data: ContactMapData }) {
  return (
    <section id="mapa" className="scroll-mt-24 border-y border-line bg-surface-alt/60 py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Kontakt"
          heading={data.heading ?? "Najdete nás v Nymburce"}
          subheading="Zastavte se v prodejně, zavolejte nebo napište — rádi poradíme."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              {/* live open status */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-sm text-brand">
                <OpenStatus />
              </div>

              <ul className="space-y-4">
                {rows.map((r) => (
                  <li key={r.label} className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                      <Icon name={r.icon} size={20} />
                    </span>
                    <span>
                      <span className="block text-xs font-medium uppercase tracking-wide text-muted">{r.label}</span>
                      {r.href ? (
                        <a href={r.href} className="font-semibold text-ink hover:text-brand">{r.value}</a>
                      ) : (
                        <span className="font-semibold text-ink">{r.value}</span>
                      )}
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon name="clock" size={20} />
                  </span>
                  <span>
                    <span className="block text-xs font-medium uppercase tracking-wide text-muted">Otevírací doba</span>
                    {siteConfig.openingHoursDisplay.map((h) => (
                      <span key={h.label} className="block text-sm text-ink">
                        <span className="font-semibold">{h.label}:</span> {h.value}
                      </span>
                    ))}
                  </span>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                <CtaButton cta={callCta} size="md" />
                <CtaButton cta={navigateCta} size="md" />
                <CtaButton cta={emailCta} size="md" />
                <CtaButton cta={fbCta} size="md" />
              </div>
            </div>

            {data.showForm && (
              <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
                <h3 className="mb-4 text-lg font-bold text-ink">Napište nám</h3>
                <ContactForm />
              </div>
            )}
          </div>

          {/* map */}
          <div className="relative min-h-80 overflow-hidden rounded-2xl border border-line shadow-card lg:min-h-full">
            <iframe
              title={`Mapa – ${siteConfig.name}`}
              src={mapsEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 size-full border-0"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
