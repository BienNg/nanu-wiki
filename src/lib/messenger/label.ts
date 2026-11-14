import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod";
import { INTERESTS } from "@/lib/assistant/schema";
import { redact } from "@/lib/assistant/suggest";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  LABEL_BUDGET_EUR,
  applyGuards,
  eurSpent,
  followupIgnored,
  monthKey,
  newestActivity,
  textRule,
} from "./classify";
import { mergePinned } from "./nextAction";
import { isStep, stepFor } from "./steps";
import { LEVELS, LOSS_REASONS, OUTCOMES, PLACES, type ChatLineRow, type LabelDraft, type MessengerFact, type Outcome, type StoredLabel } from "./types";

const MODEL = "claude-haiku-5-5";
const MAX_MODEL = 8;
const BATCH = 40;
const TRANSCRIPT_CHARS = 8000;
const LOOKBACK_MS = 21 * 24 * 60 * 60 * 1000;

const STATED = new Set(["preis", "zeit_passt_nicht", "spaeter", "andere_schule"]);
const SKIP_TIMEOUT = new Set<Outcome>(["kein_lead", "bestandskunde", "weiter_auf_zalo"]);

const LabelSchema = z.object({
  interest: z.enum([...INTERESTS, "keins"]),
  level: z.enum(LEVELS),
  place: z.enum(PLACES),
  outcome: z.enum(OUTCOMES),
  loss_reason: z.enum(LOSS_REASONS).nullable(),
  evidence: z.string(),
});

export type LabelRun = {
  rules: number;
  model: number;
  skipped: "running" | "cap" | "no-key" | null;
  error?: string;
};

function hasNewMessages(fact: MessengerFact, label: StoredLabel | undefined) {
  if (!label) return fact.customer_msgs > 0;
  const newest = newestActivity(fact);
  return !!newest && new Date(newest) > new Date(label.labeled_through);
}

function needsTimeoutPatch(fact: MessengerFact, label: StoredLabel | undefined) {
  if (!label || hasNewMessages(fact, label) || !followupIgnored(fact)) return false;
  if (SKIP_TIMEOUT.has(label.outcome)) return false;
  if (label.outcome === "verloren" && label.loss_reason === "keine_antwort") return false;
  if (label.loss_reason && STATED.has(label.loss_reason)) return false;
  return true;
}

function transcript(lines: ChatLineRow[]) {
  const body = lines
    .map((m) => {
      const text = m.text?.trim() ? redact(m.text.trim()) : "(Anhang/Sticker)";
      return `${m.from_page ? "WIR" : "KUNDE"}: ${text}`;
    })
    .join("\n");
  if (body.length <= TRANSCRIPT_CHARS) return body;
  return body.slice(body.length - TRANSCRIPT_CHARS);
}

function systemPrompt() {
  return `You classify one Facebook Messenger thread for NaNu NaNa, a German language school for Vietnamese people.
Return only the schema.

outcome:
- offen: in progress, last step unclear
- wartet_auf_uns: the person wrote last
- wartet_auf_kunde: the Page wrote last
- weiter_auf_zalo: the Page moved the chat to Zalo and the person stopped here
- bestandskunde: existing student (class, Zoom, homework), not a new enrollment
- kein_lead: job, partner, spam, or not a course inquiry
- verloren: they stopped and named a reason, or ignored a follow-up

loss_reason is null unless outcome is verloren. Use keine_antwort only when a follow-up was already sent. Do not invent a price objection they did not say.
interest is keins when nothing fits. level and place are unklar when unknown. A beginner with no German is A1.
place is where they would learn: Saigon or Hanoi when they live there (or want a class on site there), Online VN when they live elsewhere in Vietnam or want online from Vietnam, Online DE when they live in Germany.
evidence: one short German sentence quoting a few of their words.`;
}

