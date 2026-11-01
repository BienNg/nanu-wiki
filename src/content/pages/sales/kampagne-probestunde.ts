import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "kampagne-probestunde",
  title_de: "Kampagne „Kostenlose Probestunde“",
  title_vi: "Chiến dịch „Học thử miễn phí“",
  kind: "living",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Laufende Facebook-Anzeige. Wer über die Anzeige im Messenger schreibt, bekommt zuerst das Antwort-Skript unten.",
      vi: "Quảng cáo Facebook đang chạy. Ai nhắn qua quảng cáo trên Messenger sẽ nhận kịch bản trả lời bên dưới."
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Jemand schreibt über die Facebook-Anzeige „Kostenlose Probestunde“. Was bekommt die Person zuerst?",
        question_vi: "Có người nhắn qua quảng cáo „Học thử miễn phí“. Khách nhận được gì trước tiên?",
        options: [
          { de: "Sofort die Kontonummer", vi: "Số tài khoản ngay" },
          { de: "Gar keine Antwort", vi: "Không trả lời" },
          { de: "Den Link zur Website", vi: "Link website" },
          { de: "Das Antwort-Skript der Kampagne", vi: "Kịch bản trả lời của chiến dịch" }
        ],
        correct: 3
      }
    ]
  }
};

export default page;
