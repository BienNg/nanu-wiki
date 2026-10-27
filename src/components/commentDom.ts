import type { CommentAnchor } from "@/lib/types";

// DOM helpers for comments: turn a selection into an anchor, and find an anchor's words again.

const elementOf = (n: Node | null) => (n instanceof Element ? n : n?.parentElement ?? null);
const squash = (t: string) => t.replace(/\s+/g, " ");

/** Turns a text selection inside one `[data-block]` into an anchor (quote + a bit of text around it). */
export function anchorFromRange(range: Range, root: HTMLElement): CommentAnchor {
  const start = elementOf(range.startContainer);
  const block = start?.closest<HTMLElement>("[data-block]");
  if (!block || !root.contains(block) || block !== elementOf(range.endContainer)?.closest("[data-block]")) return null;
  if (start?.closest("input, textarea, button")) return null;
  const exact = squash(range.toString()).trim();
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
    prefix: squash(before.toString()).slice(-32),
    suffix: squash(after.toString()).slice(0, 32),
    context: squash(scope.textContent ?? "").trim().slice(0, 600),
  };
}

/** Finds the quoted words again inside a block (prefix + exact first, then exact alone). */
export function rangeForAnchor(block: HTMLElement, a: NonNullable<CommentAnchor>) {
  if (!a.exact) return null;
  const scope = (a.field && block.querySelector<HTMLElement>(a.field === "de" ? ".de" : ".vi, .vs")) || block;
  const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT);
  const nodes: { node: Text; from: number }[] = [];
  let text = "";
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    nodes.push({ node: n as Text, from: text.length });
    text += n.textContent;
  }
  let at = a.prefix ? text.indexOf(a.prefix + a.exact) : -1;
  at = at >= 0 ? at + (a.prefix?.length ?? 0) : text.indexOf(a.exact);
  if (at < 0) return null;
  const locate = (pos: number) => {
    const hit = [...nodes].reverse().find((n) => n.from <= pos) ?? nodes[0];
    return { node: hit.node, offset: Math.min(pos - hit.from, hit.node.length) };
  };
  const s = locate(at);
  const e = locate(at + a.exact.length);
  const range = document.createRange();
  range.setStart(s.node, s.offset);
  range.setEnd(e.node, e.offset);
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
