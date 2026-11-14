"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { INTERESTS } from "@/lib/assistant/schema";
import { saveMessengerLabel } from "@/app/(app)/admin/messenger/actions";
import { publishLabelSave } from "@/components/admin/labelPatch";
import type { ReactNode } from "react";
import { Label } from "@/components/Bi";
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

/** The two things only staff can know. Each is a yes/no field, so a wrong click is taken back the same way. */
const SENT = [
  { name: "courses_sent", de: "Kurse geschickt", vi: "Đã gửi khóa" },
  { name: "price_sent", de: "Preis geschickt", vi: "Đã báo giá" },
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
  resume: string;
  pinned: string[];
  /** Id of the element in the chat header that takes the Status menu (with Grund and Datum). */
  statusSlot: string;
  /** Id of the element on the right of the chat header that takes the Stufe menu (above the goal). */
  stageSlot: string;
  /** Staff set these two after the message went out; they move the chat to Preis and to Anmeldung. */
  coursesSent: boolean;
  priceSent: boolean;
  /** What "Automatisch" comes to right now, e.g. "Wartet auf uns". */
  autoText: { de: string; vi: string };
};

/** Field name, with a dot when the field stays as it is the next time the chat is labeled. */
function Name({ de, vi, pinned }: { de: string; vi: string; pinned: boolean }) {
  return (
    <>
      <Label de={de} vi={vi} />
      {pinned ? <span className="text-accent" title="Bleibt beim nächsten Einordnen"> ●</span> : null}
    </>
  );
}

/** Same chip as the compact <MenuSelect>, for the typed field (Datum). */
function Field({ de, vi, pinned, children }: { de: string; vi: string; pinned: boolean; children: ReactNode }) {
  return (
    <label className="flex h-6 min-w-0 items-center gap-1.5 rounded-full bg-chip pl-2 pr-1.5 text-[11.5px] text-muted transition-shadow duration-150 focus-within:ring-2 focus-within:ring-accent-soft">
      <span className="flex-none">
        <Name de={de} vi={vi} pinned={pinned} />
      </span>
      {children}
    </label>
  );
}

const typed = "h-5 min-w-0 bg-transparent text-[12px] font-medium text-ink outline-none";
const both = (de: string, vi: string) => (
  <>
    {de} <span className="opacity-60">· {vi}</span>
  </>
);

/** Correct the stored label; every change saves at once. A dot means that field stays when the chat is labeled again. */
export function LabelEditor(props: LabelFormValues) {
  return <LabelEditorForm key={props.formKey} {...props} />;
}

/** Correct the stored label. Several fields in a row are one save: the write waits until the person pauses. */
const SAVE_PAUSE_MS = 1200;

