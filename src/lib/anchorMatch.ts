// Finding a comment's quoted words again – the same rules on the server (page content) and in the
// browser (rendered text). Whitespace is ignored completely: a quote saved as "a b" must still match
// "a\nb", text across list items (rendered without a space) and text with different spacing.

/** Text without any whitespace, plus the position of each kept character in the original. */
export function strip(raw: string) {
  let text = "";
  const at: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    if (!/\s/.test(raw[i])) {
      text += raw[i];
      at.push(i);
    }
  }
  return { text, at };
}

export const squeeze = (s: string | undefined) => (s ?? "").replace(/\s+/g, "");

export type QuoteMatch = { start: number; end: number; score: number; count: number };

/** Best occurrence of the quote in `text` (already stripped). `score` = how many characters of the
 *  remembered text before and after it still match; `count` = how often the words occur at all. */
export function locate(text: string, a: { exact?: string; prefix?: string; suffix?: string }): QuoteMatch | null {
  const exact = squeeze(a.exact);
  if (!exact) return null;
  const prefix = squeeze(a.prefix);
  const suffix = squeeze(a.suffix);
  let best: QuoteMatch | null = null;
  let count = 0;
  for (let i = text.indexOf(exact); i >= 0; i = text.indexOf(exact, i + 1)) {
    count++;
    const end = i + exact.length;
    let p = 0;
    while (p < prefix.length && i - 1 - p >= 0 && text[i - 1 - p] === prefix[prefix.length - 1 - p]) p++;
    let s = 0;
    while (s < suffix.length && end + s < text.length && text[end + s] === suffix[s]) s++;
    if (!best || p + s > best.score) best = { start: i, end, score: p + s, count: 0 };
  }
  return best && { ...best, count };
}

/** Whether a match found outside the comment's own block can be trusted: some surrounding text
 *  still matches, the quote is long, or it is the only occurrence of a not-too-short quote. */
export function trustworthy(m: QuoteMatch, exact: string, totalCount: number) {
  const len = squeeze(exact).length;
  return m.score >= 8 || len >= 24 || (totalCount === 1 && len >= 10);
}

/** 0–1: how many words two texts share (Dice coefficient). For comments on a whole block. */
export function similarity(a: string, b: string) {
  const words = (t: string) => new Set(t.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []);
  const A = words(a);
  const B = words(b);
  if (!A.size || !B.size) return 0;
  let both = 0;
  for (const w of A) if (B.has(w)) both++;
  return (2 * both) / (A.size + B.size);
}
