import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasRole, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { areaTabs, canEditArea, dailyTasksFor, getHandbookGroups, getOnboarding, getPageById, onboardingQuizPage, readablePages, readingMinutes, visibleAreas, weekComplete, type AreaTab } from "@/content";
import { Topbar } from "@/components/Topbar";
import { Reveal } from "@/components/Reveal";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { BlockRenderer } from "@/components/BlockRenderer";
import { PageTable } from "@/components/PageTable";
import { OnboardingPanel, type WeekData } from "@/components/OnboardingPanel";
import { DocView } from "@/components/DocView";
import { PaneCrumb, PaneLayout } from "@/components/DocPane";
import { DailyTasksPanel } from "@/components/DailyTasksPanel";
import { vnToday, weekday, WEEKDAYS } from "@/lib/days";
import { myQuizAttempts, myQuizStatuses, onboardingDone } from "@/lib/quizProgress";
import { quizStatus, type QuizStatus } from "@/lib/pageQuiz";
import type { PageWithMeta, Profile } from "@/lib/types";

const TABS: { key: AreaTab; de: string; vi: string }[] = [
  { key: "daily", de: "Tägliche Aufgaben", vi: "Việc hằng ngày" },
  { key: "handbook", de: "Handbuch", vi: "Sổ tay" },
  { key: "onboarding", de: "Onboarding", vi: "Hội nhập" },
  { key: "interview", de: "Interview", vi: "Phỏng vấn" },
];

export default async function AreaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string; seite?: string }>;
}) {
  const { profile } = await requireRole("candidate");
  const { slug } = await params;
  const { tab: tabParam, seite } = await searchParams;

  const area = visibleAreas(profile).find((a) => a.slug === slug);
  if (!area) notFound();

  const tabs = areaTabs(profile, area.slug);
  const tab: AreaTab = tabs.includes(tabParam as AreaTab) ? (tabParam as AreaTab) : await defaultTab(profile, area.slug, tabs);
  const canEdit = canEditArea(profile);
  const pages = readablePages(profile).filter((p) => p.area.slug === area.slug);
  // Quiz status per page, for staff and up (candidates don't take page quizzes).
  const quiz = hasRole(profile.role, "staff") ? await myQuizStatuses(profile.id, pages.filter((p) => p.section !== "interview")) : undefined;

  // `?seite=<page>` = that page is open in the side pane; the list narrows to its "Seite" column.
  const base = area.is_shared ? `/bereich/${area.slug}` : `/bereich/${area.slug}?tab=${tab}`;
  const paneHref = (p: PageWithMeta) => `${base}${area.is_shared ? "?" : "&"}seite=${p.slug}`;
  // Pages the side pane may show (none on the Interview tab), and the one the URL opens now.
  const paneable = tab === "interview" && !area.is_shared ? [] : pages.filter((p) => p.section !== "interview");
  const open = paneable.find((p) => p.slug === seite);
  const titles = Object.fromEntries(paneable.map((p) => [p.slug, { de: p.title_de, vi: p.title_vi }]));

  // Both layouts are sent: the full list, and the list next to the pane. PaneLayout switches between
  // them on the client, so the pane opens and closes on the click – the page inside loads afterwards.
  const list = (narrow: boolean) => (
    <Reveal once={`area-list:${area.slug}`} className={narrow ? "flex flex-col gap-5 px-3 pb-10 pt-5" : "mx-auto flex w-full max-w-[960px] flex-col gap-6 px-8 pb-20 pt-9"}>
      <header className={`flex flex-col gap-1.5 ${narrow ? "px-2.5" : ""}`}>
        <h1 data-reveal className={`title-display m-0 leading-[1.12] ${narrow ? "text-[22px]" : "text-[38px]"}`}>
          <Bi de={area.name_de} vi={area.name_vi} />
        </h1>
        {!narrow && area.description_de && (
          <p data-reveal className="m-0 mt-1 max-w-[680px] text-[#4A4F57]">
            <Bi de={area.description_de} vi={area.description_vi} />
          </p>
        )}
      </header>

      {area.is_shared ? (
        <>
          {quiz && !narrow && <QuizCounter quiz={quiz} />}
          <PageTable pages={[...pages].sort((a, b) => a.title_de.localeCompare(b.title_de, "de"))} paneHref={paneHref} narrow={narrow} quiz={quiz} />
        </>
      ) : (
        <>
          {!narrow && (
            <div role="tablist" aria-label="Bereiche der Rolle" className="flex flex-wrap gap-1 self-start rounded-lg bg-side p-[3px]">
              {TABS.filter((t) => tabs.includes(t.key)).map((t) => (
                <Link
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  href={`/bereich/${area.slug}?tab=${t.key}`}
                  className="inline-flex h-8 items-center rounded-md px-3 text-[13px] font-medium text-[#4A4F57] hover:text-ink aria-selected:bg-accent-soft aria-selected:text-accent-dark"
                >
                  <Label de={t.de} vi={t.vi} />
                </Link>
              ))}
            </div>
          )}

          {tab === "interview" && <InterviewTab pages={pages.filter((p) => p.section === "interview")} profileId={profile.id} canEdit={canEdit} />}
          {tab === "daily" && <DailyTab areaSlug={area.slug} profileId={profile.id} paneBase={base} narrow={narrow} />}
          {tab === "onboarding" && <OnboardingTab areaSlug={area.slug} profileId={profile.id} paneBase={base} />}
          {tab === "handbook" && (
            <HandbookTab areaSlug={area.slug} pages={pages.filter((p) => p.section === "handbook")} paneHref={paneHref} narrow={narrow} quiz={quiz} />
          )}
        </>
      )}
    </Reveal>
  );

  const topbar = (pane: boolean) => (
    <Topbar showLang={!pane}>
      <Icon name={area.icon} size={14} color={area.color} strokeWidth={2} />
      <span>
        <Label de={area.name_de} vi={area.name_vi} />
      </span>
      {pane && <PaneCrumb titles={titles} />}
    </Topbar>
  );

  return (
    <PaneLayout
      open={open?.slug}
      titles={titles}
      closeHref={base}
      closed={
        <>
          {topbar(false)}
          {list(false)}
        </>
      }
      topbar={topbar(true)}
      list={list(true)}
    >
      {open && <DocView page={open} profile={profile} pane />}
    </PaneLayout>
  );
}

