import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { AREAS } from "@/content";
import { Topbar } from "@/components/Topbar";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { UsersTable, type Since } from "@/components/admin/UsersTable";
import { ROLE_META } from "@/components/admin/roleMeta";
import type { AppRole, Profile } from "@/lib/types";

export const metadata = { title: "Benutzer & Rollen" };

const LEGEND: AppRole[] = ["pending", "candidate", "staff", "admin"];
const DAY = 86_400_000;
const dateFmt = new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" });

export default async function UsersPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

  const list = ((profiles ?? []) as Profile[]).sort((a, b) => Number(b.role === "pending") - Number(a.role === "pending"));
  const pendingCount = list.filter((p) => p.role === "pending").length;
  const counts = Object.fromEntries(LEGEND.map((r) => [r, list.filter((p) => p.role === r).length])) as Record<AppRole, number>;

  // Computed on the server so the client renders the same text (no hydration mismatch around midnight).
  const now = Date.now();
  const since: Record<string, Since> = Object.fromEntries(
    list.map((p) => [p.id, { date: dateFmt.format(new Date(p.created_at)), days: Math.max(0, Math.floor((now - Date.parse(p.created_at)) / DAY)) }]),
  );

  return (
    <>
      <Topbar>
        <Icon name="shield" size={14} />
        <Label de="Benutzer & Rollen" vi="Người dùng & vai trò" />
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-8 pb-20 pt-9 max-sm:px-4">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="title-display m-0 text-[34px] leading-tight">
              <Bi de="Benutzer & Rollen" vi="Người dùng & vai trò" />
            </h1>
            <div className="flex items-center gap-2 text-[13px]">
              <span className="rounded-full bg-chip px-2.5 py-1 font-medium text-body">
                <Label de={`${list.length} Konten`} vi={`${list.length} tài khoản`} />
              </span>
              {pendingCount > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warn-soft px-2.5 py-1 font-semibold text-[#7A5600]">
                  <Icon name="bell" size={13} color="#A87400" />
                  <Label de={`${pendingCount} warten auf Freischaltung`} vi={`${pendingCount} đang chờ duyệt`} />
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ok-soft px-2.5 py-1 font-medium text-ok">
                  <Icon name="check" size={13} strokeWidth={2.4} />
                  <Label de="Niemand wartet" vi="Không ai đang chờ" />
                </span>
              )}
            </div>
          </div>
          <p className="m-0 text-[#4A4F57]">
            <Bi de="Neue Google-Konten landen als „pending“. Die Zugriffsstufe bestimmt, was jemand sieht:" vi="Tài khoản Google mới ở trạng thái „pending“. Quyền quyết định người đó xem được gì:" />
          </p>
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 lg:grid-cols-4">
            {LEGEND.map((r) => (
              <li key={r} className="flex flex-col gap-1 rounded-xl border border-line bg-[#F6F7F9] px-3 py-2.5">
                <span className="flex items-center justify-between">
                  <span className={`rounded-md px-2 py-0.5 text-[13px] font-semibold ${ROLE_META[r].chip}`}>{r}</span>
                  <span className="text-xs font-medium text-faint">{counts[r]}</span>
                </span>
                <span className="text-[13px] leading-snug text-body">
                  <Label de={ROLE_META[r].descDe} vi={ROLE_META[r].descVi} />
                </span>
              </li>
            ))}
          </ul>
        </header>

        <UsersTable profiles={list} areas={AREAS} since={since} />
      </main>
    </>
  );
}
