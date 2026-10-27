/** Bilingual text. German first, Vietnamese in italics underneath (`block`)
 *  or after a middle dot (`inline`). The DE+VI / DE / VI toggle hides
 *  either part through CSS classes on <html>. */
export function Bi({ de, vi, inline = false }: { de: string; vi?: string | null; inline?: boolean }) {
  return (
    <>
      <span className="de">{de}</span>
      {vi ? <span className={inline ? "vs" : "vi"}>{vi}</span> : null}
    </>
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
