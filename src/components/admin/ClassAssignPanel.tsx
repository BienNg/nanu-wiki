"use client";

import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Label, tip } from "@/components/Bi";
import { ClassInfoModal } from "@/components/admin/ClassInfoModal";
import { Chip, ClassWhen, Fact, OfferSwitch, saveOffer, SectionHead } from "@/components/admin/classParts";
import { Icon } from "@/components/Icon";
import { toast } from "@/components/Toaster";
import { MODE_SHORT } from "@/lib/classes";
import { setRowClasses } from "@/components/admin/classPatch";
import { classCode, isLevelStart, matchScore, MODE_TONE, rankClasses, rowClass, sortByLevel, type AssignableClass, type OfferState } from "@/lib/messenger/classes";

/** `offers`: the special-offer status per assigned class id (missing means Offen). */
type Data = { classes: AssignableClass[]; assigned: string[]; offers: Record<string, OfferState> };
type State = ({ id: string } & Data) | { id: string; error: true } | null;

/** Chats whose classes were loaded in this tab; going back shows them at once. */
const recent = new Map<string, Data>();
const COLLAPSED_KEY = "messenger-classes-panel";

/** The row in the inbox list shows the assigned classes; keep it in step with this panel. */
function publishRow(conversationId: string, data: Data) {
  const byId = new Map(data.classes.map((c) => [c.id, c]));
  setRowClasses(
    conversationId,
    data.assigned.flatMap((k) => {
      const c = byId.get(k);
      return c ? [rowClass(c, data.offers[k] ?? "offen")] : [];
    }),
  );
}

/** Cards get a view-transition name, so moving between Zugeordnet and the suggestions animates where the browser supports it. */
function animated(apply: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => void };
  if (doc.startViewTransition) doc.startViewTransition(() => flushSync(apply));
  else apply();
}

function matchesQuery(c: AssignableClass, q: string) {
  if (!q) return true;
  const hay = [c.name, c.level ?? "", c.mode ? MODE_SHORT[c.mode] : "", c.time ?? "", c.begin ?? ""].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((part) => hay.includes(part));
}

/**
 * One class as a card: code, level and place first, then start, time and seats. A click opens the
 * class info; the round button adds or removes it. An assigned class also shows the special-offer
 * switch (Offen / Geschickt / Übersprungen) for this chat.
 */
