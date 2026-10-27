import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { AppShell } from "@/components/AppShell";
import { NavigationLoader } from "@/components/NavigationLoader";
import { Toaster } from "@/components/Toaster";
import { getOnboarding, visibleAreas } from "@/content";

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

  return (
    <>
      <AppShell sidebar={<Sidebar areas={areaList} profile={session.profile} onboardingPct={onboardingPct} />} areas={areaList} showSearch={session.profile.role !== "candidate"}>
        <NavigationLoader>{children}</NavigationLoader>
      </AppShell>
      <Toaster />
    </>
  );
}
