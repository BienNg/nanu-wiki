import type { IconName } from "@/lib/types";

const PATHS: Record<IconName | "search" | "clock" | "layers" | "bell" | "spark" | "doc" | "chevron" | "check" | "lock" | "edit" | "plus" | "logout" | "shield", string> = {
  users: "M9 4.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7ZM3 20a6 6 0 0 1 12 0M16 4.5a3.5 3.5 0 0 1 0 7M21 20a6 6 0 0 0-4-5.6",
  chat: "M4 5h16v11H9l-5 4z",
  heart: "M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10z",
  cap: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5",
  book: "M4 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM20 4h-6a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h6z",
  pen: "M4 20h4L19 9l-4-4L4 16zM13 7l4 4",
  building: "M4 20V6l8-3 8 3v14M9 20v-5h6v5",
  compass: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM15.5 8.5l-2 5-5 2 2-5z",
  megaphone: "M3 11v2l13 5V6zM16 9a3 3 0 0 1 0 6",
  passport: "M6 3h12v18H6zM12 7.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM9 17h6",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14ZM20 20l-3.5-3.5",
  clock: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM12 7v5l3 2",
  layers: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  bell: "M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0",
  spark: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z",
  doc: "M6 3h8l4 4v14H6zM14 3v4h4",
  chevron: "M9 6l6 6-6 6",
  check: "M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18ZM8 12l3 3 5-6",
  lock: "M5 11h14v10H5zM8 11V8a4 4 0 0 1 8 0v3",
  edit: "M4 20h4L19 9l-4-4L4 16z",
  plus: "M12 5v14M5 12h14",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z",
};

export type AnyIcon = keyof typeof PATHS;

export function Icon({
  name,
  size = 16,
  color = "currentColor",
  strokeWidth = 1.9,
  className,
}: {
  name: AnyIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
