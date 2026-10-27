export function formatDate(value: string | null | undefined) {
  if (!value) return "–";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(value),
  );
}

export function initials(name: string | null | undefined, email?: string) {
  const source = (name || email || "?").trim();
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** "Geprüft" if verified_until is today or later. */
export function isVerified(verifiedUntil: string | null) {
  if (!verifiedUntil) return false;
  return new Date(verifiedUntil) >= new Date(new Date().toDateString());
}
