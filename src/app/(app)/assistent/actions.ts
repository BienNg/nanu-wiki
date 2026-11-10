"use server";

import { revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth";
import { canUseAssistant } from "@/lib/assistant/access";
import { addReplyExample } from "@/lib/assistant/examples";
import { suggestReply, redact } from "@/lib/assistant/suggest";
import { INTERESTS, STAGES, type ChatLine, type Interest, type Stage } from "@/lib/assistant/schema";

async function allowed() {
  const session = await getSession();
  if (!session || !canUseAssistant(session.profile)) throw new Error("not allowed");
  return session;
}

const MAX_CHARS = 8000;

export async function getSuggestion(lines: ChatLine[]) {
  await allowed();
  const clean = lines
    .map((l) => ({ from: l.from === "wir" ? ("wir" as const) : ("kunde" as const), text: String(l.text ?? "").trim() }))
    .filter((l) => l.text);
  if (!clean.some((l) => l.from === "kunde")) return { ok: false as const, error: "Bitte mindestens eine Nachricht des Kunden einfügen." };
  if (clean.reduce((n, l) => n + l.text.length, 0) > MAX_CHARS) return { ok: false as const, error: "Das Gespräch ist zu lang – bitte nur die letzten Nachrichten einfügen." };
  return suggestReply(clean);
}

/** Saves the (possibly corrected) answer as a new example in Notion, status „Entwurf“. */
export async function saveAsExample(input: { lines: ChatLine[]; answer: string; why: string; stage: string; interests: string[] }) {
  const session = await allowed();
  const question = input.lines
    .filter((l) => String(l.text ?? "").trim())
    .map((l) => (l.from === "wir" ? `WIR: ${l.text.trim()}` : l.text.trim()))
    .join("\n");
  if (!question || !input.answer.trim()) throw new Error("question and answer required");
  const url = await addReplyExample({
    question: redact(question),
    answer: input.answer.trim(),
    why: input.why.trim(),
    stage: STAGES.includes(input.stage as Stage) ? (input.stage as Stage) : null,
    interests: input.interests.filter((i): i is Interest => INTERESTS.includes(i as Interest)),
    author: session.profile.full_name ?? session.profile.email,
  });
  revalidateTag("reply-examples");
  return { url };
}
