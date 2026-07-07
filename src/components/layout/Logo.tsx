import Link from "next/link";

/**
 * Text-based logo matching the brand: "instal" in crimson, "Hampl" in navy,
 * with the royal-blue square figure mark. Replace with the real /public/logo
 * SVG when available — keep the same colors (see globals.css tokens).
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" aria-label="Instalatérství Hampl – úvodní stránka" className={`flex items-center gap-2 ${className}`}>
      <span className="flex size-9 items-center justify-center rounded-md bg-brand text-white">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="6" r="3" />
          <path d="M4 20a8 8 0 0 1 16 0z" />
        </svg>
      </span>
      <span className="text-xl font-extrabold tracking-tight">
        <span className="text-accent">instal</span>
        <span className="text-brand-dark">Hampl</span>
      </span>
    </Link>
  );
}
