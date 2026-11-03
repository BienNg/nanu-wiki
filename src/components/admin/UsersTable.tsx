"use client";

import { useState, useTransition } from "react";
import { resetUserProgress, setAreaEditor, updateUser } from "@/app/actions";
import type { AppRole, Area, Profile } from "@/lib/types";
import { initials } from "@/lib/format";

const ROLES: AppRole[] = ["pending", "candidate", "staff", "editor", "admin"];
const LOCATIONS = [
  { v: "", l: "–" },
  { v: "hcm", l: "Hồ Chí Minh" },
  { v: "hanoi", l: "Hà Nội" },
  { v: "stuttgart", l: "Stuttgart" },
  { v: "online", l: "Online" },
];
const sel = "h-8 rounded-md border border-line bg-white px-2 text-[13px] text-ink";

export function UsersTable({
  profiles,
  areas,
  editors,
}: {
  profiles: Profile[];
  areas: Area[];
  editors: { area: string; profile_id: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-line">
      <table className="w-full min-w-[980px] border-collapse text-[13px]">
        <thead className="bg-side text-left">
          <tr>
            {["Person", "Zugriff · Quyền", "Eigene Rolle (Onboarding)", "Bewerbung für", "Buddy", "Standort", ""].map((h) => (
              <th key={h} className="cap px-3 py-2.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <UserRow key={p.id} profile={p} profiles={profiles} areas={areas} editorAreas={editors.filter((e) => e.profile_id === p.id).map((e) => e.area)} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UserRow({ profile, profiles, areas, editorAreas }: { profile: Profile; profiles: Profile[]; areas: Area[]; editorAreas: string[] }) {
  const [form, setForm] = useState({
    role: profile.role,
    primary_area: profile.primary_area ?? "",
    candidate_area: profile.candidate_area ?? "",
    buddy_id: profile.buddy_id ?? "",
    location: profile.location ?? "",
  });
  const [status, setStatus] = useState<string | null>(null);
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
      setStatus(res.ok ? "✓" : res.message);
    });
  }

  function reset() {
    startTransition(async () => {
      const res = await resetUserProgress(profile.id);
      setConfirmReset(false);
      setStatus(res.ok ? "✓ Fortschritt gelöscht" : res.message);
    });
  }

  const roleAreas = areas.filter((a) => !a.is_shared);

  return (
    <>
      <tr className={`border-t border-line-soft align-top ${profile.role === "pending" ? "bg-[#FFFBF0]" : ""}`}>
        <td className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-chip text-[11px] font-bold text-body">
              {initials(profile.full_name, profile.email)}
            </span>
            <span className="leading-tight">
              <span className="block font-medium text-ink">{profile.full_name ?? "–"}</span>
              <span className="block text-xs text-muted">{profile.email}</span>
            </span>
          </div>
        </td>
        <td className="px-3 py-2.5">
          <select aria-label="Zugriff" className={sel} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as AppRole })}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2.5">
          <select aria-label="Eigene Rolle" className={sel} value={form.primary_area} onChange={(e) => setForm({ ...form, primary_area: e.target.value })} disabled={form.role === "candidate" || form.role === "pending"}>
            <option value="">–</option>
            {roleAreas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name_de}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2.5">
          <select aria-label="Bewerbung für" className={sel} value={form.candidate_area} onChange={(e) => setForm({ ...form, candidate_area: e.target.value })} disabled={form.role !== "candidate"}>
            <option value="">–</option>
            {roleAreas.map((a) => (
              <option key={a.slug} value={a.slug}>
                {a.name_de}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2.5">
          <select aria-label="Buddy" className={sel} value={form.buddy_id} onChange={(e) => setForm({ ...form, buddy_id: e.target.value })}>
            <option value="">–</option>
            {profiles
              .filter((x) => x.id !== profile.id && ["staff", "editor", "admin"].includes(x.role))
              .map((x) => (
                <option key={x.id} value={x.id}>
                  {x.full_name ?? x.email}
                </option>
              ))}
          </select>
        </td>
        <td className="px-3 py-2.5">
          <select aria-label="Standort" className={sel} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}>
            {LOCATIONS.map((l) => (
              <option key={l.v} value={l.v}>
                {l.l}
              </option>
            ))}
          </select>
        </td>
        <td className="px-3 py-2.5 text-right">
          <button type="button" onClick={save} disabled={!dirty || pending} className="h-8 rounded-md bg-accent px-3 text-[13px] font-medium text-white disabled:bg-chip disabled:text-muted">
            {pending ? "…" : "Speichern"}
          </button>
          {status && <span className="ml-2 text-xs text-muted">{status}</span>}
          {profile.role !== "pending" && !confirmReset && (
            <button type="button" onClick={() => setConfirmReset(true)} disabled={pending} className="mt-1.5 block w-full whitespace-nowrap text-right text-xs text-muted hover:text-[#B42318]">
              Fortschritt löschen
            </button>
          )}
        </td>
      </tr>
      {confirmReset && (
        <tr className="bg-[#FEF3F2]">
          <td colSpan={7} className="px-3 py-2.5">
            {/* sticky: stays in view when the wide table is scrolled sideways */}
            <div className="sticky left-3 flex w-[min(640px,calc(100vw-4rem))] flex-col items-start gap-2.5 text-[13px] text-[#7A271A]">
              <span>
                <strong>{profile.full_name ?? profile.email}</strong> startet wie neu: Onboarding-Häkchen, alle Quiz-Versuche, Messenger-Übungen und
                Tagesaufgaben werden gelöscht. Rolle, Buddy, Standort und Kommentare bleiben. Das lässt sich nicht rückgängig machen.
              </span>
              <span className="flex flex-none gap-2">
                <button type="button" onClick={() => setConfirmReset(false)} disabled={pending} className="h-8 rounded-md bg-white px-3 font-medium text-ink">
                  Abbrechen
                </button>
                <button type="button" onClick={reset} disabled={pending} className="h-8 rounded-md bg-[#B42318] px-3 font-medium text-white">
                  {pending ? "…" : "Ja, alles löschen"}
                </button>
              </span>
            </div>
          </td>
        </tr>
      )}
      {profile.role === "editor" && (
        <tr className="bg-side/60">
          <td colSpan={7} className="px-3 pb-3 pt-1">
            <span className="cap mr-3">Betreut (Entwürfe & Antworten) · Phụ trách</span>
            <span className="inline-flex flex-wrap gap-3 align-middle">
              {areas.map((a) => (
                <label key={a.slug} className="inline-flex items-center gap-1.5 text-[13px]">
                  <input
                    type="checkbox"
                    className="accent-accent"
                    defaultChecked={editorAreas.includes(a.slug)}
                    onChange={(e) => startTransition(() => setAreaEditor(a.slug, profile.id, e.target.checked))}
                  />
                  {a.name_de}
                </label>
              ))}
            </span>
          </td>
        </tr>
      )}
    </>
  );
}
