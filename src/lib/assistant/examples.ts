import "server-only";
import { unstable_cache } from "next/cache";
import { notion, text } from "@/lib/notion";
import { STAGES, type Interest, type Stage } from "./schema";

/** The team's example answers live in Notion („Nachrichten Q&A Datenbank“) so they can be added and fixed there.
 *  NOTION_REPLY_EXAMPLES_DB = that database's data source id; the integration behind NOTION_TOKEN needs edit access
 *  (the assistant saves new examples as „Entwurf“). Only the database is read, never the page around it. */
function db() {
  const id = process.env.NOTION_REPLY_EXAMPLES_DB;
  if (!id) throw new Error("NOTION_REPLY_EXAMPLES_DB is not set");
  return id;
}

export type ReplyExample = {
  id: string; // Notion page id
  url: string;
  question: string;
  answer: string;
  why: string;
  stage: Stage | null;
  type: string | null;
  interests: string[];
  status: string | null;
  rawStage: string | null;
};

type Row = { id: string; url: string; properties: Record<string, any> }; // eslint-disable-line @typescript-eslint/no-explicit-any

function toExample(r: Row): ReplyExample {
  const p = r.properties;
  const stage = p.Stage?.select?.name as string | undefined;
  return {
    id: r.id,
    url: r.url,
    question: text(p.Frage).trim(),
    answer: text(p.Antwort).trim(),
    why: text(p.Warum).trim(),
    stage: STAGES.includes(stage as Stage) ? (stage as Stage) : null,
    type: p.Typ?.select?.name ?? null,
    interests: (p.Interesse?.multi_select ?? []).map((o: { name: string }) => o.name),
    status: p.Status?.select?.name ?? null,
    rawStage: stage ?? null,
  };
}

async function load(): Promise<ReplyExample[]> {
  const rows: Row[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion<{ results: Row[]; has_more: boolean; next_cursor: string | null }>(`/data_sources/${db()}/query`, {
      method: "POST",
      body: {
        sorts: [{ timestamp: "created_time", direction: "ascending" }],
        page_size: 100,
        start_cursor: cursor,
      },
    });
    rows.push(...res.results);
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  // Filtered here, not in the Notion query: most rows have no Status/Typ/Stage yet, and empty must count as usable.
  // Drafts saved from the assistant wait for a person to check them; internal rows are not for customers.
  return rows
    .map(toExample)
    .filter((e) => e.question && e.answer && e.status !== "Entwurf" && e.type !== "Intern" && e.rawStage !== "⚙️ 7. Internal");
}

/** Checked examples, read from Notion at most every 5 minutes (oldest first, so the prompt cache stays warm). */
export const replyExamples = unstable_cache(load, ["notion-reply-examples"], { revalidate: 300, tags: ["reply-examples"] });

/** Saves a new example as „Entwurf“; it is used once someone checks it in Notion. Returns the new page's link. */
export async function addReplyExample(input: { question: string; answer: string; why: string; stage: Stage | null; interests: Interest[]; author: string }) {
  const rich = (s: string) => [{ type: "text", text: { content: s.slice(0, 2000) } }];
  // Notion caps one text piece at 2000 characters; longer answers are split.
  const chunks = (s: string) => (s.match(/[\s\S]{1,2000}/g) ?? [""]).map((c) => ({ type: "text", text: { content: c } }));
  const page = await notion<{ url: string }>("/pages", {
    method: "POST",
    body: {
      parent: { type: "data_source_id", data_source_id: db() },
      properties: {
        Frage: { title: rich(input.question) },
        Antwort: { rich_text: chunks(input.answer) },
        Warum: { rich_text: chunks(`${input.why}\n\n(Gespeichert aus dem Antwort-Assistenten von ${input.author})`.trim()) },
        Typ: { select: { name: "Kundennachricht" } },
        Status: { select: { name: "Entwurf" } },
        ...(input.stage ? { Stage: { select: { name: input.stage } } } : {}),
        ...(input.interests.length ? { Interesse: { multi_select: input.interests.map((name) => ({ name })) } } : {}),
      },
    },
  });
  return page.url;
}
