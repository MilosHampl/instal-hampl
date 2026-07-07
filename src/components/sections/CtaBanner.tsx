import { Container } from "@/components/Container";
import { CtaButton } from "@/components/CtaButton";
import type { CtaBannerData } from "@/lib/contentful/types";

const variants = {
  brand: "bg-brand text-white",
  accent: "bg-accent text-white",
  light: "bg-surface-alt text-ink",
} as const;

export function CtaBanner({ data }: { data: CtaBannerData }) {
  const variant = variants[data.variant ?? "brand"];
  return (
    <section className="py-6">
      <Container>
        <div className={`rounded-2xl px-6 py-10 text-center shadow-card sm:px-10 ${variant}`}>
          <h2 className="text-2xl font-bold sm:text-3xl">{data.heading}</h2>
          {data.text && <p className="mx-auto mt-3 max-w-xl opacity-90">{data.text}</p>}
          {data.ctas.length > 0 && (
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {data.ctas.map((cta, i) => (
                <CtaButton key={`${cta.type}-${i}`} cta={cta} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
