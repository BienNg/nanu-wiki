"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

export type MenuSelectOption = { value: string; label: ReactNode };

const check = "M5 12.5l4.5 4.5L19 7.5";
const down = "M7 10l5 5 5-5";
const plus = "M12 5.5v13M5.5 12h13";

function Glyph({ d, size }: { d: string; size: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="flex-none">
      <path d={d} />
    </svg>
  );
}

/**
 * A chip that opens a soft translucent menu with a check next to the chosen value.
 * Filled: a solid chip with only the value. Missing (`emptyValue`): a dashed "+ Name" button that asks
 * to be clicked. `keepLabel` shows the name next to the value where the value alone says too little.
 * Works inside a <form> (hidden input `name`) and with the keyboard
 * (↑ ↓ Home End, Enter/Space to choose, Esc to close).
 */
export function MenuSelect({
  name,
  label,
  ariaLabel,
  defaultValue,
  options,
  onChange,
  emptyValue,
  keepLabel,
  pinned,
}: {
  name: string;
  label: ReactNode;
  ariaLabel: string;
  defaultValue: string;
  options: MenuSelectOption[];
  onChange?: (value: string) => void;
  /** The value that means "not filled in yet". */
  emptyValue?: string;
  keepLabel?: boolean;
  /** A person set this field; it stays when the chat is labeled again. */
  pinned?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [alignRight, setAlignRight] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const chosen = Math.max(0, options.findIndex((o) => o.value === value));
  const missing = emptyValue !== undefined && value === emptyValue;

  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    return () => document.removeEventListener("mousedown", outside);
  }, [open]);

  function show() {
    const box = root.current?.getBoundingClientRect();
    setAlignRight(!!box && box.left + 230 > window.innerWidth);
    setActive(chosen);
    setOpen(true);
  }

  function pick(i: number) {
    const next = options[i];
    setOpen(false);
    if (!next || next.value === value) return;
    setValue(next.value);
    onChange?.(next.value);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        show();
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Tab") setOpen(false);
    else if (e.key === "ArrowDown") setActive((i) => Math.min(options.length - 1, i + 1));
    else if (e.key === "ArrowUp") setActive((i) => Math.max(0, i - 1));
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") pick(active);
    else return;
    if (e.key !== "Tab") e.preventDefault();
  }

  return (
    <div ref={root} className="relative min-w-0">
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={onKeyDown}
        onKeyUp={(e) => {
          if (open && e.key === " ") e.preventDefault(); // Space was already used to choose
        }}
        className={`flex h-8 max-w-full items-center gap-1 rounded-full text-[13px] outline-none transition-[background-color,border-color,box-shadow,transform] duration-150 focus-visible:ring-2 focus-visible:ring-accent-soft active:scale-[0.97] ${
          missing
            ? "border border-dashed border-accent/45 bg-white pl-2 pr-3 font-medium text-accent hover:border-solid hover:border-accent hover:bg-accent-soft/60"
            : "border border-transparent bg-chip pl-3 pr-2 text-ink hover:bg-active"
        } ${open ? "ring-2 ring-accent-soft" : ""}`}
      >
        {missing ? (
          <>
            <Glyph d={plus} size={14} />
            <span className="min-w-0 truncate">{label}</span>
          </>
        ) : (
          <>
            {pinned ? <span className="size-1.5 flex-none rounded-full bg-accent" title="Bleibt beim nächsten Einordnen" /> : null}
            {keepLabel ? <span className="flex-none text-[12px] text-muted">{label}</span> : null}
            <span className="min-w-0 truncate font-medium">{options[chosen]?.label}</span>
            <span className="text-faint">
              <Glyph d={down} size={13} />
            </span>
          </>
        )}
      </button>
      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className={`menu-pop absolute top-[calc(100%+6px)] z-40 m-0 max-h-72 min-w-[190px] list-none overflow-y-auto rounded-xl border border-black/[0.06] bg-white/85 p-1 shadow-[0_12px_40px_rgba(0,0,0,0.16),0_2px_6px_rgba(0,0,0,0.06)] backdrop-blur-xl ${
            alignRight ? "right-0 origin-top-right" : "left-0 origin-top-left"
          }`}
        >
          <li role="presentation" className="px-2 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-wide text-faint">
            {label}
          </li>
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === chosen}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(i)}
              className={`flex cursor-default items-center gap-1.5 whitespace-nowrap rounded-[7px] px-1.5 py-[5px] text-[13px] ${i === active ? "bg-accent text-white" : "text-ink"}`}
            >
              <span className={`flex w-3.5 flex-none ${i === chosen && !missing ? "" : "invisible"}`}>
                <Glyph d={check} size={13} />
              </span>
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
