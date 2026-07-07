"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { applyConsent, readStoredConsent, type ConsentValue } from "@/lib/analytics/consent";

/**
 * Minimal GDPR cookie-consent banner. On mount it re-applies a stored decision
 * (so returning visitors keep tracking on/off) and otherwise shows the banner.
 * Accepting/declining updates Consent Mode + the Pixel via applyConsent().
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // One-shot read of the persisted decision on mount (client-only storage).
    const stored = readStoredConsent();
    if (stored) applyConsent(stored);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time init from localStorage
    setVisible(!stored);
  }, []);

  const decide = (value: ConsentValue) => {
    applyConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Souhlas s cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 px-4 py-4 shadow-[0_-8px_24px_rgba(20,34,79,0.08)] backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {'Používáme cookies pro měření návštěvnosti a výkonu reklam. Kliknutím na „Přijmout" nám pomáháte web zlepšovat. '}
          <Link href="/ochrana-osobnich-udaju" className="text-brand underline">
            Více informací
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-lg border border-line px-4 py-2 text-sm font-medium text-ink transition hover:bg-surface-alt"
          >
            Odmítnout
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            Přijmout
          </button>
        </div>
      </div>
    </div>
  );
}
