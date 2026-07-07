import { createClient, type ContentfulClientApi } from "contentful";

/**
 * Contentful Content Delivery / Preview clients.
 *
 * The site is designed to build and render even when Contentful is NOT yet
 * configured (e.g. first deploy, CI, local dev without secrets). In that case
 * `isContentfulConfigured` is false and the query layer falls back to the
 * static default content in `fallback.ts`. This keeps the starter deployable
 * on day one and lets editors fill the CMS incrementally.
 */

const space = process.env.CONTENTFUL_SPACE_ID;
const environment = process.env.CONTENTFUL_ENVIRONMENT || "master";
const deliveryToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
const previewToken = process.env.CONTENTFUL_PREVIEW_TOKEN;

export const isContentfulConfigured = Boolean(space && deliveryToken);

let deliveryClient: ContentfulClientApi<undefined> | null = null;
let previewClient: ContentfulClientApi<undefined> | null = null;

export function getClient(preview = false): ContentfulClientApi<undefined> | null {
  if (!isContentfulConfigured) return null;

  if (preview) {
    if (!previewToken) return getClient(false);
    if (!previewClient) {
      previewClient = createClient({
        space: space!,
        environment,
        accessToken: previewToken,
        host: "preview.contentful.com",
      });
    }
    return previewClient;
  }

  if (!deliveryClient) {
    deliveryClient = createClient({
      space: space!,
      environment,
      accessToken: deliveryToken!,
    });
  }
  return deliveryClient;
}
