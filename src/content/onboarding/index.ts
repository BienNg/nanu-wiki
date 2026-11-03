import type { OnboardingWeek } from "@/lib/types";
import fuerAlle from "./fuer-alle";
import sales from "./sales";

/** Each role's own onboarding weeks, per area slug. */
const ONBOARDING_BY_AREA: Record<string, OnboardingWeek[]> = {
  sales: sales,
};

/** A role's learning path: week 1 opens with the „Für alle“ items (minus pages the role links itself),
 *  then the role's own items. A role without its own weeks still gets that week 1. */
export function onboardingFor(areaSlug: string): OnboardingWeek[] {
  const own = ONBOARDING_BY_AREA[areaSlug] ?? [];
  const linked = new Set(own.flatMap((w) => w.items.map((i) => i.page)));
  const shared = fuerAlle.filter((i) => !linked.has(i.page));
  if (!own.length) return [{ week: 1, title_de: "Ankommen & Grundlagen", title_vi: "Làm quen & nền tảng", items: shared }];
  const [first, ...rest] = own;
  return [{ ...first, items: [...shared, ...first.items] }, ...rest];
}