function ClassCard({
  c,
  busy,
  assigned,
  onAction,
  onInfo,
  offer,
}: {
  c: AssignableClass;
  busy: boolean;
  assigned: boolean;
  onAction: () => void;
  onInfo: () => void;
  offer?: { value: OfferState; busy: boolean; onChange: (next: OfferState) => void };
}) {
  const code = classCode(c.name);
  return (
    <li
      style={{ viewTransitionName: `k${c.id.replace(/-/g, "")}` }}
      className={`group relative rounded-xl border transition-[border-color,box-shadow] ${
        assigned ? "border-accent/40 bg-accent-soft/40" : "border-line bg-white hover:border-[#CBD0D8] hover:shadow-[0_1px_3px_rgba(16,24,40,0.06)]"
      } ${busy ? "opacity-60" : ""}`}
    >
      <button type="button" onClick={onInfo} {...tip(`${c.name} – Infos`, `${c.name} – Thông tin lớp`)} className="block w-full rounded-xl px-3 pb-2.5 pt-2 pr-11 text-left">
        <span className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span className="truncate text-[13.5px] font-semibold leading-6 text-ink">{code}</span>
          {c.level && <Chip className="bg-[#EEF0F3] text-[#3A3F47]">{c.level}</Chip>}
          {c.mode && <Chip className={MODE_TONE[c.mode]}>{MODE_SHORT[c.mode]}</Chip>}
        </span>
        <span className="mt-1.5 flex flex-col gap-1 text-[12px] text-[#3A3F47]">
          <Fact icon="calendar" title={{ de: "Start", vi: "Khai giảng" }}>
            <ClassWhen c={c} />
          </Fact>
          <span className="flex items-center gap-3">
            <Fact icon="clock" title={{ de: "Uhrzeit", vi: "Giờ học" }}>
              {c.time ?? <span className="text-faint">–</span>}
            </Fact>
            {c.students != null && (
              <Fact icon="users" title={{ de: "Angemeldete Schüler", vi: "Học viên đã đăng ký" }}>
                <span>
                  {c.students} <Label de="Schüler" vi="học viên" />
                </span>
              </Fact>
            )}
          </span>
        </span>
        {c.full && (
          <span className="mt-2 flex">
            <Chip className="bg-[#FDECEC] text-[#B3362B]">
              <Label de="Kurs ist voll" vi="Lớp đã đầy" />
            </Chip>
          </span>
        )}
      </button>
      {offer && (
        <div {...tip("Sonderangebot vor dem Kursstart", "Ưu đãi trước khi khai giảng")} className="border-t border-accent/15 px-3 py-2">
          <OfferSwitch size="sm" full value={offer.value} busy={offer.busy} onChange={offer.onChange} />
        </div>
      )}
      <button
        type="button"
        disabled={busy}
        onClick={onAction}
        aria-label={assigned ? "Entfernen" : "Zuordnen"}
        {...(assigned ? tip("Entfernen", "Bỏ gán") : tip("Zuordnen", "Gán lớp"))}
        className={`absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full transition-colors disabled:cursor-wait ${
          assigned
            ? "text-faint hover:bg-[#FBEAEA] hover:text-[#B3362B]"
            : "border border-accent/30 bg-white text-accent hover:border-accent hover:bg-accent hover:text-white"
        }`}
      >
        <Icon name={assigned ? "close" : "plus"} size={14} strokeWidth={2.4} />
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
  const [query, setQuery] = useState("");
  const [info, setInfo] = useState<AssignableClass | null>(null);
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
      .then((res) => {
        const data: Data = { ...res, offers: res.offers ?? {} };
        if (flight.current !== ctrl) return;
        recent.set(conversationId, data);
        publishRow(conversationId, data);
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
    // A removed assignment loses its offer status; assigning again starts at Offen.
    const offers = { ...state.offers };
    if (remove) delete offers[classId];
    const next = { classes: state.classes, assigned, offers };
    recent.set(conversationId, next);
    publishRow(conversationId, next);
    animated(() => setState({ id: conversationId, ...next }));
    setBusy(classId);
    fetch("/api/messenger/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ c: conversationId, k: classId, remove }),
    })
      .then((r) => (r.ok ? null : Promise.reject(r.status)))
      .catch(() => {
        const rolled = { classes: next.classes, assigned: before, offers: state.offers };
        recent.set(conversationId, rolled);
        publishRow(conversationId, rolled);
        animated(() => setState((s) => (s && !("error" in s) && s.id === conversationId ? { id: conversationId, ...rolled } : s)));
      })
      .finally(() => setBusy((b) => (b === classId ? null : b)));
  };

  /** Sets the special-offer status of this chat on an assigned class; shown at once, rolled back if saving fails. */
  const setOffer = (classId: string, offer: OfferState) => {
    if (!state || "error" in state) return;
    const apply = (value: OfferState) => {
      const cur = recent.get(conversationId) ?? { classes: state.classes, assigned: state.assigned, offers: state.offers };
      const data = { ...cur, offers: { ...cur.offers, [classId]: value } };
      recent.set(conversationId, data);
      publishRow(conversationId, data);
      setState((s) => (s && !("error" in s) && s.id === conversationId ? { id: conversationId, ...data } : s));
    };
    const before = state.offers[classId] ?? "offen";
    apply(offer);
    setBusy(classId);
    saveOffer(conversationId, classId, offer)
      .catch(() => {
        apply(before);
        toast("Speichern fehlgeschlagen · Lưu không thành công");
      })
      .finally(() => setBusy((b) => (b === classId ? null : b)));
  };

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={toggle}
        {...tip("Kurse zuordnen", "Gán lớp")}
        className="flex w-10 flex-none flex-col items-center gap-2 border-l border-line bg-[#F6F7F9] pt-3 text-muted transition-colors hover:bg-hover max-lg:hidden"
      >
        <Icon name="chevron" size={14} className="rotate-180" />
        <Icon name="cap" size={16} />
        <span className="text-[11.5px] font-semibold [writing-mode:vertical-rl]">
          <Label de="Kurse" vi="Lớp học" />
        </span>
        {state && !("error" in state) && state.assigned.length > 0 && (
          <span className="rounded-full bg-accent px-1.5 text-[10.5px] font-semibold leading-4 text-white">{state.assigned.length}</span>
        )}
      </button>
    );
  }

  const ready = state && !("error" in state) ? state : null;
  const suggestions = ready ? rankClasses(ready.classes.filter((c) => !ready.assigned.includes(c.id) && matchesQuery(c, query)), level, place) : [];
  const assignedClasses = ready ? ready.assigned.map((k) => ready.classes.find((c) => c.id === k)).filter((c): c is AssignableClass => !!c) : [];
  const canSuggest = !!level && level !== "unklar" && !!place && place !== "unklar";
  // Only first-half classes (A1.1, A2.1 …) count as a fit; second halves stay reachable under Weitere Kurse.
  const isBest = (c: AssignableClass) => matchScore(c, level, place) === 2 && isLevelStart(c);
  const best = canSuggest ? suggestions.filter(isBest) : [];
  const rest = sortByLevel(canSuggest ? suggestions.filter((c) => !isBest(c)) : suggestions);
  const card = (c: AssignableClass, assigned: boolean) => (
    <ClassCard
      key={c.id}
      c={c}
      assigned={assigned}
      busy={busy === c.id}
      onAction={() => save(c.id, assigned)}
      onInfo={() => setInfo(c)}
      offer={assigned && ready ? { value: ready.offers[c.id] ?? "offen", busy: busy === c.id, onChange: (next) => setOffer(c.id, next) } : undefined}
    />
  );

  return (
    <aside className="flex w-[288px] flex-none flex-col border-l border-line bg-[#F6F7F9] max-lg:hidden">
      <header className="flex flex-none items-center gap-2 border-b border-line bg-white px-3 py-2.5">
        <Icon name="cap" size={16} className="flex-none text-muted" />
        <h2 className="m-0 flex-1 text-[13.5px] font-semibold text-ink">
          <Label de="Kurse" vi="Lớp học" />
        </h2>
        <button type="button" onClick={toggle} aria-label="Einklappen" {...tip("Einklappen", "Thu gọn")} className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-hover">
          <Icon name="chevron" size={14} />
        </button>
      </header>
      <div className="flex-none border-b border-line bg-white px-3 pb-2.5">
        <label className="flex items-center gap-2 rounded-lg border border-line bg-[#F6F7F9] px-2.5 py-1.5 transition-colors focus-within:border-accent focus-within:bg-white">
          <Icon name="search" size={14} className="flex-none text-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kurs suchen · Tìm lớp"
            className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </label>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        {!state && (
          <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-[84px] animate-pulse rounded-xl border border-line bg-white" />
            ))}
          </ul>
        )}
        {state && "error" in state && (
          <p className="m-0 mt-3 rounded-lg bg-white px-3 py-2.5 text-[12px] text-muted">
            <Label de="Kurse konnten nicht geladen werden." vi="Không tải được lớp học." />{" "}
            <button type="button" onClick={() => setRetry((n) => n + 1)} className="font-medium text-accent hover:underline">
              <Label de="Nochmal" vi="Thử lại" />
            </button>
          </p>
        )}
        {ready && (
          <>
            <SectionHead count={assignedClasses.length}>
              <Icon name="check" size={13} className="text-accent" />
              <Label de="Zugeordnet" vi="Đã gán" />
            </SectionHead>
            {assignedClasses.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-[#E8B96A] bg-[#FDF6E9] px-4 py-5 text-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#94560F] shadow-[0_1px_2px_rgba(16,24,40,0.08)]">
                  <Icon name="cap" size={18} />
                </span>
                <p className="m-0 text-[13.5px] font-semibold text-[#7A4A0E]">
                  <Label de="Noch kein Kurs zugeordnet" vi="Chưa gán lớp nào" />
                </p>
                <p className="m-0 flex items-center gap-1 text-[12px] leading-snug text-[#94560F]">
                  <Label de="Unten mit" vi="Bấm" />
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-accent/40 bg-white text-accent">
                    <Icon name="plus" size={11} strokeWidth={2.6} />
                  </span>
                  <Label de="einen Kurs zuordnen." vi="bên dưới để gán lớp." />
                </p>
              </div>
            ) : (
              <ul className="m-0 flex list-none flex-col gap-2 p-0">{assignedClasses.map((c) => card(c, true))}</ul>
            )}

            {canSuggest ? (
              <>
                <SectionHead count={best.length}>
                  <Label de={`Für ${level} · ${place}`} vi={`Cho ${level} · ${place}`} />
                </SectionHead>
                {best.length === 0 ? (
                  <p className="m-0 px-1 text-[12px] text-faint">
                    {query ? <Label de="Kein Treffer." vi="Không có kết quả." /> : <Label de="Gerade kein passender Kurs geplant." vi="Hiện chưa có lớp phù hợp." />}
                  </p>
                ) : (
                  <ul className="m-0 flex list-none flex-col gap-2 p-0">{best.map((c) => card(c, false))}</ul>
                )}
              </>
            ) : (
              <p className="m-0 mt-3 rounded-lg bg-[#FDF6E9] px-3 py-2 text-[11.5px] leading-snug text-[#7A4A0E]">
                <Label de="Niveau und Ort setzen, dann erscheinen passende Kurse oben." vi="Điền trình độ và nơi học để hiện lớp phù hợp ở trên." />
              </p>
            )}

            {rest.length > 0 && (
              <>
                <SectionHead count={rest.length}>
                  {canSuggest ? <Label de="Weitere Kurse" vi="Lớp khác" /> : <Label de="Alle Kurse" vi="Tất cả lớp" />}
                </SectionHead>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">{rest.map((c) => card(c, false))}</ul>
              </>
            )}
            {suggestions.length === 0 && !!query && !canSuggest && (
              <p className="m-0 mt-3 px-1 text-[12px] text-faint">
                <Label de="Keine Kurse gefunden." vi="Không tìm thấy lớp nào." />
              </p>
            )}
          </>
        )}
      </div>
      {info && <ClassInfoModal c={info} onClose={() => setInfo(null)} />}
    </aside>
  );
}
