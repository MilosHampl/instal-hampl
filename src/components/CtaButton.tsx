"use client";

import Link from "next/link";
import type { CtaData } from "@/lib/contentful/types";
import { trackCta } from "@/lib/analytics/events";
import { mapsDirectionsUrl, siteConfig } from "@/lib/site-config";
import { Icon } from "./Icon";

/**
 * The site's single conversion primitive. Given a CTA from Contentful (or a
 * fallback), it:
 *   1. resolves the correct href for its `type` (tel:, mailto:, FB, Google
 *      Maps directions, internal route, in-page anchor),
 *   2. fires the mapped GA4 + Meta Pixel events on click (see analytics/events),
 *   3. renders a matching icon and style.
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
  primary: "bg-accent text-white hover:bg-accent-dark shadow-sm",
  secondary: "bg-brand text-white hover:bg-brand-dark shadow-sm",
  ghost: "border border-current/25 text-current hover:bg-current/5",
};

export function CtaButton({
  cta,
  className = "",
  fullWidth = false,
}: {
  cta: CtaData;
  className?: string;
  fullWidth?: boolean;
}) {
  const { href, external, icon } = resolve(cta);
  const style = styles[cta.style ?? "secondary"];
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${style} ${fullWidth ? "w-full" : ""} ${className}`.trim();

  const inner = (
    <>
      {icon && <Icon name={icon} size={18} />}
      <span>{cta.label}</span>
      {cta.type === "link" && !external && <Icon name="arrow" size={16} />}
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
      {...(external && href.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {inner}
    </a>
  );
}
