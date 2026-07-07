import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CtaButton } from "@/components/CtaButton";
import { Icon } from "@/components/Icon";
import type { ProductGridData } from "@/lib/contentful/types";

export function ProductGrid({ data }: { data: ProductGridData }) {
  if (!data.products.length) return null;
  return (
    <section className="border-y border-line bg-surface-alt/60 py-20 md:py-28">
      <Container>
        <SectionHeading eyebrow="Sortiment" heading={data.heading} subheading={data.subheading} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.products.map((p) => (
            <article
              key={p.name}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-lift"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-linear-to-br from-brand-light to-surface-alt">
                {p.image ? (
                  <Image
                    src={p.image.url}
                    alt={p.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-brand/30">
                    <Icon name="water" size={44} />
                  </div>
                )}
                {p.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-ink">{p.name}</h3>
                {p.description && <p className="mt-1 text-sm leading-relaxed text-muted">{p.description}</p>}
                {p.specs && p.specs.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-muted">
                    {p.specs.map((sp) => (
                      <li key={sp} className="flex items-start gap-2">
                        <Icon name="check" size={15} className="mt-0.5 shrink-0 text-brand" />
                        {sp}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
        {data.cta && (
          <div className="mt-10 flex">
            <CtaButton cta={data.cta} />
          </div>
        )}
      </Container>
    </section>
  );
}
