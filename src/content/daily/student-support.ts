import type { DailyTask } from "@/lib/types";

/** Daily routine of Customer Success, from „Aufgaben, Wochenrhythmus & KPIs“. Ids are stored in daily_task_log – keep them stable when editing labels. */
const tasks: DailyTask[] = [
  {
    id: "cs.teilnehmende-beantwortet",
    label_de: "Allen Schülern geantwortet und offene Probleme gelöst",
    label_vi: "Đã trả lời mọi học viên và xử lý các vấn đề phát sinh",
    page: "student-support/aufgaben-und-rhythmus#allen-antworten"
  },
  {
    id: "cs.lehrkraefte-erinnert",
    label_de: "Lehrkräfte erinnert: Anwesenheit, Unterrichtsdatei, Hausaufgabe und Feedback eingetragen",
    label_vi: "Đã nhắc giáo viên: điểm danh, bài giảng, bài tập và nhận xét học viên",
    page: "student-support/lehrkraefte-begleiten"
  },
  {
    id: "cs.neue-eingewiesen",
    label_de: "Neue Schüler vollständig eingewiesen und nach der ersten und zweiten Stunde gefragt, wie es läuft",
    label_vi: "Học viên mới đã được hướng dẫn đầy đủ và được hỏi thăm sau buổi 1 và buổi 2",
    page: "student-support/onboarding-und-kundenbindung"
  },
  {
    id: "cs.zalo-aufgaben",
    label_de: "Aufgaben aus Zalo erledigt – oder abends mit Screenshot in Slack eingetragen",
    label_vi: "Việc nhận trong Zalo đã xong – hoặc cuối ngày đã ghi vào Slack kèm ảnh chụp",
    page: "student-support/aufgaben-und-rhythmus#so-arbeiten-wir-im-team"
  },
  {
    id: "cs.klassen-vortag",
    label_de: "Excel-Listen der Klassen von gestern geprüft, Schüler, die gefehlt haben, angeschrieben und NaNu Go geprüft",
    label_vi: "Đã kiểm tra file Excel các lớp học hôm qua, nhắn học viên vắng và kiểm tra NaNu Go",
    page: "student-support/aufgaben-und-rhythmus#klassen-vortag"
  },
  {
    id: "cs.abend-bericht",
    label_de: "Abends: Backoffice ausgefüllt, Bericht am Ende der Schicht geschickt",
    label_vi: "Cuối ngày: đã điền Backoffice và gửi báo cáo cuối ca",
    page: "student-support/aufgaben-und-rhythmus#bericht-schicht"
  },
  {
    id: "cs.mo-neue-woche",
    label_de: "Lehrkräften die neue Woche angekündigt und das Leaderboard der letzten Woche in jede Klassengruppe geschickt",
    label_vi: "Đã nhắc giáo viên về tuần mới và gửi bảng xếp hạng tuần trước vào từng nhóm lớp",
    days: [1],
    page: "student-support/aufgaben-und-rhythmus#klassengruppen-montags"
  },
  {
    id: "cs.mi-feedback-meeting",
    label_de: "Geprüft, ob alle Lehrkräfte das Feedback ausgefüllt haben",
    label_vi: "Đã kiểm tra giáo viên đã điền nhận xét chưa",
    days: [3],
    page: "student-support/aufgaben-und-rhythmus#feedback-mittwochs"
  },
  {
    id: "cs.fr-wochenbericht",
    label_de: "Wochenbericht mit Lösungsvorschlägen geschickt",
    label_vi: "Đã gửi báo cáo tuần kèm đề xuất phương án xử lý",
    days: [5],
    page: "student-support/aufgaben-und-rhythmus#wochenbericht"
  }
];

export default tasks;
