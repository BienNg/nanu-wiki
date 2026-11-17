"use client";

import { useState, useTransition } from "react";
import { resetUserProgress, updateUser } from "@/app/actions";
import type { AppRole, Area, Profile } from "@/lib/types";
import { initials } from "@/lib/format";
import { Label } from "@/components/Bi";
import { Icon } from "@/components/Icon";
import { ROLE_META } from "./roleMeta";

const ROLES: AppRole[] = ["pending", "candidate", "staff", "admin"];
const LOCATIONS = [
  { v: "", l: "–" },
  { v: "hcm", l: "Hồ Chí Minh" },
  { v: "hanoi", l: "Hà Nội" },
  { v: "stuttgart", l: "Stuttgart" },
  { v: "online", l: "Online" },
];

export type Since = { date: string; days: number };

const fieldLabel =
  "mb-1 block text-[11px] font-semibold uppercase tracking-wide text-faint";
const sel =
  "h-9 w-full rounded-lg border border-line bg-white px-2.5 text-[13px] text-ink transition-colors hover:border-[#CDD1D8] focus:border-accent focus:outline-none disabled:cursor-not-allowed disabled:bg-side disabled:text-faint";

export function UsersTable({
  profiles,
  areas,
  since,
}: {
  profiles: Profile[];
  areas: Area[];
  since: Record<string, Since>;
}) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-line bg-[#F6F7F9] px-6 py-14 text-center">
        <Icon name="users" size={28} color="#8A8F98" />
        <strong className="text-[15px] text-ink">
          <Label de="Noch keine Konten" vi="Chưa có tài khoản nào" />
        </strong>
        <span className="text-[13px] text-muted">
          <Label
            de="Sobald sich jemand mit Google anmeldet, erscheint das Konto hier."
            vi="Khi có người đăng nhập bằng Google, tài khoản sẽ hiện ở đây."
          />
        </span>
      </div>
    );
  }

  // One flat list under one parent: a card keeps its state (status, open confirm) when it moves to another section.
  const buddyCount = new Map<string, number>();
  for (const p of profiles)
    if (p.buddy_id)
      buddyCount.set(p.buddy_id, (buddyCount.get(p.buddy_id) ?? 0) + 1);

  const items: React.ReactNode[] = [];
  ROLES.forEach((role) => {
    const group = profiles.filter((p) => p.role === role);
    if (group.length === 0) return;
    const meta = ROLE_META[role];
    items.push(
      <h2
        key={`h-${role}`}
        className={`m-0 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[14px] font-semibold text-ink ${items.length === 0 ? "" : "mt-6"}`}
      >
        <span
          aria-hidden="true"
          className={`h-2 w-2 rounded-full ${meta.dot}`}
        />
        <Label de={meta.de} vi={meta.vi} />
        <span
          className={`rounded-full px-2 py-px text-[12px] font-semibold ${meta.chip}`}
        >
          {group.length}
        </span>
        {role === "pending" && (
          <span className="ml-1 text-[13px] font-normal text-[#7A5600] max-sm:ml-4 max-sm:basis-full">
            <Label
              de="Zugriff wählen, dann Speichern"
              vi="Chọn quyền rồi bấm Lưu"
            />
          </span>
        )}
      </h2>,
    );
    for (const p of group) {
      items.push(
        <UserCard
          key={p.id}
          profile={p}
          profiles={profiles}
          areas={areas}
          since={since[p.id]}
          buddyOf={buddyCount.get(p.id) ?? 0}
        />,
      );
    }
  });

  return <div className="flex flex-col gap-2">{items}</div>;
}

type Status =
  { ok: true; kind: "saved" | "reset" } | { ok: false; message: string };

