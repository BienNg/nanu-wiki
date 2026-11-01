// Links to another page or section inside content text: `[shown text](target)`.
//   [weiter unten](#jeden-tag)                              a section on the same page
//   [„Lehrkräfte begleiten“](student-support/lehrkraefte-begleiten)            another page
//   [„Kurs pausieren“](student-support/kurs-pausieren#regeln)                 a section on another page
// A section is a heading's id: its `anchor`, or else the slug of its German text (see headingId).

export type DocLinkTarget = { area?: string; page?: string; anchor?: string };
export type TextPart = string | ({ text: string } & DocLinkTarget);

const LINK = /\[([^\]]+)\]\(((?:[a-z0-9-]+\/[a-z0-9-]+)?(?:#[a-z0-9-]+)?)\)/g;

export function parseTarget(target: string): DocLinkTarget {
  const [path, anchor] = target.split("#");
  const [area, page] = path ? path.split("/") : [];
  return { area, page, anchor: anchor || undefined };
}

/** Splits text into plain strings and links. */
export function parseLinks(text: string): TextPart[] {
  if (!text.includes("](")) return [text];
  const out: TextPart[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK)) {
    if (!m[2]) continue;
    if (m.index > last) out.push(text.slice(last, m.index));
    out.push({ text: m[1], ...parseTarget(m[2]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** The text as readers see it, without link targets (for search, snippets and comment anchors). */
export function toPlain(text: string): string {
  return text.includes("](") ? text.replace(LINK, (all, shown: string, target: string) => (target ? shown : all)) : text;
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** The id of a heading on the page: its fixed `anchor` (stays when the heading is renamed), or a slug of the German text. */
export function headingId(h: { de: string; anchor?: string }) {
  return h.anchor ?? slugify(toPlain(h.de));
}
