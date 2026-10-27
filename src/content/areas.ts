import type { Area } from "@/lib/types";

/** All areas ("Kanäle") in sidebar order. `fuer-alle` is the shared area, the others are roles. */
export const AREAS: Area[] = [
  {
    slug: "fuer-alle",
    name_de: "Für alle",
    name_vi: "Cho tất cả mọi người",
    description_de: "Das Fundament für jede Rolle. Lies diese Seiten in deiner ersten Woche.",
    description_vi: "Nền tảng cho mọi vai trò. Hãy đọc các trang này trong tuần đầu tiên.",
    icon: "users",
    color: "#0B7793",
    is_shared: true
  },
  {
    slug: "sales",
    name_de: "Sales & Kundenservice",
    name_vi: "Kinh doanh & Chăm sóc khách hàng",
    description_de: "Du bist die erste Stimme von NaNu NaNa: Du beantwortest Anfragen, berätst ehrlich und begleitest bis zur Anmeldung.",
    description_vi: "Bạn là tiếng nói đầu tiên của NaNu NaNa: trả lời câu hỏi, tư vấn trung thực và đồng hành đến khi học viên đăng ký.",
    icon: "chat",
    color: "#D9542C",
    is_shared: false
  },
  {
    slug: "student-support",
    name_de: "Customer Success / Student Support",
    name_vi: "Hỗ trợ học viên",
    description_de: "APS, Visum, Studienkolleg – wir begleiten bis zur Ankunft in Deutschland.",
    description_vi: "APS, visa, dự bị đại học – đồng hành đến khi đặt chân tới Đức.",
    icon: "heart",
    color: "#13946F",
    is_shared: false
  },
  {
    slug: "visa",
    name_de: "Visum & Aufenthalt",
    name_vi: "Visa & cư trú",
    description_de: "Visum für Ausbildung und Studium, Fristen, Unterlagen und die Fragen, die Kunden dazu stellen.",
    description_vi: "Visa du học nghề và đại học, thời hạn, hồ sơ và những câu hỏi khách hay hỏi.",
    icon: "passport",
    color: "#5E8A2C",
    is_shared: false
  },
  {
    slug: "lehrkraft",
    name_de: "Lehrkraft",
    name_vi: "Giáo viên",
    description_de: "Unterricht A1–C1, Prüfungsvorbereitung und Feedback.",
    description_vi: "Giảng dạy A1–C1, luyện thi và nhận xét học viên.",
    icon: "cap",
    color: "#4C5FD5",
    is_shared: false
  },
  {
    slug: "lehrmaterialien",
    name_de: "Lehrmaterialien",
    name_vi: "Tài liệu giảng dạy",
    description_de: "Arbeitsblätter, Vokabellisten und Videolektionen.",
    description_vi: "Bài tập, danh sách từ vựng và video bài giảng.",
    icon: "book",
    color: "#C68A10",
    is_shared: false
  },
  {
    slug: "redaktion",
    name_de: "Redaktion: Content & Social Media",
    name_vi: "Biên tập: Nội dung & mạng xã hội",
    description_de: "Facebook, TikTok, Erklärvideos und Redaktionsplan.",
    description_vi: "Facebook, TikTok, video giải thích và lịch nội dung.",
    icon: "pen",
    color: "#C9417F",
    is_shared: false
  },
  {
    slug: "operations",
    name_de: "Operations Manager (je Standort)",
    name_vi: "Quản lý vận hành (từng cơ sở)",
    description_de: "Räume, Stundenpläne, Kasse und Team vor Ort.",
    description_vi: "Phòng học, lịch học, thu chi và đội ngũ tại chỗ.",
    icon: "building",
    color: "#2F7DC0",
    is_shared: false
  },
  {
    slug: "management",
    name_de: "Management",
    name_vi: "Ban điều hành",
    description_de: "Strategie, Finanzen und Partner in Deutschland.",
    description_vi: "Chiến lược, tài chính và đối tác tại Đức.",
    icon: "compass",
    color: "#6E52C2",
    is_shared: false
  }
];
