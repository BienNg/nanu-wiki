import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { PAGES } from "@/content";
import { MODE_LABEL, shortDate, type UpcomingClass } from "@/lib/classes";
import { upcomingClasses } from "@/lib/notion";
import { pageText } from "@/lib/snippet";
import { replyExamples, type ReplyExample } from "./examples";
import { pickExamples } from "./retrieve";
import { STAGE_INFO, STAGES, SuggestionSchema, type ChatLine, type Suggestion } from "./schema";

/** A small, cheap model is enough here; override with ASSISTANT_MODEL. */
const MODEL = process.env.ASSISTANT_MODEL || "claude-haiku-5-5";

/** Wiki areas whose pages the assistant may quote. */
const KNOWLEDGE_AREAS = ["sales", "student-support", "visa"];

/** Pages about our own work (KPIs, team rhythm, teachers, ads) – they do not help answer a customer. */
const INTERNAL_PAGES = new Set([
  "sales/aufgaben-und-kpis",
  "sales/website-posts-und-werbung",
  "sales/keine-kunden",
  "sales/kampagne-probestunde",
  "student-support/aufgaben-und-rhythmus",
  "student-support/lehrkraefte-begleiten",
  "student-support/material-und-hausaufgaben",
]);

/** How many of the most similar Notion examples go into one request. */
const EXAMPLES_PER_REQUEST = 40;

const RULES = `You help the sales and student-support team of NaNu NaNa, a German language school for Vietnamese people (online and in Sài Gòn / Hà Nội) that also helps with Ausbildung, Studium, Au Pair and visas for Germany.
A team member pastes a real conversation with a person (Facebook Messenger, Zalo, TikTok, WhatsApp). You:
1. decide the funnel stage the person is in right now,
2. describe the person,
3. write the answer we should send next, in Vietnamese, in the same tone as the team's examples,
4. explain in German and Vietnamese why we answer like this.

Rules for the answer (most important first):
- FIRST fill known_facts_de and question_de, then write the reply from them.
- ANSWER THE QUESTION FIRST, concretely, in the first message. "When does A2 start?" → list the matching classes from <upcoming_classes> with start date and time. "How much?" → the price. No warm-up, no restating what they said.
- NEVER ask for anything that is in known_facts_de or follows from it. A city in Germany (Hamburg, Berlin, München …) means they live in Germany → only Online DE classes (German time); do not ask where they live, whether online, or which time zone. A level they name (A2, B1 …) is the level they want; do not ask for it. Never repeat or "confirm" what they told us – no "Bạn đang ở Hamburg đúng không?", no "Em đã học xong A1 và muốn học A2 … đúng không ạ?". Start with a short greeting and go straight to the answer. Every unnecessary question loses the customer.
- Ask at most ONE question, and only one that moves them to the next stage (e.g. "Lớp nào hợp với bạn ạ?" so we can reserve the seat, or offer to send the registration). If the answer is complete and the next step is obvious, offer that step instead of asking.
- If something really is unknown and needed (e.g. their level when they did not say it, or no matching class exists), ask only for that one thing – the wiki rule: at most two short questions (where they live, which level), and only the ones we do not know yet.
- Every level has two parts: A2.1 starts A2, A2.2 is the second half for people who finished A2.1 (same for A1, B1, B2). Someone who asks for "A2" or just finished A1 needs an A2.1 class; offer an .2 class only if they say they finished the .1 part. The same group code (e.g. G123 A2.1 → G123 A2.2) is one class continuing.
- Write dates the Vietnamese way (16/11), times as in the list (21:00 giờ Đức). Name the level part (A2.1) in the reply.
- Class dates, times and modes come ONLY from <upcoming_classes>. Classes in Germany = Online DE (German time). In Sài Gòn / Hà Nội: the local classes and Online VN. If no matching class is listed, say so honestly, offer the nearest alternative (e.g. the next level start or another mode that fits), and put it in missing_de.
- Use ONLY facts (prices, dates, durations, conditions, links) from the examples, wiki pages and upcoming classes. Never invent a price, date, promise or guarantee. If a fact is missing, say we will check and list it in missing_de.
- The wiki pages are in German; the examples show how we write in Vietnamese. Write reply_vi in natural Vietnamese like the examples. Prefer the wording of a matching example; if the wiki is newer or more specific, follow the wiki.
- Address the person with the right pronoun (bạn, em, chị, anh, cô, chú) as they or the team did so far; default "bạn".
- Short chat messages, friendly, no walls of text. Split into several messages the way the examples do.
- Never promise a visa, never comment on a teacher's voice, never share internal information.
- Answer the newest customer message; earlier lines are context. Lines marked WIR were written by us.
- In all German texts write "die Person", never guess a gender (no "Kundin"/"Kunde").
- missing_de: only real open points the team must check before sending (e.g. is a seat still free); no remarks, no reasoning.
- In sources, list the ids (E… for examples, P… for wiki pages) you actually used.
- next_goal: the concrete step this reply should get the person to take next (e.g. pick a class, book a trial lesson, send the registration form).
- confidence: hoch = an example or the class list answers this directly; mittel = combined from several sources; niedrig = little or nothing covers it.

Funnel stages:
${STAGES.map((s) => `- ${s}: ${STAGE_INFO[s].desc} Goal of our reply: ${STAGE_INFO[s].goal_de}`).join("\n")}
- unklar: not a customer conversation, or impossible to tell.`;

