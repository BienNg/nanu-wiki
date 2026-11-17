"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { INTERESTS } from "@/lib/assistant/schema";
import { saveMessengerLabel } from "@/app/(app)/admin/messenger/actions";
import { publishLabelSave, setLabelEditing, setLabelSaving } from "@/components/admin/labelPatch";
import type { ReactNode } from "react";
import { Bi, Label, tip } from "@/components/Bi";
import { MenuSelect } from "@/components/admin/MenuSelect";
import { FUNNEL_INTEREST, STEPS, STEP_INFO, isStep } from "@/lib/messenger/steps";
import { LEVELS, LOSS_REASONS, PLACES, levelOf, placeOf, type LossReason } from "@/lib/messenger/types";

const LOSS_TEXT: Record<LossReason, { de: string; vi: string }> = {
  preis: { de: "Preis", vi: "Học phí" },
  zeit_passt_nicht: { de: "Zeit", vi: "Lịch" },
  spaeter: { de: "Später", vi: "Để sau" },
  andere_schule: { de: "Andere Schule", vi: "Trường khác" },
  keine_antwort: { de: "Keine Antwort", vi: "Không trả lời" },
  kein_naechster_schritt: { de: "Kein nächster Schritt", vi: "Không bước tiếp" },
  unklar: { de: "Unklar", vi: "Chưa rõ" },
};

const JUDGMENTS = [
  { id: "auto", de: "Automatisch", vi: "Tự động" },
  { id: "kein_lead", de: "Kein Lead", vi: "Không phải khách" },
  { id: "bestandskunde", de: "Schüler", vi: "Học viên" },
  { id: "weiter_auf_zalo", de: "Zalo", vi: "Zalo" },
  { id: "verloren", de: "Verloren", vi: "Mất khách" },
] as const;

/** Yes/no fields. Kurse and Preis may also be filled in by the labeler; Bezahlt is only set here. A wrong click is taken back the same way. */
const SENT = [
  { name: "courses_sent", de: "Kurse geschickt", vi: "Đã gửi khóa" },
  { name: "price_sent", de: "Preis geschickt", vi: "Đã báo giá" },
  { name: "paid", de: "Bezahlt", vi: "Đã đóng tiền" },
] as const;

export type LabelFormValues = {
  conversationId: string;
  formKey: string;
  stage: string;
  interest: string;
  level: string;
  place: string;
  judgment: string;
  loss: string;
  pinned: string[];
  /** Id of the element in the chat header that takes the Status menu (with Grund and Datum). */
  statusSlot: string;
  /** Id of the element on the right of the chat header that takes the Stufe menu (above the goal). */
  stageSlot: string;
  /** Staff set these after the message went out. They move the chat to Preis, to Anmeldung, and to Schüler. */
  coursesSent: boolean;
  priceSent: boolean;
  /** The person paid for the course. The chat becomes Schüler. */
  paid: boolean;
  /** Staff only: wants a 1-1 class. Only with Interesse Sprachkurs; the inbox shows these chats under 1-1 alone. */
  oneOnOne: boolean;
  /** What "Automatisch" comes to right now, e.g. "Wartet auf uns". */
  autoText: { de: string; vi: string };
};

/** Field name, with a dot when the field stays as it is the next time the chat is labeled. */
function Name({ de, vi, pinned }: { de: string; vi: string; pinned: boolean }) {
  return (
    <>
      <Label de={de} vi={vi} />
      {pinned ? <span className="text-accent" {...tip("Bleibt beim nächsten Einordnen", "Giữ nguyên khi phân loại lại")}> ●</span> : null}
    </>
  );
}

/** Same chip as the compact <MenuSelect>, for the typed field (Datum). */
function Field({ de, vi, pinned, saving, children }: { de: string; vi: string; pinned: boolean; saving?: boolean; children: ReactNode }) {
  return (
    <label
      className={`flex h-6 min-w-0 items-center gap-1.5 rounded-full bg-chip pl-2 pr-1.5 text-[11.5px] text-muted transition-shadow duration-150 focus-within:ring-2 focus-within:ring-accent-soft ${
        saving ? "field-saving ring-2 ring-accent-soft" : ""
      }`}
    >
      <span className="flex-none">
        <Name de={de} vi={vi} pinned={pinned} />
      </span>
      {children}
    </label>
  );
}

const typed = "h-5 min-w-0 bg-transparent text-[12px] font-medium text-ink outline-none";
const both = (de: string, vi: string) => <Bi de={de} vi={vi} inline />;

