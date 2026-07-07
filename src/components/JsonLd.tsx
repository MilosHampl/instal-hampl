/**
 * Renders a JSON-LD structured-data block. Server component — the object is
 * serialised at render time and embedded in the initial HTML (best for crawlers).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, first-party content built from our own config.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
