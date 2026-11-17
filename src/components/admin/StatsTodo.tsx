"use client";

import { useState } from "react";
import Link from "next/link";
import { Label } from "@/components/Bi";
import { Icon, type AnyIcon } from "@/components/Icon";
import { ChatPreviewModal, type PreviewChat } from "@/components/admin/ChatPreviewModal";

export type TodoRow = {
  id: string;
  name: string;
  href: string;
  detailDe: string;
  detailVi: string;
  /** Exact date and time, for the tooltip. */
  when: string;
  ageDe: string;
  ageVi: string;
  tone: "bad" | "warn" | "plain";
};

export type TodoGroup = {
  id: string;
  icon: AnyIcon;
  de: string;
  vi: string;
  hintDe: string;
  hintVi: string;
  emptyDe: string;
  emptyVi: string;
  /** The list was cut at its limit, so there may be more. */
  capped: boolean;
  rows: TodoRow[];
};

const AVATAR = ["#E3ECFB:#1F56A8", "#E6F4EA:#23794A", "#FBF3DA:#8A5F00", "#ECE7FA:#5B3FB5", "#FCEDEA:#B9382A", "#E2F3F6:#0B7793"];

function avatarColors(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const [bg, fg] = AVATAR[h % AVATAR.length].split(":");
  return { background: bg, color: fg };
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return ((parts[0][0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

const TONE = {
  bad: "bg-bad-soft text-bad",
  warn: "bg-warn-soft text-warn",
  plain: "bg-chip text-muted",
};

/** "Jetzt erledigen": the three to-do lists as tabs. Each row opens the chat in the inbox. */
export function StatsTodo({ groups, filtered }: { groups: TodoGroup[]; filtered: boolean }) {
  const [active, setActive] = useState(groups.find((g) => g.rows.length)?.id ?? groups[0].id);
  const group = groups.find((g) => g.id === active) ?? groups[0];
  const [preview, setPreview] = useState<PreviewChat | null>(null);

  return (
    <section aria-label="Jetzt erledigen" className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-line bg-white lg:max-h-[calc(100dvh-140px)]">
      <header className="flex-none border-b border-line px-4 pb-3 pt-3.5">
        <div className="flex items-center gap-2">
          <h2 className="m-0 text-[15px] font-semibold text-ink">
            <Label de="Jetzt erledigen" vi="Việc cần làm ngay" />
          </h2>
          {filtered && (
            <span className="rounded-full bg-chip px-2 py-0.5 text-[11px] font-medium text-muted" title="Der Filter oben gilt hier nicht.">
              <Label de="ungefiltert" vi="không lọc" />
            </span>
          )}
        </div>
        <div role="tablist" className="mt-3 grid grid-cols-3 gap-1 rounded-[10px] bg-chip p-1">
          {groups.map((g) => {
            const on = g.id === group.id;
            const count = `${g.rows.length}${g.capped ? "+" : ""}`;
            return (
              <button
                key={g.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(g.id)}
                title={`${g.de} · ${g.vi}`}
                className={`flex min-w-0 flex-col items-start gap-0.5 rounded-[7px] px-2.5 py-1.5 text-left transition-colors duration-150 ${
                  on ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.04)]" : "hover:bg-white/60"
                }`}
              >
                <span className={`flex items-center gap-1 text-[18px] font-semibold leading-none tabular-nums ${on ? (g.id === "waiting" && g.rows.length ? "text-bad" : "text-ink") : "text-muted"}`}>
                  <Icon name={g.icon} size={13} className={on ? "text-accent" : "text-faint"} />
                  {count}
                </span>
                <span className={`w-full truncate text-[11.5px] font-medium ${on ? "text-ink" : "text-muted"}`}>
                  <Label de={g.de} vi={g.vi} />
                </span>
              </button>
            );
          })}
        </div>
        <p className="m-0 mt-2.5 text-[12px] leading-snug text-muted">
          <Label de={group.hintDe} vi={group.hintVi} />
        </p>
      </header>

      {group.rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ok-soft text-ok">
            <Icon name="check" size={22} />
          </span>
          <p className="m-0 text-[14px] font-semibold text-ink">
            <Label de="Alles erledigt" vi="Đã xong hết" />
          </p>
          <p className="m-0 text-[12.5px] text-muted">
            <Label de={group.emptyDe} vi={group.emptyVi} />
          </p>
        </div>
      ) : (
        <ul key={group.id} className="anim-fade m-0 min-h-0 flex-1 list-none overflow-y-auto p-1.5">
          {group.rows.map((row) => (
            <li key={row.id}>
              <Link
                href={row.href}
                data-preview=""
                onClick={(e) => {
                  // A plain click opens the read-only preview; Cmd/Ctrl/Shift-click still opens the chat in the inbox.
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                  e.preventDefault();
                  setPreview({ id: row.id, name: row.name, channel: "messenger" });
                }}
                className="group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-150 hover:bg-hover"
              >
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full text-[11.5px] font-semibold" style={avatarColors(row.name)} aria-hidden="true">
                  {initials(row.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] font-medium text-ink">{row.name}</span>
                  <span className="block truncate text-[12px] text-muted">
                    <Label de={row.detailDe} vi={row.detailVi} />
                  </span>
                </span>
                <span title={row.when} className={`flex-none rounded-full px-2 py-0.5 text-[11.5px] font-medium tabular-nums ${TONE[row.tone]}`}>
                  <Label de={row.ageDe} vi={row.ageVi} />
                </span>
                <span className="flex-none text-faint opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                  <Icon name="chevron" size={13} />
                </span>
              </Link>
            </li>
          ))}
          {group.capped && (
            <li className="px-3 py-2.5 text-center text-[12px] text-faint">
              <Label de={`Die ältesten ${group.rows.length} – es gibt noch mehr.`} vi={`${group.rows.length} cuộc lâu nhất – còn nữa.`} />
            </li>
          )}
        </ul>
      )}
      {preview && <ChatPreviewModal chat={preview} onClose={() => setPreview(null)} />}
    </section>
  );
}
