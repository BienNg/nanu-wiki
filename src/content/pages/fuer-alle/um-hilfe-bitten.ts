import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "um-hilfe-bitten",
  title_de: "Um Hilfe bitten: die 1:3:1-Regel",
  title_vi: "Nhờ giúp đỡ: quy tắc 1:3:1",
  kind: "process",
  section: "general",
  verified_until: null,
  updated_at: "2026-11-01",
  body: [
    {
      type: "paragraph",
      de: "Du hast ein Problem oder weißt nicht weiter? Dann frag jederzeit jemanden um Hilfe. Halte dich dabei an die 1:3:1-Regel.",
      vi: "Bạn gặp vấn đề hoặc không biết phải làm gì? Hãy nhờ người khác giúp bất cứ lúc nào. Khi hỏi, hãy làm theo quy tắc 1:3:1."
    },
    {
      type: "heading",
      de: "So fragst du",
      vi: "Cách hỏi"
    },
    {
      type: "steps",
      items: [
        {
          de: "1 Problem nennen",
          vi: "Nêu 1 vấn đề",
          body_de: "Beschreibe das eine Problem, auf das du gestoßen bist.",
          body_vi: "Mô tả một vấn đề bạn đang gặp."
        },
        {
          de: "3 mögliche Lösungen nennen",
          vi: "Đưa ra 3 cách giải quyết",
          body_de: "Überlege dir drei Wege, wie man das Problem lösen könnte.",
          body_vi: "Nghĩ ra ba cách có thể giải quyết vấn đề đó."
        },
        {
          de: "1 Empfehlung geben",
          vi: "Đưa ra 1 đề xuất",
          body_de: "Sag, welche der drei Lösungen du am besten findest.",
          body_vi: "Nói rõ trong ba cách đó, bạn thấy cách nào tốt nhất."
        }
      ]
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Wofür stehen die Zahlen in der 1:3:1-Regel?",
        question_vi: "Các con số trong quy tắc 1:3:1 nghĩa là gì?",
        section: "so-fragst-du",
        options: [
          { de: "1 Frage, 3 Kollegen fragen, 1 Tag warten", vi: "1 câu hỏi, hỏi 3 đồng nghiệp, chờ 1 ngày" },
          { de: "1 Problem, 3 Minuten nachdenken, 1 Nachricht schreiben", vi: "1 vấn đề, suy nghĩ 3 phút, viết 1 tin nhắn" },
          { de: "1 Problem, 3 mögliche Lösungen, 1 Empfehlung", vi: "1 vấn đề, 3 giải pháp, 1 đề xuất" },
          { de: "1 Chef, 3 Kollegen, 1 Kunde", vi: "1 sếp, 3 đồng nghiệp, 1 khách" }
        ],
        correct: 2
      },
      {
        question_de: "Was gibst du am Ende deiner Frage um Hilfe?",
        question_vi: "Khi nhờ giúp đỡ, cuối cùng bạn đưa ra điều gì?",
        section: "so-fragst-du",
        options: [
          { de: "Eine Empfehlung: welche der drei Lösungen du am besten findest", vi: "Một đề xuất: giải pháp nào trong ba cái bạn thấy tốt nhất" },
          { de: "Nichts, die andere Person entscheidet", vi: "Không gì cả, người kia tự quyết" },
          { de: "Eine Liste mit allen Problemen dieser Woche", vi: "Danh sách mọi vấn đề trong tuần" },
          { de: "Eine Frist, bis wann die Antwort kommen muss", vi: "Hạn chót phải trả lời" }
        ],
        correct: 0
      }
    ]
  }
};

export default page;
