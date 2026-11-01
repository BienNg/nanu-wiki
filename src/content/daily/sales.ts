import type { DailyTask } from "@/lib/types";

/** Daily routine of Sales, from „Aufgaben, Wochenrhythmus & KPIs“. Ids are stored in daily_task_log – keep them stable when editing labels. */
const tasks: DailyTask[] = [
  {
    id: "sales.morgen-pruefen",
    label_de: "Morgens: unbeantwortete Kontakte, fällige Rückrufe und Fristen der Unterlagen geprüft",
    label_vi: "Đầu ngày: đã kiểm tra khách chưa phản hồi, khách cần liên hệ lại và deadline hồ sơ",
    page: "sales/aufgaben-und-kpis"
  },
  {
    id: "sales.anfragen-beantwortet",
    label_de: "Alle neuen Anfragen aus Facebook, Zalo, WhatsApp, TikTok und dem Website-Formular beantwortet",
    label_vi: "Đã phản hồi mọi khách mới từ Facebook, Zalo, WhatsApp, TikTok và form website",
    page: "sales/erstkontakt-messenger"
  },
  {
    id: "sales.kontakt-status",
    label_de: "Jeder Kontakt hat im Backoffice einen Status, eine verantwortliche Person und den nächsten Kontakttermin",
    label_vi: "Mỗi khách trong Backoffice đều có trạng thái, người phụ trách và ngày liên hệ tiếp theo",
    page: "sales/aufgaben-und-kpis"
  },
  {
    id: "sales.rueckmeldungen-48h",
    label_de: "Vereinbarte Rückmeldungen erledigt – keine älter als 48 Stunden",
    label_vi: "Đã liên hệ lại đúng hẹn – không khách nào quá 48 tiếng",
    page: "sales/aufgaben-und-kpis"
  },
  {
    id: "sales.absagegruende",
    label_de: "Bei jeder Absage den Grund notiert",
    label_vi: "Đã ghi lại lý do của mỗi khách từ chối",
    page: "sales/aufgaben-und-kpis"
  },
  {
    id: "sales.uebergabe-cs",
    label_de: "Neue Anmeldungen in Slack an Customer Success übergeben – mit allem, was zugesagt wurde",
    label_vi: "Đã báo học viên mới đăng ký lên Slack cho đội Chăm sóc học viên – kèm mọi điều đã cam kết",
    page: "sales/aufgaben-und-kpis"
  },
  {
    id: "sales.abend-backoffice",
    label_de: "Abends: Backoffice ausgefüllt und in den letzten 15 Minuten alles noch einmal geprüft",
    label_vi: "Cuối ngày: đã điền Backoffice và kiểm tra lại trong 15 phút cuối",
    page: "sales/aufgaben-und-kpis"
  },
  {
    id: "sales.di-klassenbedarf",
    label_de: "Bedarf für die nächsten Klassen gesammelt – einen Monat und zwei Wochen vor dem Start",
    label_vi: "Đã tổng hợp nhu cầu mở lớp sắp tới – trước 1 tháng và trước 2 tuần",
    days: [2],
    page: "sales/aufgaben-und-kpis"
  },
  {
    id: "sales.mi-pruefen",
    label_de: "Unentschlossene Kontakte, Visumsunterlagen und Anmeldestand je Klasse geprüft",
    label_vi: "Đã kiểm tra khách chưa chốt, hồ sơ visa và tiến độ tuyển sinh từng lớp",
    days: [3],
    page: "sales/aufgaben-und-kpis"
  }
];

export default tasks;
