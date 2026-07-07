import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import type { FeatureStripData } from "@/lib/contentful/types";

export function FeatureStrip({ data }: { data: FeatureStripData }) {
  if (!data.features.length) return null;
  return (
    <section className="bg-surface-alt py-10">
      <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.features.map((f) => (
          <div key={f.title} className="flex items-start gap-4">
            {f.icon && (
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-light text-brand">
                <Icon name={f.icon} size={24} />
              </span>
            )}
            <div>
              <h3 className="font-bold text-ink">{f.title}</h3>
              {f.text && <p className="mt-1 text-sm text-muted">{f.text}</p>}
            </div>
          </div>
        ))}
      </Container>
    </section>
  );
}
