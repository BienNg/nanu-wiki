import Link from "next/link";
import { notFound } from "next/navigation";
import { getEditorAreas, requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { areaTabs, canEditArea, getHandbookGroups, getOnboarding, readablePages, visibleAreas, type AreaTab } from "@/content";
import { Topbar } from "@/components/Topbar";
import { Reveal } from "@/components/Reveal";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { BlockRenderer } from "@/components/BlockRenderer";
import { PageTable } from "@/components/PageTable";
import { OnboardingPanel, type WeekData } from "@/components/OnboardingPanel";
import type { PageWithMeta } from "@/lib/types";

const TABS: { key: AreaTab; de: string; vi: string }[] = [
  { key: "handbook", de: "Handbuch", vi: "Sổ tay" },
  { key: "onboarding", de: "Onboarding", vi: "Hội nhập" },
  { key: "interview", de: "Interview", vi: "Phỏng vấn" },
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

  const area = visibleAreas(profile).find((a) => a.slug === slug);
  if (!area) notFound();

  const editorAreas = await getEditorAreas();
  const tabs = areaTabs(profile);
  const tab: AreaTab = tabs.includes(tabParam as AreaTab) ? (tabParam as AreaTab) : tabs[0];
  const canEdit = canEditArea(profile, editorAreas, area.slug);
  const pages = readablePages(profile, editorAreas).filter((p) => p.area.slug === area.slug);

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
          <PageTable pages={[...pages].sort((a, b) => a.title_de.localeCompare(b.title_de, "de"))} />
        ) : (
          <>
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

            {tab === "interview" && <InterviewTab pages={pages.filter((p) => p.section === "interview")} profileId={profile.id} canEdit={canEdit} />}
            {tab === "onboarding" && <OnboardingTab areaSlug={area.slug} profileId={profile.id} />}
            {tab === "handbook" && <HandbookTab areaSlug={area.slug} pages={pages.filter((p) => p.section === "handbook")} />}
          </>
        )}
      </Reveal>
    </>
  );
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

async function OnboardingTab({ areaSlug, profileId }: { areaSlug: string; profileId: string }) {
  const weeks = getOnboarding(areaSlug);
  if (!weeks.length) return <p className="text-muted">Für diese Rolle gibt es noch keinen Lernpfad · Chưa có lộ trình cho vai trò này</p>;

  const supabase = await createClient();
  const quizIds = weeks.flatMap((w) => w.quiz?.id ?? []);
  const [{ data: progress }, { data: attempts }] = await Promise.all([
    supabase.from("checklist_progress").select("item_id").eq("profile_id", profileId),
    quizIds.length
      ? supabase.from("quiz_attempts").select("quiz_id, score, total, passed").eq("profile_id", profileId).in("quiz_id", quizIds)
      : Promise.resolve({ data: [] as { quiz_id: string; score: number; total: number; passed: boolean }[] }),
  ]);

  const data: WeekData[] = weeks.map((w) => {
    const mine = (attempts ?? []).filter((a) => a.quiz_id === w.quiz?.id);
    const best = mine.sort((a, b) => b.score - a.score)[0];
    return {
      id: `${areaSlug}.w${w.week}`,
      week: w.week,
      title_de: w.title_de,
      title_vi: w.title_vi,
      quizId: w.quiz?.id ?? null,
      quizPassed: mine.some((a) => a.passed),
      bestScore: best ? `${best.score}/${best.total}` : null,
      items: w.items.map((i) => ({ id: i.id, label_de: i.label_de, label_vi: i.label_vi, href: i.page ? `/bereich/${i.page}` : null })),
    };
  });

  return (
    <div role="tabpanel">
      <OnboardingPanel weeks={data} initialDone={(progress ?? []).map((p) => p.item_id)} areaSlug={areaSlug} />
    </div>
  );
}

function HandbookTab({ areaSlug, pages }: { areaSlug: string; pages: PageWithMeta[] }) {
  const newestFirst = (list: PageWithMeta[]) => [...list].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  const groups = getHandbookGroups(areaSlug).map((g) => ({
    ...g,
    pages: g.pages.flatMap((c) => pages.find((p) => p.slug === c.slug) ?? []),
  }));
  if (!groups.length) {
    return (
      <div role="tabpanel" className="flex flex-col gap-3">
        <span className="cap">SOPs · Skripte · FAQs · Entscheidungen</span>
        <PageTable pages={newestFirst(pages)} />
      </div>
    );
  }

  const grouped = new Set(groups.flatMap((g) => g.pages.map((p) => p.id)));
  const rest = newestFirst(pages.filter((p) => !grouped.has(p.id)));
  const shown = [...groups, ...(rest.length ? [{ de: "Weitere", vi: "Khác", pages: rest }] : [])].filter((g) => g.pages.length);
  return (
    <div role="tabpanel" className="flex flex-col gap-8">
      {shown.map((g, i) => (
        <section key={g.de} className="flex flex-col gap-2">
          <h2 data-reveal className="font-display m-0 px-2.5 text-lg font-bold text-heading">
            <Bi de={g.de} vi={g.vi} />
          </h2>
          <PageTable pages={g.pages} header={i === 0} />
        </section>
      ))}
    </div>
  );
}
