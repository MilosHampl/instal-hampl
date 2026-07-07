/**
 * GDPR / Czech cookie-law consent handling using Google Consent Mode v2.
 *
 * Strategy (chosen in setup): tags load immediately in a DENIED state so we
 * still get cookieless modeling pings, then upgrade to GRANTED when the user
 * accepts. This keeps ad attribution as strong as legally possible while
 * staying compliant.
 */

export const CONSENT_STORAGE_KEY = "ih_consent_v1";
export type ConsentValue = "granted" | "denied";

/** Read a previously stored decision. Returns null if the user hasn't chosen. */
export function readStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Persist and apply a consent decision to GA4 (Consent Mode) and Meta Pixel. */
export function applyConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* storage may be blocked — still update tags below */
  }

  // Google Consent Mode v2 update
  window.gtag?.("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });

  // Meta Pixel consent
  window.fbq?.("consent", value === "granted" ? "grant" : "revoke");
}