async function saveLabel(
  db: ReturnType<typeof createAdminClient>,
  fact: MessengerFact,
  draft: LabelDraft,
  tokens: { input: number; output: number },
  previous?: StoredLabel,
) {
  const merged = mergePinned(draft, previous);
  // The step follows from the fields unless a person picked it; "Kurse/Preis geschickt" stays.
  // A pin only counts when it holds one of the steps (old stage names were pinned too).
  const stagePinned = !!previous?.pinned?.includes("stage") && isStep(previous.stage);
  if (!stagePinned) merged.stage = stepFor({ ...merged, courses_sent: previous?.courses_sent, price_sent: previous?.price_sent });
  const through = newestActivity(fact) ?? new Date().toISOString();
  const { error } = await db.from("messenger_labels").upsert({
    conversation_id: fact.id,
    stage: merged.stage,
    interest: merged.interest,
    level: merged.level,
    place: merged.place,
    outcome: merged.outcome,
    loss_reason: merged.loss_reason,
    evidence: merged.evidence.slice(0, 500),
    labeled_through: through,
    source: merged.source,
    pinned: (previous?.pinned ?? []).filter((field) => field !== "stage" || stagePinned),
    resume_on: previous?.resume_on ?? null,
    input_tokens: tokens.input,
    output_tokens: tokens.output,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

/** Label threads that changed, plus quiet threads whose follow-up was ignored. At most 8 model calls. */
export async function labelMessenger(now = Date.now()): Promise<LabelRun> {
  const db = createAdminClient();
  const result: LabelRun = { rules: 0, model: 0, skipped: null };

  const { data: state, error: stateErr } = await db.from("messenger_label_state").select("running_until").eq("id", 1).maybeSingle();
  if (stateErr) throw new Error(stateErr.message);
  if (state?.running_until && new Date(state.running_until).getTime() > now) {
    result.skipped = "running";
    return result;
  }

  await db.from("messenger_label_state").update({ running_until: new Date(now + 50_000).toISOString() }).eq("id", 1);

  try {
    const since = new Date(now - LOOKBACK_MS).toISOString();
    const { data: factRows, error: factErr } = await db
      .from("messenger_facts")
      .select("*")
      .eq("channel", "messenger")
      .gt("customer_msgs", 0)
      .gte("updated_time", since)
      .order("updated_time", { ascending: false })
      .limit(500);
    if (factErr) throw new Error(factErr.message);
    const facts = (factRows ?? []) as MessengerFact[];

    const labels = new Map<string, StoredLabel>();
    for (let i = 0; i < facts.length; i += 100) {
      const slice = facts.slice(i, i + 100).map((f) => f.id);
      const { data, error } = await db
        .from("messenger_labels")
        .select("conversation_id, stage, interest, level, place, outcome, loss_reason, evidence, labeled_through, source, pinned, resume_on, courses_sent, price_sent")
        .in("conversation_id", slice);
      if (error) throw new Error(error.message);
      for (const row of (data ?? []) as StoredLabel[]) labels.set(row.conversation_id, row);
    }

    for (const fact of facts) {
      const label = labels.get(fact.id);
      if (!needsTimeoutPatch(fact, label) || !label) continue;
      const draft = applyGuards(
        {
          stage: label.stage,
          interest: label.interest,
          level: label.level,
          place: label.place,
          outcome: "verloren",
          loss_reason: "keine_antwort",
          evidence: "Nach der Nachfrage ist einen Tag lang keine Antwort gekommen.",
          source: "rule",
        },
        fact,
        now,
      );
      await saveLabel(db, fact, draft, { input: 0, output: 0 }, label);
      result.rules++;
    }

    const fresh = facts
      .filter((f) => hasNewMessages(f, labels.get(f.id)))
      .sort((a, b) => {
        const au = labels.has(a.id) ? 1 : 0;
        const bu = labels.has(b.id) ? 1 : 0;
        if (au !== bu) return au - bu;
        return (newestActivity(b) ?? "").localeCompare(newestActivity(a) ?? "");
      })
      .slice(0, BATCH);

    if (!fresh.length) {
      await db.from("messenger_label_state").update({ last_error: null }).eq("id", 1);
      return result;
    }

    const { data: messageRows, error: msgErr } = await db
      .from("messenger_messages")
      .select("conversation_id, from_page, text, created_time")
      .in("conversation_id", fresh.map((f) => f.id))
      .order("created_time", { ascending: true })
      .limit(5000);
    if (msgErr) throw new Error(msgErr.message);
    const byId = new Map<string, ChatLineRow[]>();
    for (const row of (messageRows ?? []) as ChatLineRow[]) {
      const list = byId.get(row.conversation_id) ?? [];
      list.push(row);
      byId.set(row.conversation_id, list);
    }

    const month = monthKey(new Date(now));
    const { data: budgetRow, error: budgetErr } = await db.from("messenger_label_budget").select("input_tokens, output_tokens").eq("month", month).maybeSingle();
    if (budgetErr) throw new Error(budgetErr.message);
    let inputTokens = budgetRow?.input_tokens ?? 0;
    let outputTokens = budgetRow?.output_tokens ?? 0;

    const client = process.env.ANTHROPIC_API_KEY ? new Anthropic() : null;
    if (!client) result.skipped = "no-key";

    for (const fact of fresh) {
      const lines = byId.get(fact.id) ?? [];
      const customers = lines.filter((l) => !l.from_page).map((l) => l.text ?? "");
      const ruled = textRule(customers, fact.last_from_page);
      if (ruled) {
        await saveLabel(db, fact, applyGuards(ruled, fact, now), { input: 0, output: 0 }, labels.get(fact.id));
        result.rules++;
        continue;
      }
      if (!client || result.model >= MAX_MODEL) continue;
      if (eurSpent(inputTokens, outputTokens) >= LABEL_BUDGET_EUR) {
        result.skipped = "cap";
        continue;
      }

      const hours = fact.last_customer_at ? Math.round((now - new Date(fact.last_customer_at).getTime()) / 3_600_000) : 0;
      try {
        const res = await client.messages.parse({
          model: MODEL,
          max_tokens: 2000,
          output_config: { effort: "low", format: zodOutputFormat(LabelSchema) },
          system: systemPrompt(),
          messages: [
            {
              role: "user",
              content: `Follow-up already sent: ${fact.followup_sent ? "yes" : "no"}\nLast message from: ${fact.last_from_page ? "page" : "customer"}\nHours since their last message: ${hours}\n\n<conversation>\n${transcript(lines)}\n</conversation>`,
            },
          ],
        });
        const usedIn = res.usage.input_tokens + (res.usage.cache_creation_input_tokens ?? 0) + (res.usage.cache_read_input_tokens ?? 0);
        const usedOut = res.usage.output_tokens;
        inputTokens += usedIn;
        outputTokens += usedOut;
        await db.from("messenger_label_budget").upsert({ month, input_tokens: inputTokens, output_tokens: outputTokens });

        if (res.stop_reason === "max_tokens" || !res.parsed_output) throw new Error("Label-Antwort unvollständig");
        const parsed = res.parsed_output;
        const draft: LabelDraft = applyGuards(
          {
            stage: "unklar",
            interest: parsed.interest === "keins" ? null : parsed.interest,
            level: parsed.level,
            place: parsed.place,
            outcome: parsed.outcome,
            loss_reason: parsed.loss_reason,
            evidence: parsed.evidence,
            source: "model",
          },
          fact,
          now,
        );
        await saveLabel(db, fact, draft, { input: usedIn, output: usedOut }, labels.get(fact.id));
        result.model++;
      } catch {
        // One bad reply must not stop the run or block this chat forever.
        await saveLabel(
          db,
          fact,
          applyGuards(
            {
              stage: "unklar",
              interest: null,
              level: null,
              place: null,
              outcome: fact.last_from_page ? "wartet_auf_kunde" : "wartet_auf_uns",
              loss_reason: null,
              evidence: "Automatische Einordnung ist fehlgeschlagen.",
              source: "rule",
            },
            fact,
            now,
          ),
          { input: 0, output: 0 },
          labels.get(fact.id),
        );
        result.rules++;
      }
    }

    await db.from("messenger_label_state").update({ last_error: null }).eq("id", 1);
    return result;
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    result.error = message;
    await db.from("messenger_label_state").update({ last_error: message.slice(0, 1000) }).eq("id", 1);
    return result;
  } finally {
    await db.from("messenger_label_state").update({ running_until: null, last_run_at: new Date().toISOString() }).eq("id", 1);
  }
}
