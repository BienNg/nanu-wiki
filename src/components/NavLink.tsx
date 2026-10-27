"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({
  href,
  children,
  exact = false,
  matchPrefix,
}: {
  href: string;
  children: React.ReactNode;
  exact?: boolean;
  matchPrefix?: string;
}) {
  const pathname = usePathname();
  const base = matchPrefix ?? href.split("?")[0];
  const active = exact ? pathname === base : pathname === base || pathname.startsWith(base + "/");

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className="flex min-h-9 items-center gap-2 rounded-md px-2 text-[13px] text-body hover:bg-hover hover:text-[#1F2125] aria-[current=page]:bg-active aria-[current=page]:font-medium aria-[current=page]:text-[#1F2125]"
    >
      {children}
    </Link>
  );
}
