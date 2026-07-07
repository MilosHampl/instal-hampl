import Image from "next/image";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import type { LogoStripData } from "@/lib/contentful/types";

/** Partner / brand logos (e.g. Roth, Rothenberger) — builds trust on landing pages. */
export function LogoStrip({ data }: { data: LogoStripData }) {
  if (!data.logos.length) return null;
  return (
    <section className="py-12">
      <Container>
        <SectionHeading heading={data.heading} />
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {data.logos.map((logo) => (
            <div key={logo.url} className="relative h-12 w-28 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Image src={logo.url} alt={logo.alt} fill sizes="112px" className="object-contain" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
