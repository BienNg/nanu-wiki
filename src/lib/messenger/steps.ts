import { placeOf, type Outcome } from "./types";

/**
 * Steps of the Sprachkurs funnel in the Messenger inbox. A step is named after what we do next.
 *
 *   qualifizieren  Interesse is not known yet                    → ask what they want
 *   bedarf         Sprachkurs, but Niveau or Ort is missing      → ask for them
 *   kurse          Niveau and Ort are known                      → send the courses that fit
 *   preis          staff set "Kurse geschickt"                   → send the price and our packages
 *   anmeldung      staff set "Preis geschickt"                   → close sign-up and payment
 *
 * All of it follows from the label fields (`stepFor`); "Kurse geschickt" and "Preis geschickt" are
 * two yes/no fields only staff set, and they can take them back. Other interests have no steps yet.
 * The reply assistant keeps its own stages (src/lib/assistant/schema.ts).
 */
export const STEPS = ["qualifizieren", "bedarf", "kurse", "preis", "anmeldung"] as const;
export type Step = (typeof STEPS)[number];

export const FUNNEL_INTEREST = "Sprachkurs";

/** `aim` is the goal in a few words (chip in the chat header); `goal` is the full sentence (its tooltip). */
export const STEP_INFO: Record<Step, { short_de: string; short_vi: string; aim_de: string; aim_vi: string; goal_de: string; goal_vi: string }> = {
  qualifizieren: {
    short_de: "Qualifizieren",
    short_vi: "Tìm hiểu",
    aim_de: "Interesse herausfinden",
    aim_vi: "Tìm hiểu nhu cầu",
    goal_de: "Herausfinden, wofür sich die Person interessiert.",
    goal_vi: "Tìm hiểu khách quan tâm đến gì.",
  },
  bedarf: {
    short_de: "Bedarf",
    short_vi: "Nhu cầu",
    aim_de: "Passenden Kurs finden",
    aim_vi: "Tìm khóa phù hợp",
    goal_de: "Ort und Niveau herausfinden, damit wir den passenden Kurs finden.",
    goal_vi: "Hỏi nơi học và trình độ để tìm khóa phù hợp.",
  },
  kurse: {
    short_de: "Kurse",
    short_vi: "Gửi khóa",
    aim_de: "Passende Kurse schicken",
    aim_vi: "Gửi khóa phù hợp",
    goal_de: "Die Kurse schicken, die zu Ort und Niveau passen.",
    goal_vi: "Gửi các khóa phù hợp với nơi học và trình độ.",
  },
  preis: {
    short_de: "Preis",
    short_vi: "Báo giá",
    aim_de: "Kurs verkaufen",
    aim_vi: "Chốt khóa học",
    goal_de: "Preis und Pakete schicken und den Kurs verkaufen.",
    goal_vi: "Gửi học phí và các gói để chốt khóa học.",
  },
  anmeldung: {
    short_de: "Anmeldung",
    short_vi: "Đăng ký",
    aim_de: "Anmeldung abschließen",
    aim_vi: "Hoàn tất đăng ký",
    goal_de: "Anmeldung und Zahlung abschließen.",
    goal_vi: "Hoàn tất đăng ký và thanh toán.",
  },
};

export function isStep(value: string | null | undefined): value is Step {
  return !!value && (STEPS as readonly string[]).includes(value);
}

function known(value: string | null | undefined) {
  return !!value && value !== "unklar" && value !== "keins";
}

export type StepFields = {
  interest: string | null;
  level: string | null;
  place: string | null;
  outcome?: Outcome | null;
  /** Staff marked that the matching courses went out. */
  courses_sent?: boolean | null;
  /** Staff marked that the price and packages went out. */
  price_sent?: boolean | null;
};

/** The step a chat is in when nobody picked one by hand: the first thing in the list that is still open. */
export function stepFor(fields: StepFields): Step | "unklar" {
  if (fields.outcome === "kein_lead" || fields.outcome === "bestandskunde") return "unklar";
  if (!known(fields.interest)) return "qualifizieren";
  if (fields.interest !== FUNNEL_INTEREST) return "unklar";
  if (!known(fields.level) || placeOf(fields.place) === "unklar") return "bedarf";
  if (!fields.courses_sent) return "kurse";
  if (!fields.price_sent) return "preis";
  return "anmeldung";
}

/**
 * The step a chat is in right now, worked out on every read so it never lags behind the fields:
 * a step picked by hand wins, otherwise `stepFor`. Null when the chat has no step.
 */
export function stepOf(label: (StepFields & { stage: string; pinned?: string[] | null }) | null | undefined): Step | null {
  if (!label) return "qualifizieren";
  if (isStep(label.stage) && label.pinned?.includes("stage")) return label.stage;
  const step = stepFor(label);
  return step === "unklar" ? null : step;
}
