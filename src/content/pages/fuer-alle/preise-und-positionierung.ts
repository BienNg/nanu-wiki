import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "preise-und-positionierung",
  title_de: "Preise & Positionierung",
  title_vi: "Học phí & định vị",
  kind: "decision",
  section: "general",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "callout",
      tone: "info",
      de: "Radikale Preistransparenz: keine versteckten Gebühren, gleicher Preis für alle.",
      vi: "Minh bạch học phí tuyệt đối: không phí ẩn, một mức giá cho tất cả."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Am 14.10.2026 hat das Team im Slack diese Listen- und Endpreise bestätigt (online = vor Ort). In Messenger wurden für A1, A2 und B1 aber auch höhere Listenpreise genannt (16.799.000 / 17.499.000 / 17.999.000). Welcher Listenpreis gilt? Die Endpreise sind in beiden Fällen gleich.",
      vi: "Cần làm rõ: Ngày 14/10/2026 team đã xác nhận trên Slack các mức giá gốc và giá sau ưu đãi này (online = offline). Nhưng trên Messenger với A1, A2 và B1 cũng từng báo giá gốc cao hơn (16.799.000 / 17.499.000 / 17.999.000). Giá gốc nào áp dụng? Giá sau ưu đãi thì như nhau."
    },
    { type: "heading", de: "Sprachkurse (Gruppe, online = vor Ort)", vi: "Khóa học tiếng (lớp nhóm, online = offline)" },
    {
      type: "list",
      items: [
        { de: "A1 (A1.1 + A1.2): 13.800.000 VND – Frühbucher (≥ 1 Woche vorher): 11.800.000", vi: "A1 (A1.1 + A1.2): 13.800.000 VND – đăng ký sớm (trước ≥ 1 tuần): 11.800.000" },
        { de: "A2: 14.500.000 VND – Frühbucher (−15 %): 12.300.000", vi: "A2: 14.500.000 VND – đăng ký sớm (giảm 15%): 12.300.000" },
        { de: "B1: 15.000.000 VND – Frühbucher (≥ 2 Wochen vorher, −15 %): 12.800.000", vi: "B1: 15.000.000 VND – đăng ký sớm (trước ≥ 2 tuần, giảm 15%): 12.800.000" },
        { de: "B2 (B2.1 + B2.2): 17.300.000 VND – Frühbucher (−20 %): 13.800.000", vi: "B2 (B2.1 + B2.2): 17.300.000 VND – đăng ký sớm (giảm 20%): 13.800.000" },
        { de: "Kombi A1 + A2: 23.600.000 statt 28.300.000 VND", vi: "Combo A1 + A2: 23.600.000 thay vì 28.300.000 VND" },
        { de: "Kombi A2 – B1: 24.500.000 VND", vi: "Combo A2 – B1: 24.500.000 VND" },
        { de: "Kombi A1 – B1: 36.000.000 statt 43.300.000 VND (im Oktober 2026 zusätzlich −1.000.000)", vi: "Combo A1 – B1: 36.000.000 thay vì 43.300.000 VND (tháng 10/2026 giảm thêm 1.000.000)" },
        { de: "Wiederholungskurs A1–A2 mit der Assistenz: 2.999.000 VND (10 Termine)", vi: "Lớp trợ giảng ôn A1–A2: 2.999.000 VND (10 buổi)" }
      ]
    },
    { type: "heading", de: "Feste Rabatte", vi: "Ưu đãi cố định" },
    {
      type: "list",
      items: [
        { de: "Ehemalige Schüler: −500.000 VND (von dir aus nennen)", vi: "Học viên cũ: giảm 500.000 VND (chủ động báo)" },
        { de: "Zweite Person derselben Familie: −500.000 VND", vi: "Người thứ hai cùng gia đình: giảm 500.000 VND" },
        { de: "Saisonaktionen (z. B. Tết: −1.000.000, nur in der Tết-Woche, nur vor Ort) gelten nur im Aktionszeitraum.", vi: "Ưu đãi theo dịp (ví dụ Tết: giảm 1.000.000, chỉ trong tuần Tết, chỉ lớp offline) chỉ áp dụng trong thời gian khuyến mãi." }
      ]
    },
    { type: "heading", de: "Immer enthalten", vi: "Luôn bao gồm" },
    {
      type: "list",
      items: [
        { de: "App NaNu Go (sonst 49 €), Google Classroom, PDF-Lehrbuch und Übungen", vi: "App NaNu Go (giá ngoài 49 €), Google Classroom, giáo trình PDF và bài tập" },
        { de: "Aktion Oktober 2026: Stofftasche (Vietnam) und gedrucktes Handbuch für A1 nach Hause", vi: "Ưu đãi tháng 10/2026: túi tote (ở Việt Nam) và sách Handbuch in gửi tận nhà cho khóa A1" }
      ]
    },
    { type: "heading", de: "Ausbildungsvermittlung", vi: "Du học nghề" },
    {
      type: "list",
      items: [
        { de: "Mit B1/B2: 199.000.000 VND in 3 Raten (50 / 50 / 99 Mio.) – inkl. Visum, Vertrag, Versicherung, Flug, Interviewtraining", vi: "Đã có B1/B2: 199.000.000 VND chia 3 đợt (50 / 50 / 99 triệu) – gồm visa, hợp đồng, bảo hiểm, vé máy bay, luyện phỏng vấn" },
        { de: "Paket mit Sprachkurs A1–B1 vor Ort: 220.000.000 VND", vi: "Trọn gói kèm học tiếng A1–B1 offline: 220.000.000 VND" }
      ]
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Was bedeutet „radikale Preistransparenz“?",
        question_vi: "„Minh bạch giá tuyệt đối“ nghĩa là gì?",
        options: [
          { de: "Jeder Kunde bekommt einen eigenen Preis", vi: "Mỗi khách có một giá riêng" },
          { de: "Preise stehen nur in Verträgen", vi: "Giá chỉ ghi trong hợp đồng" },
          { de: "Keine versteckten Gebühren, gleicher Preis für alle", vi: "Không phí ẩn, cùng một giá cho mọi người" },
          { de: "Online-Kurse sind immer billiger als Kurse vor Ort", vi: "Khóa online luôn rẻ hơn khóa trực tiếp" }
        ],
        correct: 2
      },
      {
        question_de: "Wie viel kostet der A1-Kurs (A1.1 + A1.2) mit Frühbucherpreis?",
        question_vi: "Khóa A1 (A1.1 + A1.2) giá đăng ký sớm là bao nhiêu?",
        section: "sprachkurse-gruppe-online-vor-ort",
        options: [
          { de: "11.800.000 VND", vi: "11.800.000 VND" },
          { de: "13.800.000 VND", vi: "13.800.000 VND" },
          { de: "12.300.000 VND", vi: "12.300.000 VND" },
          { de: "9.900.000 VND", vi: "9.900.000 VND" }
        ],
        correct: 0
      },
      {
        question_de: "Kostet ein Online-Kurs etwas anderes als derselbe Kurs vor Ort?",
        question_vi: "Khóa online có giá khác với cùng khóa học trực tiếp không?",
        section: "sprachkurse-gruppe-online-vor-ort",
        options: [
          { de: "Ja, online ist 20 % billiger", vi: "Có, online rẻ hơn 20 %" },
          { de: "Nein, online und vor Ort kosten gleich viel", vi: "Không, online và trực tiếp cùng giá" },
          { de: "Ja, vor Ort ist billiger", vi: "Có, trực tiếp rẻ hơn" },
          { de: "Das hängt von der Lehrkraft ab", vi: "Tùy giáo viên" }
        ],
        correct: 1
      },
      {
        question_de: "Ein ehemaliger Schüler meldet sich wieder an. Was gilt?",
        question_vi: "Một học viên cũ đăng ký lại. Áp dụng gì?",
        section: "feste-rabatte",
        options: [
          { de: "−500.000 VND, und du nennst den Rabatt von dir aus", vi: "Giảm 500.000 VND, và bạn chủ động nói ra" },
          { de: "−500.000 VND, aber nur, wenn er danach fragt", vi: "Giảm 500.000 VND, nhưng chỉ khi khách hỏi" },
          { de: "−1.000.000 VND das ganze Jahr", vi: "Giảm 1.000.000 VND cả năm" },
          { de: "Kein Rabatt", vi: "Không giảm" }
        ],
        correct: 0
      },
      {
        question_de: "Wann gilt ein Saisonrabatt wie der Tết-Rabatt?",
        question_vi: "Ưu đãi theo mùa như ưu đãi Tết áp dụng khi nào?",
        section: "feste-rabatte",
        options: [
          { de: "Nur im Aktionszeitraum", vi: "Chỉ trong thời gian khuyến mãi" },
          { de: "Das ganze Jahr, wenn der Kunde danach fragt", vi: "Cả năm nếu khách hỏi" },
          { de: "Immer zusätzlich zu jedem anderen Rabatt", vi: "Luôn cộng thêm với mọi ưu đãi khác" },
          { de: "Nur für Online-Kurse", vi: "Chỉ cho khóa online" }
        ],
        correct: 0
      },
      {
        question_de: "Was ist bei jedem Sprachkurs immer dabei?",
        question_vi: "Mỗi khóa tiếng luôn bao gồm gì?",
        section: "immer-enthalten",
        options: [
          { de: "Ein gedrucktes Buch für jede Stufe", vi: "Sách in cho mọi trình độ" },
          { de: "Die App NaNu Go, Google Classroom, das PDF-Lehrbuch und Übungen", vi: "App NaNu Go, Google Classroom, giáo trình PDF và bài tập" },
          { de: "Die Prüfungsgebühr für Goethe", vi: "Lệ phí thi Goethe" },
          { de: "Ein Flugticket nach Deutschland", vi: "Vé máy bay sang Đức" }
        ],
        correct: 1
      },
      {
        question_de: "Was kostet die Ausbildungsvermittlung für jemanden, der schon B1/B2 hat?",
        question_vi: "Dịch vụ du học nghề cho người đã có B1/B2 giá bao nhiêu?",
        section: "ausbildungsvermittlung",
        options: [
          { de: "220.000.000 VND auf einmal, ohne Flug", vi: "220.000.000 VND trả một lần, không gồm vé máy bay" },
          { de: "199.000.000 VND auf einmal, nur der Vertrag", vi: "199.000.000 VND trả một lần, chỉ gồm hợp đồng" },
          { de: "199.000.000 VND in 3 Raten, mit Visum, Vertrag, Versicherung, Flug und Interviewtraining", vi: "199.000.000 VND chia 3 đợt, gồm visa, hợp đồng, bảo hiểm, vé máy bay và luyện phỏng vấn" },
          { de: "Kostenlos, die Firma in Deutschland zahlt", vi: "Miễn phí, công ty ở Đức trả" }
        ],
        correct: 2
      }
    ]
  }
};

export default page;
