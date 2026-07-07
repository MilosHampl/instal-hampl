import { Container } from "@/components/Container";
import { CtaButton } from "@/components/CtaButton";

const homeCta = { label: "Zpět na úvod", type: "link" as const, value: "/", style: "secondary" as const };
const callCta = { label: "Zavolat nám", type: "call" as const, style: "primary" as const };

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand">404</p>
      <h1 className="mt-2 text-3xl font-extrabold text-ink sm:text-4xl">Stránka nenalezena</h1>
      <p className="mt-4 max-w-md text-muted">
        Zdá se, že tato stránka neexistuje nebo byla přesunuta. Zkuste to prosím z úvodní
        stránky nebo nám rovnou zavolejte.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <CtaButton cta={callCta} />
        <CtaButton cta={homeCta} />
      </div>
    </Container>
  );
}
