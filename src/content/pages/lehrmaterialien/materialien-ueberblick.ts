import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "materialien-ueberblick",
  title_de: "Unsere Materialien auf einen Blick",
  title_vi: "Tổng quan tài liệu học của trung tâm",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "callout",
      tone: "info",
      de: "Entwurf: Stellen mit [ERGÄNZEN] bitte nicht an Kunden weitergeben.",
      vi: "Bản nháp: Các chỗ có [ERGÄNZEN] thì không gửi cho khách."
    },
    {
      type: "paragraph",
      de: "Wer bei uns einen Kurs bucht, bekommt mehr als den Unterricht. Kenne jedes Material und wofür es da ist – Kunden fragen oft danach, bevor sie zahlen.",
      vi: "Học viên đăng ký khóa học nhận được nhiều hơn buổi học trên lớp. Hãy nắm rõ từng loại tài liệu và công dụng của nó – khách thường hỏi trước khi đóng học phí."
    },
    { type: "heading", de: "Was alle Studierenden bekommen", vi: "Tất cả học viên đều nhận được" },
    {
      type: "steps",
      items: [
        {
          de: "PDF-Paket per E-Mail",
          vi: "Bộ tài liệu PDF qua email",
          body_de: "Lehrbuch je Niveau (vorne Kursbuch, hinten Arbeitsbuch), Grammatik- und Wortschatzblätter, Zusatzübungen, Material für Hören, Sprechen, Lesen, Schreiben und Übungstests (A1: Goethe-Modelltests).",
          body_vi: "Giáo trình theo trình độ (nửa đầu sách giáo khoa, nửa sau sách bài tập), tài liệu ngữ pháp và từ vựng, bài tập luyện thêm, tài liệu bổ trợ nghe, nói, đọc, viết và bộ đề luyện thi (A1: đề Goethe)."
        },
        {
          de: "Unterrichtsfolien",
          vi: "Slide bài giảng",
          body_de: "Die Folien aus dem Unterricht – zum Wiederholen nach jeder Stunde.",
          body_vi: "Slide của buổi học – để ôn lại sau mỗi buổi."
        },
        {
          de: "Google Classroom",
          vi: "Google Classroom",
          body_de: "Hausaufgaben nach jeder Stunde, Abgabe und Rückmeldung der Lehrkraft, Überblick über alle Unterlagen.",
          body_vi: "Nhận bài tập sau mỗi buổi học, nộp bài và nhận nhận xét từ giáo viên, theo dõi tài liệu học tập."
        },
        {
          de: "App NaNu Go",
          vi: "App NaNu Go",
          body_de: "Läuft im Browser. Pro Lektion: Erklärvideo von Chị Phương, Wortschatz, Hörübungen. Dazu Lernfortschritt, Klassen-Rangliste und Spiele. Für Kursteilnehmende kostenlos, sonst 49 €.",
          body_vi: "Chạy trên trình duyệt. Mỗi bài: video chị Phương giảng lại, từ vựng, luyện nghe. Có tiến độ học, bảng xếp hạng cả lớp và trò chơi. Miễn phí cho học viên, giá ngoài 49 €."
        },
        {
          de: "Gedrucktes Handbuch",
          vi: "Sách Handbuch bản in",
          body_de: "Unser eigenes Buch, per Post nach Hause. [ERGÄNZEN: gilt das nur für A1 und nur in der Oktober-Aktion?]",
          body_vi: "Sách do trung tâm tự thiết kế, gửi về tận nhà. [ERGÄNZEN: chỉ cho A1 và chỉ trong ưu đãi tháng 10?]"
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "[ERGÄNZEN: Welche Apps gibt es genau? In den Chats heißen sie „2 Apps“, „NaNu Go“, „App luyện nghe“ (eigene Web-Adresse) und Classroom. Bis das geklärt ist: nur die Funktionen beschreiben, keine Anzahl nennen.]",
      vi: "[ERGÄNZEN: Chính xác có những app nào? Trong chat có lúc gọi là „2 app“, „NaNu Go“, „app luyện nghe“ (link riêng) và Classroom. Khi chưa rõ: chỉ mô tả chức năng, không nói số lượng app.]"
    },
    { type: "heading", de: "Was wir nicht machen", vi: "Những gì trung tâm không làm" },
    {
      type: "list",
      items: [
        { de: "Bücher oder Material an Personen schicken, die keinen Kurs gebucht haben.", vi: "Gửi sách hay tài liệu cho người chưa đăng ký khóa học." },
        { de: "App-Zugang ohne Kurs verkaufen.", vi: "Bán quyền dùng app khi không học tại trung tâm." }
      ]
    }
  ]
};

export default page;
