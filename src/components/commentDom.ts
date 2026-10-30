import type { CommentAnchor } from "@/lib/types";
import { locate, strip } from "@/lib/anchorMatch";

// DOM helpers for comments: turn a selection into an anchor, and find an anchor's words again.

const elementOf = (n: Node | null) => (n instanceof Element ? n : n?.parentElement ?? null);
const squash = (t: string) => t.replace(/\s+/g, " ");

/** Labels and buttons the app adds around content ("Hinweis:", "Kopieren" …) are not part of a quote. */
const UI_TEXT = "[data-ui-text], button";

/** A range's text without app UI, so the server can find it again in the page content. */
function textOf(range: Range) {
  const fragment = range.cloneContents();
  fragment.querySelectorAll(UI_TEXT).forEach((el) => el.remove());
  return fragment.textContent ?? "";
}

/** Turns a text selection inside one `[data-block]` into an anchor (quote + a bit of text around it). */
export function anchorFromRange(range: Range, root: HTMLElement): CommentAnchor {
  const start = elementOf(range.startContainer);
  const block = start?.closest<HTMLElement>("[data-block]");
  if (!block || !root.contains(block) || block !== elementOf(range.endContainer)?.closest("[data-block]")) return null;
  if (start?.closest("input, textarea, button")) return null;
  const exact = squash(textOf(range)).trim();
  if (!exact) return null;

  // DE or VI part of a bilingual text (see Bi); a selection across both belongs to the whole block.
  const lang = elementOf(range.commonAncestorContainer)?.closest<HTMLElement>(".de, .vi, .vs");
  const scope = lang && block.contains(lang) ? lang : block;
  const before = document.createRange();
  before.selectNodeContents(scope);
  before.setEnd(range.startContainer, range.startOffset);
  const after = document.createRange();
  after.selectNodeContents(scope);
  after.setStart(range.endContainer, range.endOffset);

  return {
    block: block.dataset.block!,
    field: lang ? (lang.classList.contains("de") ? "de" : "vi") : undefined,
    exact: exact.slice(0, 500),
    prefix: squash(textOf(before)).slice(-32),
    suffix: squash(textOf(after)).slice(0, 32),
    context: squash(scope.textContent ?? "").trim().slice(0, 600),
    tab: start?.closest<HTMLElement>("[data-tab]")?.dataset.tab,
  };
}

/** Asks the block to show the part a comment is on (e.g. switch to its tab, see ConversationTabs).
 *  True if it changed what is shown; the new content is there after the next render. */
export function revealAnchor(block: HTMLElement, a: NonNullable<CommentAnchor>) {
  return !block.dispatchEvent(new CustomEvent("comment-reveal", { detail: a, cancelable: true }));
}

/** Content inside a block changed without a resize (another tab): comments find their words again. */
export function contentChanged(el: HTMLElement) {
  el.dispatchEvent(new Event("comment-content", { bubbles: true }));
}

/** Finds the quoted words again inside a block. Whitespace is ignored (see anchorMatch), and a quote in
 *  one language is searched in all of that language's parts of the block (every list item, step …). */
export function rangeForAnchor(block: HTMLElement, a: NonNullable<CommentAnchor>) {
  if (!a.exact) return null;
  const parts = a.field ? [...block.querySelectorAll<HTMLElement>(a.field === "de" ? ".de" : ".vi, .vs")] : [];
  const nodes: { node: Text; from: number }[] = [];
  let raw = "";
  for (const scope of parts.length ? parts : [block]) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.parentElement?.closest(UI_TEXT) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
    });
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      nodes.push({ node: n as Text, from: raw.length });
      raw += n.textContent;
    }
  }
  const { text, at } = strip(raw);
  const m = locate(text, a);
  if (!m) return null;
  // Back to positions in the real text nodes: start of the first kept character, end of the last one.
  const start = at[m.start];
  const end = at[m.end - 1] + 1;
  const s = nodes.findLast((n) => n.from <= start)!;
  const e = nodes.findLast((n) => n.from < end)!;
  const range = document.createRange();
  range.setStart(s.node, start - s.from);
  range.setEnd(e.node, end - e.from);
  return range;
}

/** The text position under the mouse, as a collapsed range (Chrome/Safari and Firefox APIs). */
export function caretAt(x: number, y: number): Range | null {
  const doc = document as Document & {
    caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
  };
  if (doc.caretPositionFromPoint) {
    const pos = doc.caretPositionFromPoint(x, y);
    if (!pos) return null;
    const r = document.createRange();
    r.setStart(pos.offsetNode, pos.offset);
    return r;
  }
  return document.caretRangeFromPoint?.(x, y) ?? null;
}
