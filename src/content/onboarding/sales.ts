import type { OnboardingWeek } from "@/lib/types";

/** Learning path of this role. Item `id`s are stored in checklist_progress – keep them stable when editing labels. */
const weeks: OnboardingWeek[] = [
  {
    items: [
      {
        id: "sales.w1.seiten-fur-alle-lesen",
        label_de: "Seiten „Für alle“ lesen",
        label_vi: "Đọc các trang „Cho tất cả“"
      },
      {
        id: "sales.w1.zugange-slack-notion-zalo-oa-mes",
        label_de: "Zugänge: Slack, Notion, Zalo OA, Messenger",
        label_vi: "Tài khoản: Slack, Notion, Zalo OA, Messenger"
      },
      {
        id: "sales.w1.kursniveaus-a1-c1-kennenlernen",
        label_de: "Kursniveaus A1–C1 kennenlernen",
        label_vi: "Tìm hiểu các trình độ A1–C1"
      },
      {
        id: "sales.w1.3-beratungsgesprache-mithoren",
        label_de: "3 Beratungsgespräche mithören",
        label_vi: "Nghe 3 buổi tư vấn của đồng nghiệp"
      }
    ],
    week: 1,
    title_de: "Ankommen & Grundlagen",
    title_vi: "Làm quen & nền tảng"
  },
  {
    items: [
      {
        id: "sales.w2.preisliste-und-positionierung-le",
        label_de: "Preisliste und Positionierung lesen",
        label_vi: "Đọc bảng học phí và định vị"
      },
      {
        id: "sales.w2.sop-erstkontakt-uber-messenger",
        label_de: "SOP: Erstkontakt über Messenger",
        label_vi: "SOP: Trả lời tin nhắn đầu tiên qua Messenger",
        page: "sales/erstkontakt-messenger"
      },
      {
        id: "sales.w2.skript-probestunde-uben",
        label_de: "Skript Probestunde üben",
        label_vi: "Luyện kịch bản buổi học thử",
        page: "sales/probestunde-buchen"
      },
      {
        id: "sales.w2.5-antworten-mit-buddy-feedback-s",
        label_de: "5 Antworten mit Buddy-Feedback schreiben",
        label_vi: "Viết 5 câu trả lời có góp ý của người hướng dẫn"
      }
    ],
    week: 2,
    title_de: "Produkte & Preise",
    title_vi: "Sản phẩm & học phí",
    quiz: {
      id: "sales-woche-2",
      pass_percent: 75,
      questions: [
        {
          question_de: "Ein Interessent fragt auf Messenger nach dem Preis für A1. Was tust du?",
          question_vi: "Một khách hỏi học phí khóa A1 qua Messenger. Bạn làm gì?",
          options: [
            {
              de: "Preis aus der Preisliste nennen und erklären, was enthalten ist",
              vi: "Báo giá theo bảng học phí và giải thích những gì đã bao gồm"
            },
            {
              de: "Erst nach der Telefonnummer fragen, dann den Preis nennen",
              vi: "Hỏi số điện thoại trước rồi mới báo giá"
            },
            {
              de: "Einen Rabatt anbieten, wenn heute gezahlt wird",
              vi: "Đề nghị giảm giá nếu thanh toán hôm nay"
            },
            {
              de: "An das Management weiterleiten",
              vi: "Chuyển cho ban điều hành"
            }
          ],
          correct: 0,
          explanation_de: "Radikale Preistransparenz: Wir nennen Preise offen und für alle gleich.",
          explanation_vi: "Minh bạch học phí tuyệt đối: báo giá công khai và như nhau cho mọi người."
        },
        {
          question_de: "Wie viele Unterrichtseinheiten hat der A1-Kurs?",
          question_vi: "Khóa A1 có bao nhiêu buổi học?",
          options: [
            {
              de: "30",
              vi: "30"
            },
            {
              de: "40",
              vi: "40"
            },
            {
              de: "44",
              vi: "44"
            },
            {
              de: "58",
              vi: "58"
            }
          ],
          correct: 1,
          explanation_de: "A1 hat 40 Einheiten, A2 42, B1 44, B2 und C1 je 58.",
          explanation_vi: "A1 có 40 buổi, A2 42, B1 44, B2 và C1 mỗi khóa 58 buổi."
        },
        {
          question_de: "In welcher Zeit beantworten wir neue Messenger-Anfragen?",
          question_vi: "Chúng ta trả lời tin nhắn mới trong bao lâu?",
          options: [
            {
              de: "Sofort",
              vi: "Ngay lập tức"
            },
            {
              de: "Innerhalb von 2 Stunden",
              vi: "Trong vòng 2 giờ"
            },
            {
              de: "Am selben Tag",
              vi: "Trong ngày"
            },
            {
              de: "Innerhalb von 24 Stunden",
              vi: "Trong vòng 24 giờ"
            }
          ],
          correct: 0,
          explanation_de: "Sofort antworten – bevor die Person das Interesse verliert oder eine andere Schule fragt.",
          explanation_vi: "Trả lời ngay – trước khi khách mất hứng thú hoặc hỏi trường khác."
        },
        {
          question_de: "Wann übergibst du eine neue Studentin an Student Support?",
          question_vi: "Khi nào bạn bàn giao học viên mới cho Hỗ trợ học viên?",
          options: [
            {
              de: "Nach der ersten Nachricht",
              vi: "Sau tin nhắn đầu tiên"
            },
            {
              de: "Nach der Probestunde",
              vi: "Sau buổi học thử"
            },
            {
              de: "Nach Anmeldung und Zahlung",
              vi: "Sau khi đăng ký và thanh toán"
            },
            {
              de: "Erst bei Kursbeginn",
              vi: "Khi khóa học bắt đầu"
            }
          ],
          correct: 2,
          explanation_de: "Die Übergabe erfolgt nach unterschriebener Anmeldung und Zahlung.",
          explanation_vi: "Bàn giao sau khi đã ký đăng ký và thanh toán."
        },
        {
          question_de: "Welche Fragen stellst du, um den Bedarf zu klären?",
          question_vi: "Bạn hỏi gì để tìm hiểu nhu cầu của khách?",
          options: [
            {
              de: "Ziel, aktuelles Niveau und Zeitplan",
              vi: "Mục tiêu, trình độ hiện tại và thời gian"
            },
            {
              de: "Wo wohnst du? Welches Niveau hast du?",
              vi: "Bạn sống ở đâu? Bạn đang ở trình độ nào?"
            },
            {
              de: "Wie hoch ist dein Budget?",
              vi: "Ngân sách của bạn là bao nhiêu?"
            },
            {
              de: "Erzähl mir von deinen Plänen in Deutschland.",
              vi: "Kể cho mình nghe về kế hoạch ở Đức của bạn."
            }
          ],
          correct: 1,
          explanation_de: "Nur zwei Fragen: Wohnort und Niveau. Jede weitere oder offene Frage ist eine Hausaufgabe für den Kunden.",
          explanation_vi: "Chỉ hỏi 2 điều: nơi ở và trình độ. Mỗi câu hỏi thêm hoặc câu hỏi mở là một bài tập về nhà cho khách."
        }
      ]
    }
  },
  {
    items: [
      {
        id: "sales.w3.studium-vs-ausbildung-erklaren-k",
        label_de: "Studium vs. Ausbildung erklären können",
        label_vi: "Giải thích được du học và du học nghề"
      },
      {
        id: "sales.w3.einwande-ehrlich-behandeln",
        label_de: "Einwände ehrlich behandeln",
        label_vi: "Xử lý phản đối một cách trung thực"
      },
      {
        id: "sales.w3.crm-in-notion-pflegen",
        label_de: "CRM in Notion pflegen",
        label_vi: "Cập nhật CRM trên Notion"
      },
      {
        id: "sales.w3.erstes-eigenes-beratungsgesprach",
        label_de: "Erstes eigenes Beratungsgespräch",
        label_vi: "Buổi tư vấn đầu tiên của riêng bạn"
      }
    ],
    week: 3,
    title_de: "Beratung & Abschluss",
    title_vi: "Tư vấn & chốt đăng ký"
  },
  {
    items: [
      {
        id: "sales.w4.eigene-messenger-schicht-uberneh",
        label_de: "Eigene Messenger-Schicht übernehmen",
        label_vi: "Tự trực một ca Messenger"
      },
      {
        id: "sales.w4.ersten-wochenreport-schreiben",
        label_de: "Ersten Wochenreport schreiben",
        label_vi: "Viết báo cáo tuần đầu tiên"
      },
      {
        id: "sales.w4.feedbackgesprach-mit-sales-lead",
        label_de: "Feedbackgespräch mit Sales Lead",
        label_vi: "Buổi góp ý với Sales Lead"
      },
      {
        id: "sales.w4.abschlussquiz-bestehen",
        label_de: "Abschlussquiz bestehen",
        label_vi: "Hoàn thành quiz cuối khóa"
      }
    ],
    week: 4,
    title_de: "Selbstständig arbeiten",
    title_vi: "Làm việc độc lập"
  }
];

export default weeks;
