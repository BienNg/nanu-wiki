import { cookies } from "next/headers";
import type { Lang } from "@/lib/types";
import { LangToggle } from "./LangToggle";

/** The language chosen last (cookie), for the toggle's first render. */
export async function currentLang(): Promise<Lang> {
  return ((await cookies()).get("lang")?.value as Lang | undefined) ?? "both";
}

/** Breadcrumb bar above every page, with the language toggle on the right.
 *  `showLang={false}`: the toggle lives elsewhere (the side pane's header, see DocView). */
export async function Topbar({ children, actions, showLang = true }: { children: React.ReactNode; actions?: React.ReactNode; showLang?: boolean }) {
  const lang = await currentLang();
  return (
    <div className="flex min-h-12 flex-wrap items-center gap-1.5 px-4 text-[13px] text-muted">
      <nav aria-label="Brotkrumen" className="flex flex-wrap items-center gap-1.5 text-body">
        {children}
      </nav>
      <div className="ml-auto flex items-center gap-1.5">
        {actions}
        {showLang && <LangToggle initial={lang} />}
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
