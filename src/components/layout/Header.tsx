"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { CtaButton } from "@/components/CtaButton";
import { Icon } from "@/components/Icon";
import { siteConfig } from "@/lib/site-config";
import type { NavItem } from "@/lib/contentful/types";

const callCta = { label: siteConfig.contact.phoneDisplay, type: "call" as const, style: "primary" as const };

export function Header({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Hlavní navigace" className="hidden items-center gap-6 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition hover:text-brand ${active ? "text-brand" : "text-ink"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <CtaButton cta={callCta} />
          </div>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-lg border border-line text-ink md:hidden"
            aria-label="Otevřít menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? "arrow" : "map"} size={20} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav aria-label="Mobilní navigace" className="border-t border-line bg-surface md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 text-sm font-medium text-ink last:border-0"
              >
                {item.label}
              </Link>
            ))}
            <div className="py-3">
              <CtaButton cta={callCta} fullWidth />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