/** Customer-facing handbook pages only: interview, onboarding, daily checklists and internal pages do not help answer customers. */
function knowledgePages() {
  return PAGES.filter(
    (p) => KNOWLEDGE_AREAS.includes(p.area.slug) && p.published && (p.section === "handbook" || p.section === "general") && !INTERNAL_PAGES.has(p.id),
  ).sort((a, b) => a.id.localeCompare(b.id));
}

/** Wiki pages in German only: keeps the prompt under Haiku's 100k-token price step (5× cheaper).
 *  The Vietnamese tone comes from the Notion examples. */
function knowledgeText() {
  return knowledgePages()
    .map((p, i) => `<page id="P${i + 1}" title="${p.title_de}" area="${p.area.name_de}" updated="${p.updated_at}">\n${pageText(p)}\n</page>`)
    .join("\n\n");
}

/** Upcoming group classes from the Notion class database, one line each, so the model can name real start dates. */
function classesText(classes: UpcomingClass[]) {
  if (!classes.length) return "(no upcoming classes found – do not name any dates)";
  return classes
    .map((c) => `- ${c.level} | ${MODE_LABEL[c.mode].vi} / ${MODE_LABEL[c.mode].de} | ${c.time ?? "Uhrzeit unbekannt"} | khai giảng ${shortDate(c.begin).vi} (${c.begin}) | ${c.name}`)
    .join("\n");
}

function examplesText(examples: ReplyExample[]) {
  return examples
    .map((e, i) =>
      [
        `<example id="E${i + 1}"${e.stage ? ` stage="${e.stage}"` : ""}${e.type ? ` type="${e.type}"` : ""}${e.interests.length ? ` interests="${e.interests.join(", ")}"` : ""}>`,
        `QUESTION: ${e.question}`,
        `ANSWER: ${e.answer}`,
        e.why ? `WHY: ${e.why}` : "",
        "</example>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
}

/** Phone numbers and e-mail addresses are removed before anything leaves our server. */
export function redact(s: string) {
  return s
    .replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[E-Mail]")
    // Vietnamese (0… / +84 …) and German (+49 / 01…) phone numbers; prices like 129.000.000 stay.
    .replace(/(?<![\d.])(?:\+84|0084|\+49|0)[\s.-]?\d{2,4}(?:[\s.-]?\d{2,4}){2,3}(?![\d.])/g, (m) => (m.replace(/\D/g, "").length >= 9 ? "[Telefon]" : m));
}

export type SourceRef = { id: string; kind: "example" | "page"; title: string; href: string };

export type SuggestResult =
  | { ok: true; suggestion: Suggestion; sources: SourceRef[]; usage: { input: number; cached: number; output: number } }
  | { ok: false; error: string };

export async function suggestReply(lines: ChatLine[]): Promise<SuggestResult> {
  const pages = knowledgePages();
  const conversation = lines.map((l) => `${l.from === "kunde" ? "KUNDE" : "WIR"}: ${redact(l.text.trim())}`).join("\n");
  // Only the examples closest to this conversation: keeps every request well under Haiku's 100k-token price step,
  // however many examples the team adds in Notion.
  const [allExamples, classes] = await Promise.all([
    replyExamples(),
    upcomingClasses().catch(() => [] as UpcomingClass[]), // Notion down → the model is told there are no dates
  ]);
  const examples = pickExamples(allExamples, conversation, EXAMPLES_PER_REQUEST);
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

  if (!process.env.ANTHROPIC_API_KEY) return { ok: false, error: "ANTHROPIC_API_KEY fehlt in den Umgebungsvariablen." };
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY

  let res;
  try {
    res = await client.messages.parse({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: "medium", format: zodOutputFormat(SuggestionSchema) },
      // Rules + wiki are the same every time and cached; the chosen examples change per request (cheap below 100k).
      system: [
        { type: "text", text: RULES },
        { type: "text", text: `<wiki>\n${knowledgeText()}\n</wiki>`, cache_control: { type: "ephemeral", ttl: "1h" } },
        { type: "text", text: `<examples>\n${examplesText(examples)}\n</examples>` },
        { type: "text", text: `Today is ${today}.\n<upcoming_classes>\n${classesText(classes)}\n</upcoming_classes>` },
      ],
      messages: [{ role: "user", content: `<conversation>\n${conversation}\n</conversation>` }],
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) return { ok: false, error: "ANTHROPIC_API_KEY fehlt oder ist ungültig." };
    if (err instanceof Anthropic.RateLimitError) return { ok: false, error: "Zu viele Anfragen – bitte kurz warten und noch einmal versuchen." };
    if (err instanceof Anthropic.APIError) return { ok: false, error: `KI-Fehler ${err.status ?? ""}: ${err.message}` };
    throw err;
  }

  if (res.stop_reason === "refusal") return { ok: false, error: "Die KI hat diese Nachricht abgelehnt. Bitte selbst beantworten." };
  if (res.stop_reason === "max_tokens" || !res.parsed_output) return { ok: false, error: "Die KI-Antwort war unvollständig. Bitte noch einmal versuchen." };

  const sources: SourceRef[] = [];
  for (const id of new Set(res.parsed_output.sources)) {
    const n = Number(id.slice(1)) - 1;
    if (id.startsWith("E") && examples[n]) sources.push({ id, kind: "example", title: examples[n].question.slice(0, 90), href: examples[n].url });
    if (id.startsWith("P") && pages[n]) sources.push({ id, kind: "page", title: pages[n].title_de, href: pages[n].href });
  }

  return {
    ok: true,
    suggestion: res.parsed_output,
    sources,
    usage: { input: res.usage.input_tokens + (res.usage.cache_creation_input_tokens ?? 0), cached: res.usage.cache_read_input_tokens ?? 0, output: res.usage.output_tokens },
  };
}

