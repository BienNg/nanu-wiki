import { unstable_cache } from "next/cache";
import sharp from "sharp";
import { classImageUrl } from "@/lib/notion";

export const runtime = "nodejs";

/** Widths a smaller copy can be asked for: the picker thumbnail and the class info modal. */
const WIDTHS = new Set([96, 800]);

/**
 * The smaller copy as base64, kept in Next's data cache for an hour so that only the first view
 * downloads the multi-MB original from Notion. Null when the class has no image.
 */
const smallImage = unstable_cache(
  async (id: string, width: number): Promise<string | null> => {
    const url = await classImageUrl(id);
    if (!url) return null;
    const img = await fetch(url, { cache: "no-store" });
    if (!img.ok) return null;
    const small = await sharp(Buffer.from(await img.arrayBuffer()))
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    return small.toString("base64");
  },
  ["class-image-small", "v1"],
  { revalidate: 3600 },
);

/**
 * A class's marketing image, served from our own URL: Notion's file links expire after an hour.
 * Without `?w=` it is the original file (copied into Messenger at full quality). With `?w=96` or
 * `?w=800` it is a WebP copy at most that wide, for showing on screen; the originals are several MB.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{32,36}$/i.test(id)) return new Response("Not found", { status: 404 });
  const w = new URL(req.url).searchParams.get("w");
  const width = w === null ? null : Number(w);
  if (width !== null && !WIDTHS.has(width)) return new Response("Bad width", { status: 400 });
  try {
    if (width !== null) {
      const small = await smallImage(id.toLowerCase(), width);
      if (!small) return new Response("Not found", { status: 404 });
      return new Response(new Uint8Array(Buffer.from(small, "base64")), {
        headers: { "Content-Type": "image/webp", "Cache-Control": "private, max-age=3600" },
      });
    }
    const url = await classImageUrl(id);
    if (!url) return new Response("Not found", { status: 404 });
    const img = await fetch(url, { cache: "no-store" });
    if (!img.ok || !img.body) return new Response("Not found", { status: 404 });
    return new Response(img.body, {
      headers: {
        "Content-Type": img.headers.get("content-type") ?? "image/png",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (err) {
    console.error("[classes/image]", err);
    return new Response("Notion error", { status: 503 });
  }
}
