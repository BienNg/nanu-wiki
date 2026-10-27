import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/Sidebar";
import { AppShell } from "@/components/AppShell";
import { NavigationLoader } from "@/components/NavigationLoader";
import { Toaster } from "@/components/Toaster";
import type { Area } from "@/lib/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role === "pending") redirect("/pending");

  const supabase = await createClient();
  // RLS decides which areas come back (candidates only get their own role).
  const { data: areas } = await supabase.from("areas").select("*").order("sort");

  let onboardingPct: number | null = null;
  if (session.profile.primary_area_id && session.profile.role !== "candidate") {
    const [{ count: total }, { count: done }] = await Promise.all([
      supabase
        .from("checklist_items")
        .select("id, onboarding_weeks!inner(area_id)", { count: "exact", head: true })
        .eq("onboarding_weeks.area_id", session.profile.primary_area_id),
      supabase
        .from("checklist_progress")
        .select("item_id, checklist_items!inner(onboarding_weeks!inner(area_id))", { count: "exact", head: true })
        .eq("profile_id", session.profile.id)
        .eq("checklist_items.onboarding_weeks.area_id", session.profile.primary_area_id),
    ]);
    if (total) onboardingPct = Math.round(((done ?? 0) / total) * 100);
  }

  const areaList = (areas ?? []) as Area[];

  return (
    <>
      <AppShell sidebar={<Sidebar areas={areaList} profile={session.profile} onboardingPct={onboardingPct} />} areas={areaList} showSearch={session.profile.role !== "candidate"}>
        <NavigationLoader>{children}</NavigationLoader>
      </AppShell>
      <Toaster />
    </>
  );
}
