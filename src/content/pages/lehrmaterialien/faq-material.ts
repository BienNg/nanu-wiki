import type { PageContent } from "@/lib/types";

// Collected from Messenger (Sept–Oct 2026). Add new questions here as they come up.
const page: PageContent = {
  slug: "faq-material",
  title_de: "Häufige Fragen zu Material",
  title_vi: "Câu hỏi thường gặp về tài liệu",
  kind: "living",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "steps",
      items: [
        { de: "„Kann ich nur das Buch kaufen?“", vi: "„Bên mình có bán riêng sách không ạ?“", body_de: "Nein. Bücher und Material gehen nur an Studierende, die einen Kurs gebucht haben. Freundlich den passenden Kurs anbieten.", body_vi: "Không. Sách và tài liệu chỉ gửi cho học viên đã đăng ký khóa học. Nhẹ nhàng gợi ý khóa phù hợp." },
        { de: "„Habt ihr Übungstests für Goethe?“", vi: "„Trung tâm có đề luyện thi Goethe không ạ?“", body_de: "Ja. Im PDF-Paket sind Übungstests, für A1 das Goethe-A1-Set. [ERGÄNZEN: welche Tests für A2 und B1?]", body_vi: "Có. Trong bộ PDF có đề luyện thi, với A1 là bộ đề Goethe A1. [ERGÄNZEN: đề nào cho A2 và B1?]" },
        { de: "„Welches Material bekomme ich im Kurs?“", vi: "„Học ở đây thì được nhận những tài liệu gì ạ?“", body_de: "PDF-Lehrbuch, Folien, Übungen, Classroom und App – Details unter „Unsere Materialien auf einen Blick“.", body_vi: "Giáo trình PDF, slide, bài tập, Classroom và app – chi tiết ở trang „Tổng quan tài liệu học“." },
        { de: "„Kann ich mich mit einem Video auf die Stunde vorbereiten?“", vi: "„Trước buổi học có video để xem không ạ?“", body_de: "In NaNu Go kann man alte Lektionen wiederholen und die nächste vorbereiten. Nach der Stunde gibt es ein Video, in dem Chị Phương das Wichtigste noch einmal erklärt. [ERGÄNZEN: Ist Vorbereitung Pflicht?]", body_vi: "Trong NaNu Go có thể ôn bài cũ và chuẩn bị bài mới trước mỗi buổi. Sau buổi học có video chị Phương giảng lại nội dung chính. [ERGÄNZEN: có bắt buộc chuẩn bị trước không?]" },
        { de: "„Ich habe gestern gefehlt – wo finde ich Video und Hausaufgabe?“", vi: "„Hôm qua em nghỉ, em xem lại bài và bài tập ở đâu ạ?“", body_de: "Auf die Zalo-Gruppe und die App verweisen. Wenn die Person schreibt, dass sie es nicht findet, direkt schicken.", body_vi: "Hướng học viên vào nhóm Zalo và app. Nếu học viên báo không tìm thấy thì gửi trực tiếp." },
        { de: "„Gibt es eine App zum Wiederholen von Grammatik und Wortschatz?“", vi: "„Có app nào để ôn ngữ pháp và từ vựng không ạ?“", body_de: "Die App ordnet Grammatik, Wortschatz und Videos nach Niveau und Lektion. [ERGÄNZEN: geplante Funktionen]", body_vi: "App chia ngữ pháp, từ vựng và video theo trình độ và từng bài. [ERGÄNZEN: tính năng sắp có]" },
        { de: "„Wird mir das Handbuch auch geschickt?“", vi: "„Sách Handbuch có gửi cho em không ạ?“", body_de: "[ERGÄNZEN: Regel – nur A1, nur in der Aktion?]", body_vi: "[ERGÄNZEN: quy định – chỉ A1, chỉ trong ưu đãi?]" }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Neue Frage, die hier fehlt? Trag sie mit Datum hier ein, auch wenn die Antwort noch offen ist.",
      vi: "Có câu hỏi mới chưa có ở đây? Ghi lại kèm ngày, kể cả khi chưa có câu trả lời."
    }
  ]
};

export default page;
