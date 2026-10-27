"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEditorAreas, getSession, hasRole } from "@/lib/auth";
import { canReadPage, getOnboarding, getPageById, getQuiz, readablePages, searchPages } from "@/content";
import { dmByEmail, siteUrl } from "@/lib/slack";
import type { AppRole, ChatTurn, PageWithMeta } from "@/lib/types";

// ------------------------------------------------------------------ helpers
async function notifyBuddy(text: string) {
  const session = await getSession();
  if (!session?.profile.buddy_id) return;
  const supabase = await createClient();
  const { data: buddy } = await supabase.from("profiles").select("email").eq("id", session.profile.buddy_id).single();
  if (buddy?.email) await dmByEmail(buddy.email, text);
}

function who(session: NonNullable<Awaited<ReturnType<typeof getSession>>>) {
  return session.profile.full_name ?? session.profile.email;
}

// ------------------------------------------------------------------ onboarding checklist
export async function toggleChecklistItem(itemId: string, done: boolean, areaSlug: string) {
  const session = await getSession();
  if (!session) throw new Error("not signed in");
  const weeks = getOnboarding(areaSlug);
  const week = weeks.find((w) => w.items.some((i) => i.id === itemId));
  if (!week) throw new Error("unknown checklist item");
  const supabase = await createClient();

  if (done) {
    await supabase.from("checklist_progress").upsert({ profile_id: session.profile.id, item_id: itemId });
  } else {
    await supabase.from("checklist_progress").delete().eq("profile_id", session.profile.id).eq("item_id", itemId);
  }

  // Week finished? → tell the buddy on Slack
  if (done) {
    const ids = week.items.map((i) => i.id);
    const { count } = await supabase
      .from("checklist_progress")
      .select("item_id", { count: "exact", head: true })
      .eq("profile_id", session.profile.id)
      .in("item_id", ids);
    if (count === ids.length) {
      await notifyBuddy(
        `✅ ${who(session)} hat Woche ${week.week} („${week.title_de}“) abgeschlossen. ${siteUrl(`/bereich/${areaSlug}?tab=onboarding`)}`,
      );
    }
  }

  revalidatePath(`/bereich/${areaSlug}`);
  revalidatePath("/", "layout");
}

// ------------------------------------------------------------------ quiz
// Answers live in src/content (server-only) and are graded here, never in the browser.
async function staffQuiz(quizId: string) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "staff")) throw new Error("not allowed");
  const found = getQuiz(quizId);
  if (!found) throw new Error("unknown quiz");
  return { session, ...found };
}

/** Instant feedback for one question; records nothing. */
export async function checkAnswer(quizId: string, question: number, answer: number) {
  const { quiz } = await staffQuiz(quizId);
  const correctIndex = quiz.questions[question]?.correct ?? -1;
  return { isCorrect: correctIndex === answer, correctIndex };
}

export async function submitQuiz(quizId: string, answers: number[]) {
  const { session, quiz, week } = await staffQuiz(quizId);
  const correct = quiz.questions.map((q) => q.correct);
  const total = correct.length;
  const score = correct.filter((c, i) => answers[i] === c).length;
  const result = { score, total, passed: score * 100 >= quiz.pass_percent * total, correct };

  // Users can't insert attempts themselves (no RLS insert policy), so a pass can't be faked from the browser.
  const { error } = await createAdminClient()
    .from("quiz_attempts")
    .insert({ quiz_id: quizId, profile_id: session.profile.id, answers: answers.slice(0, total), score, total, passed: result.passed });
  if (error) throw new Error(error.message);

  const weekLabel = `Woche ${week.week} · ${week.title_de}`;

  await notifyBuddy(
    result.passed
      ? `🎉 ${who(session)} hat das Quiz „${weekLabel}“ bestanden: ${result.score}/${result.total}.`
      : `📘 ${who(session)} hat das Quiz „${weekLabel}“ versucht: ${result.score}/${result.total} – noch nicht bestanden.`,
  );
  revalidatePath("/", "layout");
  return result;
}

// ------------------------------------------------------------------ messenger simulation
export async function submitChat(pageId: string, simId: string, turns: ChatTurn[]) {
  const session = await getSession();
  if (!session) throw new Error("not signed in");
  const page = getPageById(pageId);
  if (!page || !canReadPage(session.profile, await getEditorAreas(), page) || !page.body.some((b) => b.type === "chat" && b.id === simId)) {
    return { ok: false as const, message: "Seite nicht gefunden · Không tìm thấy trang" };
  }
  const clean = turns.slice(0, 30).map((t) => ({
    customer: String(t.customer).slice(0, 2000),
    reply: String(t.reply).trim().slice(0, 2000),
    seconds: Math.max(0, Math.round(Number(t.seconds) || 0)),
  }));
  const supabase = await createClient();
  const { error } = await supabase.from("chat_responses").insert({ page_id: pageId, area: page.area.slug, sim_id: simId, profile_id: session.profile.id, turns: clean });
  if (error) {
    return { ok: false as const, message: error.code === "23505" ? "Schon abgeschickt · Bạn đã gửi rồi" : error.message };
  }
  revalidatePath(page.href);
  revalidatePath("/", "layout");
  return { ok: true as const };
}

// ------------------------------------------------------------------ admin: users
export async function updateUser(
  profileId: string,
  patch: {
    role: AppRole;
    candidate_area: string | null;
    primary_area: string | null;
    buddy_id: string | null;
    location: string | null;
  },
) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "admin")) throw new Error("admins only");
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(patch).eq("id", profileId);
  if (error) return { ok: false as const, message: error.message };
  revalidatePath("/admin/benutzer");
  return { ok: true as const };
}

export async function setAreaEditor(area: string, profileId: string, enabled: boolean) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "admin")) throw new Error("admins only");
  const supabase = await createClient();
  if (enabled) await supabase.from("area_editors").upsert({ area, profile_id: profileId });
  else await supabase.from("area_editors").delete().eq("area", area).eq("profile_id", profileId);
  revalidatePath("/admin/benutzer");
}

// ------------------------------------------------------------------ search
/** Search overlay: published pages this user may read that match `q`, newest first. */
export async function searchWiki(q: string, limit: number): Promise<PageWithMeta[]> {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "staff")) return [];
  const pages = readablePages(session.profile, await getEditorAreas()).filter((p) => p.published);
  return searchPages(pages, q.slice(0, 80)).slice(0, limit);
}
