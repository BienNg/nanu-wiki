import { parseLinks } from "@/lib/links";
import { DocLink } from "./DocLink";
import { Icon } from "./Icon";

/** Bilingual text. German first, Vietnamese in italics underneath (`block`)
 *  or after a middle dot (`inline`). The DE+VI / DE / VI toggle hides
 *  either part through CSS classes on <html>. */
export function Bi({ de, vi, inline = false }: { de: string; vi?: string | null; inline?: boolean }) {
  return (
    <>
      <span className="de">
        <Linked text={de} />
      </span>
      {vi ? (
        <span className={inline ? "vs" : "vi"}>
          <Linked text={vi} />
        </span>
      ) : null}
    </>
  );
}

/** Text with `[shown](target)` links to other pages, sections and websites (see lib/links). */
function Linked({ text }: { text: string }) {
  const parts = parseLinks(text);
  if (parts.length === 1 && typeof parts[0] === "string") return parts[0];
  return parts.map((p, i) =>
    typeof p === "string" ? (
      p
    ) : "url" in p ? (
      <a
        key={i}
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-md border border-accent/25 bg-accent/10 px-1.5 py-px align-baseline font-medium text-accent-dark no-underline transition-colors hover:border-accent/50 hover:bg-accent/15"
      >
        {p.text}
        <Icon name="external" size={13} strokeWidth={2.2} className="flex-none" />
      </a>
    ) : (
      <DocLink key={i} area={p.area} page={p.page} anchor={p.anchor}>
        {p.text}
      </DocLink>
    ),
  );
}

/** Tooltip text: one language (a name, a note) or German plus Vietnamese. */
export type TipText = string | { de: string; vi?: string | null };

/**
 * Tooltip attributes, spread onto any element: `<button {...tip("Entfernen", "Bỏ gán")}>`.
 * German plus Vietnamese becomes data-tip-de / data-tip-vi, and the TooltipLayer shows the language
 * picked in the DE+VI / DE / VI toggle (both on two lines in DE+VI). One language stays a plain title.
 */
export function tip(text: TipText | null | undefined, vi?: string | null): { title?: string; "data-tip-de"?: string; "data-tip-vi"?: string } {
  if (text == null) return {};
  const de = typeof text === "string" ? text : text.de;
  const viText = typeof text === "string" ? vi : text.vi;
  return viText ? { "data-tip-de": de, "data-tip-vi": viText } : { title: de };
}

/** For short UI labels: shows only one language (DE in DE+VI mode). */
export function Label({ de, vi }: { de: string; vi: string }) {
  return (
    <>
      <span className="dx">{de}</span>
      <span className="vx">{vi}</span>
    </>
  );
}
