import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Icon } from "@/components/Icon";
import type { FaqData } from "@/lib/contentful/types";

/** Native <details> accordion — accessible, works without JS, and pairs with FAQPage JSON-LD. */
export function Faq({ data }: { data: FaqData }) {
  if (!data.items.length) return null;
  return (
    <section className="py-14">
      <Container className="max-w-3xl">
        <SectionHeading heading={data.heading ?? "Časté dotazy"} />
        <div className="divide-y divide-line rounded-[var(--radius-card)] border border-line bg-surface">
          {data.items.map((item) => (
            <details key={item.question} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {item.question}
                <Icon
                  name="arrow"
                  size={18}
                  className="shrink-0 rotate-90 text-brand transition group-open:-rotate-90"
                />
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-muted">
                {typeof item.answer === "string" ? (
                  <p>{item.answer}</p>
                ) : (
                  documentToReactComponents(item.answer as Document)
                )}
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
