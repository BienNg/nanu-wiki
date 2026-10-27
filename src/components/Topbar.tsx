import { cookies } from "next/headers";
import type { Lang } from "@/lib/types";
import { LangToggle } from "./LangToggle";

/** Breadcrumb bar above every page, with the language toggle on the right. */
export async function Topbar({ children, actions }: { children: React.ReactNode; actions?: React.ReactNode }) {
  const lang = ((await cookies()).get("lang")?.value as Lang | undefined) ?? "both";
  return (
    <div className="flex min-h-12 flex-wrap items-center gap-1.5 px-4 text-[13px] text-muted">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1.5 text-body">
        {children}
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        {actions}
        <LangToggle initial={lang} />
      </div>
    </div>
  );
}

export function Crumb({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden="true" className="text-[#B7BBC2]">
        /
      </span>
      {children}
    </>
  );
}
