import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "interview",
  title_de: "Die Rolle in Kürze",
  title_vi: "Tóm tắt vai trò",
  kind: "reference",
  section: "interview",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Du beantwortest Anfragen von jungen Menschen, die in Deutschland studieren oder eine Ausbildung machen möchten – schnell, freundlich und ehrlich.",
      vi: "Bạn trả lời câu hỏi của các bạn trẻ muốn du học hoặc học nghề tại Đức – nhanh, thân thiện và trung thực."
    },
    {
      type: "video",
      url: "",
      caption_de: "Ein Tag im Sales-Team (YouTube-Link einfügen)",
      caption_vi: "Một ngày của đội Sales (thêm link YouTube)"
    },
    {
      type: "heading",
      de: "Aufgaben",
      vi: "Nhiệm vụ"
    },
    {
      type: "list",
      items: [
        {
          de: "Anfragen über Messenger, Zalo und Telefon beantworten",
          vi: "Trả lời yêu cầu qua Messenger, Zalo và điện thoại"
        },
        {
          de: "Zu Kurs, Niveau und Weg nach Deutschland beraten",
          vi: "Tư vấn khóa học, trình độ và con đường sang Đức"
        },
        {
          de: "Probestunden, Anmeldung und Übergabe an Student Support",
          vi: "Học thử, đăng ký và bàn giao cho Hỗ trợ học viên"
        }
      ]
    },
    {
      type: "heading",
      de: "So sieht „großartig“ aus",
      vi: "Thế nào là „xuất sắc“"
    },
    {
      type: "list",
      items: [
        {
          de: "Antwortet ehrlich – auch wenn die Antwort „Nein“ ist",
          vi: "Trả lời trung thực – kể cả khi câu trả lời là „không“"
        },
        {
          de: "Nennt Preise offen und erklärt, was enthalten ist",
          vi: "Nói rõ học phí và những gì đã bao gồm"
        },
        {
          de: "Jedes Gespräch endet mit einem klaren nächsten Schritt",
          vi: "Mỗi cuộc trò chuyện kết thúc bằng bước tiếp theo rõ ràng"
        }
      ]
    },
    {
      type: "heading",
      de: "Anforderungen",
      vi: "Yêu cầu"
    },
    {
      type: "list",
      items: [
        {
          de: "Vietnamesisch (Muttersprache)",
          vi: "Tiếng Việt bản ngữ"
        },
        {
          de: "Deutsch: [NIVEAU]",
          vi: "Tiếng Đức: [TRÌNH ĐỘ]"
        },
        {
          de: "Klare schriftliche Kommunikation, Empathie",
          vi: "Viết rõ ràng, đồng cảm"
        }
      ]
    },
    {
      type: "heading",
      de: "Interviewfragen",
      vi: "Câu hỏi phỏng vấn"
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          de: "Erzähl von einem Gespräch, in dem jemand unsicher war. Was hast du getan?",
          vi: "Kể về một lần khách hàng còn phân vân. Bạn đã làm gì?"
        },
        {
          de: "„Bei einer anderen Schule ist es günstiger.“ Wie antwortest du?",
          vi: "„Trung tâm khác rẻ hơn.“ Bạn trả lời thế nào?"
        },
        {
          de: "Wie organisierst du 40 offene Chats an einem Montagmorgen?",
          vi: "Bạn sắp xếp 40 tin nhắn chưa trả lời vào sáng thứ Hai thế nào?"
        }
      ]
    },
    {
      type: "heading",
      de: "Testaufgabe · 45 Min.",
      vi: "Bài test · 45 phút"
    },
    {
      type: "callout",
      tone: "tip",
      de: "Beantworte drei anonymisierte Messenger-Anfragen in einem Google Doc. Wir achten auf Ton, Richtigkeit und den nächsten Schritt.",
      vi: "Trả lời ba tin nhắn Messenger ẩn danh trong Google Doc. Chúng tôi đánh giá giọng điệu, độ chính xác và bước tiếp theo."
    },
    {
      type: "heading",
      de: "Messenger-Simulation",
      vi: "Mô phỏng Messenger"
    },
    {
      type: "chat",
      id: "sales-test",
      customer: "Linh",
      intro_de: "Linh schreibt der NaNu-NaNa-Seite auf Messenger. Antworte so, wie du es im Job tun würdest – auf Vietnamesisch. Die Zeit läuft ab jeder neuen Nachricht.",
      intro_vi: "Linh nhắn tin cho trang NaNu NaNa trên Messenger. Hãy trả lời như khi bạn đang làm việc – bằng tiếng Việt. Thời gian được tính từ mỗi tin nhắn mới.",
      messages: [
        {
          text: "Chào ad\n\nCho mình hỏi học phí khoá A1 bao nhiêu vậy ạ?",
          translation_de: "„Hallo Admin! Darf ich fragen, wie viel der A1-Kurs kostet?“"
        },
        {
          text: "Mình đang học lớp 12, muốn sang Đức học nghề điều dưỡng. Giờ mới bắt đầu học tiếng Đức thì có kịp không ạ?",
          translation_de: "„Ich bin in der 12. Klasse und möchte in Deutschland eine Pflege-Ausbildung machen. Schaffe ich das, wenn ich jetzt erst mit Deutsch anfange?“"
        },
        {
          text: "Trung tâm kia rẻ hơn bên mình 2 triệu lận\n\nBên mình có giảm giá gì không ad?",
          translation_de: "„Bei der anderen Schule ist es ganze 2 Millionen günstiger. Gibt es bei euch irgendeinen Rabatt?“"
        }
      ]
    }
  ]
};

export default page;
