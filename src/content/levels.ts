import type { Level } from "@/lib/types";

/** Course facts per level, used in the Messenger examples (`{sessions}`, `{fee}` …).
 *  Values in [BRACKETS] are placeholders until the real numbers are known; staff see them as "still to fill in". */
export const LEVEL_FACTS: Record<
  Level,
  { sessions: string; duration: string; duration_de: string; fee: string; fee_early: string; fee_eur: string }
> = {
  A1: {
    sessions: "40",
    duration: "khoảng 2,5–3 tháng",
    duration_de: "etwa 2,5–3 Monate",
    fee: "13.800.000đ",
    fee_early: "11.800.000đ",
    fee_eur: "580€",
  },
  A2: {
    sessions: "42",
    duration: "[THỜI GIAN A2]",
    duration_de: "[DAUER A2]",
    fee: "14.500.000đ",
    fee_early: "12.300.000đ",
    fee_eur: "580€",
  },
  B1: {
    sessions: "[SỐ BUỔI B1]",
    duration: "[THỜI GIAN B1]",
    duration_de: "[DAUER B1]",
    fee: "[HỌC PHÍ B1]",
    fee_early: "[GIÁ ƯU ĐÃI B1]",
    fee_eur: "[HỌC PHÍ € B1]",
  },
  B2: {
    sessions: "[SỐ BUỔI B2]",
    duration: "[THỜI GIAN B2]",
    duration_de: "[DAUER B2]",
    fee: "[HỌC PHÍ B2]",
    fee_early: "[GIÁ ƯU ĐÃI B2]",
    fee_eur: "[HỌC PHÍ € B2]",
  },
};
