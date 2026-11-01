import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "kurse-und-leistungen",
  title_de: "Kurse & Leistungen",
  title_vi: "Khóa học & dịch vụ",
  kind: "reference",
  section: "general",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "list",
      items: [
        {
          de: "A1 – 40 Einheiten",
          vi: "A1 – 40 buổi"
        },
        {
          de: "A2 – 42 Einheiten",
          vi: "A2 – 42 buổi"
        },
        {
          de: "B1 & Prüfungsvorbereitung – 44 Einheiten",
          vi: "B1 & luyện thi – 44 buổi"
        },
        {
          de: "B2 – 58 Einheiten",
          vi: "B2 – 58 buổi"
        },
        {
          de: "C1 – 58 Einheiten (TestDaF, DSH, Goethe C1)",
          vi: "C1 – 58 buổi (TestDaF, DSH, Goethe C1)"
        },
        {
          de: "Kommunikationskurs (Sprechen und Aussprache, ab A2–B1)",
          vi: "Lớp giao tiếp (luyện nói và phát âm, từ A2–B1)"
        }
      ]
    },
    {
      type: "heading",
      de: "Formate",
      vi: "Hình thức học"
    },
    {
      type: "list",
      items: [
        {
          de: "Online nach deutscher Zeit – 5–9 Schüler, 3–4 Termine/Woche à 1,5 Std., über Zoom",
          vi: "Online giờ Đức – 5–9 học viên, 3–4 buổi/tuần, mỗi buổi 1,5 tiếng, học qua Zoom"
        },
        {
          de: "Online nach vietnamesischer Zeit – 5–9 Schüler, 3–4 Termine/Woche à 1,5 Std.",
          vi: "Online giờ Việt Nam – 5–9 học viên, 3–4 buổi/tuần, mỗi buổi 1,5 tiếng"
        },
        {
          de: "Vor Ort in Hanoi und Saigon – 8–15 Schüler, 4 Termine/Woche à 2,5 Std. (Intensiv)",
          vi: "Offline tại Hà Nội và Sài Gòn – 8–15 học viên, 4 buổi/tuần, mỗi buổi 2,5 tiếng (cấp tốc)"
        },
        {
          de: "1:1 oder 1:2 – nur wenn keine Gruppe passt, z. B. telc-Vorbereitung",
          vi: "Kèm 1-1 hoặc 1-2 – chỉ khi không có lớp nhóm phù hợp, ví dụ ôn thi telc"
        }
      ]
    },
    {
      type: "paragraph",
      de: "Jede Stufe A1–B1 dauert 2,5–3 Monate. Lehrkräfte: vietnamesisch oder deutsch, alle mit Studium in Deutschland; Lehrplan von NaNu NaNa selbst geschrieben.",
      vi: "Mỗi cấp độ A1–B1 kéo dài 2,5–3 tháng. Giáo viên người Việt hoặc người Đức, đều đã học tập tại Đức; giáo trình do NaNu NaNa tự biên soạn."
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Wie viele Einheiten hat der A1-Kurs?",
        question_vi: "Khóa A1 có bao nhiêu buổi học?",
        options: [
          { de: "42", vi: "42" },
          { de: "44", vi: "44" },
          { de: "40", vi: "40" },
          { de: "58", vi: "58" }
        ],
        correct: 2
      },
      {
        question_de: "Für wen ist der Kommunikationskurs?",
        question_vi: "Khóa giao tiếp dành cho ai?",
        options: [
          { de: "Für Leute ab A2–B1, die Sprechen und Aussprache üben wollen", vi: "Cho người từ A2–B1 muốn luyện nói và phát âm" },
          { de: "Für komplette Anfänger ohne Deutsch", vi: "Cho người mới hoàn toàn chưa biết tiếng Đức" },
          { de: "Nur für die C1-Prüfung", vi: "Chỉ để thi C1" },
          { de: "Nur für Lehrkräfte", vi: "Chỉ cho giáo viên" }
        ],
        correct: 0
      },
      {
        question_de: "Wie groß sind die Klassen vor Ort in Hanoi und Saigon, und wie oft ist Unterricht?",
        question_vi: "Lớp học trực tiếp ở Hà Nội và Sài Gòn có bao nhiêu học viên và học mấy buổi?",
        section: "formate",
        options: [
          { de: "5–9 Schüler, 3–4 Termine pro Woche à 1,5 Std.", vi: "5–9 học viên, 3–4 buổi/tuần, mỗi buổi 1,5 tiếng" },
          { de: "8–15 Schüler, 4 Termine pro Woche à 2,5 Std.", vi: "8–15 học viên, 4 buổi/tuần, mỗi buổi 2,5 tiếng" },
          { de: "20–30 Schüler, 2 Termine pro Woche à 3 Std.", vi: "20–30 học viên, 2 buổi/tuần, mỗi buổi 3 tiếng" },
          { de: "1–2 Schüler, so oft sie möchten", vi: "1–2 học viên, học bao nhiêu tùy ý" }
        ],
        correct: 1
      },
      {
        question_de: "Wann bieten wir 1:1- oder 1:2-Unterricht an?",
        question_vi: "Khi nào chúng ta mở lớp 1:1 hoặc 1:2?",
        section: "formate",
        options: [
          { de: "Immer, wenn ein Kunde es möchte", vi: "Bất cứ khi nào khách muốn" },
          { de: "Nur wenn keine Gruppe passt, z. B. für die telc-Vorbereitung", vi: "Chỉ khi không có lớp nhóm phù hợp, ví dụ luyện thi telc" },
          { de: "Nie", vi: "Không bao giờ" },
          { de: "Nur für Kinder", vi: "Chỉ cho trẻ em" }
        ],
        correct: 1
      },
      {
        question_de: "Wie lange dauert eine Stufe von A1 bis B1?",
        question_vi: "Mỗi trình độ từ A1 đến B1 kéo dài bao lâu?",
        section: "formate",
        options: [
          { de: "4 Wochen", vi: "4 tuần" },
          { de: "6 Monate", vi: "6 tháng" },
          { de: "2,5–3 Monate", vi: "2,5–3 tháng" },
          { de: "1 Jahr", vi: "1 năm" }
        ],
        correct: 2
      }
    ]
  }
};

export default page;
