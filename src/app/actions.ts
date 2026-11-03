"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getEditorAreas, getSession, hasRole } from "@/lib/auth";
import { canReadPage, dailyTasksFor, getOnboarding, getPageById, getPageQuiz, getQuiz, onboardingQuizPage, readablePages, requiredQuizPages, searchPages } from "@/content";
import { PAGE_QUIZ_PREFIX, pageQuizId, quizStatus, type QuizAttemptRow } from "@/lib/pageQuiz";
import { onboardingDone } from "@/lib/quizProgress";
import { dmByEmail, siteUrl } from "@/lib/slack";
import { vnToday } from "@/lib/days";
import { blockKey, blockText, COMMENT_STATUSES, tagInfo } from "@/lib/comments";
import type { AppRole, ChatTurn, CommentAnchor, CommentStatus, CommentTag, OnboardingWeek, PageWithMeta } from "@/lib/types";

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
  if (onboardingQuizPage(week.items.find((i) => i.id === itemId)!)) throw new Error("ticked by passing the page quiz");
  const supabase = await createClient();

  if (done) {
    await supabase.from("checklist_progress").upsert({ profile_id: session.profile.id, item_id: itemId });
  } else {
    await supabase.from("checklist_progress").delete().eq("profile_id", session.profile.id).eq("item_id", itemId);
  }

  if (done) await notifyWeekFinished(session, areaSlug, week);
  revalidatePath(`/bereich/${areaSlug}`);
  revalidatePath("/", "layout");
}

/** Week finished (manual ticks and passed page quizzes together)? → tell the buddy on Slack. Call right after the step that may have finished it. */
async function notifyWeekFinished(session: NonNullable<Awaited<ReturnType<typeof getSession>>>, areaSlug: string, week: OnboardingWeek) {
  const done = await onboardingDone(session.profile.id, areaSlug);
  if (week.items.every((i) => done.has(i.id))) {
    await notifyBuddy(`✅ ${who(session)} hat Woche ${week.week} („${week.title_de}“) abgeschlossen. ${siteUrl(`/bereich/${areaSlug}?tab=onboarding`)}`);
  }
}

// ------------------------------------------------------------------ daily tasks
/** Saves one task of today's list. `day` is the day the browser shows: once it is no longer today
 *  (page left open past midnight) nothing is saved and the page reloads with the new, empty list. */
export async function saveDailyTask(areaSlug: string, taskId: string, day: string, done: boolean, note: string) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "staff")) throw new Error("not allowed");
  const today = vnToday();
  if (day !== today) return { ok: false as const, stale: true };
  if (!dailyTasksFor(areaSlug, today).some((t) => t.id === taskId)) throw new Error("unknown task");

  const supabase = await createClient();
  const key = { profile_id: session.profile.id, task_id: taskId, day: today };
  const clean = note.trim().slice(0, 1000);
  if (!done && !clean) {
    const { error } = await supabase.from("daily_task_log").delete().match(key);
    if (error) throw new Error(error.message);
  } else {
    const { data: prev } = await supabase.from("daily_task_log").select("done, done_at").match(key).maybeSingle();
    const now = new Date().toISOString();
    const { error } = await supabase.from("daily_task_log").upsert({
      ...key,
      area: areaSlug,
      done,
      note: clean || null,
      done_at: done ? (prev?.done ? prev.done_at : now) : null,
      updated_at: now,
    });
    if (error) throw new Error(error.message);
  }
  revalidatePath("/admin/aufgaben");
  return { ok: true as const };
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

// ------------------------------------------------------------------ page quiz
/** Grades the quiz at the end of a Handbuch page. 100 % passes. Only says which questions were wrong, never the right answers.
 *  `answers[i]` is the original index of the option picked for question i (the browser shows them shuffled). */
