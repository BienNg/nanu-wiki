import { parseLinks } from "@/lib/links";
import { DocLink } from "./DocLink";

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

/** Text with `[shown](target)` links to other pages and sections (see lib/links). */
function Linked({ text }: { text: string }) {
  const parts = parseLinks(text);
  if (parts.length === 1 && typeof parts[0] === "string") return parts[0];
  return parts.map((p, i) =>
    typeof p === "string" ? (
      p
    ) : (
      <DocLink key={i} area={p.area} page={p.page} anchor={p.anchor}>
        {p.text}
      </DocLink>
    ),
  );
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
