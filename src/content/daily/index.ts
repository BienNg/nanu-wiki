import type { DailyTask } from "@/lib/types";
import sales from "./sales";
import studentSupport from "./student-support";

/** Daily checklists per area slug. Only areas listed here get the „Tägliche Aufgaben“ tab. */
export const DAILY_TASKS_BY_AREA: Record<string, DailyTask[]> = {
  sales: sales,
  "student-support": studentSupport,
};