export async function submitPageQuiz(pageId: string, version: number, answers: number[]) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "staff")) throw new Error("not allowed");
  const page = getPageById(pageId);
  const quiz = getPageQuiz(pageId);
  if (!page || !quiz || !canReadPage(session.profile, await getEditorAreas(), page)) {
    return { ok: false as const, message: "Quiz nicht gefunden · Không tìm thấy bài kiểm tra" };
  }
  if (version !== quiz.version) {
    return { ok: false as const, message: "Die Seite wurde gerade aktualisiert. Lade das Quiz neu · Trang vừa được cập nhật. Hãy tải lại bài kiểm tra" };
  }
  const clean = quiz.questions.map((_, i) => (Number.isInteger(answers[i]) ? answers[i] : -1));
  const wrong = quiz.questions.flatMap((q, i) => (clean[i] === q.correct ? [] : [i]));
  const total = quiz.questions.length;
  const score = total - wrong.length;
  const passed = wrong.length === 0;

  // Users can't insert attempts themselves (no RLS insert policy), so a pass can't be faked from the browser.
  const admin = createAdminClient();
  const { error } = await admin
    .from("quiz_attempts")
    .insert({ quiz_id: pageQuizId(pageId, quiz.version), profile_id: session.profile.id, answers: clean, score, total, passed });
  if (error) return { ok: false as const, message: error.message };

  // One Slack message to the buddy once every required quiz is passed, not one per page.
  const required = requiredQuizPages(session.profile.primary_area);
  if (passed && required.some((p) => p.id === pageId)) {
    const { data } = await admin.from("quiz_attempts").select("quiz_id, profile_id, passed, created_at").eq("profile_id", session.profile.id).like("quiz_id", `${PAGE_QUIZ_PREFIX}%`);
    const rows = (data ?? []) as QuizAttemptRow[];
    const done = required.filter((p) => quizStatus(rows, p.id, p.quiz!.version).state === "passed").length;
    const firstPass = rows.filter((r) => r.passed && r.quiz_id === pageQuizId(pageId, quiz.version)).length === 1;
    if (done === required.length && firstPass) {
      await notifyBuddy(`🎓 ${who(session)} hat alle ${required.length} Handbuch-Quizze bestanden. ${siteUrl("/admin/quiz")}`);
    }
  }

  // The pass ticks the onboarding items linking to this page and may finish their week.
  const area = session.profile.primary_area;
  const weeks = area ? getOnboarding(area).filter((w) => w.items.some((i) => onboardingQuizPage(i)?.id === pageId)) : [];
  if (passed && weeks.length) {
    const { count } = await admin
      .from("quiz_attempts")
      .select("id", { count: "exact", head: true })
      .eq("profile_id", session.profile.id)
      .eq("quiz_id", pageQuizId(pageId, quiz.version))
      .eq("passed", true);
    if (count === 1) for (const w of weeks) await notifyWeekFinished(session, area!, w);
  }
  revalidatePath("/", "layout");
  return { ok: true as const, score, total, passed, wrong };
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

// ------------------------------------------------------------------ multiple-choice round on a page
/** Grades a page's `mcq` block on the server and stores it in quiz_attempts as "<page id>#<block id>". One run per person. */
export async function submitMcq(pageId: string, mcqId: string, answers: number[]) {
  const session = await getSession();
  if (!session) throw new Error("not signed in");
  const page = getPageById(pageId);
  const block = page?.body.find((b) => b.type === "mcq" && b.id === mcqId);
  if (!page || !block || block.type !== "mcq" || !canReadPage(session.profile, await getEditorAreas(), page)) {
    return { ok: false as const, message: "Seite nicht gefunden · Không tìm thấy trang" };
  }
  const quizId = `${pageId}#${mcqId}`;
  const admin = createAdminClient();
  const { count } = await admin.from("quiz_attempts").select("id", { count: "exact", head: true }).eq("quiz_id", quizId).eq("profile_id", session.profile.id);
  if (count) return { ok: false as const, message: "Schon abgeschickt · Bạn đã gửi rồi" };

  const total = block.questions.length;
  const clean = block.questions.map((_, i) => (Number.isInteger(answers[i]) ? answers[i] : -1));
  const score = block.questions.filter((q, i) => clean[i] === q.correct).length;
  // No pass mark in an interview round: `passed` just means everything was right.
  const { error } = await admin.from("quiz_attempts").insert({ quiz_id: quizId, profile_id: session.profile.id, answers: clean, score, total, passed: score === total });
  if (error) return { ok: false as const, message: error.message };
  revalidatePath(page.href);
  return { ok: true as const };
}

// ------------------------------------------------------------------ page comments
const clip = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : undefined);

