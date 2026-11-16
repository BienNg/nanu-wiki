"use client";

import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/Bi";
import { MODE_SHORT, shortDate } from "@/lib/classes";
import { hasStarted, matchScore, rankClasses, type AssignableClass } from "@/lib/messenger/classes";

type Data = { classes: AssignableClass[]; assigned: string[] };
type State = ({ id: string } & Data) | { id: string; error: true } | null;

/** Chats whose classes were loaded in this tab; going back shows them at once. */
const recent = new Map<string, Data>();
const COLLAPSED_KEY = "messenger-classes-panel";

function Badge({ tone, children }: { tone: "accent" | "muted" | "warn"; children: React.ReactNode }) {
  const cls =
    tone === "accent"
      ? "bg-accent-soft text-accent"
      : tone === "warn"
        ? "bg-[#FDF1E2] text-[#9A5B13]"
        : "bg-[#F1F2F4] text-muted";
  return <span className={`rounded-full px-1.5 py-px text-[10.5px] font-medium ${cls}`}>{children}</span>;
}

/** Name, when and where of one class, plus an add or remove button. */
function ClassRow({ c, score, busy, actionLabel, onAction }: { c: AssignableClass; score: number; busy: boolean; actionLabel: "add" | "remove"; onAction: () => void }) {
  const when = c.begin ? shortDate(c.begin) : null;
  return (
    <li className="flex items-start gap-2 rounded-lg px-2 py-1.5 hover:bg-hover">
      <div className="min-w-0 flex-1">
        <p className="m-0 truncate text-[12.5px] font-medium leading-snug" title={c.name}>
          {c.name}
        </p>
        <p className="m-0 mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted">
          {c.mode && <span>{MODE_SHORT[c.mode]}</span>}
          {when ? (
            <span>
              <Label de={`ab ${when.de}`} vi={`từ ${when.vi}`} />
              {c.time ? ` · ${c.time}` : ""}
            </span>
          ) : (
            <Badge tone="muted">
              <Label de="Start offen" vi="Chưa có ngày" />
            </Badge>
          )}
          {score === 2 && (
            <Badge tone="accent">
              <Label de="Passt" vi="Phù hợp" />
            </Badge>
          )}
          {c.full && (
            <Badge tone="warn">
              <Label de="Voll" vi="Đã đầy" />
            </Badge>
          )}
          {hasStarted(c) && (
            <Badge tone="muted">
              <Label de="Läuft" vi="Đang học" />
            </Badge>
          )}
        </p>
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={onAction}
        aria-label={actionLabel === "add" ? "Zuordnen" : "Entfernen"}
        title={actionLabel === "add" ? "Zuordnen / Gán lớp" : "Entfernen / Bỏ gán"}
        className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border text-[14px] leading-none transition-colors disabled:opacity-40 ${
          actionLabel === "add" ? "border-line text-accent hover:bg-accent-soft" : "border-transparent text-faint hover:bg-[#FBEAEA] hover:text-[#B3362B]"
        }`}
      >
        {actionLabel === "add" ? "+" : "×"}
      </button>
    </li>
  );
}

/**
 * The right panel of a Sprachkurs chat: which upcoming classes this lead is assigned to, and the
 * assignable classes ranked by how well they fit Niveau and Ort (best match, then start date).
 * Assignments are stored in Supabase; class details come live from Notion (api/messenger/classes).
 */
export function ClassAssignPanel({ conversationId, level, place }: { conversationId: string; level: string | null; place: string | null }) {
  const [state, setState] = useState<State>(() => {
    const cached = recent.get(conversationId);
    return cached ? { id: conversationId, ...cached } : null;
  });
  const [collapsed, setCollapsed] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);
  const flight = useRef<AbortController | null>(null);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === "closed");
    } catch {}
  }, []);
  const toggle = () => {
    setCollapsed((v) => {
      try {
        localStorage.setItem(COLLAPSED_KEY, v ? "open" : "closed");
      } catch {}
      return !v;
    });
  };

  useEffect(() => {
    flight.current?.abort();
    const ctrl = new AbortController();
    flight.current = ctrl;
    const cached = recent.get(conversationId);
    setState(cached ? { id: conversationId, ...cached } : null);
    fetch(`/api/messenger/classes?c=${encodeURIComponent(conversationId)}`, { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<Data>) : Promise.reject(r.status)))
      .then((data) => {
        if (flight.current !== ctrl) return;
        recent.set(conversationId, data);
        setState({ id: conversationId, ...data });
      })
      .catch((e) => {
        if (flight.current !== ctrl || (e instanceof DOMException && e.name === "AbortError")) return;
        if (!recent.has(conversationId)) setState({ id: conversationId, error: true });
      });
    return () => ctrl.abort();
  }, [conversationId, retry]);

  const save = (classId: string, remove: boolean) => {
    if (!state || "error" in state) return;
    const before = state.assigned;
    const assigned = remove ? before.filter((k) => k !== classId) : [...before, classId];
    const next = { classes: state.classes, assigned };
    recent.set(conversationId, next);
    setState({ id: conversationId, ...next });
    setBusy(classId);
    fetch("/api/messenger/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ c: conversationId, k: classId, remove }),
    })
      .then((r) => (r.ok ? null : Promise.reject(r.status)))
      .catch(() => {
        const rolled = { classes: next.classes, assigned: before };
        recent.set(conversationId, rolled);
        setState((s) => (s && !("error" in s) && s.id === conversationId ? { id: conversationId, ...rolled } : s));
      })
      .finally(() => setBusy((b) => (b === classId ? null : b)));
  };

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={toggle}
        title="Kurse zuordnen / Gán lớp"
        className="flex w-9 flex-none flex-col items-center gap-1.5 border-l border-line bg-[#FAFBFC] pt-3 text-muted transition-colors hover:bg-hover max-lg:hidden"
      >
        <span aria-hidden="true" className="text-[14px]">
          ‹
        </span>
        <span className="text-[11px] font-medium [writing-mode:vertical-rl]">
          <Label de="Kurse" vi="Lớp học" />
          {state && !("error" in state) && state.assigned.length > 0 ? ` · ${state.assigned.length}` : ""}
        </span>
      </button>
    );
  }

  const ready = state && !("error" in state) ? state : null;
  const suggestions = ready ? rankClasses(ready.classes.filter((c) => !ready.assigned.includes(c.id)), level, place) : [];
  const assignedClasses = ready ? ready.assigned.map((k) => ready.classes.find((c) => c.id === k)).filter((c): c is AssignableClass => !!c) : [];
  const canSuggest = !!level && level !== "unklar" && !!place && place !== "unklar";

  return (
    <aside className="flex w-[264px] flex-none flex-col border-l border-line bg-[#FAFBFC] max-lg:hidden">
      <header className="flex flex-none items-center justify-between gap-2 border-b border-line px-3 py-2">
        <h2 className="m-0 text-[12.5px] font-semibold">
          <Label de="Kurse" vi="Lớp học" />
        </h2>
        <button type="button" onClick={toggle} aria-label="Einklappen" className="rounded px-1.5 text-[14px] text-muted hover:bg-hover">
          ›
        </button>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto px-1.5 py-2">
        {!state && <p className="m-0 px-2 text-[12px] text-faint">…</p>}
        {state && "error" in state && (
          <p className="m-0 px-2 text-[12px] text-muted">
            <Label de="Kurse konnten nicht geladen werden." vi="Không tải được lớp học." />{" "}
            <button type="button" onClick={() => setRetry((n) => n + 1)} className="text-accent hover:underline">
              <Label de="Nochmal" vi="Thử lại" />
            </button>
          </p>
        )}
        {ready && (
          <>
            <p className="m-0 px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-faint">
              <Label de="Zugeordnet" vi="Đã gán" />
            </p>
            {assignedClasses.length === 0 ? (
              <p className="m-0 px-2 pb-2 text-[12px] text-faint">
                <Label de="Noch kein Kurs zugeordnet." vi="Chưa gán lớp nào." />
              </p>
            ) : (
              <ul className="m-0 list-none p-0 pb-2">
                {assignedClasses.map((c) => (
                  <ClassRow key={c.id} c={c} score={matchScore(c, level, place)} busy={busy === c.id} actionLabel="remove" onAction={() => save(c.id, true)} />
                ))}
              </ul>
            )}
            <p className="m-0 border-t border-line px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-faint">
              <Label de="Vorschläge" vi="Gợi ý" />
            </p>
            {!canSuggest && (
              <p className="m-0 px-2 pb-1 text-[11.5px] text-faint">
                <Label de="Niveau und Ort setzen, dann passen die Vorschläge." vi="Điền trình độ và nơi học để gợi ý đúng hơn." />
              </p>
            )}
            <ul className="m-0 list-none p-0">
              {suggestions.map((c) => (
                <ClassRow key={c.id} c={c} score={matchScore(c, level, place)} busy={busy === c.id} actionLabel="add" onAction={() => save(c.id, false)} />
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
}
