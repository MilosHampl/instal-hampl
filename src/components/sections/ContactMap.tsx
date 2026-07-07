import { Container } from "@/components/Container";
import { CtaButton } from "@/components/CtaButton";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { mapsEmbedUrl, siteConfig } from "@/lib/site-config";
import type { ContactMapData } from "@/lib/contentful/types";

const callCta = { label: `Zavolat ${siteConfig.contact.phoneDisplay}`, type: "call" as const, style: "primary" as const };
const navigateCta = { label: "Navigovat", type: "navigate" as const, style: "secondary" as const };
const emailCta = { label: "Napsat e-mail", type: "email" as const, style: "ghost" as const };
const fbCta = { label: "Facebook", type: "facebook" as const, style: "ghost" as const };

/** Anchor id="mapa" lets any `map`-type CTA scroll here. */
export function ContactMap({ data }: { data: ContactMapData }) {
  return (
    <section id="mapa" className="scroll-mt-24 bg-brand-dark py-14 text-white">
      <Container>
        {data.heading && <h2 className="mb-8 text-2xl font-bold sm:text-3xl">{data.heading}</h2>}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: NAP + hours + CTAs */}
          <div className="space-y-6">
            <ul className="space-y-4 text-white/90">
              <li className="flex items-start gap-3">
                <Icon name="pin" size={22} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  {siteConfig.address.street}
                  <br />
                  {siteConfig.address.postalCode} {siteConfig.address.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" size={22} className="shrink-0 text-accent" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:underline">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="mail" size={22} className="shrink-0 text-accent" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:underline">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="clock" size={22} className="mt-0.5 shrink-0 text-accent" />
                <span>
                  {siteConfig.openingHoursDisplay.map((h) => (
                    <span key={h.label} className="block">
                      <strong className="font-semibold">{h.label}:</strong> {h.value}
                    </span>
                  ))}
                </span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3">
              <CtaButton cta={callCta} />
              <CtaButton cta={navigateCta} />
              <CtaButton cta={emailCta} />
              <CtaButton cta={fbCta} />
            </div>

            {data.showForm && (
              <div className="mt-8 rounded-[var(--radius-card)] bg-surface p-6 text-ink shadow-card">
                <h3 className="mb-4 text-lg font-bold">Napište nám</h3>
                <ContactForm />
              </div>
            )}
          </div>

          {/* Right: map embed */}
          <div className="min-h-[320px] overflow-hidden rounded-[var(--radius-card)] shadow-card">
            <iframe
              title={`Mapa – ${siteConfig.name}`}
              src={mapsEmbedUrl()}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[320px] w-full border-0"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
