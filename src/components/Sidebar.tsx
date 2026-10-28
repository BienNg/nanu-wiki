import Link from "next/link";
import type { Area, Profile } from "@/lib/types";
import { hasRole } from "@/lib/auth";
import { Icon } from "./Icon";
import { Label } from "./Bi";
import { NavLink } from "./NavLink";
import { initials } from "@/lib/format";
import { CollapseSidebarButton, SearchTrigger } from "./AppShell";

/** `openComments`: open comments in the areas this editor/admin works through, null for everyone else. */
export function Sidebar({
  areas,
  profile,
  onboardingPct,
  openComments,
}: {
  areas: Area[];
  profile: Profile;
  onboardingPct: number | null;
  openComments: number | null;
}) {
  const isCandidate = profile.role === "candidate";
  const myArea = areas.find((a) => a.slug === profile.primary_area);

  return (
    <aside aria-label="Seitenleiste" className="flex h-full min-h-0 w-full flex-col bg-side px-2.5 pb-3 pt-2.5">
      <div className="side-head flex min-h-10 items-center gap-2 px-1.5">
        <span aria-hidden="true" className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
          N
        </span>
        <span className="side-text min-w-0 flex-1 truncate text-sm font-semibold text-ink">NaNu NaNa</span>
        <CollapseSidebarButton />
      </div>

      {!isCandidate && (
        <SearchTrigger className="side-search mb-2.5 mt-1 flex h-9 w-full items-center gap-2 rounded-[7px] border border-line bg-white px-2.5 text-[13px] text-muted hover:text-ink" />
      )}

      <div className="flex min-h-0 flex-1 flex-col gap-px overflow-y-auto overscroll-contain">
        {!isCandidate && (
          <>
            <NavLink href="/" exact title="Neuigkeiten">
              <Icon name="clock" size={15} />
              <span className="side-text min-w-0 truncate">
                <Label de="Neuigkeiten" vi="Cập nhật" />
              </span>
            </NavLink>
            {myArea && (
              <NavLink href={`/bereich/${myArea.slug}?tab=onboarding`} title="Mein Onboarding">
                <Icon name="layers" size={15} />
                <span className="side-text min-w-0 truncate">
                  <Label de="Mein Onboarding" vi="Lộ trình của tôi" />
                </span>
              </NavLink>
            )}
          </>
        )}

        <div className="side-hide cap px-2 pb-1.5 pt-4">
          <Label de="Kanäle" vi="Kênh" />
        </div>
        {areas.map((a) => (
          <NavLink
            key={a.slug}
            href={isCandidate ? `/bereich/${a.slug}?tab=handbook` : `/bereich/${a.slug}`}
            matchPrefix={`/bereich/${a.slug}`}
            title={a.name_de}
          >
            <Icon name={a.icon} size={15} color={a.color} strokeWidth={2} />
            <span className="side-text min-w-0 truncate">
              <Label de={a.name_de} vi={a.name_vi} />
            </span>
          </NavLink>
        ))}
      </div>

      <div className="flex flex-col gap-px pt-2">
        {openComments !== null && (
          <NavLink href="/admin/kommentare" title="Kommentare">
            <Icon name="chat" size={15} />
            <span className="side-text min-w-0 flex-1 truncate">
              <Label de="Kommentare" vi="Bình luận" />
            </span>
            {openComments > 0 && <span className="side-text rounded-full bg-accent px-1.5 text-[11px] font-semibold leading-[18px] text-white">{openComments}</span>}
          </NavLink>
        )}
        {hasRole(profile.role, "admin") && (
          <NavLink href="/admin/benutzer" title="Benutzer & Rollen">
            <Icon name="shield" size={15} />
            <span className="side-text min-w-0 truncate">
              <Label de="Benutzer & Rollen" vi="Người dùng & vai trò" />
            </span>
          </NavLink>
        )}
        {onboardingPct !== null && myArea && (
          <Link
            href={`/bereich/${myArea.slug}?tab=onboarding`}
            title={`Onboarding: ${onboardingPct} %`}
            className="mt-2.5 flex min-h-[34px] items-center gap-2 rounded-md bg-accent-soft px-2.5 text-xs font-medium text-accent-dark"
          >
            <Icon name="layers" size={14} strokeWidth={2} />
            <span className="side-text min-w-0">
              <Label de={`Onboarding: ${onboardingPct} % erledigt`} vi={`Hội nhập: xong ${onboardingPct} %`} />
            </span>
          </Link>
        )}
        <div className="side-user mt-2 flex items-center gap-2 px-1.5 py-1">
          <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#FCE6DC] text-[11px] font-bold text-[#9E3617]">
            {initials(profile.full_name, profile.email)}
          </span>
          <span className="side-text min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13px] font-semibold text-ink">{profile.full_name ?? profile.email}</span>
            <span className="block text-xs capitalize text-muted">{profile.role}</span>
          </span>
          <form action="/auth/signout" method="post">
            <button type="submit" aria-label="Abmelden" className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-hover hover:text-ink">
              <Icon name="logout" size={15} />
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
