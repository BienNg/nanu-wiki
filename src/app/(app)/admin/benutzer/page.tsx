import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/Topbar";
import { Bi, Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { UsersTable } from "@/components/admin/UsersTable";
import type { Area, Profile } from "@/lib/types";

export const metadata = { title: "Benutzer & Rollen" };

export default async function UsersPage() {
  await requireRole("admin");
  const supabase = await createClient();
  const [{ data: profiles }, { data: areas }, { data: editors }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("areas").select("*").order("sort"),
    supabase.from("area_editors").select("area_id, profile_id"),
  ]);

  const list = ((profiles ?? []) as Profile[]).sort((a, b) => Number(b.role === "pending") - Number(a.role === "pending"));
  const pendingCount = list.filter((p) => p.role === "pending").length;

  return (
    <>
      <Topbar>
        <Icon name="shield" size={14} />
        <Label de="Benutzer & Rollen" vi="Người dùng & vai trò" />
      </Topbar>
      <main className="mx-auto flex w-full max-w-[1100px] flex-col gap-6 px-8 pb-20 pt-9">
        <header className="flex flex-col gap-2">
          <h1 className="title-display m-0 text-[34px] leading-tight">
            <Bi de="Benutzer & Rollen" vi="Người dùng & vai trò" />
          </h1>
          <p className="m-0 max-w-[720px] text-[#4A4F57]">
            <Bi
              de="Neue Google-Konten landen als „pending“. Weise eine Zugriffsstufe zu: candidate (nur Interview einer Rolle), staff (alles lesen, eigenes Onboarding), editor (schreibt in ausgewählten Bereichen), admin."
              vi="Tài khoản Google mới ở trạng thái „pending“. Hãy gán quyền: candidate (chỉ xem phỏng vấn của một vai trò), staff (đọc tất cả, lộ trình riêng), editor (viết trong các mục được chọn), admin."
            />
          </p>
        </header>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2.5 rounded-lg bg-warn-soft px-4 py-3 text-[13px] text-[#5C4505]">
            <Icon name="bell" size={15} color="#A87400" />
            <Label de={`${pendingCount} Konto/Konten warten auf Freischaltung`} vi={`${pendingCount} tài khoản đang chờ duyệt`} />
          </div>
        )}

        <UsersTable profiles={list} areas={(areas ?? []) as Area[]} editors={editors ?? []} />
      </main>
    </>
  );
}
