import Link from "next/link";

/**
 * Brand logo: the vector mark (red head + navy shoulders) + "instalHampl"
 * wordmark ("instal" crimson, "Hampl" navy). Colors come from the theme tokens
 * so it stays in sync with globals.css. Standalone assets: /public/logo.svg,
 * /public/logo-mark.svg.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Instalatérství Hampl – úvodní stránka"
      className={`flex items-center gap-2.5 ${className}`}
    >
      <svg width="34" height="34" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
        <rect x="6" y="27" width="36" height="15" rx="3" fill="var(--color-brand)" />
        <circle cx="24" cy="18" r="10" fill="var(--color-accent)" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-accent">instal</span>
        <span className="text-brand-dark">Hampl</span>
      </span>
    </Link>
  );
}
