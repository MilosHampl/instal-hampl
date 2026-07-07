"use client";

import Link from "next/link";
import type { CtaData } from "@/lib/contentful/types";
import { trackCta } from "@/lib/analytics/events";
import { mapsDirectionsUrl, siteConfig } from "@/lib/site-config";
import { Icon } from "./Icon";

/**
 * The site's single conversion primitive. Resolves the correct href for the CTA
 * `type` (tel: / mailto: / Facebook / Maps directions / route / anchor), fires
 * the mapped GA4 + Meta Pixel events on click, and renders in the shared button
 * idiom (press micro-interaction, hover, arrow-nudge) borrowed from tryride.
 */

interface Resolved {
  href: string;
  external: boolean;
  icon?: string;
}

function resolve(cta: CtaData): Resolved {
  switch (cta.type) {
    case "call":
      return { href: `tel:${(cta.value || siteConfig.contact.phone).replace(/\s/g, "")}`, external: true, icon: "phone" };
    case "email":
      return { href: `mailto:${cta.value || siteConfig.contact.email}`, external: true, icon: "mail" };
    case "facebook":
      return { href: cta.value || siteConfig.social.facebook, external: true, icon: "facebook" };
    case "navigate":
      return { href: cta.value || mapsDirectionsUrl(), external: true, icon: "navigate" };
    case "map":
      return { href: cta.value || "#mapa", external: false, icon: "map" };
    case "anchor":
      return { href: cta.value || "#", external: false };
    case "link":
    default: {
      const v = cta.value || "/";
      return { href: v, external: /^https?:\/\//.test(v), icon: undefined };
    }
  }
}

const styles: Record<NonNullable<CtaData["style"]>, string> = {
  primary: "bg-accent text-white hover:bg-accent-dark shadow-sm shadow-accent/20",
  secondary: "bg-brand text-white hover:bg-brand-dark shadow-sm",
  ghost: "border border-current/20 bg-transparent hover:bg-current/5",
};

const sizes = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function CtaButton({
  cta,
  className = "",
  fullWidth = false,
  size = "lg",
}: {
  cta: CtaData;
  className?: string;
  fullWidth?: boolean;
  size?: keyof typeof sizes;
}) {
  const { href, external, icon } = resolve(cta);
  const style = styles[cta.style ?? "secondary"];
  const isLink = cta.type === "link" && !external;
  const classes = `group/cta inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent font-semibold transition-all active:translate-y-px focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-brand/40 ${style} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`.trim();

  const inner = (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span>{cta.label}</span>
      {isLink && <Icon name="arrow" size={16} className="transition-transform group-hover/cta:translate-x-0.5" />}
    </>
  );

  // Internal app routes use next/link for client-side navigation & prefetch.
  if (!external && href.startsWith("/")) {
    return (
      <Link href={href} className={classes} onClick={() => trackCta(cta)}>
        {inner}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      onClick={() => trackCta(cta)}
      {...(external && href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {inner}
    </a>
  );
}
