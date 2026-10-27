import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "visum-studium",
  title_de: "Visum zum Studium",
  title_vi: "Visa du học đại học",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "callout",
      tone: "info",
      de: "Entwurf: Beträge und Unterlagenliste folgen.",
      vi: "Bản nháp: số tiền và danh sách hồ sơ sẽ được bổ sung."
    },
    { type: "heading", de: "Der Weg zum Visum", vi: "Các bước đến visa" },
    {
      type: "steps",
      items: [
        { de: "Deutsch bis mindestens B1", vi: "Học tiếng Đức tối thiểu B1" },
        { de: "APS-Prüfung der Unterlagen", vi: "Thẩm tra hồ sơ APS", body_de: "Kommt zuerst. Für einen Start im September beginnen wir Anfang des Jahres.", body_vi: "Làm đầu tiên. Muốn nhập học tháng 9 thì bắt đầu từ đầu năm." },
        { de: "TestAS (falls nötig)", vi: "TestAS (nếu cần)", body_de: "Eignungstest, kein Bestehen oder Durchfallen, ca. 4 Stunden, auch auf Englisch.", body_vi: "Bài đánh giá năng lực, không có đậu hay trượt, khoảng 4 tiếng, có thể thi bằng tiếng Anh." },
        { de: "Zulassung Studienkolleg oder Hochschule", vi: "Nhận thư mời dự bị hoặc đại học" },
        { de: "Finanzierungsnachweis (Sperrkonto)", vi: "Chứng minh tài chính (tài khoản phong tỏa)", body_de: "[ERGÄNZEN: aktueller Betrag pro Jahr, Anbieter, wie wir helfen]", body_vi: "[ERGÄNZEN: số tiền hiện hành mỗi năm, nhà cung cấp, cách trung tâm hỗ trợ]" },
        { de: "Krankenversicherung und Visumantrag", vi: "Bảo hiểm y tế và nộp visa", body_de: "[ERGÄNZEN: Unterlagen, Termin, Wartezeit]", body_vi: "[ERGÄNZEN: hồ sơ, lịch hẹn, thời gian chờ]" }
      ]
    },
    { type: "heading", de: "Häufige Fragen der Familien", vi: "Câu hỏi phụ huynh hay hỏi" },
    {
      type: "list",
      items: [
        { de: "„Kann die Familie den Finanzierungsnachweis übernehmen und die Lebenskosten teilweise?“ – Ja, das ist der übliche Weg. [ERGÄNZEN: Details]", vi: "„Gia đình lo chứng minh tài chính và một phần sinh hoạt phí được không?“ – Được, đây là cách thông thường. [ERGÄNZEN: chi tiết]" },
        { de: "„Was, wenn das erste Studienjahr in Vietnam nicht ganz glatt war?“ – Entscheidend ist die Bestätigung der Uni, dass das Jahr abgeschlossen ist.", vi: "„Năm nhất ở Việt Nam trượt môn thì sao?“ – Quan trọng là trường xác nhận đã hoàn thành năm nhất." }
      ]
    }
  ]
};

export default page;
