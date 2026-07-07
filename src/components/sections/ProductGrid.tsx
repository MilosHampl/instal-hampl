import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { CtaButton } from "@/components/CtaButton";
import { Icon } from "@/components/Icon";
import type { ProductGridData } from "@/lib/contentful/types";

export function ProductGrid({ data }: { data: ProductGridData }) {
  if (!data.products.length) return null;
  return (
    <section className="bg-surface-alt py-14">
      <Container>
        <SectionHeading heading={data.heading} subheading={data.subheading} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.products.map((p) => (
            <article
              key={p.name}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface shadow-card"
            >
              <div className="relative aspect-[4/3] bg-brand-light">
                {p.image ? (
                  <Image
                    src={p.image.url}
                    alt={p.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-brand/40">
                    <Icon name="wrench" size={40} />
                  </div>
                )}
                {p.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-bold text-ink">{p.name}</h3>
                {p.description && <p className="mt-1 text-sm text-muted">{p.description}</p>}
                {p.specs && p.specs.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-muted">
                    {p.specs.map((sp) => (
                      <li key={sp}>• {sp}</li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
        {data.cta && (
          <div className="mt-10 flex justify-center">
            <CtaButton cta={data.cta} />
          </div>
        )}
      </Container>
    </section>
  );
}
