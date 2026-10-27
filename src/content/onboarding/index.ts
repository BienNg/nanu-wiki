import type { OnboardingWeek } from "@/lib/types";
import sales from "./sales";

/** Onboarding weeks per area slug. */
export const ONBOARDING_BY_AREA: Record<string, OnboardingWeek[]> = {
  sales: sales,
};