function UserCard({
  profile,
  profiles,
  areas,
  since,
  buddyOf,
}: {
  profile: Profile;
  profiles: Profile[];
  areas: Area[];
  since: Since | undefined;
  buddyOf: number;
}) {
  const [form, setForm] = useState({
    role: profile.role,
    primary_area: profile.primary_area ?? "",
    candidate_area: profile.candidate_area ?? "",
    buddy_id: profile.buddy_id ?? "",
    location: profile.location ?? "",
  });
  const [status, setStatus] = useState<Status | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [pending, startTransition] = useTransition();
  const dirty =
    form.role !== profile.role ||
    form.primary_area !== (profile.primary_area ?? "") ||
    form.candidate_area !== (profile.candidate_area ?? "") ||
    form.buddy_id !== (profile.buddy_id ?? "") ||
    form.location !== (profile.location ?? "");

  function save() {
    startTransition(async () => {
      const res = await updateUser(profile.id, {
        role: form.role,
        primary_area: form.primary_area || null,
        candidate_area: form.candidate_area || null,
        buddy_id: form.buddy_id || null,
        location: form.location || null,
      });
      setStatus(
        res.ok
          ? { ok: true, kind: "saved" }
          : { ok: false, message: res.message },
      );
    });
  }

  function reset() {
    startTransition(async () => {
      const res = await resetUserProgress(profile.id);
      setConfirmReset(false);
      setStatus(
        res.ok
          ? { ok: true, kind: "reset" }
          : { ok: false, message: res.message },
      );
    });
  }

  const roleAreas = areas.filter((a) => !a.is_shared);
  const isPending = profile.role === "pending";
  const buddies = profiles.filter(
    (x) => x.id !== profile.id && (x.role === "staff" || x.role === "admin"),
  );

  // Same edit rules as before: staff/admin set their own role, candidates the role they applied for, pending neither.
  const areaField =
    form.role === "candidate"
      ? ({
          key: "candidate_area",
          de: "Bewerbung für",
          vi: "Ứng tuyển cho",
          aria: "Bewerbung für",
        } as const)
      : ({
          key: "primary_area",
          de: "Eigene Rolle (Onboarding)",
          vi: "Vai trò (hội nhập)",
          aria: "Eigene Rolle",
        } as const);
  const areaDisabled = form.role === "pending";
  const missingArea = !areaDisabled && !form[areaField.key];

  const cardTone = dirty
    ? "border-accent/50 ring-1 ring-accent/15 bg-white"
    : isPending
      ? "border-[#EED9A0] bg-[#FFFCF3]"
      : "border-line bg-white";

  return (
    <article
      aria-busy={pending}
      className={`relative rounded-xl border p-4 transition-[box-shadow,opacity] hover:shadow-[0_2px_10px_rgba(16,24,40,0.06)] ${cardTone} ${pending ? "opacity-60" : ""}`}
    >
      {/* identifier */}
      <div className="flex items-start gap-3 pr-36 max-sm:pr-0">
        <span
          aria-hidden="true"
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-full text-[13px] font-bold ${ROLE_META[profile.role].chip}`}
        >
          {initials(profile.full_name, profile.email)}
        </span>
        <div className="min-w-0 leading-tight">
          <div className="truncate text-[15px] font-semibold text-ink">
            {profile.full_name ?? "–"}
          </div>
          <div className="truncate text-[13px] text-muted">{profile.email}</div>
          {since && (
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-faint">
              <span
                className={`inline-flex items-center gap-1 ${isPending && since.days >= 2 ? "font-medium text-[#A87400]" : ""}`}
                title={since.date}
              >
                <Icon name="clock" size={12} />
                {isPending ? (
                  <Label
                    de={`wartet ${ago(since.days, "de", "seit")}`}
                    vi={`chờ ${ago(since.days, "vi", "seit")}`}
                  />
                ) : (
                  <Label
                    de={`Start ${since.date} · ${ago(since.days, "de", "vor")}`}
                    vi={`Bắt đầu ${since.date} · ${ago(since.days, "vi", "vor")}`}
                  />
                )}
              </span>
              {buddyOf > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Icon name="heart" size={12} />
                  <Label
                    de={`Buddy für ${buddyOf}`}
                    vi={`Buddy của ${buddyOf} người`}
                  />
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* primary action: same spot on every card */}
      <div className="absolute right-4 top-4 flex flex-col items-end gap-1 max-sm:static max-sm:mt-3">
        <div className="flex items-center gap-2">
          {status && <StatusText status={status} />}
          <button
            type="button"
            onClick={save}
            disabled={!dirty || pending}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-accent px-3.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-accent-dark disabled:bg-chip disabled:text-faint disabled:shadow-none"
          >
            <Icon name="check" size={14} strokeWidth={2.4} />
            {pending ? (
              <Label de="Speichert…" vi="Đang lưu…" />
            ) : (
              <Label de="Speichern" vi="Lưu" />
            )}
          </button>
        </div>
        {!isPending && !confirmReset && (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            disabled={pending}
            className="rounded-md px-1.5 py-0.5 text-xs text-faint transition-colors hover:bg-bad-soft hover:text-bad"
          >
            <Label de="Fortschritt löschen" vi="Xoá tiến độ" />
          </button>
        )}
      </div>

      {/* fields */}
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[auto_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)]">
        <div>
          <span className={fieldLabel}>
            <Label de="Zugriff" vi="Quyền" />
          </span>
          <div
            role="radiogroup"
            aria-label="Zugriff"
            className="inline-flex rounded-lg border border-line bg-side p-0.5"
          >
            {ROLES.map((r) => {
              const checked = form.role === r;
              return (
                <label
                  key={r}
                  title={ROLE_META[r].title}
                  className={`inline-flex h-8 cursor-pointer items-center rounded-md px-2.5 text-[13px] font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${
                    checked
                      ? `${ROLE_META[r].chip} shadow-[0_1px_2px_rgba(16,24,40,0.08)]`
                      : "text-muted hover:bg-white hover:text-ink"
                  }`}
                >
                  <input
                    type="radio"
                    className="sr-only"
                    name={`role-${profile.id}`}
                    value={r}
                    checked={checked}
                    onChange={() => setForm({ ...form, role: r })}
                  />
                  {r}
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <span className={fieldLabel}>
            <Label de={areaField.de} vi={areaField.vi} />
          </span>
          <select
            aria-label={areaField.aria}
            className={sel}
            value={areaDisabled ? "" : form[areaField.key]}
            onChange={(e) =>
              setForm({ ...form, [areaField.key]: e.target.value })
            }
            disabled={areaDisabled}
          >
            <option value="">
              {areaDisabled ? "Erst Zugriff wählen" : "–"}
            </option>
            {roleAreas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name_de}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={fieldLabel}>Buddy</span>
          <select
            aria-label="Buddy"
            className={sel}
            value={form.buddy_id}
            onChange={(e) => setForm({ ...form, buddy_id: e.target.value })}
          >
            <option value="">–</option>
            {buddies.map((x) => (
              <option key={x.id} value={x.id}>
                {x.full_name ?? x.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className={fieldLabel}>
            <Label de="Standort" vi="Địa điểm" />
          </span>
          <select
            aria-label="Standort"
            className={sel}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          >
            {LOCATIONS.map((l) => (
              <option key={l.v} value={l.v}>
                {l.l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* warnings */}
      {missingArea && (
        <div className="mt-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-warn-soft px-2 py-0.5 text-xs font-medium text-[#7A5600]">
            <Icon name="bell" size={12} />
            {form.role === "candidate" ? (
              <Label de="Bewerbung für fehlt" vi="Chưa chọn vị trí ứng tuyển" />
            ) : (
              <Label
                de="Eigene Rolle fehlt – kein Onboarding"
                vi="Chưa có vai trò – không có hội nhập"
              />
            )}
          </span>
        </div>
      )}

      {confirmReset && (
        <div className="mt-3 flex flex-col gap-2.5 rounded-lg border border-[#F4C7C0] bg-bad-soft p-3 text-[13px] text-[#7A271A]">
          <span>
            <strong>{profile.full_name ?? profile.email}</strong>{" "}
            <Label
              de="startet wie neu: Onboarding-Häkchen, alle Quiz-Versuche, Messenger-Übungen und Tagesaufgaben werden gelöscht. Rolle, Buddy, Standort und Kommentare bleiben. Das lässt sich nicht rückgängig machen."
              vi="bắt đầu lại từ đầu: dấu tích hội nhập, mọi lần làm quiz, bài luyện Messenger và việc hằng ngày sẽ bị xoá. Vai trò, buddy, địa điểm và bình luận được giữ lại. Không thể hoàn tác."
            />
          </span>
          <span className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              disabled={pending}
              className="h-8 rounded-md border border-line bg-white px-3 font-medium text-ink hover:bg-hover"
            >
              <Label de="Abbrechen" vi="Huỷ" />
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={pending}
              className="h-8 rounded-md bg-[#B42318] px-3 font-medium text-white hover:bg-[#912018]"
            >
              {pending ? (
                "…"
              ) : (
                <Label de="Ja, alles löschen" vi="Có, xoá hết" />
              )}
            </button>
          </span>
        </div>
      )}
    </article>
  );
}

function StatusText({ status }: { status: Status }) {
  if (!status.ok) {
    return (
      <span
        role="alert"
        className="max-w-[260px] truncate text-xs font-medium text-bad"
        title={status.message}
      >
        {status.message}
      </span>
    );
  }
  return (
    <span
      role="status"
      className="inline-flex items-center gap-1 text-xs font-medium text-ok"
    >
      <Icon name="check" size={12} strokeWidth={2.4} />
      {status.kind === "saved" ? (
        <Label de="Gespeichert" vi="Đã lưu" />
      ) : (
        <Label de="Fortschritt gelöscht" vi="Đã xoá tiến độ" />
      )}
    </span>
  );
}

/** "seit 3 Tagen" / "vor 3 Tagen" / "heute" – so nobody has to count days from the date. */
function ago(days: number, lang: "de" | "vi", mode: "seit" | "vor") {
  if (days <= 0)
    return lang === "de"
      ? mode === "seit"
        ? "seit heute"
        : "heute"
      : mode === "seit"
        ? "từ hôm nay"
        : "hôm nay";
  if (lang === "vi")
    return mode === "seit" ? `${days} ngày` : `${days} ngày trước`;
  return `${mode} ${days} ${days === 1 ? "Tag" : "Tagen"}`;
}
