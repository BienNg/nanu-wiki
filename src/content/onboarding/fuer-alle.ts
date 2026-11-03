import type { OnboardingWeek } from "@/lib/types";

/** The „Für alle“ pages every new hire reads first, one item per page, shortest and most useful first.
 *  They open week 1 of every role (see onboardingFor). Item `id`s are stored in checklist_progress – keep them stable. */
const items: OnboardingWeek["items"] = [
  {
    id: "fuer-alle.w1.um-hilfe-bitten",
    label_de: "Um Hilfe bitten: die 1:3:1-Regel",
    label_vi: "Nhờ giúp đỡ: quy tắc 1:3:1",
    page: "fuer-alle/um-hilfe-bitten"
  },
  {
    id: "fuer-alle.w1.allgemeine-regeln",
    label_de: "Allgemeine Regeln lesen",
    label_vi: "Đọc quy định chung",
    page: "fuer-alle/allgemeine-regeln"
  },
  {
    id: "fuer-alle.w1.tools",
    label_de: "Tools, die wir nutzen",
    label_vi: "Các công cụ chúng ta dùng",
    page: "fuer-alle/tools"
  },
  {
    id: "fuer-alle.w1.standorte-und-team",
    label_de: "Standorte & Team kennenlernen",
    label_vi: "Tìm hiểu cơ sở & đội ngũ",
    page: "fuer-alle/standorte-und-team"
  },
  {
    id: "fuer-alle.w1.geschichte-und-werte",
    label_de: "Unsere Geschichte & Werte",
    label_vi: "Câu chuyện & giá trị của chúng ta",
    page: "fuer-alle/geschichte-und-werte"
  },
  {
    id: "fuer-alle.w1.kurse-und-leistungen",
    label_de: "Kurse & Leistungen kennenlernen",
    label_vi: "Tìm hiểu các khóa học & dịch vụ",
    page: "fuer-alle/kurse-und-leistungen"
  },
  {
    id: "fuer-alle.w1.preise-und-positionierung",
    label_de: "Preise & Positionierung lesen",
    label_vi: "Đọc học phí & định vị",
    page: "fuer-alle/preise-und-positionierung"
  },
  {
    id: "fuer-alle.w1.google-drive-offline",
    label_de: "Google Drive auf dem PC einrichten",
    label_vi: "Cài Google Drive trên máy tính",
    page: "fuer-alle/google-drive-offline"
  }
];

export default items;
