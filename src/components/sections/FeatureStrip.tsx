import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import type { FeatureStripData } from "@/lib/contentful/types";

export function FeatureStrip({ data }: { data: FeatureStripData }) {
  if (!data.features.length) return null;
  return (
    <section className="border-y border-line bg-surface-alt/60 py-12">
      <Container className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.features.map((f) => (
          <div key={f.title} className="flex items-start gap-4">
            {f.icon && (
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                <Icon name={f.icon} size={22} />
              </span>
            )}
            <div>
              <h3 className="font-bold text-ink">{f.title}</h3>
              {f.text && <p className="mt-1 text-sm leading-relaxed text-muted">{f.text}</p>}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
