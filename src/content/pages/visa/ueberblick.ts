import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "ueberblick",
  title_de: "Überblick: Welche Visa wir begleiten",
  title_vi: "Tổng quan: Các loại visa trung tâm hỗ trợ",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "callout",
      tone: "info",
      de: "Entwurf: Diese Seite wird noch ergänzt. Stellen mit [ERGÄNZEN] bitte nicht an Kunden weitergeben.",
      vi: "Bản nháp: Trang này sẽ được bổ sung thêm. Các chỗ có [ERGÄNZEN] thì không gửi cho khách."
    },
    {
      type: "paragraph",
      de: "NaNu NaNa begleitet junge Menschen bis zur Ankunft in Deutschland. Das Visum ist der letzte und oft nervenaufreibendste Schritt – für die Familie geht es um viel Geld und Zeit.",
      vi: "NaNu NaNa đồng hành cùng các bạn trẻ đến khi đặt chân tới Đức. Visa là bước cuối cùng và thường căng thẳng nhất – với gia đình, đó là rất nhiều tiền bạc và thời gian."
    },
    { type: "heading", de: "Was wir begleiten", vi: "Những gì trung tâm hỗ trợ" },
    {
      type: "list",
      items: [
        { de: "Visum zur Ausbildung – im Paket der Ausbildungsvermittlung enthalten", vi: "Visa du học nghề – đã bao gồm trong gói du học nghề" },
        { de: "Visum zum Studium (Studienkolleg, Bachelor, Master) – inkl. APS und Finanzierungsnachweis", vi: "Visa du học đại học (dự bị, cử nhân, thạc sĩ) – gồm APS và chứng minh tài chính" },
        { de: "[ERGÄNZEN: weitere Visaarten, z. B. Sprachkursvisum]", vi: "[ERGÄNZEN: các loại visa khác, ví dụ visa học tiếng]" }
      ]
    },
    { type: "heading", de: "Was wir nicht begleiten", vi: "Những gì trung tâm không làm" },
    {
      type: "list",
      items: [
        { de: "Arbeitsvisa und Arbeitsprogramme (z. B. „8 Monate arbeiten“), Saisonarbeit", vi: "Visa lao động và chương trình lao động (ví dụ „lao động 8 tháng“), lao động thời vụ" },
        { de: "Familiennachzug und Verlängerungen bestehender Aufenthalte – hier helfen wir nur mit dem Sprachkurs (A1/A2 bzw. B1).", vi: "Đoàn tụ gia đình và gia hạn cư trú – trung tâm chỉ hỗ trợ khóa học tiếng (A1/A2 hoặc B1)." },
        { de: "Wechsel des Ausbildungsbetriebs für Personen, die über eine andere Agentur gekommen sind", vi: "Đổi doanh nghiệp cho các bạn sang Đức qua công ty khác" }
      ]
    },
    { type: "heading", de: "Wer macht was", vi: "Ai làm gì" },
    {
      type: "list",
      items: [
        { de: "Sales: erste Fragen beantworten, Kosten nennen, an Student Support übergeben", vi: "Sales: trả lời câu hỏi đầu tiên, báo chi phí, bàn giao cho Hỗ trợ học viên" },
        { de: "Student Support: Unterlagen, Termin bei der Botschaft, Nachverfolgung bis zum Visum", vi: "Hỗ trợ học viên: hồ sơ, lịch hẹn Đại sứ quán, theo dõi đến khi có visa" },
        { de: "[ERGÄNZEN: Ansprechperson Visa, Vertretung]", vi: "[ERGÄNZEN: người phụ trách visa, người thay thế]" }
      ]
    }
  ]
};

export default page;
