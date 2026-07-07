"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";

/**
 * No-backend lead form: composes a mailto: on submit (works on any host with
 * zero infra) and fires a generate_lead / Lead conversion. Swap the onSubmit
 * body for a POST to an API route or a service like Formspree/Resend when you
 * want server-side delivery.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const contact = String(data.get("contact") ?? "");
    const message = String(data.get("message") ?? "");

    // Soft conversion signal.
    if (typeof window !== "undefined") {
      window.gtag?.("event", "generate_lead", { method: "contact_form" });
      window.fbq?.("track", "Lead");
    }

    const subject = encodeURIComponent("Poptávka z webu");
    const body = encodeURIComponent(`Jméno: ${name}\nKontakt: ${contact}\n\n${message}`);
    window.location.href = `mailto:${siteConfig.contact.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-ink">Jméno</label>
        <input id="name" name="name" required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <div>
        <label htmlFor="contact" className="mb-1 block text-sm font-medium text-ink">Telefon nebo e-mail</label>
        <input id="contact" name="contact" required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <div>
        <label htmlFor="message" className="mb-1 block text-sm font-medium text-ink">Zpráva</label>
        <textarea id="message" name="message" rows={4} required className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-brand" />
      </div>
      <button type="submit" className="w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-dark">
        Odeslat poptávku
      </button>
      {sent && <p className="text-sm text-brand">Otevřeli jsme váš e-mailový klient s předvyplněnou zprávou.</p>}
    </form>
  );
}
