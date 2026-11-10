import type { Profile } from "@/lib/types";

/** Roles that answer customers. Admins always may use the assistant. */
export const ASSISTANT_AREAS = ["sales", "student-support", "visa"];

export function canUseAssistant(profile: Profile) {
  return profile.role === "admin" || (profile.role === "staff" && ASSISTANT_AREAS.includes(profile.primary_area ?? ""));
}
