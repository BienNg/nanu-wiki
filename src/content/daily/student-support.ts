import type { DailyTask } from "@/lib/types";

/** Daily routine of Customer Success. Each task links to its section on „taegliche-aufgaben“ (step by step, with links to the Handbuch). Ids are stored in daily_task_log – keep them stable when editing labels. */
const tasks: DailyTask[] = [
  {
    id: "cs.teilnehmende-beantwortet",
    label_de: "Alle Nachrichten der Schüler und Klassen durchgelesen und Anfragen und Probleme der Schüler und Lehrer gelöst",
    label_vi: "Đã đọc hết tin nhắn của học viên và các lớp, đã xử lý yêu cầu và vấn đề của học viên và giáo viên",
    page: "student-support/taegliche-aufgaben#nachrichten-beantworten",
    subtasks: [
      {
        id: "cs.teilnehmende-beantwortet.zalo",
        label_de: "Zalo: alle Nachrichten gelesen und Anfragen und Probleme gelöst",
        label_vi: "Zalo: đã đọc hết tin nhắn và xử lý yêu cầu, vấn đề",
        page: "student-support/taegliche-aufgaben#nachrichten-beantworten"
      },
      {
        id: "cs.teilnehmende-beantwortet.whatsapp",
        label_de: "WhatsApp: alle Nachrichten gelesen und Anfragen und Probleme gelöst",
        label_vi: "WhatsApp: đã đọc hết tin nhắn và xử lý yêu cầu, vấn đề",
        page: "student-support/taegliche-aufgaben#nachrichten-beantworten"
      }
    ]
  },
  {
    id: "cs.neue-eingewiesen",
    label_de: "Alle neuen Schüler in Slack \"student-support\" vollständig eingewiesen",
    label_vi: "Đã hướng dẫn đầy đủ tất cả học viên mới trong Slack \"student-support\"",
    page: "student-support/taegliche-aufgaben#neue-eingewiesen"
  },
  {
    id: "cs.sheets-vortag",
    label_de: "Google-Sheet-Tabellen aller Klassen von gestern geprüft",
    label_vi: "Đã kiểm tra bảng Google Sheet của mọi lớp học hôm qua",
    page: "student-support/taegliche-aufgaben#klassen-vortag",
    subtasks: [
      {
        id: "cs.mi-feedback-meeting",
        label_de: "Geprüft, ob alle Lehrkräfte das Feedback ausgefüllt haben",
        label_vi: "Đã kiểm tra giáo viên đã điền nhận xét chưa",
        page: "student-support/taegliche-aufgaben#mi-feedback"
      },
      {
        id: "cs.klassen-vortag",
        label_de: "Schüler, die gefehlt haben, angeschrieben und NaNu Go geprüft",
        label_vi: "Đã nhắn học viên vắng và kiểm tra NaNu Go",
        page: "student-support/taegliche-aufgaben#klassen-vortag"
      }
    ]
  },
  {
    id: "cs.abend-bericht",
    label_de: "Abends: Backoffice ausgefüllt, Bericht am Ende der Schicht geschickt",
    label_vi: "Cuối ngày: đã điền Backoffice và gửi báo cáo cuối ca",
    page: "student-support/taegliche-aufgaben#abend-bericht"
  },
  {
    id: "cs.mo-neue-woche",
    label_de: "Lehrkräften die neue Woche angekündigt und das Leaderboard der letzten Woche in jede Klassengruppe geschickt",
    label_vi: "Đã nhắc giáo viên về tuần mới và gửi bảng xếp hạng tuần trước vào từng nhóm lớp",
    days: [1],
    page: "student-support/taegliche-aufgaben#mo-neue-woche"
  },
  {
    id: "cs.fr-wochenbericht",
    label_de: "Wochenbericht mit Lösungsvorschlägen geschickt",
    label_vi: "Đã gửi báo cáo tuần kèm đề xuất phương án xử lý",
    days: [5],
    page: "student-support/taegliche-aufgaben#fr-wochenbericht"
  }
];

export default tasks;
