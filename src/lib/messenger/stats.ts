import "server-only";
import { INTERESTS } from "@/lib/assistant/schema";
import { STEPS, STEP_INFO } from "./steps";
import { addDays, eurSpent, formatVnDate, inWorkHours, monthKey, parseWeekStart, LABEL_BUDGET_EUR } from "./classify";
import type { LossReason, MessengerFact, Outcome, StoredLabel } from "./types";
import { LOSS_REASONS, OUTCOMES } from "./types";

const LEAD_EXCLUDED = new Set<Outcome>(["bestandskunde", "kein_lead"]);

const OUTCOME_LABEL: Record<Outcome, { de: string; vi: string }> = {
  offen: { de: "Offen", vi: "Đang mở" },
  wartet_auf_uns: { de: "Wartet auf uns", vi: "Chờ mình trả lời" },
  wartet_auf_kunde: { de: "Wartet auf die Person", vi: "Chờ khách" },
  weiter_auf_zalo: { de: "Weiter auf Zalo", vi: "Chuyển sang Zalo" },
  bestandskunde: { de: "Bestandskunde", vi: "Học viên cũ" },
  kein_lead: { de: "Keine Anfrage", vi: "Không phải khách" },
  verloren: { de: "Verloren", vi: "Mất khách" },
};

const LOSS_LABEL: Record<LossReason, { de: string; vi: string }> = {
  preis: { de: "Preis", vi: "Học phí" },
  zeit_passt_nicht: { de: "Zeit passt nicht", vi: "Lịch không hợp" },
  spaeter: { de: "Später", vi: "Để sau" },
  andere_schule: { de: "Andere Schule", vi: "Trường khác" },
  keine_antwort: { de: "Keine Antwort nach Nachfrage", vi: "Không trả lời sau tin nhắc" },
  kein_naechster_schritt: { de: "Kein nächster Schritt", vi: "Không có bước tiếp" },
  unklar: { de: "Unklar", vi: "Chưa rõ" },
};

export type PersonRow = {
  id: string;
  name: string;
  at: string;
  detailDe: string;
  detailVi: string;
};

export type StatsSnapshot = {
  weekStart: string;
  weekEnd: string;
  prevWeek: string;
  nextWeek: string | null;
  rangeDe: string;
  rangeVi: string;
  newThreads: number;
  inboundMessages: number;
  leads: number;
  bestand: number;
  keinLead: number;
  unlabeled: number;
  medianReplySeconds: number | null;
  answeredWithin15: number;
  workHourLeads: number;
  buckets: { id: string; de: string; vi: string; count: number }[];
  days: { date: string; de: string; vi: string; threads: number; leads: number }[];
  funnel: { id: string; de: string; vi: string; count: number }[];
  outcomes: { id: string; de: string; vi: string; count: number }[];
  losses: { id: string; de: string; vi: string; count: number }[];
  waiting: PersonRow[];
  quiet: PersonRow[];
  price: PersonRow[];
  budgetEur: number;
  capReached: boolean;
  labelError: string | null;
  interest: string;
  level: string;
};

type Client = {
  from: (table: string) => any;
};

const WAIT_MS = 15 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function rangeLabel(start: Date, endInclusive: Date) {
  const fmt = new Intl.DateTimeFormat("de-DE", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit", month: "2-digit" });
  return `${fmt.format(start)}–${fmt.format(endInclusive)}`;
}

function dayLabel(isoDate: string) {
  const noon = new Date(`${isoDate}T12:00:00+07:00`);
  return {
    de: new Intl.DateTimeFormat("de-DE", { timeZone: "Asia/Ho_Chi_Minh", weekday: "short", day: "2-digit" }).format(noon),
    vi: new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", weekday: "short", day: "2-digit" }).format(noon),
  };
}

function median(nums: number[]) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : Math.round((s[mid - 1] + s[mid]) / 2);
}

function isLead(label: StoredLabel | undefined) {
  if (!label) return true;
  return !LEAD_EXCLUDED.has(label.outcome);
}

function matchesFilter(label: StoredLabel | undefined, interest: string, level: string) {
  if (interest && label?.interest !== interest) return false;
  if (level && label?.level !== level) return false;
  return true;
}

