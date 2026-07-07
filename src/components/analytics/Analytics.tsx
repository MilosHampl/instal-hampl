"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

/**
 * Loads GA4 (gtag) and the Meta Pixel with Google Consent Mode v2 defaults set
 * to DENIED, and revokes the Pixel until consent — the ConsentBanner upgrades
 * both on accept. Also fires page_view / PageView on client-side navigation
 * (App Router doesn't emit a full page load between routes).
 *
 * Renders nothing if the corresponding env var is missing, so local dev and
 * previews stay clean.
 */
export function Analytics() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  useEffect(() => {
    // Skip the initial load — the tags fire their own first page_view.
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    if (GA_ID) {
      window.gtag?.("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  return (
    <>
      {GA_ID && (
        <>
          {/* Consent-default + config in one ordered script: the 'default' denied
              state is pushed to dataLayer before 'config', so the first page_view
              respects consent. gtag.js (loaded next) then processes them in order. */}
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  analytics_storage: 'denied',
                  wait_for_update: 500
                });
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { anonymize_ip: true });
              `,
            }}
          />
          <Script
            id="ga-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          />
        </>
      )}

      {PIXEL_ID && (
        <Script
          id="fb-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('consent', 'revoke');
              fbq('init', '${PIXEL_ID}');
              fbq('track', 'PageView');
            `,
          }}
        />
      )}
    </>
  );
}
