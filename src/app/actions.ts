"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession, hasRole } from "@/lib/auth";
import { dmByEmail, siteUrl } from "@/lib/slack";
import type { AppRole, ChatTurn } from "@/lib/types";

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
  const supabase = await createClient();

  if (done) {
    await supabase.from("checklist_progress").upsert({ profile_id: session.profile.id, item_id: itemId });
  } else {
    await supabase.from("checklist_progress").delete().eq("profile_id", session.profile.id).eq("item_id", itemId);
  }

  // Week finished? → tell the buddy on Slack
  if (done) {
    const { data: item } = await supabase
      .from("checklist_items")
      .select("week_id, onboarding_weeks(week, title_de)")
      .eq("id", itemId)
      .single();
    if (item) {
      const { data: siblings } = await supabase.from("checklist_items").select("id").eq("week_id", item.week_id);
      const ids = (siblings ?? []).map((s) => s.id);
      const { count } = await supabase
        .from("checklist_progress")
        .select("item_id", { count: "exact", head: true })
        .eq("profile_id", session.profile.id)
        .in("item_id", ids);
      const week = item.onboarding_weeks as unknown as { week: number; title_de: string } | null;
      if (week && count === ids.length) {
        await notifyBuddy(
          `✅ ${who(session)} hat Woche ${week.week} („${week.title_de}“) abgeschlossen. ${siteUrl(`/bereich/${areaSlug}?tab=onboarding`)}`,
        );
      }
    }
  }

  revalidatePath(`/bereich/${areaSlug}`);
  revalidatePath("/", "layout");
}

// ------------------------------------------------------------------ quiz
export async function checkAnswer(questionId: string, answer: number) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_answer", { p_question_id: questionId, p_answer: answer });
  if (error) throw new Error(error.message);
  const row = (data as { is_correct: boolean; correct_index: number }[])[0];
  return { isCorrect: row?.is_correct ?? false, correctIndex: row?.correct_index ?? -1 };
}

export async function submitQuiz(quizId: string, answers: number[], weekLabel: string) {
  const session = await getSession();
  if (!session) throw new Error("not signed in");
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("submit_quiz", { p_quiz_id: quizId, p_answers: answers });
  if (error) throw new Error(error.message);
  const result = (data as { score: number; total: number; passed: boolean; correct: number[] }[])[0];

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
  const clean = turns.slice(0, 30).map((t) => ({
    customer: String(t.customer).slice(0, 2000),
    reply: String(t.reply).trim().slice(0, 2000),
    seconds: Math.max(0, Math.round(Number(t.seconds) || 0)),
  }));
  const supabase = await createClient();
  const { error } = await supabase.from("chat_responses").insert({ page_id: pageId, sim_id: simId, profile_id: session.profile.id, turns: clean });
  if (error) {
    return { ok: false as const, message: error.code === "23505" ? "Schon abgeschickt · Bạn đã gửi rồi" : error.message };
  }
  revalidatePath(`/seite/${pageId}`);
  revalidatePath("/", "layout");
  return { ok: true as const };
}

// ------------------------------------------------------------------ admin: users
export async function updateUser(
  profileId: string,
  patch: {
    role: AppRole;
    candidate_area_id: string | null;
    primary_area_id: string | null;
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

export async function setAreaEditor(areaId: string, profileId: string, enabled: boolean) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "admin")) throw new Error("admins only");
  const supabase = await createClient();
  if (enabled) await supabase.from("area_editors").upsert({ area_id: areaId, profile_id: profileId });
  else await supabase.from("area_editors").delete().eq("area_id", areaId).eq("profile_id", profileId);
  revalidatePath("/admin/benutzer");
}
