import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { AppShell } from "@/components/AppShell";
import { NavigationLoader } from "@/components/NavigationLoader";
import { Toaster } from "@/components/Toaster";
import { getOnboarding, onboardingLeafIds, visibleAreas } from "@/content";
import { onboardingDone } from "@/lib/quizProgress";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role === "pending") redirect("/pending");

  // Candidates only get their own role.
  const areaList = visibleAreas(session.profile);

  let onboardingPct: number | null = null;
  const itemIds = onboardingLeafIds(getOnboarding(session.profile.primary_area ?? ""));
  if (itemIds.length && session.profile.role !== "candidate") {
    const done = await onboardingDone(session.profile.id, session.profile.primary_area!);
    onboardingPct = Math.round((done.size / itemIds.length) * 100);
  }

  // Admins: open comments waiting anywhere (sidebar badge).
  let openComments: number | null = null;
  if (session.profile.role === "admin") {
    const supabase = await createClient();
    const { count } = await supabase
      .from("page_comments")
      .select("id", { count: "exact", head: true })
      .in("status", ["open", "in_progress"]);
    openComments = count ?? 0;
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
