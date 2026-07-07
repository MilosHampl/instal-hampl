import Image from "next/image";
import { Container } from "@/components/Container";
import { CtaButton } from "@/components/CtaButton";
import { Icon } from "@/components/Icon";
import type { HeroData } from "@/lib/contentful/types";

export function Hero({ data, isFirst }: { data: HeroData; isFirst: boolean }) {
  const Heading = isFirst ? "h1" : "h2";
  return (
    <section className="relative overflow-hidden bg-brand-dark text-white">
      {/* subtle brand gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-dark via-brand-dark to-brand" />
      <Container className="relative grid items-center gap-10 py-14 md:grid-cols-2 md:py-24">
        <div>
          {data.eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-light/90">
              {data.eyebrow}
            </p>
          )}
          <Heading className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {data.heading}
          </Heading>
          {data.subheading && (
            <p className="mt-4 max-w-xl text-lg text-white/80">{data.subheading}</p>
          )}
          {data.bullets && data.bullets.length > 0 && (
            <ul className="mt-6 space-y-2">
              {data.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3 text-white/90">
                  <Icon name="check" size={20} className="text-accent" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
          {(data.primaryCta || data.secondaryCta) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {data.primaryCta && <CtaButton cta={data.primaryCta} />}
              {data.secondaryCta && <CtaButton cta={data.secondaryCta} />}
            </div>
          )}
        </div>

        {data.image && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card ring-1 ring-white/10">
            <Image
              src={data.image.url}
              alt={data.image.alt}
              fill
              priority={isFirst}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
