import { classImageUrl } from "@/lib/notion";

/** A class's marketing image, served from our own URL: Notion's file links expire after an hour. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{32,36}$/i.test(id)) return new Response("Not found", { status: 404 });
  try {
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
