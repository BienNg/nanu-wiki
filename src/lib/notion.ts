import "server-only";
import { unstable_cache } from "next/cache";
import type { ClassMode, UpcomingClass } from "@/lib/classes";

/** Minimal Notion API client for the "Klassen Datenbank". Needs an internal integration that the database is shared with:
 *  NOTION_TOKEN, and NOTION_CLASSES_DB = the database's data source id. */
const API = "https://api.notion.com/v1";
const VERSION = "2025-09-03";

type FileValue = { name: string; type: "file"; file: { url: string } } | { name: string; type: "external"; external: { url: string } };
type NotionPage = {
  id: string;
  parent: { type: string; data_source_id?: string };
  properties: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
};

function config() {
  const token = process.env.NOTION_TOKEN;
  const db = process.env.NOTION_CLASSES_DB;
  if (!token || !db) throw new Error("NOTION_TOKEN or NOTION_CLASSES_DB is not set");
  return { token, db };
}

async function notion<T>(path: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const { token } = config();
  const res = await fetch(`${API}${path}`, {
    method: init?.method ?? "GET",
    headers: { Authorization: `Bearer ${token}`, "Notion-Version": VERSION, "Content-Type": "application/json" },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Notion ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

const MODE_BY_LOCATION: Record<string, ClassMode> = { "Online DE": "online-de", "Online VN": "online-vn", Hanoi: "hanoi", Saigon: "saigon" };

/** The Location field is not always set, but the class name always says it, e.g. "G132 - A1.1 ( SG/9h)". */
function modeFromName(name: string): ClassMode | null {
  if (/\bSG\b/i.test(name)) return "saigon";
  if (/\bHN\b/i.test(name)) return "hanoi";
  if (/\bDE\b/i.test(name)) return "online-de";
  if (/\bVN\b/i.test(name)) return "online-vn";
  return null;
}

/** "21h" → "21:00", "19h30" → "19:30", "9H" → "9:00". */
function timeFromName(name: string) {
  const m = name.match(/(\d{1,2})\s*h(\d{2})?/i);
  return m ? `${m[1]}:${m[2] ?? "00"}` : null;
}

const text = (p: any) => (p?.title ?? p?.rich_text ?? []).map((t: { plain_text: string }) => t.plain_text).join(""); // eslint-disable-line @typescript-eslint/no-explicit-any
const files = (page: NotionPage): FileValue[] => page.properties["Files & media"]?.files ?? [];

function toClass(page: NotionPage): UpcomingClass | null {
  const p = page.properties;
  const name = text(p.Name).trim();
  const select: string | undefined = p.Level?.select?.name;
  // Only group courses with a level like "B1.1"; exam prep, 1-1 and workshops (M…, T…) have none.
  const level = select?.match(/^[ABC][12]\.[12]$/)?.[0] ?? name.match(/\b([ABC][12]\.[12])\b/)?.[1];
  const mode = MODE_BY_LOCATION[p.Location?.select?.name ?? ""] ?? modeFromName(name);
  const begin: string | undefined = p.Begin?.date?.start;
  if (!level || !mode || !begin) return null;
  return { id: page.id, name, level, mode, time: timeFromName(name), begin: begin.slice(0, 10), hasImage: files(page).length > 0 };
}

async function loadUpcoming(): Promise<UpcomingClass[]> {
  const { db } = config();
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  const pages: NotionPage[] = [];
  let cursor: string | undefined;
  do {
    const res = await notion<{ results: NotionPage[]; has_more: boolean; next_cursor: string | null }>(`/data_sources/${db}/query`, {
      method: "POST",
      body: {
        filter: {
          and: [
            { property: "Begin", date: { on_or_after: today } },
            { property: "1-1", checkbox: { equals: false } },
            { property: "Archiv", checkbox: { equals: false } },
            { property: "🔵 Class full", checkbox: { equals: false } },
          ],
        },
        sorts: [{ property: "Begin", direction: "ascending" }],
        page_size: 100,
        start_cursor: cursor,
      },
    });
    pages.push(...res.results);
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);
  return pages.map(toClass).filter((c): c is UpcomingClass => !!c);
}

/** Upcoming group classes, read from Notion at most every 5 minutes. */
export const upcomingClasses = unstable_cache(loadUpcoming, ["notion-upcoming-classes"], { revalidate: 300 });

/** A fresh (short-lived) link to the class's marketing image, or null. Only pages of the classes database are allowed. */
export async function classImageUrl(id: string): Promise<string | null> {
  const { db } = config();
  const page = await notion<NotionPage>(`/pages/${id}`);
  if (page.parent.data_source_id?.replace(/-/g, "") !== db.replace(/-/g, "")) return null;
  const all = files(page);
  const f = all.find((x) => /\.(png|jpe?g|webp|gif)(\?|$)/i.test(x.name)) ?? all[0];
  if (!f) return null;
  return f.type === "file" ? f.file.url : f.external.url;
}
