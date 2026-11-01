import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "keine-kunden",
  title_de: "Nachrichten, die keine Kundenanfragen sind",
  title_vi: "Tin nhắn không phải từ khách hàng",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Etwa jede sechste Unterhaltung ist keine Kursanfrage. Erkenne sie schnell, damit echte Kunden nicht warten.",
      vi: "Khoảng 1/6 số cuộc trò chuyện không phải hỏi khóa học. Hãy nhận ra nhanh để khách thật không phải chờ."
    },
    {
      type: "steps",
      items: [
        { de: "Agenturen und Partner", vi: "Công ty và đối tác", body_de: "Andere Agenturen wollen „mit der Leitung sprechen“. Freundlich danken, Telefonnummer (Zalo/WhatsApp) und Thema der Zusammenarbeit erfragen, an das Management geben. Keine Preise und keine Zusagen.", body_vi: "Công ty khác muốn „trao đổi với lãnh đạo“. Cảm ơn lịch sự, xin số điện thoại (Zalo/WhatsApp) và lĩnh vực muốn hợp tác, rồi chuyển cho ban điều hành. Không báo giá, không hứa hẹn." },
        { de: "Jobsuche", vi: "Tìm việc", body_de: "Wer bei uns arbeiten möchte (z. B. mit B2): auf offene Stellen wie Lehrassistenz hinweisen und den Bewerbungsweg nennen.", body_vi: "Người muốn làm việc ở trung tâm (ví dụ có B2): giới thiệu vị trí đang tuyển như trợ giảng và cách ứng tuyển." },
        { de: "Werbung und Spam", vi: "Quảng cáo và spam", body_de: "Bank- oder Verkaufsangebote nicht beantworten, als Spam markieren.", body_vi: "Không trả lời tin quảng cáo của ngân hàng hay bán hàng, đánh dấu spam." },
        { de: "Nur Emojis, Sticker, Herzen", vi: "Chỉ có emoji, sticker, thả tim", body_de: "Einmal freundlich antworten („Trung tâm có thể hỗ trợ gì cho bạn ạ?“). Kommt nichts, nicht nachfassen.", body_vi: "Trả lời thân thiện một lần („Trung tâm có thể hỗ trợ gì cho bạn ạ?“). Không thấy trả lời thì không nhắn lại." },
        { de: "Unverständlicher Text", vi: "Tin nhắn không rõ nghĩa", body_de: "Oft versehentlich getippt. Einmal nachfragen, ob wir helfen können.", body_vi: "Thường là bấm nhầm. Hỏi lại một lần xem trung tâm có thể giúp gì." },
        { de: "Nachrichtenanfragen anderer Seiten", vi: "Tin nhắn chờ từ trang khác", body_de: "Nicht annehmen, wenn es keinen Bezug zu uns gibt.", body_vi: "Không chấp nhận nếu không liên quan đến trung tâm." }
      ]
    },
    {
      type: "callout",
      tone: "info",
      de: "Im Zweifel ist es ein Kunde. Eine kurze freundliche Antwort kostet nichts.",
      vi: "Nếu không chắc thì coi đó là khách hàng. Một câu trả lời ngắn và thân thiện không tốn gì cả."
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Eine andere Agentur möchte „mit der Leitung sprechen“. Was machst du?",
        question_vi: "Một công ty khác muốn „nói chuyện với quản lý“. Bạn làm gì?",
        options: [
          { de: "Gleich unsere Preise schicken", vi: "Gửi bảng giá ngay" },
          { de: "Eine Zusammenarbeit zusagen", vi: "Đồng ý hợp tác luôn" },
          { de: "Ignorieren", vi: "Bỏ qua" },
          { de: "Danken, Telefonnummer und Thema erfragen, an das Management geben – keine Preise, keine Zusagen", vi: "Cảm ơn, hỏi số điện thoại và nội dung hợp tác, chuyển quản lý – không báo giá, không hứa gì" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand schickt nur ein Herz. Was tust du?",
        question_vi: "Có người chỉ gửi một trái tim. Bạn làm gì?",
        options: [
          { de: "Nicht antworten", vi: "Không trả lời" },
          { de: "Jeden Tag nachfragen", vi: "Hỏi lại mỗi ngày" },
          { de: "Als Spam markieren", vi: "Đánh dấu là spam" },
          { de: "Einmal freundlich fragen, wie wir helfen können – kommt nichts, nicht nachfassen", vi: "Hỏi thân thiện một lần có thể hỗ trợ gì – nếu không trả lời thì thôi" }
        ],
        correct: 3
      },
      {
        question_de: "Du bist unsicher, ob es ein Kunde ist. Wie behandelst du die Nachricht?",
        question_vi: "Bạn không chắc đó có phải khách không. Bạn xử lý thế nào?",
        options: [
          { de: "Als Spam", vi: "Như tin rác" },
          { de: "Wie einen Kunden – eine kurze freundliche Antwort kostet nichts", vi: "Như khách hàng – một câu trả lời ngắn, thân thiện chẳng tốn gì" },
          { de: "Ich warte, bis die Person noch einmal schreibt", vi: "Chờ khách nhắn thêm" },
          { de: "Ich leite sie an die Leitung", vi: "Chuyển cho quản lý" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
