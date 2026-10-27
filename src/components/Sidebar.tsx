import Link from "next/link";
import type { Area, Profile } from "@/lib/types";
import { hasRole } from "@/lib/auth";
import { Icon } from "./Icon";
import { Label } from "./Bi";
import { NavLink } from "./NavLink";
import { initials } from "@/lib/format";

export function Sidebar({ areas, profile, onboardingPct }: { areas: Area[]; profile: Profile; onboardingPct: number | null }) {
  const isCandidate = profile.role === "candidate";
  const myArea = areas.find((a) => a.id === profile.primary_area_id);

  return (
    <aside aria-label="Seitenleiste" className="flex min-w-0 max-w-[264px] flex-[1_1_250px] flex-col gap-px bg-side px-2.5 pb-3 pt-2.5">
      <div className="flex min-h-10 items-center gap-2 px-1.5">
        <span aria-hidden="true" className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">
          N
        </span>
        <span className="flex-1 text-sm font-semibold text-ink">NaNu NaNa</span>
      </div>

      {!isCandidate && (
        <Link
          href="/suche"
          className="mb-2.5 mt-1 flex h-9 items-center gap-2 rounded-[7px] border border-line bg-white px-2.5 text-[13px] text-muted hover:text-ink"
        >
          <Icon name="search" size={14} strokeWidth={2} />
          <span className="flex-1">
            <Label de="Suchen …" vi="Tìm kiếm …" />
          </span>
        </Link>
      )}

      {!isCandidate && (
        <>
          <NavLink href="/" exact>
            <Icon name="clock" size={15} />
            <Label de="Neuigkeiten" vi="Cập nhật" />
          </NavLink>
          {myArea && (
            <NavLink href={`/bereich/${myArea.slug}?tab=onboarding`}>
              <Icon name="layers" size={15} />
              <Label de="Mein Onboarding" vi="Lộ trình của tôi" />
            </NavLink>
          )}
        </>
      )}

      <div className="cap px-2 pb-1.5 pt-4">
        <Label de="Kanäle" vi="Kênh" />
      </div>
      {areas.map((a) => (
        <NavLink key={a.id} href={isCandidate ? `/bereich/${a.slug}?tab=interview` : `/bereich/${a.slug}`} matchPrefix={`/bereich/${a.slug}`}>
          <svg className="w-3 flex-none text-faint" aria-hidden="true" viewBox="0 0 24 24" height="12" fill="currentColor">
            <path d="M9 6l7 6-7 6z" />
          </svg>
          <Icon name={a.icon} size={15} color={a.color} strokeWidth={2} />
          <span className="truncate">
            <Label de={a.name_de} vi={a.name_vi} />
          </span>
        </NavLink>
      ))}

      <div className="mt-auto flex flex-col gap-px pt-4">
        {hasRole(profile.role, "admin") && (
          <NavLink href="/admin/benutzer">
            <Icon name="shield" size={15} />
            <Label de="Benutzer & Rollen" vi="Người dùng & vai trò" />
          </NavLink>
        )}
        {onboardingPct !== null && myArea && (
          <Link
            href={`/bereich/${myArea.slug}?tab=onboarding`}
            className="mt-2.5 flex min-h-[34px] items-center gap-2 rounded-md bg-accent-soft px-2.5 text-xs font-medium text-accent-dark"
          >
            <Icon name="layers" size={14} strokeWidth={2} />
            <Label de={`Onboarding: ${onboardingPct} % erledigt`} vi={`Hội nhập: xong ${onboardingPct} %`} />
          </Link>
        )}
        <div className="mt-2 flex items-center gap-2 px-1.5 py-1">
          <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#FCE6DC] text-[11px] font-bold text-[#9E3617]">
            {initials(profile.full_name, profile.email)}
          </span>
          <span className="min-w-0 flex-1 leading-tight">
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