/** Correct the stored label; every change saves at once. A dot means that field stays when the chat is labeled again. */
export function LabelEditor(props: LabelFormValues) {
  return <LabelEditorForm key={props.formKey} {...props} />;
}

/** Correct the stored label. Several fields in a row are one save: the write waits until the person pauses. */
const SAVE_PAUSE_MS = 1200;

function LabelEditorForm({ conversationId, stage, interest, level, place, judgment, loss, pinned, statusSlot, stageSlot, coursesSent, priceSent, paid, oneOnOne, autoText }: LabelFormValues) {
  const [status, setStatus] = useState(judgment);
  // The 1-1 switch shows only while the Interesse is Sprachkurs (a Schüler always is).
  const [interestNow, setInterestNow] = useState(interest);
  const sprachkurs = status === "bestandskunde" || interestNow === FUNNEL_INTEREST;
  const [reason, setReason] = useState(loss);
  /** Fields changed since the last finished save. Their chips show that they are still saving. */
  const [dirty, setDirty] = useState<ReadonlySet<string>>(() => new Set());
  const [error, setError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const [base, setBase] = useState<Record<string, string>>({
    stage: isStep(stage) ? stage : "unklar",
    interest,
    level: levelOf(level),
    place: placeOf(place),
    courses_sent: coursesSent ? "ja" : "nein",
    price_sent: priceSent ? "ja" : "nein",
    paid: paid ? "ja" : "nein",
    one_on_one: oneOnOne ? "ja" : "nein",
    judgment,
    loss_reason: judgment === "verloren" ? loss : "",
  });
  const baseRef = useRef(base);
  baseRef.current = base;
  const wait = useRef<number | undefined>(undefined);
  const flight = useRef(false);
  const pending = useRef(false);
  const afterFlight = useRef<FormData | null>(null);
  const mounted = useRef(true);
  /** Each write gets a number. A response from an earlier write must not cover a later one. */
  const epoch = useRef(0);
  // Once a save went through, what was sent is what is stored: the next change is compared with that.
  const sent = useRef<Record<string, string> | null>(null);
  const formId = useId();
  // Status and Stufe sit in the chat header, outside this form in the page; `form={formId}` keeps them part of the form.
  const [slot, setSlot] = useState<HTMLElement | null>(null);
  const [stageEl, setStageEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setSlot(document.getElementById(statusSlot));
    setStageEl(document.getElementById(stageSlot));
  }, [statusSlot, stageSlot]);
  const locked = (field: string) => pinned.includes(field);
  // A filled field without a pin came from the labeler: every change a person saves pins that field.
  // MenuSelect shows no dot on an empty chip, so `labeled` only needs the missing pin.

  const readForm = () => {
    const data = new FormData(form.current!);
    const get = (name: string, missing = "") => String(data.get(name) ?? missing);
    sent.current = {
      stage: get("stage", "unklar"),
      interest: get("interest"),
      level: get("level"),
      place: get("place"),
      courses_sent: get("courses_sent"),
      price_sent: get("price_sent"),
      paid: get("paid"),
      one_on_one: get("one_on_one"),
      judgment: get("judgment"),
      loss_reason: get("loss_reason"),
    };
    return data;
  };

  const differs = (data: FormData) => Object.entries(baseRef.current).some(([name, value]) => String(data.get(name) ?? "") !== value);

  const finish = () => {
    setLabelSaving(conversationId, false);
    if (mounted.current) setDirty(new Set());
  };

  const flush = async () => {
    if (!form.current) return;
    if (flight.current) {
      pending.current = true;
      return;
    }
    const data = readForm();
    if (!differs(data)) {
      if (!wait.current && !pending.current) {
        setLabelEditing(conversationId, false);
        finish();
      }
      return;
    }
    const mine = ++epoch.current;
    flight.current = true;
    setLabelEditing(conversationId, true);
    const result = await saveMessengerLabel(null, data);
    flight.current = false;
    const stale = mine !== epoch.current;
    const more = !!wait.current || pending.current || !!afterFlight.current;
    if (mounted.current && !stale && !more) {
      if (result.error) setError(result.error);
      else {
        setError("");
        if (sent.current) setBase(sent.current);
      }
    }
    // The version is always noted. The fields are replaced only when nothing newer is waiting.
    if (result.saved) publishLabelSave(result.saved, !stale && !more);
    if (!stale && !more && !wait.current && !pending.current) {
      setLabelEditing(conversationId, false);
      finish();
    }
    if (afterFlight.current) {
      const latest = afterFlight.current;
      afterFlight.current = null;
      sendClosed(latest);
      return;
    }
    // The form closed while this write was on the way and nothing else waits: the save is over.
    if (!mounted.current) {
      setLabelSaving(conversationId, false);
      return;
    }
    if (pending.current) {
      pending.current = false;
      if (!wait.current) void flush();
    }
  };

  /** Send a change the form still had when it closed (another chat was opened). The spinner stays until the server answers. */
  const sendClosed = (data: FormData) => {
    void saveMessengerLabel(null, data)
      .then((result) => {
        if (result.saved) publishLabelSave(result.saved, true);
        else if (result.error) console.error("Label save failed", result.error);
      })
      .catch((err) => console.error("Label save failed", err))
      .finally(() => {
        setLabelEditing(conversationId, false);
        setLabelSaving(conversationId, false);
      });
  };

  // A new field resets the wait, so Interesse + Niveau + Ort become one write.
  const save = (field: string) => {
    setDirty((d) => (d.has(field) ? d : new Set(d).add(field)));
    setLabelSaving(conversationId, true);
    // This edit is newer than a write already on the way, so that write must not be shown.
    if (flight.current) epoch.current += 1;
    setLabelEditing(conversationId, true);
    if (wait.current) window.clearTimeout(wait.current);
    wait.current = window.setTimeout(() => {
      wait.current = undefined;
      void flush();
    }, SAVE_PAUSE_MS);
  };

  // A layout cleanup, not useEffect: React clears `form.current` (and removes the Status/Stufe portals) before
  // useEffect cleanups run, so reading the form there found nothing and the waiting change was dropped.
  useLayoutEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      setLabelEditing(conversationId, false);
      // A change is waiting for the pause, or for the write on the way to finish.
      const waiting = !!wait.current || pending.current;
      if (wait.current) window.clearTimeout(wait.current);
      wait.current = undefined;
      pending.current = false;
      const data = waiting && form.current ? readForm() : null;
      // While a write is on the way the base is older than what is stored, so the waiting change is always sent.
      if (!data || (!flight.current && !differs(data))) {
        if (!flight.current) setLabelSaving(conversationId, false);
        return;
      }
      if (flight.current) afterFlight.current = data;
      else sendClosed(data);
    };
    // The form closes: send whatever is still waiting. `differs` reads the base from this render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form
      ref={form}
      id={formId}
      onSubmit={(e) => {
        e.preventDefault();
        if (wait.current) window.clearTimeout(wait.current);
        wait.current = undefined;
        void flush();
      }}
      className="flex min-w-0 flex-wrap items-center gap-2"
    >
      <input type="hidden" name="conversation_id" value={conversationId} />
      {/* What each field showed when this form opened (or was last saved). The server keeps the stored value of every field that still equals it,
          so a change a colleague saved in the meantime is not put back. */}
      {Object.entries(base).map(([name, value]) => (
        <input key={name} type="hidden" name={`base_${name}`} value={value} />
      ))}
      <MenuSelect
        key={status === "bestandskunde" ? FUNNEL_INTEREST : interest}
        name="interest"
        saving={dirty.has("interest")}
        ariaLabel="Interesse / Nhu cầu"
        label={<Label de="Interesse" vi="Nhu cầu" />}
        emptyValue=""
        pinned={locked("interest")}
        labeled={!locked("interest")}
        defaultValue={status === "bestandskunde" ? FUNNEL_INTEREST : interest}
        onChange={(v) => {
          setInterestNow(v);
          save("interest");
        }}
        options={[{ value: "", label: "—" }, ...INTERESTS.map((id) => ({ value: id as string, label: id }))]}
      />
      {/* 1-1 is set by hand only and pins the Interesse Sprachkurs. Away from Sprachkurs it is off (the server clears it too). */}
      {sprachkurs ? (
        <MenuSelect
          name="one_on_one"
          saving={dirty.has("one_on_one")}
          ariaLabel="1-1 / Kèm 1-1"
          label={<Label de="1-1" vi="Kèm 1-1" />}
          emptyValue="nein"
          defaultValue={oneOnOne ? "ja" : "nein"}
          onChange={() => save("one_on_one")}
          options={[
            { value: "ja", label: both("Will 1-1", "Muốn học kèm 1-1"), chip: <Label de="✓ 1-1" vi="✓ Kèm 1-1" /> },
            { value: "nein", label: both("Gruppe", "Lớp nhóm") },
          ]}
        />
      ) : (
        <input type="hidden" name="one_on_one" value="nein" />
      )}
      <MenuSelect
        name="level"
        saving={dirty.has("level")}
        ariaLabel="Niveau / Trình độ"
        label={<Label de="Niveau" vi="Trình độ" />}
        emptyValue="unklar"
        pinned={locked("level")}
        labeled={!locked("level")}
        defaultValue={levelOf(level)}
        onChange={() => save("level")}
        options={LEVELS.map((id) => ({ value: id as string, label: id === "unklar" ? "—" : id }))}
      />
      <MenuSelect
        name="place"
        saving={dirty.has("place")}
        ariaLabel="Ort / Nơi học"
        label={<Label de="Ort" vi="Nơi học" />}
        emptyValue="unklar"
        pinned={locked("place")}
        labeled={!locked("place")}
        defaultValue={placeOf(place)}
        onChange={() => save("place")}
        options={PLACES.map((id) => ({ value: id as string, label: id === "unklar" ? "—" : id }))}
      />
      {SENT.map((item) => (
        <MenuSelect
          key={item.name}
          name={item.name}
          saving={dirty.has(item.name)}
          ariaLabel={`${item.de} / ${item.vi}`}
          label={<Label de={item.de} vi={item.vi} />}
          emptyValue="nein"
          pinned={item.name === "paid" ? undefined : locked(item.name)}
          labeled={item.name !== "paid" && !locked(item.name)}
          defaultValue={(item.name === "courses_sent" ? coursesSent : item.name === "price_sent" ? priceSent : paid) ? "ja" : "nein"}
          onChange={(v) => {
            if (item.name === "paid") {
              if (v === "ja") {
                setStatus("bestandskunde");
                save("judgment");
              } else if (status === "bestandskunde" && judgment !== "bestandskunde") {
                setStatus("auto");
                save("judgment");
              }
            }
            save(item.name);
          }}
          options={[
            { value: "ja", label: both(item.de, item.vi), chip: <Label de={`✓ ${item.de}`} vi={`✓ ${item.vi}`} /> },
            { value: "nein", label: item.name === "paid" ? both("Noch nicht", "Chưa đóng") : both("Noch nicht", "Chưa gửi") },
          ]}
        />
      ))}
      <span role="status" className="sr-only">
        {dirty.size > 0 ? <Label de="Speichert…" vi="Đang lưu…" /> : null}
      </span>
      {error ? <p className="m-0 w-full text-[12px] text-bad">{error}</p> : null}
      {/* Steps exist for Sprachkurs only; before the Interesse is known the step is Qualifizieren. */}
      {stageEl &&
        (!interest || interest === FUNNEL_INTEREST || isStep(stage)) &&
        createPortal(
        <MenuSelect
          name="stage"
          saving={dirty.has("stage")}
          ariaLabel="Stufe / Bước"
          label={<Label de="Stufe" vi="Bước" />}
          emptyValue="unklar"
          compact
          form={formId}
          pinned={locked("stage")}
          defaultValue={isStep(stage) ? stage : "unklar"}
          onChange={() => save("stage")}
          options={[
            ...(locked("stage") ? [{ value: "auto", label: both("Automatisch", "Tự động") }] : []),
            ...STEPS.map((id) => ({ value: id as string, label: both(STEP_INFO[id].short_de, STEP_INFO[id].short_vi) })),
            ...(isStep(stage) ? [] : [{ value: "unklar", label: "—" }]),
          ]}
        />,
          stageEl,
        )}
      {slot &&
        createPortal(
          <>
            <MenuSelect
              key={status}
              name="judgment"
              saving={dirty.has("judgment")}
              ariaLabel="Status / Trạng thái"
              label={<Label de="Status" vi="Trạng thái" />}
              compact
              form={formId}
              pinned={locked("outcome")}
              defaultValue={status}
              onChange={(v) => {
                setStatus(v);
                save("judgment");
              }}
              options={JUDGMENTS.map((item) => ({ value: item.id as string, label: both(item.de, item.vi), chip: item.id === "auto" ? <Label de={autoText.de} vi={autoText.vi} /> : undefined }))}
            />
            {status === "verloren" && (
              <MenuSelect
                name="loss_reason"
                saving={dirty.has("loss_reason")}
                ariaLabel="Grund / Lý do"
                label={<Label de="Grund" vi="Lý do" />}
                emptyValue="unklar"
                compact
                form={formId}
                pinned={locked("loss_reason")}
                defaultValue={reason}
                onChange={(v) => {
                  setReason(v);
                  save("loss_reason");
                }}
                // "Später" is a follow-up now (button in the chat header), not a reason.
                options={LOSS_REASONS.filter((id) => id !== "spaeter").map((id) => ({ value: id as string, label: both(LOSS_TEXT[id].de, LOSS_TEXT[id].vi) }))}
              />
            )}
          </>,
          slot,
        )}
    </form>
  );
}
