import { redirect } from "next/navigation";
import { getEditorAreas, getSession, hasRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { AppShell } from "@/components/AppShell";
import { NavigationLoader } from "@/components/NavigationLoader";
import { Toaster } from "@/components/Toaster";
import { AREAS, getOnboarding, visibleAreas } from "@/content";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role === "pending") redirect("/pending");

  // Candidates only get their own role.
  const areaList = visibleAreas(session.profile);

  let onboardingPct: number | null = null;
  const itemIds = getOnboarding(session.profile.primary_area ?? "").flatMap((w) => w.items.map((i) => i.id));
  if (itemIds.length && session.profile.role !== "candidate") {
    const supabase = await createClient();
    const { count: done } = await supabase
      .from("checklist_progress")
      .select("item_id", { count: "exact", head: true })
      .eq("profile_id", session.profile.id)
      .in("item_id", itemIds);
    onboardingPct = Math.round(((done ?? 0) / itemIds.length) * 100);
  }

  // Editors and admins: open comments waiting in their areas (sidebar badge).
  let openComments: number | null = null;
  if (hasRole(session.profile.role, "editor")) {
    const areas = session.profile.role === "admin" ? AREAS.map((a) => a.slug) : await getEditorAreas();
    openComments = 0;
    if (areas.length) {
      const supabase = await createClient();
      const { count } = await supabase
        .from("page_comments")
        .select("id", { count: "exact", head: true })
        .in("area", areas)
        .in("status", ["open", "in_progress"]);
      openComments = count ?? 0;
    }
  }

  return (
    <>
      <AppShell
        sidebar={<Sidebar areas={areaList} profile={session.profile} onboardingPct={onboardingPct} openComments={openComments} />} areas={areaList} showSearch={session.profile.role !== "candidate"}>
        <NavigationLoader>{children}</NavigationLoader>
      </AppShell>
      <Toaster />
    </>
  );
}
