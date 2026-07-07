import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Icon } from "@/components/Icon";
import type { FaqData } from "@/lib/contentful/types";

/** Native <details> accordion — accessible, works without JS, pairs with FAQPage JSON-LD. */
export function Faq({ data }: { data: FaqData }) {
  if (!data.items.length) return null;
  return (
    <section className="py-20 md:py-28">
      <Container className="max-w-3xl">
        <SectionHeading eyebrow="FAQ" heading={data.heading ?? "Časté dotazy"} />
        <div className="mt-10 space-y-3">
          {data.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-line bg-surface px-5 py-4 transition-colors open:border-brand/40 hover:border-brand/40"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {item.question}
                <Icon
                  name="chevron"
                  size={18}
                  className="shrink-0 text-brand transition-transform duration-200 group-open:rotate-180"
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
