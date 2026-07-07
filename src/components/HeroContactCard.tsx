"use client";

import Image from "next/image";
import { Icon } from "./Icon";
import { OpenStatus } from "./OpenStatus";
import { trackCta } from "@/lib/analytics/events";
import { mapsDirectionsUrl, siteConfig } from "@/lib/site-config";
import type { ImageData } from "@/lib/contentful/types";

/**
 * Hero "product mock" replacement: a bento conversion cluster. Instead of a
 * decorative stock photo, the hero's second column is a call card + hours +
 * navigate — the actions we want ad traffic to take, one tap away. Uses the
 * tryride "blurred gradient blob behind a card" signature treatment.
 */
export function HeroContactCard({ image }: { image?: ImageData }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -inset-4 -z-10 rounded-[2.2rem] bg-linear-to-br from-brand/25 to-brand-2/25 blur-2xl"
      />
      <div className="grid gap-3">
        {/* Primary: tap-to-call */}
        <a
          href={`tel:${siteConfig.contact.phone}`}
          onClick={() => trackCta({ label: "Hero – zavolat", type: "call" })}
          className="group relative overflow-hidden rounded-3xl bg-linear-to-br from-brand to-brand-2 p-6 text-white shadow-lift transition active:translate-y-px"
        >
          <span aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_100%_at_85%_0%,rgba(255,255,255,0.28),transparent)]" />
          <span className="relative flex items-center gap-2 text-sm font-medium text-white/85">
            <Icon name="phone" size={16} /> Zavolejte nám
          </span>
          <span className="relative mt-1 block text-3xl font-extrabold tracking-tight sm:text-4xl">
            {siteConfig.contact.phoneDisplay}
          </span>
          <OpenStatus className="relative mt-3 text-sm text-white/90" />
        </a>

        <div className="grid grid-cols-2 gap-3">
          {/* Hours */}
          <div className="rounded-2xl border border-line bg-surface p-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon name="clock" size={18} />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">Otevírací doba</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Po–Pá 8–12, 13–16
              <br />
              So–Ne zavřeno
            </p>
          </div>

          {/* Navigate */}
          <a
            href={mapsDirectionsUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCta({ label: "Hero – navigovat", type: "navigate" })}
            className="group rounded-2xl border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-card"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <Icon name="pin" size={18} />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">Nymburk</p>
            <p className="mt-1 text-xs text-muted">{siteConfig.address.street}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand">
              Navigovat
              <Icon name="arrow" size={13} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>

        {image && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-line">
            <Image src={image.url} alt={image.alt} fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
