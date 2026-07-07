import { Container } from "@/components/Container";
import { CtaButton } from "@/components/CtaButton";
import { Icon } from "@/components/Icon";
import { OpenStatus } from "@/components/OpenStatus";
import { HeroContactCard } from "@/components/HeroContactCard";
import type { HeroData } from "@/lib/contentful/types";

export function Hero({ data, isFirst }: { data: HeroData; isFirst: boolean }) {
  const Heading = isFirst ? "h1" : "h2";
  return (
    <section className="relative overflow-hidden">
      {/* soft brand + water glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_12%_-10%,color-mix(in_oklab,var(--color-brand)_16%,transparent),transparent_60%),radial-gradient(45%_50%_at_98%_-5%,color-mix(in_oklab,var(--color-brand-2)_20%,transparent),transparent_60%)]"
      />
      {/* faint graph-paper grid, faded toward edges */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-line)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-line)_1px,transparent_1px)] bg-size-[46px_46px] opacity-50 mask-[radial-gradient(70%_55%_at_50%_0%,black,transparent)]"
      />

      <Container className="grid items-center gap-12 py-14 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1.5 text-xs font-medium text-muted backdrop-blur">
            <OpenStatus showDetail={false} />
            {data.eyebrow && (
              <>
                <span className="text-line">·</span>
                <span>{data.eyebrow}</span>
              </>
            )}
          </div>

          <Heading className="mt-5 text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-6xl">
            {data.heading}
          </Heading>

          {data.subheading && (
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted">{data.subheading}</p>
          )}

          {(data.primaryCta || data.secondaryCta) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {data.primaryCta && <CtaButton cta={data.primaryCta} />}
              {data.secondaryCta && <CtaButton cta={data.secondaryCta} />}
            </div>
          )}

          {data.bullets && data.bullets.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/80">
              {data.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Icon name="check" size={16} className="text-brand" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <HeroContactCard image={data.image} />
      </Container>
    </section>
  );
}
