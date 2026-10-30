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
        { de: "Ehemalige Teilnehmende: −500.000 VND (von dir aus nennen)", vi: "Học viên cũ: giảm 500.000 VND (chủ động báo)" },
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
  ]
};

export default page;
