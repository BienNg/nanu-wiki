import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AppRole, Profile } from "@/lib/types";

const RANK: Record<AppRole, number> = { pending: 0, candidate: 1, staff: 2, editor: 3, admin: 4 };

export function hasRole(role: AppRole, min: AppRole) {
  return RANK[role] >= RANK[min];
}

/** Signed-in user + profile for this request (cached per request). */
export const getSession = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return profile ? { user, profile } : null;
});

/** Redirects unless the user has at least `min` access. */
export async function requireRole(min: AppRole) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role === "pending") redirect("/pending");
  if (!hasRole(session.profile.role, min)) redirect("/");
  return session;
}

/** Area slugs the signed-in editor may manage (cached per request). */
export const getEditorAreas = cache(async () => {
  const session = await getSession();
  if (!session || session.profile.role !== "editor") return [] as string[];
  const supabase = await createClient();
  const { data } = await supabase.from("area_editors").select("area").eq("profile_id", session.profile.id);
  return (data ?? []).map((r) => r.area as string);
});
