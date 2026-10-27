import type { Block, CommentAnchor, CommentStatus, CommentTag } from "@/lib/types";
import { locate, similarity, strip, trustworthy, type QuoteMatch } from "@/lib/anchorMatch";

/** The key a comment uses to point at a block: the block's own `id`, or a short hash of its content.
 *  Editing a block without an `id` changes the key; its comments then show as "Stelle geändert". */
export function blockKey(b: Block) {
  if (b.id) return b.id;
  const text = JSON.stringify(b);
  let h = 0x811c9dc5; // FNV-1a
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return `b${(h >>> 0).toString(36)}`;
}

export const COMMENT_TAGS: { id: CommentTag; emoji: string; de: string; vi: string }[] = [
  { id: "unklar", emoji: "❓", de: "Unklar", vi: "Chưa rõ" },
  { id: "fehler", emoji: "⚠️", de: "Fehler", vi: "Sai" },
  { id: "veraltet", emoji: "🕒", de: "Veraltet", vi: "Lỗi thời" },
  { id: "idee", emoji: "💡", de: "Idee", vi: "Ý tưởng" },
  { id: "hilfreich", emoji: "👍", de: "Hilfreich", vi: "Hữu ích" },
];

export const COMMENT_STATUSES: { id: CommentStatus; de: string; vi: string }[] = [
  { id: "open", de: "Offen", vi: "Mở" },
  { id: "in_progress", de: "In Arbeit", vi: "Đang xử lý" },
  { id: "resolved", de: "Erledigt", vi: "Đã xong" },
  { id: "declined", de: "Abgelehnt", vi: "Không làm" },
];

export function tagInfo(tag: CommentTag | null) {
  return COMMENT_TAGS.find((t) => t.id === tag);
}

// ------------------------------------------------------------------ finding a comment's spot after edits
const NOT_TEXT = new Set(["type", "id", "tone", "url", "from", "ordered"]);

/** All readable text of a block, in reading order (DE and VI of each part, templates, messages …). */
export function blockText(b: Block): string {
  const out: string[] = [];
  const walk = (v: unknown, key?: string) => {
    if (typeof v === "string") {
      if (!key || !NOT_TEXT.has(key)) out.push(v);
    } else if (Array.isArray(v)) v.forEach((x) => walk(x));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, k);
  };
  walk(b);
  return out.join(" ").replace(/\s+/g, " ").trim();
}

/** Where a comment belongs on the current version of the page.
 *  - `block`: the key of the block it belongs to now (may differ from the saved one after an edit)
 *  - `moved`: it was re-attached to another block key
 *  - detached: its block and words are gone. */
export type ResolvedAnchor = { detached: false; block: string; moved: boolean } | { detached: true };

export function resolveAnchor(body: Block[], anchor: NonNullable<CommentAnchor>): ResolvedAnchor {
  const keys = body.map(blockKey);
  const own = keys.indexOf(anchor.block);

  if (anchor.exact) {
    const texts = body.map((b) => strip(blockText(b)).text);
    if (own >= 0 && locate(texts[own], anchor)) return { detached: false, block: anchor.block, moved: false };
    // The block changed: look for the words (and the text around them) anywhere on the page.
    let best: { i: number; m: QuoteMatch } | null = null;
    let total = 0;
    for (let i = 0; i < texts.length; i++) {
      const m = locate(texts[i], anchor);
      if (!m) continue;
      total += m.count;
      if (!best || m.score > best.m.score) best = { i, m };
    }
    return best && trustworthy(best.m, anchor.exact, total)
      ? { detached: false, block: keys[best.i], moved: keys[best.i] !== anchor.block }
      : { detached: true };
  }

  if (own >= 0) return { detached: false, block: anchor.block, moved: false };
  // A comment on a whole block that was edited: the block whose text is most like the saved one.
  if (!anchor.context) return { detached: true };
  let bestI = -1;
  let bestScore = 0;
  body.forEach((b, i) => {
    const score = similarity(anchor.context!, blockText(b));
    if (score > bestScore) [bestI, bestScore] = [i, score];
  });
  return bestScore >= 0.5 ? { detached: false, block: keys[bestI], moved: true } : { detached: true };
}
