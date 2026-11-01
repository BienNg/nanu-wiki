import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "aktion-oktober-2026",
  title_de: "Aktion Oktober 2026",
  title_vi: "Ưu đãi tháng 10/2026",
  kind: "living",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "callout",
      tone: "info",
      de: "Gilt nur für Anmeldungen im Oktober 2026. Ab November nicht mehr anbieten – und ehrlich sagen, dass die Aktion vorbei ist.",
      vi: "Chỉ áp dụng cho đăng ký trong tháng 10/2026. Từ tháng 11 không báo nữa – và nói thật nếu khách hỏi là ưu đãi đã hết."
    },
    { type: "heading", de: "Die sechs Vorteile", vi: "Sáu ưu đãi" },
    {
      type: "list",
      ordered: true,
      items: [
        { de: "−2.000.000 VND sofort – wer schon bei NaNu gelernt hat: −2.500.000 VND.", vi: "Giảm ngay 2.000.000 VNĐ – học viên đã học ở NaNu giảm 2.500.000." },
        { de: "Stofftasche NaNu NaNa für Schüler in Vietnam.", vi: "Tặng túi tote NaNu NaNa cho các bạn ở Việt Nam." },
        { de: "Gedrucktes Handbuch nach Hause geschickt.", vi: "Tặng sách Handbuch gửi về tận nhà." },
        { de: "App NaNu Go: Wortschatz, Hören, Schreiben, interaktive Übungen, Wiederholung und Vorbereitung der Stunden.", vi: "Tặng quyền sử dụng app NaNu Go: học và ôn từ vựng, luyện nghe, luyện viết, bài tập tương tác, ôn bài cũ và chuẩn bị bài mới." },
        { de: "Google Classroom: Hausaufgaben nach jeder Stunde, abgeben und Feedback der Lehrkraft bekommen.", vi: "Tặng quyền truy cập Google Classroom: nhận bài tập sau mỗi buổi, nộp bài và nhận nhận xét từ giáo viên." },
        { de: "Komplettes PDF-Material: Lehrbuch je Stufe, Grammatik und Wortschatz, Zusatzübungen, Material für alle vier Fertigkeiten.", vi: "Tặng trọn bộ tài liệu PDF: giáo trình theo trình độ, tài liệu ngữ pháp và từ vựng, bài tập thêm, tài liệu bổ trợ 4 kỹ năng." }
      ]
    },
    { type: "heading", de: "Dazu", vi: "Thêm" },
    {
      type: "list",
      items: [
        { de: "Kombi A1–B1: bei Anmeldung im Oktober zusätzlich −1.000.000 VND.", vi: "Combo A1–B1: đăng ký trong tháng 10 giảm thêm 1.000.000 VND." },
        { de: "Wer gerade lernt und sich im Oktober schon für die nächste Stufe anmeldet (z. B. A2 ab 28.11.), bekommt die Geschenke auch. Customer Success schreibt das allen laufenden Klassen.", vi: "Học viên đang học mà đăng ký trước khoá sau trong tháng 10 (ví dụ A2 bắt đầu 28/11) cũng nhận quà. Đội Chăm sóc học viên nhắn cho tất cả các lớp đang học." },
        { de: "Für A1 gibt es zusätzlich das Buch „A1 Kompass“: Grammatik mit Übungen und Satzbau-Training, Wortschatz nach Themen und Wortarten, Alltagssituationen (Restaurant, Bahnhof, Ausländerbehörde, Nagelstudio, Schule).", vi: "Với A1 còn có cuốn sách tổng hợp kiến thức „A1 Kompass“: tổng hợp ngữ pháp kèm bài tập và bài tập tư duy đặt câu, từ vựng theo chủ đề và loại từ, các tình huống đời sống (nhà hàng, nhà ga, sở ngoại kiều, tiệm nail, trường học)." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Die −2.000.000 VND ergeben genau den bisherigen „Frühbucherpreis“ (A1 13,8 → 11,8 Mio.). Ist die Aktion dasselbe wie der Frühbucherrabatt – also gilt sie auch ohne Anmeldung eine Woche vorher? Und gilt der Rabatt für Ehemalige (−500.000) zusätzlich zu den −2.500.000 oder ist er schon darin?",
      vi: "Cần làm rõ: giảm 2.000.000 VND ra đúng bằng „giá đăng ký sớm“ trước đây (A1 13,8 → 11,8 triệu). Ưu đãi tháng 10 có phải chính là ưu đãi đăng ký sớm không – tức là có áp dụng khi không đăng ký trước 1 tuần? Và giảm 500.000 cho học viên cũ được cộng thêm vào 2.500.000 hay đã nằm trong đó?"
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Jemand fragt im November nach der Oktober-Aktion. Was sagst du?",
        question_vi: "Tháng 11 có người hỏi về ưu đãi tháng 10. Bạn nói gì?",
        options: [
          { de: "Dass sie noch bis Jahresende gilt", vi: "Nói vẫn áp dụng đến cuối năm" },
          { de: "Ehrlich, dass die Aktion vorbei ist – sie galt nur für Anmeldungen im Oktober 2026", vi: "Nói thật là ưu đãi đã kết thúc – chỉ áp dụng cho đăng ký trong tháng 10/2026" },
          { de: "Ich gebe den Rabatt trotzdem", vi: "Vẫn cho giảm giá" },
          { de: "Ich antworte nicht auf die Frage", vi: "Không trả lời câu hỏi" }
        ],
        correct: 1
      },
      {
        question_de: "Wie viel Rabatt gab es sofort für Neukunden in der Aktion?",
        question_vi: "Khách mới được giảm ngay bao nhiêu trong chương trình?",
        section: "die-sechs-vorteile",
        options: [
          { de: "−500.000 VND", vi: "−500.000 VND" },
          { de: "−2.000.000 VND", vi: "−2.000.000 VND" },
          { de: "−2.500.000 VND", vi: "−2.500.000 VND" },
          { de: "−15 %", vi: "−15 %" }
        ],
        correct: 1
      },
      {
        question_de: "Wer bekommt die Stofftasche NaNu NaNa?",
        question_vi: "Ai được nhận túi vải NaNu NaNa?",
        section: "die-sechs-vorteile",
        options: [
          { de: "Schüler in Vietnam", vi: "Học viên ở Việt Nam" },
          { de: "Alle Schüler, auch in Deutschland", vi: "Tất cả học viên, kể cả ở Đức" },
          { de: "Nur Schüler der Kombi A1–B1", vi: "Chỉ học viên combo A1–B1" },
          { de: "Nur Lehrkräfte", vi: "Chỉ giáo viên" }
        ],
        correct: 0
      },
      {
        question_de: "Ein Schüler lernt gerade A1 und meldet sich im Oktober schon für A2 an. Bekommt er die Geschenke?",
        question_vi: "Học viên đang học A1 và trong tháng 10 đăng ký luôn A2. Có được quà không?",
        section: "dazu",
        options: [
          { de: "Nein, nur Neukunden", vi: "Không, chỉ khách mới" },
          { de: "Ja, auch er bekommt die Geschenke", vi: "Có, cũng được nhận quà" },
          { de: "Nur, wenn er die Kombi A1–B1 bucht", vi: "Chỉ khi đăng ký combo A1–B1" },
          { de: "Nur die Stofftasche", vi: "Chỉ túi vải" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
