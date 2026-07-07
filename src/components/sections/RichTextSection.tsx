import { documentToReactComponents, type Options } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import { Container } from "@/components/Container";
import type { RichTextData } from "@/lib/contentful/types";

/** Maps Contentful rich-text nodes to styled elements (no typography plugin needed). */
const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong className="font-semibold">{text}</strong>,
    [MARKS.ITALIC]: (text) => <em>{text}</em>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="mt-4 leading-relaxed text-ink/90 first:mt-0">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="mt-8 text-2xl font-bold text-ink">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="mt-6 text-xl font-bold text-ink">{children}</h3>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="mt-4 list-disc space-y-1.5 pl-5 text-ink/90">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-ink/90">{children}</ol>
    ),
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="mt-4 border-l-4 border-brand pl-4 italic text-muted">{children}</blockquote>
    ),
    [INLINES.HYPERLINK]: (node, children) => {
      const uri = (node.data as { uri?: string }).uri ?? "#";
      const external = /^https?:\/\//.test(uri);
      return (
        <a
          href={uri}
          className="text-brand underline underline-offset-2 hover:text-brand-dark"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichTextSection({ data }: { data: RichTextData }) {
  if (!data.body) return null;
  return (
    <section className="py-14">
      <Container className="max-w-3xl">
        {data.heading && <h2 className="text-2xl font-bold text-ink sm:text-3xl">{data.heading}</h2>}
        <div className="mt-4">{documentToReactComponents(data.body, options)}</div>
      </Container>
    </section>
  );
}
