import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "onboarding-und-kundenbindung",
  title_de: "Onboarding & Kundenbindung",
  title_vi: "Bắt đầu học & giữ chân học viên",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Unser Verkaufstrichter hat sieben Stufen. Nach Anmeldung und Zahlung übernimmt Customer Success die letzten beiden: Lernende sollen sofort starten, den Wert sehen und den nächsten Kurs buchen.",
      vi: "Phễu bán hàng của mình có bảy bước. Sau khi khách đăng ký và thanh toán, đội Chăm sóc học viên phụ trách hai bước cuối: học viên bắt đầu ngay, thấy giá trị và đăng ký khoá tiếp theo."
    },
    {
      type: "heading",
      de: "Die sieben Stufen",
      vi: "Bảy bước của phễu"
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          de: "Bekanntheit – Marketing",
          vi: "Biết đến – Marketing"
        },
        {
          de: "Erstkontakt – Sales",
          vi: "Liên hệ đầu tiên – Sales"
        },
        {
          de: "Bedarf klären – Sales",
          vi: "Tìm hiểu nhu cầu – Sales"
        },
        {
          de: "Passende Kurse vorstellen – Sales",
          vi: "Giới thiệu lớp phù hợp – Sales"
        },
        {
          de: "Angebot & Abschluss – Sales",
          vi: "Báo giá & chốt – Sales"
        },
        {
          de: "Sofort mit dem Lernen beginnen (Onboarding) – Customer Success",
          vi: "Bắt đầu học ngay (Onboarding) – Chăm sóc học viên"
        },
        {
          de: "Kundenbindung – Customer Success mit den Lehrkräften",
          vi: "Giữ chân học viên – Chăm sóc học viên cùng giáo viên"
        }
      ]
    },
    {
      type: "heading",
      de: "6 · Sofort mit dem Lernen beginnen",
      vi: "6 · Bắt đầu học ngay"
    },
    {
      type: "callout",
      tone: "info",
      de: "Ziel: Der Kunde sieht sofort den Wert und verlangt nach den Probestunden kein Geld zurück.",
      vi: "Mục tiêu: khách thấy giá trị ngay và không yêu cầu hoàn tiền sau buổi học thử."
    },
    {
      type: "paragraph",
      de: "Schick sofort alles, was zum Start gebraucht wird – damit der Kunde gleich mit dem Lernen beginnt:",
      vi: "Gửi mọi thứ để bắt đầu – ngay lập tức – để khách học được ngay:"
    },
    {
      type: "steps",
      items: [
        {
          de: "Onboarding-E-Mail senden",
          vi: "Gửi email onboarding"
        },
        {
          de: "Die App NaNu Go schicken",
          vi: "Gửi app NaNu Go"
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Mögliche Ursache für Verluste: Der Kunde sieht noch keinen Wert, oder der Start ist verwirrend. Unterstütze in der Onboarding-Phase besser.",
      vi: "Lý do có thể mất khách: khách chưa thấy giá trị, hoặc lúc bắt đầu còn rối. Hãy hỗ trợ tốt hơn trong giai đoạn onboarding."
    },
    {
      type: "heading",
      de: "7 · Kundenbindung",
      vi: "7 · Giữ chân học viên"
    },
    {
      type: "callout",
      tone: "info",
      de: "Ziel: Die Lernenden buchen den nächsten Kurs.",
      vi: "Mục tiêu: học viên đăng ký khoá tiếp theo."
    },
    {
      type: "paragraph",
      de: "Behalte laufend im Blick:",
      vi: "Theo dõi liên tục:"
    },
    {
      type: "list",
      items: [
        {
          de: "Anwesenheit",
          vi: "Điểm danh"
        },
        {
          de: "Feedback der Lehrkraft",
          vi: "Phản hồi giáo viên"
        },
        {
          de: "Übungen in der App",
          vi: "Bài tập trên app"
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Jemand fehlt, kommt nicht gut mit oder macht die Übungen in der App nicht? Melde dich sofort und biete Hilfe an.",
      vi: "Học viên vắng, học chưa tốt hoặc không làm bài trên app? Liên hệ ngay và hỗ trợ."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Mögliche Ursache für Verluste: Die Lernenden sind mit unserem Service nicht zufrieden.",
      vi: "Lý do có thể mất khách: học viên chưa hài lòng với dịch vụ."
    },
    {
      type: "heading",
      de: "So unterstützen wir besser",
      vi: "Cách hỗ trợ tốt hơn"
    },
    {
      type: "list",
      items: [
        {
          de: "Die App NaNu Go vorstellen",
          vi: "Giới thiệu app NaNu Go"
        },
        {
          de: "Regelmäßig nachfragen, auf Basis des Feedbacks der Lehrkraft",
          vi: "Hỏi thăm thường xuyên dựa trên phản hồi của giáo viên"
        },
        {
          de: "Empfehlungen geben und zusätzlich unterstützen",
          vi: "Đưa lời khuyên và hỗ trợ thêm"
        }
      ]
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Welche Stufen des Verkaufstrichters übernimmt Customer Success?",
        question_vi: "Customer Success phụ trách những bước nào của phễu bán hàng?",
        section: "die-sieben-stufen",
        options: [
          { de: "Bekanntheit und Erstkontakt", vi: "Nhận diện và liên hệ đầu tiên" },
          { de: "Angebot und Abschluss", vi: "Báo giá và chốt" },
          { de: "Alle sieben", vi: "Cả bảy bước" },
          { de: "Die letzten beiden: Sofort mit dem Lernen beginnen und Kundenbindung", vi: "Hai bước cuối: bắt đầu học ngay và giữ chân khách hàng" }
        ],
        correct: 3
      },
      {
        question_de: "Was ist das Ziel der Onboarding-Phase?",
        question_vi: "Mục tiêu của giai đoạn onboarding là gì?",
        section: "6-sofort-mit-dem-lernen-beginnen",
        options: [
          { de: "Der Kunde bucht sofort einen zweiten Kurs", vi: "Khách đăng ký ngay khóa thứ hai" },
          { de: "Der Kunde sieht sofort den Wert und verlangt nach den Probestunden kein Geld zurück", vi: "Khách thấy ngay giá trị và không đòi hoàn tiền sau buổi học thử" },
          { de: "Der Kunde schreibt eine Bewertung", vi: "Khách viết đánh giá" },
          { de: "Der Kunde zahlt die Rechnung", vi: "Khách thanh toán hóa đơn" }
        ],
        correct: 1
      },
      {
        question_de: "Was behältst du in der Kundenbindung laufend im Blick?",
        question_vi: "Trong giai đoạn giữ chân, bạn luôn theo dõi gì?",
        section: "7-kundenbindung",
        options: [
          { de: "Anwesenheit, Feedback der Lehrkraft und Übungen in der App", vi: "Chuyên cần, nhận xét của giáo viên và bài tập trong app" },
          { de: "Nur die Zahlungen", vi: "Chỉ các khoản thanh toán" },
          { de: "Die Facebook-Kommentare", vi: "Bình luận trên Facebook" },
          { de: "Nichts, bis der Kurs zu Ende ist", vi: "Không gì, đến khi hết khóa" }
        ],
        correct: 0
      },
      {
        question_de: "Jemand fehlt öfter und macht die App-Übungen nicht. Was tust du?",
        question_vi: "Có học viên hay vắng và không làm bài trong app. Bạn làm gì?",
        section: "7-kundenbindung",
        options: [
          { de: "Warten, bis die Lehrkraft etwas sagt", vi: "Chờ giáo viên lên tiếng" },
          { de: "Mich sofort melden und Hilfe anbieten", vi: "Liên hệ ngay và đề nghị hỗ trợ" },
          { de: "Nichts, das ist seine Sache", vi: "Không làm gì, đó là việc của học viên" },
          { de: "Ihn aus der Gruppe nehmen", vi: "Xóa khỏi nhóm" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
