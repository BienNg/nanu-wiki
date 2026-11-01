import type { DailyTask } from "@/lib/types";

/** Daily routine of Customer Success, from „Aufgaben, Wochenrhythmus & KPIs“. Ids are stored in daily_task_log – keep them stable when editing labels. */
const tasks: DailyTask[] = [
  {
    id: "cs.teilnehmende-beantwortet",
    label_de: "Allen Teilnehmenden geantwortet und offene Probleme gelöst",
    label_vi: "Đã trả lời mọi học viên và xử lý các vấn đề phát sinh",
    page: "student-support/aufgaben-und-rhythmus"
  },
  {
    id: "cs.lehrkraefte-erinnert",
    label_de: "Lehrkräfte erinnert: Anwesenheit, Unterrichtsdatei, Hausaufgabe und Feedback eingetragen",
    label_vi: "Đã nhắc giáo viên: điểm danh, bài giảng, bài tập và nhận xét học viên",
    page: "student-support/lehrkraefte-begleiten"
  },
  {
    id: "cs.neue-eingewiesen",
    label_de: "Neue Teilnehmende vollständig eingewiesen und nach der ersten und zweiten Stunde gefragt, wie es läuft",
    label_vi: "Học viên mới đã được hướng dẫn đầy đủ và được hỏi thăm sau buổi 1 và buổi 2",
    page: "student-support/onboarding-und-kundenbindung"
  },
  {
    id: "cs.beschwerden",
    label_de: "Jede Beschwerde am selben Tag notiert – mit jemandem, der sie löst",
    label_vi: "Mọi phản ánh đã được ghi nhận trong ngày – và có người xử lý",
    page: "student-support/aufgaben-und-rhythmus"
  },
  {
    id: "cs.zalo-aufgaben",
    label_de: "Aufgaben aus Zalo erledigt – oder abends mit Screenshot in Slack eingetragen",
    label_vi: "Việc nhận trong Zalo đã xong – hoặc cuối ngày đã ghi vào Slack kèm ảnh chụp",
    page: "student-support/aufgaben-und-rhythmus"
  },
  {
    id: "cs.abend-bericht",
    label_de: "Abends: Beobachtungsliste aktualisiert, Backoffice ausgefüllt, Bericht am Ende der Schicht geschickt",
    label_vi: "Cuối ngày: đã cập nhật danh sách cần theo dõi, điền Backoffice và gửi báo cáo cuối ca",
    page: "student-support/aufgaben-und-rhythmus"
  },
  {
    id: "cs.mo-betreuungsliste",
    label_de: "Klassen mit vielen Fehlzeiten herausgesucht, Betreuungsliste bis 15 Uhr an die Leitung geschickt",
    label_vi: "Đã lọc các lớp có học viên vắng nhiều, gửi danh sách cần chăm sóc cho quản lý trước 15h",
    days: [1],
    page: "student-support/aufgaben-und-rhythmus"
  },
  {
    id: "cs.mo-neue-woche",
    label_de: "Lehrkräften die neue Woche angekündigt und in jeder Klassengruppe an Drive, Classroom, NaNu Go und Handbuch erinnert",
    label_vi: "Đã nhắc giáo viên về tuần mới và nhắn vào từng nhóm lớp về Drive, Classroom, NaNu Go, Handbuch",
    days: [1],
    page: "student-support/aufgaben-und-rhythmus"
  },
  {
    id: "cs.mi-feedback-meeting",
    label_de: "Feedback der Lehrkräfte und offene Fälle geprüft, Meeting mit der Leitung vereinbart",
    label_vi: "Đã kiểm tra nhận xét của giáo viên và các vấn đề còn tồn đọng, đã gửi lịch họp với quản lý",
    days: [3],
    page: "student-support/aufgaben-und-rhythmus"
  },
  {
    id: "cs.fr-wochenbericht",
    label_de: "Wochenbericht mit Lösungsvorschlägen geschickt",
    label_vi: "Đã gửi báo cáo tuần kèm đề xuất phương án xử lý",
    days: [5],
    page: "student-support/aufgaben-und-rhythmus"
  }
];

export default tasks;