/** Staff leave a comment on a page, a block or a few words of it. Editors of the area hear about it on Slack. */
export async function addComment(input: { pageId: string; anchor: CommentAnchor; tag: CommentTag | null; body: string }) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "staff")) return { ok: false as const, message: "Nicht erlaubt · Không được phép" };
  const page = getPageById(input.pageId);
  if (!page || !canReadPage(session.profile, await getEditorAreas(), page)) {
    return { ok: false as const, message: "Seite nicht gefunden · Không tìm thấy trang" };
  }
  const tag = tagInfo(input.tag) ? input.tag : null;
  const body = String(input.body ?? "").trim().slice(0, 2000);
  if (!tag && !body) return { ok: false as const, message: "Bitte Tag wählen oder Text schreiben · Hãy chọn nhãn hoặc viết vài chữ" };

  let anchor: CommentAnchor = null;
  if (input.anchor) {
    const block = page.body.find((b) => blockKey(b) === input.anchor?.block);
    if (!block) return { ok: false as const, message: "Stelle nicht gefunden – bitte Seite neu laden · Hãy tải lại trang" };
    const a = input.anchor;
    anchor = {
      block: a.block,
      field: a.field === "de" || a.field === "vi" ? a.field : undefined,
      exact: clip(a.exact?.trim(), 500) || undefined,
      prefix: clip(a.prefix, 32),
      suffix: clip(a.suffix, 32),
      // Comments on a whole block keep its text (from the content), so they can be found again after edits.
      context: a.exact ? clip(a.context, 600) : blockText(block).slice(0, 600),
      tab: clip(a.tab, 80) || undefined,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_comments")
    .insert({ page_id: page.id, area: page.area.slug, author_id: session.profile.id, anchor, tag, body, page_version: page.updated_at })
    .select("id")
    .single();
  if (error) return { ok: false as const, message: error.message };

  await notifyEditors(page, `💬 ${who(session)}`, { anchor, tag, body, id: data.id }, session.profile.id);
  revalidatePath("/admin/kommentare");
  revalidatePath(page.href);
  return { ok: true as const };
}

/** DMs the editors of the page's area (or the admins when the area has none). */
async function notifyEditors(
  page: PageWithMeta,
  from: string,
  c: { anchor: CommentAnchor; tag: CommentTag | null; body: string; id: string },
  authorId: string,
) {
  // Service role only to look up who to tell; what is read is decided here, not by the user.
  const admin = createAdminClient();
  const { data: editors } = await admin.from("area_editors").select("profiles(id, email, role)").eq("area", page.area.slug);
  let people = (editors ?? []).flatMap((e) => (e.profiles ? [e.profiles as unknown as { id: string; email: string; role: AppRole }] : []));
  people = people.filter((p) => p.role === "editor" || p.role === "admin");
  if (people.length === 0) {
    const { data: admins } = await admin.from("profiles").select("id, email, role").eq("role", "admin");
    people = (admins ?? []) as typeof people;
  }
  const t = tagInfo(c.tag);
  const lines = [
    `${from} hat „${page.title_de}“ kommentiert${t ? ` (${t.emoji} ${t.de})` : ""}:`,
    c.anchor?.exact ? `> „${c.anchor.exact.slice(0, 200)}“` : null,
    c.body ? c.body.slice(0, 500) : null,
    `${siteUrl(`${page.href}?c=${c.id}`)}  ·  Alle Kommentare: ${siteUrl(`/admin/kommentare?area=${page.area.slug}`)}`,
  ].filter(Boolean);
  await Promise.all(people.filter((p) => p.id !== authorId && p.email).map((p) => dmByEmail(p.email, lines.join("\n"))));
}

/** Editors and admins move a comment along. On "resolved"/"declined" the author gets a thank-you DM. */
export async function setCommentStatus(id: string, status: CommentStatus, note?: string) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "editor")) throw new Error("editors only");
  if (!COMMENT_STATUSES.some((s) => s.id === status)) throw new Error("unknown status");
  const supabase = await createClient();
  const { data: before } = await supabase.from("page_comments").select("status, page_id, anchor, author_id").eq("id", id).single();
  if (!before) return { ok: false as const, message: "Kommentar nicht gefunden · Không tìm thấy bình luận" };

  const resolution_note = note?.trim().slice(0, 2000) || null;
  // RLS only lets editors of the comment's area (and admins) update; 0 rows means not allowed.
  const { data: updated, error } = await supabase.from("page_comments").update({ status, resolution_note }).eq("id", id).select("id");
  if (error) return { ok: false as const, message: error.message };
  if (!updated?.length) return { ok: false as const, message: "Nicht erlaubt · Không được phép" };

  const closing = (status === "resolved" || status === "declined") && before.status !== status;
  if (closing && before.author_id !== session.profile.id) {
    const page = getPageById(before.page_id);
    const { data: author } = await supabase.from("profiles").select("email").eq("id", before.author_id).single();
    const quote = (before.anchor as CommentAnchor)?.exact;
    const where = `„${page?.title_de ?? before.page_id}“${quote ? ` („${quote.slice(0, 80)}“)` : ""}`;
    const text =
      status === "resolved"
        ? `🙏 Danke! Dein Hinweis zu ${where} wurde umgesetzt. · Cảm ơn bạn! Góp ý của bạn đã được cập nhật.`
        : `Dein Hinweis zu ${where} wurde angesehen, wird aber nicht umgesetzt. · Góp ý của bạn đã được xem nhưng sẽ không thay đổi.`;
    if (author?.email) {
      await dmByEmail(author.email, [text, resolution_note ? `${who(session)}: ${resolution_note}` : null, page ? siteUrl(page.href) : null].filter(Boolean).join("\n"));
    }
  }
  revalidatePath("/admin/kommentare");
  revalidatePath("/", "layout"); // sidebar badge and the page's comment view
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

/** Deletes everything a person has done – onboarding ticks, quiz attempts (week, page and interview), Messenger
 *  simulations, daily-task log – and restarts their „new hire“ clock (created_at), so they start over like a
 *  new user. Role, areas, buddy, location and their comments on pages stay. */
export async function resetUserProgress(profileId: string) {
  const session = await getSession();
  if (!session || !hasRole(session.profile.role, "admin")) throw new Error("admins only");
  const admin = createAdminClient();
  for (const table of ["checklist_progress", "quiz_attempts", "chat_responses", "daily_task_log"]) {
    const { error } = await admin.from(table).delete().eq("profile_id", profileId);
    if (error) return { ok: false as const, message: error.message };
  }
  const { error } = await admin.from("profiles").update({ created_at: new Date().toISOString() }).eq("id", profileId);
  if (error) return { ok: false as const, message: error.message };
  revalidatePath("/", "layout");
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
