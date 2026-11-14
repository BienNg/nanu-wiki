"use client";

import { useActionState, useRef, useState } from "react";
import { INTERESTS, STAGES, STAGE_INFO, type Stage } from "@/lib/assistant/schema";
import { saveMessengerLabel } from "@/app/(app)/admin/messenger/actions";
import type { ReactNode } from "react";
import { Label } from "@/components/Bi";
import { MenuSelect } from "@/components/admin/MenuSelect";
import { LEVELS, LOSS_REASONS, PLACES, placeOf, type LossReason } from "@/lib/messenger/types";

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

/** Same chip as <MenuSelect>, for the typed field (Datum). */
function Field({ de, vi, pinned, children }: { de: string; vi: string; pinned: boolean; children: ReactNode }) {
  return (
    <label className="flex h-8 min-w-0 items-center gap-1.5 rounded-full bg-chip pl-3 pr-2 text-[12px] text-muted transition-shadow duration-150 focus-within:ring-2 focus-within:ring-accent-soft">
      <span className="flex-none">
        <Name de={de} vi={vi} pinned={pinned} />
      </span>
      {children}
    </label>
  );
}

const typed = "h-6 min-w-0 bg-transparent text-[13px] font-medium text-ink outline-none";
const both = (de: string, vi: string) => (
  <>
    {de} <span className="opacity-60">· {vi}</span>
  </>
);

/** Correct the stored label; every change saves at once. A dot means that field stays when the chat is labeled again. */
export function LabelEditor(props: LabelFormValues) {
  return <LabelEditorForm key={props.formKey} {...props} />;
}

function LabelEditorForm({ conversationId, stage, interest, level, place, judgment, loss, resume, pinned }: LabelFormValues) {
  const [state, action, saving] = useActionState(saveMessengerLabel, null);
  const [status, setStatus] = useState(judgment);
  const [reason, setReason] = useState(loss);
  const form = useRef<HTMLFormElement>(null);
  const locked = (field: string) => pinned.includes(field);
  // After the re-render, so the new value and fields that just appeared (Grund, Datum) are sent too.
  const save = () => setTimeout(() => form.current?.requestSubmit(), 0);

  return (
    <form ref={form} action={action} className="flex min-w-0 flex-wrap items-center gap-2">
      <input type="hidden" name="conversation_id" value={conversationId} />
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
        defaultValue={level}
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
      <MenuSelect
        name="stage"
        ariaLabel="Stufe / Bước"
        label={<Label de="Stufe" vi="Bước" />}
        emptyValue="unklar"
        pinned={locked("stage")}
        defaultValue={stage}
        onChange={save}
        options={[
          { value: "unklar", label: "—" },
          ...STAGES.map((id) => ({ value: id as string, label: both(STAGE_INFO[id as Stage].short_de, STAGE_INFO[id as Stage].short_vi) })),
        ]}
      />
      <MenuSelect
        name="judgment"
        ariaLabel="Status / Trạng thái"
        label={<Label de="Status" vi="Trạng thái" />}
        keepLabel
        pinned={locked("outcome")}
        defaultValue={status}
        onChange={(v) => {
          setStatus(v);
          save();
        }}
        options={JUDGMENTS.map((item) => ({ value: item.id as string, label: both(item.de, item.vi) }))}
      />
      {status === "verloren" && (
        <MenuSelect
          name="loss_reason"
          ariaLabel="Grund / Lý do"
          label={<Label de="Grund" vi="Lý do" />}
        emptyValue="unklar"
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
          <input name="resume_on" type="date" defaultValue={resume} onChange={save} className={typed} />
        </Field>
      )}
      {saving && (
        <span className="anim-fade text-[11px] text-faint">
          <Label de="Speichert…" vi="Đang lưu…" />
        </span>
      )}
      {state?.error ? <p className="m-0 w-full text-[12px] text-bad">{state.error}</p> : null}
    </form>
  );
}
