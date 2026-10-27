"use client";

import { useState } from "react";
import type { Lang } from "@/lib/types";

const OPTIONS: { value: Lang; label: string }[] = [
  { value: "both", label: "DE+VI" },
  { value: "de", label: "DE" },
  { value: "vi", label: "VI" },
];

/** Switches language instantly by swapping the class on <html>;
 *  the choice is remembered in a cookie for server rendering. */
export function LangToggle({ initial }: { initial: Lang }) {
  const [lang, setLang] = useState<Lang>(initial);

  function choose(next: Lang) {
    setLang(next);
    const html = document.documentElement;
    html.classList.remove("lang-both", "lang-de", "lang-vi");
    html.classList.add(`lang-${next}`);
    html.lang = next === "vi" ? "vi" : "de";
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <div role="group" aria-label="Sprache · Ngôn ngữ" className="flex gap-0.5 rounded-[7px] bg-chip p-0.5">
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={lang === o.value}
          onClick={() => choose(o.value)}
          className="h-7 rounded-[5px] px-2.5 text-xs font-medium text-[#4A4F57] aria-pressed:bg-accent-soft aria-pressed:text-accent-dark"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
