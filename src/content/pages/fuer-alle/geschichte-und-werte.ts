import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "geschichte-und-werte",
  title_de: "Unsere Geschichte & Werte",
  title_vi: "Câu chuyện & giá trị của chúng ta",
  kind: "decision",
  section: "general",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Qualität und Freundlichkeit – darauf bauen wir NaNu NaNa.",
      vi: "Chất lượng và sự tử tế – nền tảng của NaNu NaNa."
    },
    {
      type: "heading",
      de: "Was uns wichtig ist",
      vi: "Điều chúng ta coi trọng"
    },
    {
      type: "list",
      items: [
        {
          de: "Ehrlich beraten – auch wenn die Antwort „Nein“ ist",
          vi: "Tư vấn trung thực – kể cả khi câu trả lời là „không“"
        },
        {
          de: "Radikale Preistransparenz",
          vi: "Minh bạch học phí tuyệt đối"
        },
        {
          de: "Begleitung bis zur Ankunft in Deutschland",
          vi: "Đồng hành đến khi đặt chân tới Đức"
        }
      ]
    },
    {
      type: "video",
      url: "",
      caption_de: "Willkommensvideo der Gründer (YouTube-Link einfügen)",
      caption_vi: "Video chào mừng từ nhà sáng lập (thêm link YouTube)"
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Worauf bauen wir NaNu NaNa?",
        question_vi: "NaNu NaNa được xây dựng dựa trên điều gì?",
        options: [
          { de: "Qualität und Freundlichkeit", vi: "Chất lượng và sự thân thiện" },
          { de: "Niedrige Preise und schnelle Abschlüsse", vi: "Giá rẻ và chốt đơn nhanh" },
          { de: "Möglichst viele Schüler pro Klasse", vi: "Càng nhiều học viên mỗi lớp càng tốt" },
          { de: "Werbung und Bekanntheit", vi: "Quảng cáo và độ nổi tiếng" }
        ],
        correct: 0
      },
      {
        question_de: "Ein Kunde fragt etwas, und die ehrliche Antwort ist „Nein“. Was machen wir?",
        question_vi: "Khách hỏi một điều mà câu trả lời thật là „Không“. Chúng ta làm gì?",
        section: "was-uns-wichtig-ist",
        options: [
          { de: "Wir sagen „Ja“, damit er bucht", vi: "Nói „Có“ để khách đăng ký" },
          { de: "Wir antworten nicht auf die Frage", vi: "Không trả lời câu hỏi đó" },
          { de: "Wir sagen „Vielleicht“ und klären es später", vi: "Nói „Có thể“ rồi tính sau" },
          { de: "Wir sagen ehrlich „Nein“ – ehrliche Beratung ist uns wichtig", vi: "Nói thật là „Không“ – tư vấn trung thực là điều quan trọng" }
        ],
        correct: 3
      },
      {
        question_de: "Was gehört zu unseren Werten?",
        question_vi: "Điều nào thuộc giá trị của chúng ta?",
        section: "was-uns-wichtig-ist",
        options: [
          { de: "Sonderpreise für Kunden, die gut verhandeln", vi: "Giá riêng cho khách biết trả giá" },
          { de: "Begleitung nur bis zum Ende des Sprachkurses", vi: "Chỉ đồng hành đến hết khóa tiếng" },
          { de: "Radikale Preistransparenz und Begleitung bis zur Ankunft in Deutschland", vi: "Minh bạch giá tuyệt đối và đồng hành đến khi tới Đức" },
          { de: "Preise erst nach der Anmeldung nennen", vi: "Chỉ báo giá sau khi đăng ký" }
        ],
        correct: 2
      }
    ]
  }
};

export default page;
