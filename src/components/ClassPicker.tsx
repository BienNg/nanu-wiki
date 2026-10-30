"use client";

import { useEffect, useState } from "react";
import { MODE_SHORT, fits, imageSrc, shortDate, type UpcomingClass } from "@/lib/classes";
import type { Selection } from "@/lib/dialogue";
import { Label } from "./Bi";

type State = { classes: UpcomingClass[] } | { error: string } | null;

// One request per page view, shared by every Messenger example that builds a message from classes.
let request: Promise<State> | null = null;
function load(): Promise<State> {
  request ??= fetch("/api/classes")
    .then(async (r) => {
      const json = await r.json();
      return r.ok ? { classes: json as UpcomingClass[] } : { error: json.error ?? "Fehler" };
    })
    .catch(() => ({ error: "Kurse konnten nicht geladen werden." }));
  return request;
}

/** Upcoming classes from Notion; null while loading. */
export function useUpcomingClasses() {
  const [state, setState] = useState<State>(null);
  useEffect(() => {
    let live = true;
    load().then((s) => live && setState(s));
    return () => {
      live = false;
    };
  }, []);
  return state;
}

/** The list of upcoming classes under the selectors. Classes that fit the chosen level and place come first and are
 *  ticked automatically; staff can tick others by hand. */
export function ClassPicker({
  state,
  sel,
  picked,
  onChange,
}: {
  state: State;
  sel: Selection;
  picked: string[];
  onChange: (ids: string[]) => void;
}) {
  const [all, setAll] = useState(false);

  if (!state || "error" in state) {
    return (
      <div className="border-b border-line bg-side px-3.5 py-2 text-[12px] text-muted">
        {!state ? (
          <Label de="Kurse werden aus Notion geladen …" vi="Đang tải lớp từ Notion …" />
        ) : (
          <span className="text-warn">
            <Label de={state.error} vi="Không tải được lớp từ Notion." />
          </span>
        )}
      </div>
    );
  }

  const matching = state.classes.filter((c) => fits(c, sel.level, sel.place));
  const others = state.classes.filter((c) => !fits(c, sel.level, sel.place));
  // Ticked classes stay visible even when they don't fit.
  const shown = all ? [...matching, ...others] : [...matching, ...others.filter((c) => picked.includes(c.id))];
  const toggle = (id: string) => onChange(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);

  return (
    <div className="border-b border-line bg-side px-3.5 py-2 text-[12px]">
      <div className="mb-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="font-semibold text-muted">
          <Label de="Kurse" vi="Lớp học" />
        </span>
        <span className="text-faint">
          <Label de={`${picked.length} gewählt`} vi={`đã chọn ${picked.length}`} />
        </span>
        {others.length > 0 && (
          <button type="button" onClick={() => setAll(!all)} className="ml-auto font-medium text-accent hover:underline">
            {all ? (
              <Label de="Nur passende zeigen" vi="Chỉ hiện lớp phù hợp" />
            ) : (
              <Label de={`Alle ${state.classes.length} Kurse zeigen`} vi={`Hiện tất cả ${state.classes.length} lớp`} />
            )}
          </button>
        )}
      </div>
      {shown.length === 0 ? (
        <p className="m-0 text-muted">
          <Label de="Kein passender Kurs in Notion." vi="Chưa có lớp phù hợp trong Notion." />
        </p>
      ) : (
        <ul className="m-0 grid max-h-[220px] list-none grid-cols-1 gap-1 overflow-y-auto p-0 sm:grid-cols-2">
          {shown.map((c) => {
            const on = picked.includes(c.id);
            return (
              <li key={c.id}>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1 transition-colors ${
                    on ? "border-accent bg-white" : "border-line bg-white/60 hover:bg-white"
                  }`}
                >
                  <input type="checkbox" checked={on} onChange={() => toggle(c.id)} className="accent-[var(--color-accent)]" />
                  {c.hasImage ? (
                    <img src={imageSrc(c)} alt="" loading="lazy" className="h-8 w-8 flex-none rounded object-cover" />
                  ) : (
                    <span className="flex h-8 w-8 flex-none items-center justify-center rounded bg-chip text-center text-[9px] leading-tight text-faint">
                      <Label de="kein Bild" vi="chưa có hình" />
                    </span>
                  )}
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate font-semibold text-ink">
                      {c.level} · {MODE_SHORT[c.mode]}
                      {c.time ? ` · ${c.time}` : ""}
                    </span>
                    <span className="truncate text-faint">
                      <Label de={`Start ${shortDate(c.begin).de}`} vi={`Khai giảng ${shortDate(c.begin).vi}`} /> · {c.name.split(" ")[0]}
                    </span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
