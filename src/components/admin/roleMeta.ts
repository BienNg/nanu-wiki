import type { AppRole } from "@/lib/types";

/** One soft colour per access level, used for the legend, the section headings and the selected role pill. */
export const ROLE_META: Record<
  AppRole,
  { chip: string; dot: string; de: string; vi: string; title: string; descDe: string; descVi: string }
> = {
  pending: {
    chip: "bg-[#FBF3DA] text-[#7A5600]",
    dot: "bg-[#D9A21B]",
    de: "Warten auf Freischaltung",
    vi: "Đang chờ duyệt",
    title: "pending – sieht noch nichts",
    descDe: "Neues Google-Konto, sieht noch nichts",
    descVi: "Tài khoản Google mới, chưa xem được gì",
  },
  candidate: {
    chip: "bg-[#ECE7FA] text-[#5B3FB5]",
    dot: "bg-[#7B61D1]",
    de: "Kandidat:innen",
    vi: "Ứng viên",
    title: "candidate – Handbuch und Interview einer Rolle",
    descDe: "Handbuch und Interview einer Rolle",
    descVi: "Sổ tay và phỏng vấn của một vai trò",
  },
  staff: {
    chip: "bg-[#E6F4EA] text-[#23794A]",
    dot: "bg-[#3A9B65]",
    de: "Team",
    vi: "Nhân viên",
    title: "staff – Handbuch und Onboarding",
    descDe: "Handbuch und Onboarding",
    descVi: "Sổ tay và hội nhập",
  },
  admin: {
    chip: "bg-[#DFF1F4] text-[#0B6A80]",
    dot: "bg-[#1A8AA3]",
    de: "Admins",
    vi: "Quản trị",
    title: "admin – Handbuch, Onboarding, Interview und Entwürfe",
    descDe: "Handbuch, Onboarding, Interview, plus Entwürfe",
    descVi: "Sổ tay, hội nhập, phỏng vấn, thêm bản nháp",
  },
};