function LabelEditorForm({ conversationId, stage, interest, level, place, judgment, loss, resume, pinned, statusSlot, stageSlot, coursesSent, priceSent, autoText }: LabelFormValues) {
  const [status, setStatus] = useState(judgment);
  const [reason, setReason] = useState(loss);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const [base, setBase] = useState<Record<string, string>>({
    stage: isStep(stage) ? stage : "unklar",
    interest,
    level: levelOf(level),
    place: placeOf(place),
    courses_sent: coursesSent ? "ja" : "nein",
    price_sent: priceSent ? "ja" : "nein",
    judgment,
    loss_reason: judgment === "verloren" ? loss : "",
    resume_on: judgment === "verloren" && loss === "spaeter" ? resume : "",
  });
  const baseRef = useRef(base);
  baseRef.current = base;
  const wait = useRef<number | undefined>(undefined);
  const flight = useRef(false);
  const pending = useRef(false);
  const afterFlight = useRef<FormData | null>(null);
  const mounted = useRef(true);
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
      judgment: get("judgment"),
      loss_reason: get("loss_reason"),
      resume_on: get("resume_on"),
    };
    return data;
  };

  const differs = (data: FormData) => Object.entries(baseRef.current).some(([name, value]) => String(data.get(name) ?? "") !== value);

  const flush = async () => {
    if (!form.current) return;
    if (flight.current) {
      pending.current = true;
      return;
    }
    const data = readForm();
    if (!differs(data)) return;
    flight.current = true;
    if (mounted.current) setSaving(true);
    const result = await saveMessengerLabel(null, data);
    flight.current = false;
    if (mounted.current) {
      setSaving(false);
      if (result.error) setError(result.error);
      else {
        setError("");
        if (sent.current) setBase(sent.current);
      }
    }
    if (result.saved) publishLabelSave(result.saved);
    if (afterFlight.current) {
      const latest = afterFlight.current;
      afterFlight.current = null;
      const sentNow = sent.current;
      void saveMessengerLabel(null, latest).then((again) => {
        if (again.saved) publishLabelSave(again.saved);
        if (mounted.current && !again.error && sentNow) setBase(sentNow);
      });
      return;
    }
    if (pending.current) {
      pending.current = false;
      if (!wait.current) void flush();
    }
  };

  // A new field resets the wait, so Interesse + Niveau + Ort become one write.
  const save = () => {
    if (wait.current) window.clearTimeout(wait.current);
    wait.current = window.setTimeout(() => {
      wait.current = undefined;
      void flush();
    }, SAVE_PAUSE_MS);
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (!wait.current || !form.current) return;
      window.clearTimeout(wait.current);
      wait.current = undefined;
      const data = readForm();
      if (!differs(data)) return;
      const send = () => {
        void saveMessengerLabel(null, data).then((result) => {
          if (result.saved) publishLabelSave(result.saved);
        });
      };
      if (flight.current) afterFlight.current = data;
      else send();
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
        name="interest"
        ariaLabel="Interesse / Nhu cầu"
        label={<Label de="Interesse" vi="Nhu cầu" />}
        emptyValue=""
        pinned={locked("interest")}
        defaultValue={interest}
        onChange={save}
        options={[{ value: "", label: "—" }, ...INTERESTS.map((id) => ({ value: id as string, label: id }))]}
      />
      <MenuSelect
        name="level"
        ariaLabel="Niveau / Trình độ"
        label={<Label de="Niveau" vi="Trình độ" />}
        emptyValue="unklar"
        pinned={locked("level")}
        defaultValue={levelOf(level)}
        onChange={save}
        options={LEVELS.map((id) => ({ value: id as string, label: id === "unklar" ? "—" : id }))}
      />
      <MenuSelect
        name="place"
        ariaLabel="Ort / Nơi học"
        label={<Label de="Ort" vi="Nơi học" />}
        emptyValue="unklar"
        pinned={locked("place")}
        defaultValue={placeOf(place)}
        onChange={save}
        options={PLACES.map((id) => ({ value: id as string, label: id === "unklar" ? "—" : id }))}
      />
      {SENT.map((item) => (
        <MenuSelect
          key={item.name}
          name={item.name}
          ariaLabel={`${item.de} / ${item.vi}`}
          label={<Label de={item.de} vi={item.vi} />}
          emptyValue="nein"
          defaultValue={(item.name === "courses_sent" ? coursesSent : priceSent) ? "ja" : "nein"}
          onChange={save}
          options={[
            { value: "ja", label: both(item.de, item.vi), chip: <Label de={`✓ ${item.de}`} vi={`✓ ${item.vi}`} /> },
            { value: "nein", label: both("Noch nicht", "Chưa gửi") },
          ]}
        />
      ))}
      {saving && (
        <span className="anim-fade text-[11px] text-faint">
          <Label de="Speichert…" vi="Đang lưu…" />
        </span>
      )}
      {error ? <p className="m-0 w-full text-[12px] text-bad">{error}</p> : null}
      {/* Steps exist for Sprachkurs only; before the Interesse is known the step is Qualifizieren. */}
      {stageEl &&
        (!interest || interest === FUNNEL_INTEREST || isStep(stage)) &&
        createPortal(
        <MenuSelect
          name="stage"
          ariaLabel="Stufe / Bước"
          label={<Label de="Stufe" vi="Bước" />}
          emptyValue="unklar"
          compact
          form={formId}
          pinned={locked("stage")}
          defaultValue={isStep(stage) ? stage : "unklar"}
          onChange={save}
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
              name="judgment"
              ariaLabel="Status / Trạng thái"
              label={<Label de="Status" vi="Trạng thái" />}
              compact
              form={formId}
              pinned={locked("outcome")}
              defaultValue={status}
              onChange={(v) => {
                setStatus(v);
                save();
              }}
              options={JUDGMENTS.map((item) => ({ value: item.id as string, label: both(item.de, item.vi), chip: item.id === "auto" ? <Label de={autoText.de} vi={autoText.vi} /> : undefined }))}
            />
            {status === "verloren" && (
              <MenuSelect
                name="loss_reason"
                ariaLabel="Grund / Lý do"
                label={<Label de="Grund" vi="Lý do" />}
                emptyValue="unklar"
                compact
                form={formId}
                pinned={locked("loss_reason")}
                defaultValue={reason}
                onChange={(v) => {
                  setReason(v);
                  save();
                }}
                options={LOSS_REASONS.map((id) => ({ value: id as string, label: both(LOSS_TEXT[id].de, LOSS_TEXT[id].vi) }))}
              />
            )}
            {status === "verloren" && reason === "spaeter" && (
              <Field de="Datum" vi="Ngày" pinned={locked("resume_on")}>
                <input name="resume_on" type="date" form={formId} defaultValue={resume} onChange={save} className={typed} />
              </Field>
            )}
          </>,
          slot,
        )}
    </form>
  );
}
