"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";

/**
 * Live "Otevřeno / Zavřeno" pill computed in Europe/Prague time from the config
 * opening hours. A strong trust + conversion signal for a physical shop ("open
 * now → call/visit"). Renders after mount to avoid SSR/timezone hydration drift.
 */

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAY_CS: Record<string, string> = {
  Monday: "Po", Tuesday: "Út", Wednesday: "St", Thursday: "Čt", Friday: "Pá", Saturday: "So", Sunday: "Ne",
};

type Status = { open: boolean; label: string; detail: string };

function computeStatus(): Status {
  // Current weekday + minutes-since-midnight in Prague.
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Prague",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(new Date());
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Monday";
  const hh = Number(parts.find((p) => p.type === "hour")?.value ?? "0");
  const mm = Number(parts.find((p) => p.type === "minute")?.value ?? "0");
  const now = hh * 60 + mm;
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));

  // Open right now?
  for (const h of siteConfig.openingHours) {
    if ((h.days as readonly string[]).includes(weekday) && now >= toMin(h.opens) && now < toMin(h.closes)) {
      return { open: true, label: "Otevřeno", detail: `zavíráme v ${h.closes}` };
    }
  }

  // Find the next opening within the next 7 days.
  const startIdx = DAYS.indexOf(weekday);
  for (let d = 0; d < 8; d++) {
    const day = DAYS[(startIdx + d) % 7];
    const intervals = siteConfig.openingHours
      .filter((h) => (h.days as readonly string[]).includes(day))
      .filter((h) => d > 0 || toMin(h.opens) > now)
      .sort((a, b) => toMin(a.opens) - toMin(b.opens));
    if (intervals.length) {
      const when = d === 0 ? "dnes" : d === 1 ? "zítra" : DAY_CS[day];
      return { open: false, label: "Zavřeno", detail: `otevíráme ${when} v ${intervals[0].opens}` };
    }
  }
  return { open: false, label: "Zavřeno", detail: "" };
}

export function OpenStatus({ className = "", showDetail = true }: { className?: string; showDetail?: boolean }) {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time compute of current time on mount
    setStatus(computeStatus());
    const id = setInterval(() => setStatus(computeStatus()), 60_000);
    return () => clearInterval(id);
  }, []);

  if (!status) {
    // Neutral placeholder to reserve space and avoid layout shift / hydration mismatch.
    return <span className={`inline-flex items-center gap-2 ${className}`} aria-hidden />;
  }

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex size-2.5">
        {status.open && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        )}
        <span className={`relative inline-flex size-2.5 rounded-full ${status.open ? "bg-emerald-400" : "bg-amber-400"}`} />
      </span>
      <span className="font-semibold">{status.label}</span>
      {showDetail && status.detail && <span className="opacity-70">· {status.detail}</span>}
    </span>
  );
}
