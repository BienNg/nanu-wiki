import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/Topbar";
import { Reveal } from "@/components/Reveal";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { BlockRenderer } from "@/components/BlockRenderer";
import { PageTable, PAGE_SELECT } from "@/components/PageTable";
import { OnboardingPanel, type WeekData } from "@/components/OnboardingPanel";
import { createPage } from "@/app/actions";
import type { Area, PageSection, PageWithMeta } from "@/lib/types";

type Tab = "interview" | "onboarding" | "handbook";
const TABS: { key: Tab; de: string; vi: string }[] = [
  { key: "interview", de: "Interview", vi: "Phỏng vấn" },
  { key: "onboarding", de: "Onboarding", vi: "Hội nhập" },
  { key: "handbook", de: "Handbuch", vi: "Sổ tay" },
];

export default async function AreaPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { profile } = await requireRole("candidate");
  const { slug } = await params;
  const { tab: tabParam } = await searchParams;
  const supabase = await createClient();

  const { data: area } = await supabase.from("areas").select("*").eq("slug", slug).maybeSingle<Area>();
  if (!area) notFound();

  const isCandidate = profile.role === "candidate";
  const tab: Tab = isCandidate ? "interview" : TABS.some((t) => t.key === tabParam) ? (tabParam as Tab) : "onboarding";
  const { data: canEdit } = await supabase.rpc("can_edit_area", { target: area.id });

  const newPageForm = (section: PageSection) =>
    canEdit ? (
      <form action={createPage.bind(null, area.id, section)}>
        <button type="submit" className="inline-flex h-8 items-center gap-1.5 rounded-md bg-accent px-3 text-[13px] font-medium text-white hover:bg-[#1F5DB5]">
          <Icon name="plus" size={14} strokeWidth={2.2} />
          <Label de="Neue Seite" vi="Trang mới" />
        </button>
      </form>
    ) : null;

  return (
    <>
      <Topbar>
        <Icon name={area.icon} size={14} color={area.color} strokeWidth={2} />
        <span>
          <Label de={area.name_de} vi={area.name_vi} />
        </span>
      </Topbar>

      <Reveal className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-8 pb-20 pt-9">
        <header className="flex flex-col gap-1.5">
          <h1 data-reveal className="title-display m-0 text-[38px] leading-[1.12]">
            <Bi de={area.name_de} vi={area.name_vi} />
          </h1>
          {area.description_de && (
            <p data-reveal className="m-0 mt-1 max-w-[680px] text-[#4A4F57]">
              <Bi de={area.description_de} vi={area.description_vi} />
            </p>
          )}
        </header>

        {area.is_shared ? (
          <SharedArea areaId={area.id} action={newPageForm("general")} />
        ) : (
          <>
            {!isCandidate && (
              <div role="tablist" aria-label="Bereiche der Rolle" className="flex flex-wrap gap-1 self-start rounded-lg bg-side p-[3px]">
                {TABS.map((t) => (
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

            {tab === "interview" && <InterviewTab areaId={area.id} profileId={profile.id} canEdit={!!canEdit} action={newPageForm("interview")} />}
            {tab === "onboarding" && <OnboardingTab areaId={area.id} areaSlug={area.slug} profileId={profile.id} />}
            {tab === "handbook" && <HandbookTab areaId={area.id} action={newPageForm("handbook")} />}
          </>
        )}
      </Reveal>
    </>
  );
}

async function SharedArea({ areaId, action }: { areaId: string; action: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.from("pages").select(PAGE_SELECT).eq("area_id", areaId).order("title_de");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">{action}</div>
      <PageTable pages={(data ?? []) as unknown as PageWithMeta[]} />
    </div>
  );
}

async function InterviewTab({ areaId, profileId, canEdit, action }: { areaId: string; profileId: string; canEdit: boolean; action: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.from("pages").select(PAGE_SELECT).eq("area_id", areaId).eq("section", "interview").order("created_at");
  const pages = (data ?? []) as unknown as PageWithMeta[];
  const withChat = pages.filter((p) => p.body.some((b) => b.type === "chat")).map((p) => p.id);
  const { data: mine } = withChat.length
    ? await supabase.from("chat_responses").select("page_id, sim_id").eq("profile_id", profileId).in("page_id", withChat)
    : { data: [] as { page_id: string; sim_id: string }[] };
  return (
    <div role="tabpanel" className="flex max-w-[720px] flex-col gap-10">
      {action && <div className="flex justify-end">{action}</div>}
      {pages.length === 0 && <p className="text-muted">Noch keine Interview-Seite · Chưa có trang phỏng vấn</p>}
      {pages.map((p) => (
        <article key={p.id} className="flex flex-col gap-4">
          <h2 data-reveal className="font-display m-0 text-2xl font-bold text-heading">
            <Link href={`/seite/${p.id}`} className="text-heading hover:text-heading">
              <Bi de={p.title_de} vi={p.title_vi} />
            </Link>
          </h2>
          <BlockRenderer blocks={p.body} chat={{ pageId: p.id, done: (mine ?? []).filter((r) => r.page_id === p.id).map((r) => r.sim_id) }} />
          {canEdit && withChat.includes(p.id) && (
            <Link href={`/seite/${p.id}`} className="self-start text-[13px] font-medium text-accent">
              <Label de="Antworten der Kandidaten ansehen" vi="Xem câu trả lời của ứng viên" /> →
            </Link>
          )}
        </article>
      ))}
    </div>
  );
}

async function OnboardingTab({ areaId, areaSlug, profileId }: { areaId: string; areaSlug: string; profileId: string }) {
  const supabase = await createClient();
  const { data: weeks } = await supabase
    .from("onboarding_weeks")
    .select("id, week, title_de, title_vi, checklist_items(id, sort, label_de, label_vi, page_id), quizzes(id)")
    .eq("area_id", areaId)
    .order("week");

  const quizIds = (weeks ?? []).flatMap((w) => (w.quizzes as unknown as { id: string } | null)?.id ?? []);
  const [{ data: progress }, { data: attempts }] = await Promise.all([
    supabase.from("checklist_progress").select("item_id").eq("profile_id", profileId),
    quizIds.length
      ? supabase.from("quiz_attempts").select("quiz_id, score, total, passed").eq("profile_id", profileId).in("quiz_id", quizIds)
      : Promise.resolve({ data: [] as { quiz_id: string; score: number; total: number; passed: boolean }[] }),
  ]);

  const data: WeekData[] = (weeks ?? []).map((w) => {
    const quiz = w.quizzes as unknown as { id: string } | null;
    const mine = (attempts ?? []).filter((a) => a.quiz_id === quiz?.id);
    const best = mine.sort((a, b) => b.score - a.score)[0];
    return {
      id: w.id,
      week: w.week,
      title_de: w.title_de,
      title_vi: w.title_vi,
      quizId: quiz?.id ?? null,
      quizPassed: mine.some((a) => a.passed),
      bestScore: best ? `${best.score}/${best.total}` : null,
      items: [...(w.checklist_items ?? [])]
        .sort((a, b) => a.sort - b.sort)
        .map((i) => ({ id: i.id, label_de: i.label_de, label_vi: i.label_vi, pageId: i.page_id })),
    };
  });

  if (!data.length) return <p className="text-muted">Für diese Rolle gibt es noch keinen Lernpfad · Chưa có lộ trình cho vai trò này</p>;
  return (
    <div role="tabpanel">
      <OnboardingPanel weeks={data} initialDone={(progress ?? []).map((p) => p.item_id)} areaSlug={areaSlug} />
    </div>
  );
}

async function HandbookTab({ areaId, action }: { areaId: string; action: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.from("pages").select(PAGE_SELECT).eq("area_id", areaId).eq("section", "handbook").order("updated_at", { ascending: false });
  return (
    <div role="tabpanel" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="cap">SOPs · Skripte · FAQs · Entscheidungen</span>
        {action}
      </div>
      <PageTable pages={(data ?? []) as unknown as PageWithMeta[]} />
    </div>
  );
}
