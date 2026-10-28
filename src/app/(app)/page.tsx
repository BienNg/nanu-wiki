import Link from "next/link";
import { redirect } from "next/navigation";
import { getEditorAreas, requireRole } from "@/lib/auth";
import { AREAS, getArea, readablePages } from "@/content";
import { Topbar } from "@/components/Topbar";
import { Reveal } from "@/components/Reveal";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { KindBadge } from "@/components/Badges";
import { PageTable } from "@/components/PageTable";
import { formatDate } from "@/lib/format";

const NO_AREA_TOAST = "Dir ist noch keine Rolle zugewiesen · Bạn chưa được gán vai trò";

export default async function HomePage() {
  const { profile } = await requireRole("candidate");

  if (profile.role === "candidate") {
    const area = getArea(profile.candidate_area);
    redirect(area ? `/bereich/${area.slug}?tab=handbook` : "/pending");
  }

  const published = readablePages(profile, await getEditorAreas()).filter((p) => p.published);
  const recent = [...published].sort((a, b) => b.updated_at.localeCompare(a.updated_at)).slice(0, 6);
  const shared = AREAS.find((a) => a.is_shared);
  const roles = AREAS.filter((a) => !a.is_shared);
  const myArea = getArea(profile.primary_area);
  const sharedPages = published.filter((p) => p.area.slug === shared?.slug).sort((a, b) => a.title_de.localeCompare(b.title_de, "de"));

  return (
    <>
      <Topbar>
        <Icon name="clock" size={14} />
        <Label de="Neuigkeiten" vi="Cập nhật" />
      </Topbar>

      <Reveal className="mx-auto flex w-full max-w-[900px] flex-col gap-11 px-8 pb-20 pt-10">
        <section className="flex flex-col gap-4">
          <span data-reveal className="cap">
            NaNu NaNa · Hồ Chí Minh · Hà Nội · Stuttgart
          </span>
          <h1 data-reveal className="title-display m-0 text-[40px] leading-[1.1]">
            <Bi de="Willkommen im NaNu Wiki" vi="Chào mừng bạn đến với NaNu Wiki" />
          </h1>
          <p data-reveal className="m-0 max-w-[640px] text-[15px]">
            <Bi
              de="Alles, was wir wissen, an einem Ort: Rollen, Abläufe, Skripte und Entscheidungen – für Bewerber:innen, neue Kolleg:innen und alle, die schon lange dabei sind."
              vi="Mọi kiến thức của NaNu NaNa ở cùng một nơi: vai trò, quy trình, kịch bản và các quyết định – dành cho ứng viên, đồng nghiệp mới và cả những bạn đã gắn bó lâu năm."
            />
          </p>
          <form data-reveal action="/suche" className="rounded-[10px] border border-line bg-white shadow-[0_4px_18px_rgba(16,24,40,.07)]">
            <label className="flex min-h-[50px] items-center gap-2.5 px-3.5 text-muted">
              <Icon name="search" size={17} strokeWidth={2} />
              <span className="sr-only">Wiki durchsuchen</span>
              <input
                name="q"
                type="search"
                placeholder="Wie beantworte ich die erste Messenger-Nachricht? · Hỏi Wiki …"
                className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none"
              />
              <button type="submit" className="h-[34px] rounded-md bg-accent px-3.5 text-[13px] font-medium text-white hover:bg-[#1F5DB5]">
                <Label de="Suchen" vi="Tìm" />
              </button>
            </label>
          </form>
        </section>

        <section data-reveal className="flex flex-col gap-3 rounded-[10px] border border-line p-3.5">
          <div className="px-1">
            <span className="cap text-body">
              <Label de="Start hier" vi="Bắt đầu từ đây" />
            </span>
            <p className="m-0 mt-0.5 text-[13px] text-muted">
              <Bi de="Folge diesen Schritten in deiner ersten Woche." vi="Làm theo các bước này trong tuần đầu tiên." />
            </p>
          </div>
          <div className="flex flex-wrap items-stretch gap-3.5">
            <ol className="m-0 flex min-w-0 flex-[1_1_320px] list-none flex-col gap-0.5 p-0 text-[13px]">
              {[
                { de: "„Für alle“ lesen: Geschichte, Werte, Kurse und Preise", vi: "Đọc mục „Cho tất cả“: câu chuyện, giá trị, khóa học và học phí", href: shared ? `/bereich/${shared.slug}` : "#" },
                { de: "Deine Rolle öffnen und Woche 1 starten", vi: "Mở trang vai trò và bắt đầu tuần 1", href: myArea ? `/bereich/${myArea.slug}?tab=onboarding` : "#" },
                { de: "Wöchentliches Quiz bestehen", vi: "Hoàn thành quiz hằng tuần", href: myArea ? `/bereich/${myArea.slug}?tab=onboarding` : "#" },
              ].map((s, i) => (
                <li key={i}>
                  <Link href={s.href} data-toast={s.href === "#" ? NO_AREA_TOAST : undefined} className="flex items-start gap-2.5 rounded-md px-2 py-2.5 text-ink hover:bg-side">
                    <span className="mt-px flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-chip text-[11px] font-semibold text-body">
                      {i + 1}
                    </span>
                    <span>
                      <Bi de={s.de} vi={s.vi} />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <div aria-hidden="true" className="flex min-h-[200px] flex-[1_1_260px] items-center justify-center rounded-md bg-[#F9D3C1] p-4">
              <svg viewBox="0 0 240 170" className="w-full max-w-[280px]" fill="none" stroke="#2B2D31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M30 140 Q72 124 118 140 L118 66 Q72 50 30 66 Z" fill="#FFF6F1" />
                <path d="M118 140 Q164 124 210 140 L210 66 Q164 50 118 66 Z" fill="#FFFFFF" />
                <path d="M44 84 Q72 76 104 85 M44 100 Q72 92 104 101 M132 85 Q162 76 196 84 M132 101 Q162 92 196 100" />
                <rect x="14" y="12" width="84" height="32" rx="12" fill="#FFFFFF" />
                <text x="56" y="33" textAnchor="middle" fontSize="14" fontWeight="600" fill="#2B2D31" stroke="none">
                  Hallo!
                </text>
                <rect x="132" y="8" width="96" height="32" rx="12" fill="#FFFFFF" />
                <text x="180" y="29" textAnchor="middle" fontSize="14" fontWeight="600" fill="#2B2D31" stroke="none">
                  Xin chào!
                </text>
              </svg>
            </div>
          </div>
        </section>

        {shared && (
          <section className="flex flex-col gap-3">
            <h2 data-reveal className="title-display m-0 text-2xl">
              <Bi de={shared.name_de} vi={shared.name_vi} />
            </h2>
            <PageTable pages={sharedPages} />
          </section>
        )}

        <section className="flex flex-col gap-3">
          <h2 data-reveal className="title-display m-0 text-2xl">
            <Bi de="Rollen" vi="Các vai trò" />
          </h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-2.5 rounded-lg bg-side p-2.5">
            {roles.map((a) => (
              <Link
                key={a.slug}
                href={`/bereich/${a.slug}`}
                data-reveal
                className="flex flex-col gap-2 rounded-lg border border-line bg-white p-3.5 text-ink shadow-[0_1px_2px_rgba(16,24,40,.04)] transition hover:-translate-y-0.5 hover:border-[#D3D6DC] hover:shadow-md"
              >
                <Icon name={a.icon} size={18} color={a.color} strokeWidth={2} />
                <h3 className="m-0 text-sm font-semibold leading-snug">
                  <Bi de={a.name_de} vi={a.name_vi} />
                </h3>
                <span className="text-xs text-muted">
                  {profile.role === "admin" ? "Handbuch · Onboarding · Interview" : "Handbuch · Onboarding"}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-1.5">
          <h2 data-reveal className="title-display m-0 mb-1.5 text-2xl">
            <Bi de="Neuigkeiten" vi="Cập nhật" />
          </h2>
          <span className="cap border-b border-line-soft pb-1.5">
            <Label de="Änderungen im Wiki" vi="Thay đổi trong Wiki" />
          </span>
          {recent.map((p) => (
            <Link key={p.id} href={p.href} data-reveal className="flex gap-2.5 rounded-md px-1.5 py-2.5 text-ink hover:bg-side">
              <Icon name="doc" size={15} color="#6B7079" className="mt-0.5 flex-none" />
              <span className="flex flex-col gap-0.5">
                <span className="flex flex-wrap items-center gap-2 font-medium">
                  <span>
                    <Bi de={p.title_de} vi={p.title_vi} inline />
                  </span>
                  {p.kind === "living" && <KindBadge kind="living" />}
                </span>
                <span className="text-xs text-muted">
                  {p.area.name_de} · {formatDate(p.updated_at)}
                </span>
              </span>
            </Link>
          ))}
        </section>
      </Reveal>
    </>
  );
}
