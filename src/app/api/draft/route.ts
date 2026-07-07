import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

/**
 * Draft-mode preview. Set the "Preview URL" in Contentful to:
 *   https://<domain>/api/draft?secret=CONTENTFUL_PREVIEW_SECRET&slug={entry.fields.slug}
 * Enables Next Draft Mode (bypasses cache, uses the Preview API) and redirects
 * to the page so editors see unpublished changes.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug") || "/";

  if (!process.env.CONTENTFUL_PREVIEW_SECRET || secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response("Invalid token", { status: 401 });
  }

  (await draftMode()).enable();
  redirect(slug.startsWith("/") ? slug : `/${slug}`);
}
