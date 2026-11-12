"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { INTERESTS, STAGES, STAGE_INFO, type Stage } from "@/lib/assistant/schema";
import { saveMessengerLabel } from "@/app/(app)/admin/messenger/actions";
import type { ReactNode } from "react";
import { Label } from "@/components/Bi";
import { LEVELS, LOSS_REASONS, type LossReason } from "@/lib/messenger/types";

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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="h-8 rounded-full bg-accent px-3 text-[12.5px] font-medium text-white disabled:opacity-60">
      <Label de={pending ? "Speichert…" : "Speichern"} vi={pending ? "Đang lưu…" : "Lưu"} />
    </button>
  );
}

function Field({ de, vi, pinned, children }: { de: string; vi: string; pinned: boolean; children: ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-[11px] text-muted">
      <span>
        <Label de={de} vi={vi} />
        {pinned ? <span className="text-accent"> ●</span> : null}
      </span>
      {children}
    </label>
  );
}

const control = "h-8 rounded-lg border border-line bg-white px-2 text-[13px] text-ink";

/** Correct the stored label. A dot means that field stays when the chat is labeled again. */
export function LabelEditor(props: LabelFormValues) {
  return <LabelEditorForm key={props.formKey} {...props} />;
}

function LabelEditorForm({ conversationId, stage, interest, level, place, judgment, loss, resume, pinned }: LabelFormValues) {
  const [state, action] = useActionState(saveMessengerLabel, null);
  const [status, setStatus] = useState(judgment);
  const [reason, setReason] = useState(loss);
  const locked = (field: string) => pinned.includes(field);

  return (
    <form action={action} className="flex flex-col gap-2 border-b border-line bg-[#FAFBFC] px-3 py-2.5">
      <input type="hidden" name="conversation_id" value={conversationId} />
      <div className="flex flex-wrap items-end gap-2">
        <Field de="Interesse" vi="Nhu cầu" pinned={locked("interest")}>
          <select name="interest" defaultValue={interest} className={control}>
            <option value="">—</option>
            {INTERESTS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Field>
        <Field de="Niveau" vi="Trình độ" pinned={locked("level")}>
          <select name="level" defaultValue={level} className={control}>
            {LEVELS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </Field>
        <Field de="Ort" vi="Nơi ở" pinned={locked("place")}>
          <input name="place" defaultValue={place} className={`${control} w-28`} />
        </Field>
        <Field de="Stufe" vi="Bước" pinned={locked("stage")}>
          <select name="stage" defaultValue={stage} className={control}>
            <option value="unklar">Unklar · Chưa rõ</option>
            {STAGES.map((id) => (
              <option key={id} value={id}>
                {STAGE_INFO[id as Stage].short_de} · {STAGE_INFO[id as Stage].short_vi}
              </option>
            ))}
          </select>
        </Field>
        <Field de="Status" vi="Trạng thái" pinned={locked("outcome")}>
          <select name="judgment" value={status} onChange={(e) => setStatus(e.target.value)} className={control}>
            {JUDGMENTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.de} · {item.vi}
              </option>
            ))}
          </select>
        </Field>
        {status === "verloren" && (
          <Field de="Grund" vi="Lý do" pinned={locked("loss_reason")}>
            <select name="loss_reason" value={reason} onChange={(e) => setReason(e.target.value)} className={control}>
              {LOSS_REASONS.map((id) => (
                <option key={id} value={id}>
                  {LOSS_TEXT[id].de} · {LOSS_TEXT[id].vi}
                </option>
              ))}
            </select>
          </Field>
        )}
        {status === "verloren" && reason === "spaeter" && (
          <Field de="Datum" vi="Ngày" pinned={locked("resume_on")}>
            <input name="resume_on" type="date" defaultValue={resume} className={control} />
          </Field>
        )}
        <SubmitButton />
      </div>
      {state?.error ? <p className="m-0 text-[12px] text-bad">{state.error}</p> : null}
    </form>
  );
}