/** Without `?tab=`: new hires (first 4 weeks) open their own role on Onboarding until week 1 is done –
 *  the daily tasks come after they know the basics. Everyone else gets the first tab. */
async function defaultTab(profile: Profile, areaSlug: string, tabs: AreaTab[]): Promise<AreaTab> {
  const isNew = Date.now() - new Date(profile.created_at).getTime() < 28 * 86_400_000;
  const week1 = getOnboarding(areaSlug)[0];
  if (isNew && week1 && tabs.includes("onboarding") && profile.primary_area === areaSlug) {
    const done = await onboardingDone(profile.id, areaSlug);
    if (!weekComplete(week1, done)) return "onboarding";
  }
  return tabs[0];
}

async function InterviewTab({ pages, profileId, canEdit }: { pages: PageWithMeta[]; profileId: string; canEdit: boolean }) {
  const supabase = await createClient();
  const withChat = pages.filter((p) => p.body.some((b) => b.type === "chat")).map((p) => p.id);
  const { data: mine } = withChat.length
    ? await supabase.from("chat_responses").select("page_id, sim_id").eq("profile_id", profileId).in("page_id", withChat)
    : { data: [] as { page_id: string; sim_id: string }[] };
  return (
    <div role="tabpanel" className="flex max-w-[720px] flex-col gap-10">
      {pages.length === 0 && <p className="text-muted">Noch keine Interview-Seite · Chưa có trang phỏng vấn</p>}
      {pages.map((p) => (
        <article key={p.id} className="flex flex-col gap-4">
          <h2 data-reveal className="font-display m-0 text-2xl font-bold text-heading">
            <Link href={p.href} className="text-heading hover:text-heading">
              <Bi de={p.title_de} vi={p.title_vi} />
            </Link>
          </h2>
          <BlockRenderer blocks={p.body} chat={{ pageId: p.id, done: (mine ?? []).filter((r) => r.page_id === p.id).map((r) => r.sim_id) }} />
          {canEdit && withChat.includes(p.id) && (
            <Link href={p.href} className="self-start text-[13px] font-medium text-accent">
              <Label de="Antworten der Kandidaten ansehen" vi="Xem câu trả lời của ứng viên" /> →
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}

// With the pane open, the tabs render twice (see `closed`): these load once per request.
const dailyLog = cache(async (profileId: string, day: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from("daily_task_log").select("task_id, done, note").eq("profile_id", profileId).eq("day", day);
  return data;
});

const onboardingProgress = cache(async (profileId: string, areaSlug: string) => {
  const supabase = await createClient();
  const quizIds = getOnboarding(areaSlug).flatMap((w) => w.quiz?.id ?? []);
  const [done, { data: attempts }, pageQuiz] = await Promise.all([
    onboardingDone(profileId, areaSlug),
    quizIds.length
      ? supabase.from("quiz_attempts").select("quiz_id, score, total, passed").eq("profile_id", profileId).in("quiz_id", quizIds)
      : Promise.resolve({ data: [] as { quiz_id: string; score: number; total: number; passed: boolean }[] }),
    myQuizAttempts(profileId),
  ]);
  return [done, attempts, pageQuiz] as const;
});

function taskLinks(page: string | undefined, areaSlug: string, paneBase: string) {
  const [pageId, anchor] = page?.split("#") ?? [];
  const [pageArea, pageSlug] = pageId?.split("/") ?? [];
  const hash = anchor ? `#${anchor}` : "";
  const full = pageId ? `/bereich/${pageId}${hash}` : null;
  return {
    href: pageArea === areaSlug ? `${paneBase}&seite=${pageSlug}${hash}` : full,
    fullHref: pageArea === areaSlug ? full : null,
    anchor: anchor ?? null,
  };
}

async function DailyTab({ areaSlug, profileId, paneBase, narrow }: { areaSlug: string; profileId: string; paneBase: string; narrow: boolean }) {
  const day = vnToday();
  const tasks = dailyTasksFor(areaSlug, day);
  const data = await dailyLog(profileId, day);
  const initial = Object.fromEntries((data ?? []).map((r) => [r.task_id as string, { done: r.done as boolean, note: (r.note as string | null) ?? "" }]));
  const wd = WEEKDAYS[weekday(day) - 1];

  return (
    <DailyTasksPanel
      key={day}
      narrow={narrow}
      areaSlug={areaSlug}
      day={day}
      dayLabel={{ de: wd.de, vi: wd.vi }}
      initial={initial}
      items={tasks.map((t) => ({
        ...taskLinks(t.page, areaSlug, paneBase),
        id: t.id,
        label_de: t.label_de,
        label_vi: t.label_vi,
        weekdayOnly: !!t.days,
        subtasks: (t.subtasks ?? []).map((s) => ({
          ...taskLinks(s.page ?? t.page, areaSlug, paneBase),
          id: s.id,
          label_de: s.label_de,
          label_vi: s.label_vi,
        })),
      }))}
    />
  );
}

async function OnboardingTab({ areaSlug, profileId, paneBase }: { areaSlug: string; profileId: string; paneBase: string }) {
  const weeks = getOnboarding(areaSlug);
  if (!weeks.length) return <p className="text-muted">Für diese Rolle gibt es noch keinen Lernpfad · Chưa có lộ trình cho vai trò này</p>;

  const [done, attempts, pageQuiz] = await onboardingProgress(profileId, areaSlug);

  const data: WeekData[] = weeks.map((w) => {
    const mine = (attempts ?? []).filter((a) => a.quiz_id === w.quiz?.id);
    const best = mine.sort((a, b) => b.score - a.score)[0];
    return {
      id: `${areaSlug}.w${w.week}`,
      week: w.week,
      timed: w.timed !== false,
      title_de: w.title_de,
      title_vi: w.title_vi,
      quizId: w.quiz?.id ?? null,
      quizPassed: mine.some((a) => a.passed),
      bestScore: best ? `${best.score}/${best.total}` : null,
      items: w.items.map((i) => {
        // Pages of this area open in the side pane; others go to the full page.
        const [pageArea, pageSlug] = i.page?.split("/") ?? [];
        const full = i.page ? `/bereich/${i.page}` : null;
        const quizPage = onboardingQuizPage(i);
        const page = i.page ? getPageById(i.page.split("#")[0]) : undefined;
        return {
          id: i.id,
          label_de: i.label_de,
          label_vi: i.label_vi,
          href: pageArea === areaSlug ? `${paneBase}&seite=${pageSlug}` : full,
          fullHref: pageArea === areaSlug ? full : null,
          minutes: page ? readingMinutes(page) : null,
          quiz: quizPage ? { href: `${quizPage.href}/quiz`, state: quizStatus(pageQuiz, quizPage.id, quizPage.quiz!.version).state } : null,
          children: i.children,
        };
      }),
    };
  });

  return (
    <div role="tabpanel">
      <OnboardingPanel weeks={data} initialDone={[...done]} areaSlug={areaSlug} />
    </div>
  );
}

function HandbookTab({
  areaSlug,
  pages,
  paneHref,
  narrow,
  quiz,
}: {
  areaSlug: string;
  pages: PageWithMeta[];
  paneHref: (p: PageWithMeta) => string;
  narrow: boolean;
  quiz?: Record<string, QuizStatus>;
}) {
  const own = quiz && Object.fromEntries(Object.entries(quiz).filter(([id]) => pages.some((p) => p.id === id)));
  const newestFirst = (list: PageWithMeta[]) => [...list].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  const groups = getHandbookGroups(areaSlug).map((g) => ({
    ...g,
    pages: g.pages.flatMap((c) => pages.find((p) => p.slug === c.slug) ?? []),
  }));
  if (!groups.length) {
    return (
      <div role="tabpanel" className="flex flex-col gap-3">
        <span className="cap">SOPs · Skripte · FAQs · Entscheidungen</span>
        {own && !narrow && <QuizCounter quiz={own} />}
        <PageTable pages={newestFirst(pages)} paneHref={paneHref} narrow={narrow} quiz={own} />
      </div>
    );
  }

  const grouped = new Set(groups.flatMap((g) => g.pages.map((p) => p.id)));
  const rest = newestFirst(pages.filter((p) => !grouped.has(p.id)));
  const shown = [...groups, ...(rest.length ? [{ de: "Weitere", vi: "Khác", pages: rest }] : [])].filter((g) => g.pages.length);
  return (
    <div role="tabpanel" className="flex flex-col gap-8">
      {own && !narrow && <QuizCounter quiz={own} />}
      {shown.map((g, i) => (
        <section key={g.de} className="flex flex-col gap-2">
          <h2 data-reveal className={`font-display m-0 px-2.5 font-bold text-heading ${narrow ? "text-[15px]" : "text-lg"}`}>
            <Bi de={g.de} vi={g.vi} />
          </h2>
          <PageTable pages={g.pages} header={i === 0} paneHref={paneHref} narrow={narrow} quiz={own} />
        </section>
      ))}
    </div>
  );
}

/** „7 / 12 Quizze bestanden“ above a page list, plus how many need a retake after new content. */
function QuizCounter({ quiz }: { quiz: Record<string, QuizStatus> }) {
  const all = Object.values(quiz);
  if (!all.length) return null;
  const passed = all.filter((s) => s.state === "passed").length;
  const outdated = all.filter((s) => s.state === "outdated").length;
  const pct = Math.round((passed / all.length) * 100);
  return (
    <div data-reveal className="flex max-w-[520px] flex-col gap-1.5 rounded-lg border border-line px-4 py-3">
      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px]">
        <strong className="text-ink">
          <Label de={`${passed} / ${all.length} Quizze bestanden`} vi={`Đã qua ${passed}/${all.length} quiz`} />
        </strong>
        {outdated > 0 && (
          <span className="text-[#7F5F05]">
            <Label de={`${outdated} wegen neuer Inhalte wiederholen`} vi={`${outdated} cần làm lại vì có nội dung mới`} />
          </span>
        )}
      </span>
      <span aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-chip">
        <span className="block h-full rounded-full bg-ok" style={{ width: `${pct}%` }} />
      </span>
    </div>
  );
}
