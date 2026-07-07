import { Container } from "@/components/Container";
import { CtaButton } from "@/components/CtaButton";
import type { CtaBannerData } from "@/lib/contentful/types";

const variants = {
  brand: "bg-linear-to-br from-brand to-brand-2 text-white",
  accent: "bg-linear-to-br from-accent to-accent-dark text-white",
  light: "border border-line bg-surface-alt text-ink",
} as const;

export function CtaBanner({ data }: { data: CtaBannerData }) {
  const variant = data.variant ?? "brand";
  const light = variant === "light";
  return (
    <section className="py-10">
      <Container>
        <div className={`relative overflow-hidden rounded-4xl px-6 py-12 text-center shadow-lift sm:px-10 sm:py-14 ${variants[variant]}`}>
          {!light && (
            <span
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(45%_90%_at_82%_0%,rgba(255,255,255,0.22),transparent)]"
            />
          )}
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{data.heading}</h2>
            {data.text && <p className={`mt-3 text-lg ${light ? "text-muted" : "text-white/90"}`}>{data.text}</p>}
            {data.ctas.length > 0 && (
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {data.ctas.map((cta, i) => (
                  <CtaButton key={`${cta.type}-${i}`} cta={cta} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
