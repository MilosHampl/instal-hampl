import { CtaButton } from "@/components/CtaButton";

const callCta = { label: "Zavolat", type: "call" as const, style: "primary" as const };
const navigateCta = { label: "Navigovat", type: "navigate" as const, style: "secondary" as const };

/**
 * Mobile-only sticky bar keeping the primary conversions (call, navigate) one
 * tap away — the dominant pattern for ad traffic on phones. Hidden ≥ md.
 */
export function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-line bg-surface/95 p-2 backdrop-blur md:hidden">
      <CtaButton cta={callCta} fullWidth />
      <CtaButton cta={navigateCta} fullWidth />
    </div>
  );
}
