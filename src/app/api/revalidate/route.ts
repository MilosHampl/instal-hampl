import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { CONTENTFUL_TAG } from "@/lib/contentful/queries";

/**
 * Contentful webhook target. Configure a webhook (Publish + Unpublish events)
 * pointing at:  POST https://<domain>/api/revalidate?secret=CONTENTFUL_REVALIDATE_SECRET
 * (or send the secret in an `x-webhook-secret` header). Busts the whole
 * `contentful` cache tag so edits go live within seconds.
 */
export async function POST(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get("secret") || req.headers.get("x-webhook-secret");
  const expected = process.env.CONTENTFUL_REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ ok: false, message: "Invalid or missing secret" }, { status: 401 });
  }

  // { expire: 0 } evicts immediately (Next 16 requires the 2nd arg) — right for
  // a publish webhook where visitors should see fresh content ASAP.
  revalidateTag(CONTENTFUL_TAG, { expire: 0 });
  return NextResponse.json({ ok: true, revalidated: true, tag: CONTENTFUL_TAG });
}
