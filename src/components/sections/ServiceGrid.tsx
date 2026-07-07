import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CtaButton } from "@/components/CtaButton";
import { Icon } from "@/components/Icon";
import type { ServiceGridData } from "@/lib/contentful/types";

export function ServiceGrid({ data }: { data: ServiceGridData }) {
  if (!data.services.length) return null;
  return (
    <section className="py-14">
      <Container>
        <SectionHeading heading={data.heading} subheading={data.subheading} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.services.map((s) => (
            <article
              key={s.title}
              className="flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-card"
            >
              {s.image ? (
                <div className="relative aspect-[16/10]">
                  <Image
                    src={s.image.url}
                    alt={s.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                s.icon && (
                  <div className="flex items-center justify-center bg-brand-light py-8">
                    <span className="flex size-16 items-center justify-center rounded-2xl bg-brand text-white">
                      <Icon name={s.icon} size={30} />
                    </span>
                  </div>
                )
              )}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-bold text-ink">{s.title}</h3>
                {s.description && <p className="mt-2 text-sm text-muted">{s.description}</p>}
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-ink">
                        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {s.cta && (
                  <div className="mt-6 pt-2">
                    <CtaButton cta={s.cta} fullWidth />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
