import type { Block, CommentStatus, CommentTag } from "@/lib/types";

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
