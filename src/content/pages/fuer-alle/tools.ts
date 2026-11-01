import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "tools",
  title_de: "Tools, die wir nutzen",
  title_vi: "Công cụ chúng ta dùng",
  kind: "process",
  section: "general",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Slack, Notion, Zalo, Facebook Messenger, Google Workspace und Canva. Facebook Messenger ist unser erster Kontaktkanal, Zalo nutzen wir für alles danach.",
      vi: "Slack, Notion, Zalo, Facebook Messenger, Google Workspace và Canva. Messenger là kênh liên hệ đầu tiên, Zalo dùng cho các bước sau."
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Über welchen Kanal kommt der erste Kontakt mit Kunden?",
        question_vi: "Liên hệ đầu tiên với khách qua kênh nào?",
        options: [
          { de: "Zalo", vi: "Zalo" },
          { de: "Slack", vi: "Slack" },
          { de: "Facebook Messenger", vi: "Facebook Messenger" },
          { de: "E-Mail", vi: "Email" }
        ],
        correct: 2
      },
      {
        question_de: "Ein Kunde hat schon auf Messenger geschrieben. Welchen Kanal nutzen wir danach?",
        question_vi: "Khách đã nhắn qua Messenger. Sau đó chúng ta dùng kênh nào?",
        options: [
          { de: "Slack", vi: "Slack" },
          { de: "Notion", vi: "Notion" },
          { de: "Zalo", vi: "Zalo" },
          { de: "Canva", vi: "Canva" }
        ],
        correct: 2
      }
    ]
  }
};

export default page;
