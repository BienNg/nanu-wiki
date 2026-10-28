import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getArea } from "@/content";

/** Neuigkeiten is gone. Land in the person's area, or in the shared handbook. */
export default async function HomePage() {
  const { profile } = await requireRole("candidate");

  if (profile.role === "candidate") {
    const area = getArea(profile.candidate_area);
    redirect(area ? `/bereich/${area.slug}?tab=handbook` : "/pending");
  }

  const area = getArea(profile.primary_area) ?? getArea("fuer-alle");
  redirect(area ? `/bereich/${area.slug}` : "/pending");
}
