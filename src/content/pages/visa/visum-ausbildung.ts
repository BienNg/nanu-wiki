import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "visum-ausbildung",
  title_de: "Visum zur Ausbildung",
  title_vi: "Visa du học nghề",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "callout",
      tone: "info",
      de: "Entwurf: Unterlagenliste und Botschaftsablauf folgen.",
      vi: "Bản nháp: danh sách hồ sơ và quy trình tại Đại sứ quán sẽ được bổ sung."
    },
    { type: "heading", de: "Voraussetzungen", vi: "Điều kiện" },
    {
      type: "list",
      items: [
        { de: "Unterschriebener Ausbildungsvertrag mit einem deutschen Betrieb", vi: "Hợp đồng học nghề đã ký với doanh nghiệp Đức" },
        { de: "Deutsch mindestens B1 in allen vier Fertigkeiten (Pflege und Zahnmedizin: B2)", vi: "Tiếng Đức tối thiểu B1 đủ 4 kỹ năng (điều dưỡng và nha khoa: B2)" },
        { de: "Mindestens 18 Jahre", vi: "Từ 18 tuổi trở lên" },
        { de: "[ERGÄNZEN: Anerkennung des Schulabschlusses, Finanzierung, Versicherung]", vi: "[ERGÄNZEN: công nhận bằng cấp, tài chính, bảo hiểm]" }
      ]
    },
    { type: "heading", de: "Ablauf", vi: "Quy trình" },
    {
      type: "steps",
      items: [
        { de: "Vertrag liegt vor – Rate 2 (50 Mio.)", vi: "Có hợp đồng – đóng đợt 2 (50 triệu)" },
        { de: "Unterlagen vorbereiten und übersetzen", vi: "Chuẩn bị và dịch thuật hồ sơ", body_de: "[ERGÄNZEN: Liste der Unterlagen]", body_vi: "[ERGÄNZEN: danh sách hồ sơ]" },
        { de: "Termin bei der Botschaft", vi: "Hẹn lịch Đại sứ quán", body_de: "[ERGÄNZEN: Hanoi oder Generalkonsulat Ho-Chi-Minh-Stadt, Buchungsweg]", body_vi: "[ERGÄNZEN: Hà Nội hay Tổng lãnh sự quán TP.HCM, cách đặt lịch]" },
        { de: "Warten auf das Visum – oft 3–5 Monate", vi: "Chờ visa – thường 3–5 tháng" },
        { de: "Visum erteilt – Rate 3 (99 Mio.), Flug buchen", vi: "Có visa – đóng đợt 3 (99 triệu), đặt vé máy bay" }
      ]
    },
    { type: "heading", de: "Fristen, die alles entscheiden", vi: "Những mốc thời gian quyết định" },
    {
      type: "list",
      items: [
        { de: "Ein B1-Zertifikat gilt für den Visumantrag nur 12 Monate.", vi: "Bằng B1 chỉ có hiệu lực 12 tháng để nộp hồ sơ visa." },
        { de: "Es gibt nur zwei Ausbildungsstarts pro Jahr. Mit 3–5 Monaten Wartezeit muss der Antrag früh raus.", vi: "Mỗi năm chỉ có 2 kỳ nhập học. Visa chờ 3–5 tháng nên phải nộp sớm." },
        { de: "Wer nur auf eine Wunschstadt wartet, riskiert, den Start zu verpassen.", vi: "Chỉ chờ một thành phố mong muốn thì dễ lỡ kỳ nhập học." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Nie ein Visum versprechen. Die Entscheidung trifft die Botschaft, nicht wir.",
      vi: "Không bao giờ hứa chắc có visa. Quyết định là của Đại sứ quán, không phải của trung tâm."
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Welches Deutschniveau braucht man für das Ausbildungsvisum (außer Pflege und Zahnmedizin)?",
        question_vi: "Cần trình độ tiếng Đức nào cho visa du học nghề (trừ điều dưỡng và nha khoa)?",
        section: "voraussetzungen",
        options: [
          { de: "Mindestens B1 in allen vier Fertigkeiten", vi: "Tối thiểu B1 cả bốn kỹ năng" },
          { de: "A2 reicht", vi: "A2 là đủ" },
          { de: "B1 nur im Sprechen", vi: "B1 chỉ phần nói" },
          { de: "C1", vi: "C1" }
        ],
        correct: 0
      },
      {
        question_de: "Wann wird Rate 3 (99 Mio.) fällig?",
        question_vi: "Khi nào đóng đợt 3 (99 triệu)?",
        section: "ablauf",
        options: [
          { de: "Wenn das Visum erteilt ist – danach wird der Flug gebucht", vi: "Khi visa được cấp – sau đó đặt vé máy bay" },
          { de: "Wenn der Vertrag unterschrieben ist", vi: "Khi ký hợp đồng" },
          { de: "Beim Termin bei der Botschaft", vi: "Khi đến hẹn Đại sứ quán" },
          { de: "Am ersten Tag der Ausbildung", vi: "Vào ngày đầu học nghề" }
        ],
        correct: 0
      },
      {
        question_de: "Wie lange gilt ein B1-Zertifikat für den Visumantrag?",
        question_vi: "Chứng chỉ B1 có giá trị bao lâu khi nộp visa?",
        section: "fristen-die-alles-entscheiden",
        options: [
          { de: "6 Monate", vi: "6 tháng" },
          { de: "24 Monate", vi: "24 tháng" },
          { de: "Unbegrenzt", vi: "Vô thời hạn" },
          { de: "12 Monate", vi: "12 tháng" }
        ],
        correct: 3
      },
      {
        question_de: "Eine Kundin fragt: „Bekomme ich sicher das Visum?“ Was sagst du?",
        question_vi: "Khách hỏi: „Tôi chắc chắn có visa chứ?“ Bạn nói gì?",
        section: "fristen-die-alles-entscheiden",
        options: [
          { de: "Ich verspreche kein Visum – die Botschaft entscheidet, nicht wir", vi: "Không hứa visa – Đại sứ quán quyết định, không phải trung tâm" },
          { de: "Ja, mit unserer Vermittlung zu 100 %", vi: "Có, qua trung tâm thì chắc chắn 100 %" },
          { de: "Ja, wenn du die Rate 3 sofort bezahlst", vi: "Có, nếu đóng đợt 3 ngay" },
          { de: "Ja, wenn du auf deine Wunschstadt wartest", vi: "Có, nếu chờ được thành phố mình muốn" }
        ],
        correct: 0
      }
    ]
  }
};

export default page;
