// Calendar days for the daily checklists, as "YYYY-MM-DD" strings in Vietnam time
// (the same zone as public.vn_today() in the database).

const TZ = "Asia/Ho_Chi_Minh";

export const WEEKDAYS = [
  { de: "Montag", vi: "Thứ Hai", short_de: "Mo", short_vi: "T2" },
  { de: "Dienstag", vi: "Thứ Ba", short_de: "Di", short_vi: "T3" },
  { de: "Mittwoch", vi: "Thứ Tư", short_de: "Mi", short_vi: "T4" },
  { de: "Donnerstag", vi: "Thứ Năm", short_de: "Do", short_vi: "T5" },
  { de: "Freitag", vi: "Thứ Sáu", short_de: "Fr", short_vi: "T6" },
  { de: "Samstag", vi: "Thứ Bảy", short_de: "Sa", short_vi: "T7" },
  { de: "Sonntag", vi: "Chủ Nhật", short_de: "So", short_vi: "CN" },
];

export function vnToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date());
}

/** 1 = Monday … 7 = Sunday. */
export function weekday(day: string): number {
  return ((new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7) + 1;
}

export function addDays(day: string, n: number): string {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** The Monday of the week `day` is in. */
export function weekStart(day: string): string {
  return addDays(day, 1 - weekday(day));
}

export function isDay(value: string | undefined): value is string {
  return !!value && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

/** "27.10." */
export function shortDate(day: string) {
  return `${day.slice(8, 10)}.${day.slice(5, 7)}.`;
}
