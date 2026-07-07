import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CtaButton } from "@/components/CtaButton";
import { Icon } from "@/components/Icon";
import type { ServiceGridData } from "@/lib/contentful/types";

export function ServiceGrid({ data }: { data: ServiceGridData }) {
  if (!data.services.length) return null;
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Služby a sortiment" heading={data.heading} subheading={data.subheading} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.services.map((s) => (
            <article
              key={s.title}
              className="group flex flex-col rounded-2xl border border-line bg-surface p-6 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift"
            >
              {s.image ? (
                <div className="relative mb-5 aspect-16/10 overflow-hidden rounded-xl">
                  <Image
                    src={s.image.url}
                    alt={s.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                s.icon && (
                  <span className="grid size-12 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                    <Icon name={s.icon} size={24} />
                  </span>
                )
              )}

              <h3 className="mt-4 text-lg font-bold text-ink">{s.title}</h3>
              {s.description && <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>}

              {s.bullets && s.bullets.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink/80">
                      <Icon name="check" size={16} className="mt-0.5 shrink-0 text-brand" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}

              {s.cta && (
                <div className="mt-6 pt-1">
                  <CtaButton cta={{ ...s.cta, style: "ghost" }} size="md" />
                </div>
              )}
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