export async function loadMessengerStats(
  supabase: Client,
  opts: { week?: string; interest?: string; level?: string },
): Promise<StatsSnapshot> {
  const start = parseWeekStart(opts.week);
  const end = addDays(start, 7);
  const current = parseWeekStart(undefined);
  const interest = INTERESTS.includes(opts.interest as (typeof INTERESTS)[number]) ? opts.interest! : "";
  const level = ["A1", "A2", "B1", "B2", "C1"].includes(opts.level ?? "") ? opts.level! : "";
  const startIso = start.toISOString();
  const endIso = end.toISOString();
  const quietBefore = new Date(Date.now() - DAY_MS).toISOString();

  const [weekRes, inboundRes, waitingRes, quietRes, priceRes, consultRes, budgetRes, stateRes] = await Promise.all([
    supabase.from("messenger_facts").select("*").eq("channel", "messenger").gte("first_customer_at", startIso).lt("first_customer_at", endIso),
    supabase.from("messenger_messages").select("id", { count: "exact", head: true }).eq("channel", "messenger").eq("from_page", false).gte("created_time", startIso).lt("created_time", endIso),
    supabase.from("messenger_facts").select("id, customer_name, last_customer_at, customer_msgs, last_from_page").eq("channel", "messenger").eq("last_from_page", false).gt("customer_msgs", 0).order("last_customer_at", { ascending: true }).limit(80),
    supabase
      .from("messenger_facts")
      .select("id, customer_name, last_customer_at, last_page_at, followup_sent, last_from_page, last_page_has_zalo, customer_msgs")
      .eq("channel", "messenger")
      .eq("last_from_page", true)
      .eq("followup_sent", false)
      .eq("last_page_has_zalo", false)
      .gt("customer_msgs", 0)
      .lte("last_customer_at", quietBefore)
      .order("last_customer_at", { ascending: true })
      .limit(40),
    supabase.from("messenger_labels").select("conversation_id, stage, loss_reason, outcome, evidence").eq("loss_reason", "preis").limit(40),
    supabase.from("messenger_labels").select("conversation_id, stage, loss_reason, outcome").eq("stage", "preis").limit(200),
    supabase.from("messenger_label_budget").select("input_tokens, output_tokens").eq("month", monthKey()).maybeSingle(),
    supabase.from("messenger_label_state").select("last_error").eq("id", 1).maybeSingle(),
  ]);

  for (const res of [weekRes, inboundRes, waitingRes, quietRes, priceRes, consultRes, budgetRes, stateRes]) {
    if (res.error) throw new Error(res.error.message);
  }

  const weekFacts = (weekRes.data ?? []) as MessengerFact[];
  const ids = weekFacts.map((f) => f.id);
  const labels = new Map<string, StoredLabel>();
  if (ids.length) {
    const labelRes = await supabase.from("messenger_labels").select("conversation_id, stage, interest, level, place, outcome, loss_reason, evidence, labeled_through, source").in("conversation_id", ids);
    if (labelRes.error) throw new Error(labelRes.error.message);
    for (const row of (labelRes.data ?? []) as StoredLabel[]) labels.set(row.conversation_id, row);
  }

  const cohort = weekFacts.filter((f) => matchesFilter(labels.get(f.id), interest, level));
  let bestand = 0;
  let keinLead = 0;
  const leads: { fact: MessengerFact; label?: StoredLabel }[] = [];
  for (const fact of cohort) {
    const label = labels.get(fact.id);
    if (label?.outcome === "bestandskunde") bestand++;
    else if (label?.outcome === "kein_lead") keinLead++;
    if (isLead(label)) leads.push({ fact, label });
  }

  const workHour = leads.filter((l) => l.fact.first_customer_at && inWorkHours(l.fact.first_customer_at));
  const buckets = [
    { id: "5", de: "Unter 5 Min.", vi: "Dưới 5 phút", count: 0 },
    { id: "15", de: "Unter 15 Min.", vi: "Dưới 15 phút", count: 0 },
    { id: "60", de: "Unter 1 Std.", vi: "Dưới 1 giờ", count: 0 },
    { id: "slow", de: "Langsamer", vi: "Chậm hơn", count: 0 },
    { id: "none", de: "Keine Antwort", vi: "Chưa trả lời", count: 0 },
  ];
  const replied: number[] = [];
  for (const { fact } of workHour) {
    const s = fact.reply_seconds;
    if (s == null) buckets[4].count++;
    else if (s < 300) buckets[0].count++;
    else if (s < 900) buckets[1].count++;
    else if (s < 3600) buckets[2].count++;
    else buckets[3].count++;
    if (s != null) replied.push(s);
  }

  const funnelIds = [
    ...STEPS.map((stage) => ({ id: stage as string, de: STEP_INFO[stage].short_de, vi: STEP_INFO[stage].short_vi })),
    { id: "unklar", de: "Unklar", vi: "Chưa rõ" },
    { id: "unlabeled", de: "Noch ohne Einordnung", vi: "Chưa gắn nhãn" },
  ];
  const funnel = funnelIds.map((row) => ({
    ...row,
    count: leads.filter(({ label }) => (row.id === "unlabeled" ? !label : label?.stage === row.id)).length,
  }));

  const outcomes = OUTCOMES.map((id) => ({
    id,
    ...OUTCOME_LABEL[id],
    count: cohort.filter((f) => labels.get(f.id)?.outcome === id).length,
  })).filter((row) => row.count > 0);

  const losses = LOSS_REASONS.map((id) => ({
    id,
    ...LOSS_LABEL[id],
    count: leads.filter(({ label }) => label?.outcome === "verloren" && label.loss_reason === id).length,
  })).filter((row) => row.count > 0);

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = formatVnDate(addDays(start, i));
    const onDay = cohort.filter((f) => f.first_customer_at && formatVnDate(new Date(f.first_customer_at)) === date);
    return { date, ...dayLabel(date), threads: onDay.length, leads: onDay.filter((f) => isLead(labels.get(f.id))).length };
  });

  const excludeIds = new Set<string>();
  const listIds = [...(waitingRes.data ?? []), ...(quietRes.data ?? [])].map((r: { id: string }) => r.id);
  if (listIds.length) {
    const tagged = await supabase.from("messenger_labels").select("conversation_id, outcome").in("conversation_id", listIds);
    if (tagged.error) throw new Error(tagged.error.message);
    for (const row of (tagged.data ?? []) as { conversation_id: string; outcome: Outcome }[]) {
      if (row.outcome === "kein_lead" || row.outcome === "bestandskunde") excludeIds.add(row.conversation_id);
    }
  }

  const waiting: PersonRow[] = ((waitingRes.data ?? []) as MessengerFact[])
    .filter((f) => f.last_customer_at && Date.now() - new Date(f.last_customer_at).getTime() >= WAIT_MS && !excludeIds.has(f.id))
    .slice(0, 30)
    .map((f) => ({
      id: f.id,
      name: f.customer_name ?? "Unbekannt",
      at: f.last_customer_at!,
      detailDe: "Letzte Nachricht von der Person",
      detailVi: "Tin cuối là của khách",
    }));

  const quiet: PersonRow[] = ((quietRes.data ?? []) as MessengerFact[])
    .filter((f) => !excludeIds.has(f.id))
    .slice(0, 30)
    .map((f) => ({
      id: f.id,
      name: f.customer_name ?? "Unbekannt",
      at: f.last_customer_at ?? f.updated_time,
      detailDe: "Seit 24 Stunden still, keine Nachfrage",
      detailVi: "Im lặng 24 giờ, chưa nhắn lại",
    }));

  const priceIds = new Set<string>(((priceRes.data ?? []) as { conversation_id: string }[]).map((r) => r.conversation_id));
  const consultSilent = new Set<string>();
  for (const row of (consultRes.data ?? []) as { conversation_id: string; outcome: Outcome }[]) {
    if (row.outcome !== "kein_lead" && row.outcome !== "bestandskunde" && row.outcome !== "weiter_auf_zalo") consultSilent.add(row.conversation_id);
  }
  const priceFactIds = [...new Set([...priceIds, ...consultSilent])].slice(0, 200);
  let price: PersonRow[] = [];
  if (priceFactIds.length) {
    const factsRes = await supabase
      .from("messenger_facts")
      .select("id, customer_name, last_customer_at, last_from_page, followup_sent, updated_time")
      .in("id", priceFactIds);
    if (factsRes.error) throw new Error(factsRes.error.message);
    price = ((factsRes.data ?? []) as MessengerFact[])
      .filter((f) => {
        const silent = f.last_from_page && !!f.last_customer_at && Date.now() - new Date(f.last_customer_at).getTime() >= DAY_MS;
        if (!silent) return false;
        if (priceIds.has(f.id)) return true;
        return !f.followup_sent;
      })
      .sort((a, b) => (a.last_customer_at ?? "").localeCompare(b.last_customer_at ?? ""))
      .slice(0, 30)
      .map((f) => ({
        id: f.id,
        name: f.customer_name ?? "Unbekannt",
        at: f.last_customer_at ?? f.updated_time,
        detailDe: priceIds.has(f.id) ? "Preis als Grund genannt" : "Beratung, dann 24 Stunden still",
        detailVi: priceIds.has(f.id) ? "Khách nói do học phí" : "Đang tư vấn rồi im 24 giờ",
      }));
  }

  const budget = budgetRes.data as { input_tokens: number; output_tokens: number } | null;
  const budgetEur = eurSpent(budget?.input_tokens ?? 0, budget?.output_tokens ?? 0);

  return {
    weekStart: formatVnDate(start),
    weekEnd: formatVnDate(addDays(start, 6)),
    prevWeek: formatVnDate(addDays(start, -7)),
    nextWeek: end.getTime() <= current.getTime() ? formatVnDate(end) : null,
    rangeDe: rangeLabel(start, addDays(start, 6)),
    rangeVi: rangeLabel(start, addDays(start, 6)),
    newThreads: cohort.length,
    inboundMessages: inboundRes.count ?? 0,
    leads: leads.length,
    bestand,
    keinLead,
    unlabeled: leads.filter((l) => !l.label).length,
    medianReplySeconds: median(replied),
    answeredWithin15: buckets[0].count + buckets[1].count,
    workHourLeads: workHour.length,
    buckets,
    days,
    funnel,
    outcomes,
    losses,
    waiting,
    quiet,
    price,
    budgetEur,
    capReached: budgetEur >= LABEL_BUDGET_EUR,
    labelError: (stateRes.data as { last_error: string | null } | null)?.last_error ?? null,
    interest,
    level,
  };
}

export function formatDuration(seconds: number) {
  if (seconds < 60) return { de: `${seconds} Sek.`, vi: `${seconds} giây` };
  const min = Math.round(seconds / 60);
  if (min < 60) return { de: `${min} Min.`, vi: `${min} phút` };
  const h = Math.floor(min / 60);
  const m = min % 60;
  return { de: `${h} Std. ${m} Min.`, vi: `${h} giờ ${m} phút` };
}

export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("de-DE", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
