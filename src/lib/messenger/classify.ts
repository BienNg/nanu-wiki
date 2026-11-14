import { isStep, type Step } from "./steps";
import { LOSS_REASONS, OUTCOMES, type LossReason, type MessengerFact, type Outcome } from "./types";

/** Vietnam has no daylight-saving time. */
export const TZ = "Asia/Ho_Chi_Minh";
const TZ_OFFSET_MS = 7 * 60 * 60 * 1000;

export const WORK_HOUR_START = 9;
export const WORK_HOUR_END = 18;

/** Haiku 5.5, prompts under 100k tokens. €10 ≈ $10.80 at this fixed rate. */
export const INPUT_USD_PER_TOKEN = 0.1 / 1_000_000;
export const OUTPUT_USD_PER_TOKEN = 0.5 / 1_000_000;
export const USD_PER_EUR = 1.08;
export const LABEL_BUDGET_EUR = 10;

const DAY_MS = 24 * 60 * 60 * 1000;

export function eurSpent(inputTokens: number, outputTokens: number) {
  const usd = inputTokens * INPUT_USD_PER_TOKEN + outputTokens * OUTPUT_USD_PER_TOKEN;
  return usd / USD_PER_EUR;
}

export function formatVnDate(d: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function monthKey(d = new Date()) {
  return formatVnDate(d).slice(0, 7);
}

export function inWorkHours(iso: string) {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "numeric", hourCycle: "h23" }).format(new Date(iso)));
  return hour >= WORK_HOUR_START && hour < WORK_HOUR_END;
}

/** Monday 00:00 in Vietnam for the week that contains `now`. */
export function vietnamWeekStart(now = new Date()) {
  const vn = new Date(now.getTime() + TZ_OFFSET_MS);
  const day = vn.getUTCDay();
  const mondayOffset = day === 0 ? 6 : day - 1;
  const mondayUtc = Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate() - mondayOffset);
  return new Date(mondayUtc - TZ_OFFSET_MS);
}

export function parseWeekStart(w: string | undefined) {
  if (w && /^\d{4}-\d{2}-\d{2}$/.test(w)) {
    const [y, m, d] = w.split("-").map(Number);
    const noonThatDay = new Date(Date.UTC(y, m - 1, d) - TZ_OFFSET_MS + 12 * 60 * 60 * 1000);
    if (!Number.isNaN(noonThatDay.getTime())) return vietnamWeekStart(noonThatDay);
  }
  return vietnamWeekStart();
}

export function addDays(d: Date, days: number) {
  return new Date(d.getTime() + days * DAY_MS);
}

export function newestActivity(f: MessengerFact) {
  const times = [f.last_customer_at, f.last_page_at].filter((t): t is string => !!t);
  if (!times.length) return null;
  return times.reduce((a, b) => (a > b ? a : b));
}

/** Follow-up was sent, a full day passed, and the person still has not written. Zalo handoffs are not losses. */
export function followupIgnored(f: MessengerFact, now = Date.now()) {
  if (!f.followup_sent || !f.last_from_page || !f.last_page_at || f.last_page_has_zalo) return false;
  return now - new Date(f.last_page_at).getTime() >= DAY_MS;
}

export function isOutcome(value: string): value is Outcome {
  return (OUTCOMES as readonly string[]).includes(value);
}

export function isLossReason(value: string | null | undefined): value is LossReason {
  return !!value && (LOSS_REASONS as readonly string[]).includes(value);
}

export function isStage(value: string): value is Step | "unklar" {
  return value === "unklar" || isStep(value);
}
