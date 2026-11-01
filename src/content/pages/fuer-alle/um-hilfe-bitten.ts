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
  ]
};

export default page;
