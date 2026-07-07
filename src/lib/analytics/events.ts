import type { CtaData, CtaType } from "@/lib/contentful/types";

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CONVERSION TAXONOMY  —  the one place worth your judgement.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Every CTA click fires ONE GA4 event and ONE Meta Pixel event. The mapping
 * below decides which. This is a real business decision, not boilerplate:
 *
 *   • Which actions count as HARD conversions (a call, an e-mail) vs SOFT
 *     signals (viewing the map, opening Facebook)? Hard conversions are what
 *     you'll import into Google Ads / optimize the Meta campaign toward.
 *   • Meta Pixel STANDARD events (Contact, Lead, FindLocation…) are recognised
 *     by Meta's optimisation; custom events (trackCustom) are not, but give you
 *     finer reporting. Choose per action.
 *
 * The defaults below are a sensible starting point for a plumbing shop whose
 * primary goal is phone calls. Adjust the CONVERSION_MAP to match the
 * conversion actions you create in Google Ads and Meta Events Manager.
 * A CTA may also override its GA4 event name from Contentful via `eventName`.
 */

export interface ConversionMapping {
  /** GA4 event name (snake_case). Mark as a Key Event in GA4 if it's a conversion. */
  ga4: string;
  /** Meta Pixel event name. */
  pixel: string;
  /** true → fbq("trackCustom", …); false → fbq("track", …) standard event. */
  pixelCustom?: boolean;
  /** Whether this is a primary (hard) conversion — handy for filtering/reporting. */
  isConversion: boolean;
}

const CONVERSION_MAP: Record<CtaType, ConversionMapping> = {
  call: { ga4: "click_to_call", pixel: "Contact", isConversion: true },
  email: { ga4: "click_to_email", pixel: "Contact", isConversion: true },
  navigate: { ga4: "get_directions", pixel: "FindLocation", isConversion: true },
  map: { ga4: "view_map", pixel: "FindLocation", isConversion: false },
  facebook: { ga4: "social_click", pixel: "SocialClick", pixelCustom: true, isConversion: false },
  link: { ga4: "cta_click", pixel: "CTAClick", pixelCustom: true, isConversion: false },
  anchor: { ga4: "cta_click", pixel: "CTAClick", pixelCustom: true, isConversion: false },
};

/** Resolve the conversion mapping for a CTA. */
export function conversionForCta(cta: CtaData): ConversionMapping {
  const base = CONVERSION_MAP[cta.type] ?? CONVERSION_MAP.link;
  return cta.eventName ? { ...base, ga4: cta.eventName } : base;
}

/**
 * Fire the GA4 + Meta Pixel events for a CTA click. Safe to call before the
 * tags exist (optional chaining) and before consent (Consent Mode buffers).
 */
export function trackCta(cta: CtaData): void {
  if (typeof window === "undefined") return;
  const m = conversionForCta(cta);
  const params = { cta_label: cta.label, cta_type: cta.type, cta_value: cta.value };

  window.gtag?.("event", m.ga4, params);
  window.fbq?.(m.pixelCustom ? "trackCustom" : "track", m.pixel, {
    content_name: cta.label,
    cta_type: cta.type,
  });
}
