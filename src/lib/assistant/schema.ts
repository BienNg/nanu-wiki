import { z } from "zod";

/** Funnel stages exactly as named in the Notion „Stage“ column (7 · Internal is never a customer). */
export const STAGES = [
  "🟡 1. First Contact",
  "🟠 2. Interest & Qualification",
  "🔵 3. Consultation",
  "🟢 4. Enrollment",
  "🟢 5. During Class",
  "🛫 6. Pre-Departure",
] as const;
export type Stage = (typeof STAGES)[number];

/** What each stage means and what our reply has to achieve to move the person to the next one
 *  (from the wiki's „Verkaufstrichter“). Shown in the UI and given to the model. */
export const STAGE_INFO: Record<Stage, { de: string; vi: string; short_de: string; short_vi: string; desc: string; goal_de: string; goal_vi: string }> = {
  "🟡 1. First Contact": {
    de: "Erstkontakt",
    short_de: "Kontakt",
    short_vi: "Liên hệ",
    vi: "Liên hệ đầu tiên",
    desc: "First message to us; we do not know yet what they need. Answer fast, greet, ask what they want.",
    goal_de: "Sofort antworten und herausfinden, was die Person will (Ziel, Niveau, Wohnort).",
    goal_vi: "Trả lời ngay và tìm hiểu khách muốn gì (mục tiêu, trình độ, nơi ở).",
  },
  "🟠 2. Interest & Qualification": {
    de: "Interesse & Bedarf",
    short_de: "Bedarf",
    short_vi: "Nhu cầu",
    vi: "Quan tâm & nhu cầu",
    desc: "They ask about a course/programme; we find out goal (Ausbildung, Studium, Sprachkurs …), level, place, timing.",
    goal_de: "Bedarf klären und passende Kurse oder ein Beratungsgespräch anbieten.",
    goal_vi: "Làm rõ nhu cầu và giới thiệu khóa phù hợp hoặc hẹn tư vấn.",
  },
  "🔵 3. Consultation": {
    de: "Beratung",
    short_de: "Beratung",
    short_vi: "Tư vấn",
    vi: "Tư vấn",
    desc: "Detailed questions, comparing options, prices, schedules, doubts; a call or meeting may help.",
    goal_de: "Zweifel ausräumen und ein konkretes Angebot mit Frist machen.",
    goal_vi: "Giải đáp băn khoăn và đưa ra đề xuất cụ thể có thời hạn.",
  },
  "🟢 4. Enrollment": {
    de: "Anmeldung & Zahlung",
    short_de: "Anmeldung",
    short_vi: "Đăng ký",
    vi: "Đăng ký & đóng tiền",
    desc: "They want to sign up or pay: registration form, payment details, contract, invoice.",
    goal_de: "Anmeldung und Zahlung abschließen, nächste Schritte nach der Zahlung erklären.",
    goal_vi: "Hoàn tất đăng ký và thanh toán, giải thích các bước sau khi đóng tiền.",
  },
  "🟢 5. During Class": {
    de: "Während des Kurses",
    short_de: "Kurs",
    short_vi: "Đang học",
    vi: "Trong khóa học",
    desc: "Existing student: Zoom link, missed lessons, pause, app, teacher, exam, refund.",
    goal_de: "Problem schnell lösen, damit die Person dranbleibt und weiterbucht.",
    goal_vi: "Giải quyết nhanh để học viên tiếp tục học và đăng ký khóa tiếp theo.",
  },
  "🛫 6. Pre-Departure": {
    de: "Vor der Ausreise",
    short_de: "Ausreise",
    short_vi: "Sang Đức",
    vi: "Trước khi sang Đức",
    desc: "Visa, documents, Sperrkonto, insurance, flight, arrival in Germany.",
    goal_de: "Unterlagen und Fristen klar machen, damit Visum und Ausreise klappen.",
    goal_vi: "Làm rõ giấy tờ và thời hạn để visa và việc sang Đức suôn sẻ.",
  },
};

export const INTERESTS = ["Sprachkurs", "Ausbildung", "Studium", "Au Pair", "Visa", "Prüfung", "App"] as const;
export type Interest = (typeof INTERESTS)[number];

export const PRONOUNS = ["bạn", "em", "chị", "anh", "cô", "chú", "unklar"] as const;

/** What the model must return for one conversation. */
export const SuggestionSchema = z.object({
  known_facts_de: z
    .array(z.string())
    .describe(
      "FIRST: German, everything the customer already told us or that follows from it (e.g. 'Wohnt in Hamburg → Deutschland → nur Online DE (deutsche Zeit)', 'Will A2', 'Fragt nach Startdatum'). The reply must never ask for any of these again.",
    ),
  question_de: z.string().describe("German: the exact question(s) the newest customer message asks; the reply answers these first"),
  stage: z.enum([...STAGES, "unklar"]).describe("Funnel stage of the customer right now"),
  stage_reason_de: z.string().describe("One short German sentence: why this stage"),
  profile: z.object({
    interests: z.array(z.enum(INTERESTS)),
    level: z.enum(["A0", "A1", "A2", "B1", "B2", "C1", "unklar"]).describe("Current German level"),
    place: z.string().describe("Where they live or want to study (Sài Gòn, Hà Nội, other city, Germany) or 'unklar'"),
    pronoun: z.enum(PRONOUNS).describe("How we should address them in Vietnamese"),
    summary_de: z.string().describe("1–2 German sentences: who this person is and what they want"),
  }),
  next_goal_de: z.string().describe("German, one sentence: what this reply must achieve to move this person to the next funnel stage"),
  next_goal_vi: z.string().describe("The same in Vietnamese"),
  reply_vi: z.array(z.string()).describe("The suggested answer in Vietnamese, split into the separate chat messages we would send"),
  reply_de: z.array(z.string()).describe("German translation of each reply_vi message, same order"),
  why_de: z.string().describe("German: why we answer like this, which rule or example it follows"),
  why_vi: z.string().describe("The same explanation in Vietnamese"),
  sources: z.array(z.string()).describe("Ids of the examples (E…) and wiki pages (P…) this answer is based on"),
  missing_de: z.array(z.string()).describe("German: facts we do not know and should check or ask before sending; empty if none"),
  confidence: z.enum(["hoch", "mittel", "niedrig"]).describe("niedrig if no example or page covers the question"),
});
export type Suggestion = z.infer<typeof SuggestionSchema>;

export type ChatLine = { from: "kunde" | "wir"; text: string };
