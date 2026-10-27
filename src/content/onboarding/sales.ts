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
        id: "sales.w2.faq-sprachkurse-lesen",
        label_de: "FAQ Sprachkurse lesen",
        label_vi: "Đọc FAQ khóa học tiếng",
        page: "sales/faq-sprachkurse"
      },
      {
        id: "sales.w2.faq-app-lesen",
        label_de: "FAQ App NaNu Go lesen",
        label_vi: "Đọc FAQ app NaNu Go",
        page: "sales/faq-app"
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
        id: "sales.w3.faq-ausbildung-und-studium-lesen",
        label_de: "FAQ Ausbildung und Studium lesen",
        label_vi: "Đọc FAQ du học nghề và đại học",
        page: "sales/faq-ausbildung"
      },
      {
        id: "sales.w3.bestandskunden-und-keine-kunden",
        label_de: "Teilnehmende und Nicht-Kunden im Messenger",
        label_vi: "Học viên đang học và tin nhắn không phải khách",
        page: "sales/bestandskunden-im-messenger"
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
    title_vi: "Tư vấn & chốt đăng ký",
    quiz: {
      id: "sales-woche-3",
      pass_percent: 75,
      questions: [
        {
          question_de: "Jemand fragt über den App-Button: „Was kostet die App?“ Was stimmt?",
          question_vi: "Khách bấm nút hỏi: „App này giá bao nhiêu?“ Câu nào đúng?",
          options: [
            { de: "Sie kostet 49 Euro im Monat.", vi: "App có giá 49 Euro/tháng." },
            { de: "Für Kursteilnehmende ist sie kostenlos, einzeln verkaufen wir sie nicht.", vi: "App miễn phí cho học viên của trung tâm, không bán riêng." },
            { de: "Jeder kann sie kostenlos herunterladen.", vi: "Ai cũng tải miễn phí được." },
            { de: "Sie gibt es nur ab B1.", vi: "App chỉ dành cho trình độ B1 trở lên." }
          ],
          correct: 1,
          explanation_de: "Die App folgt genau dem Unterricht – deshalb nur für Teilnehmende, dort aber kostenlos (Wert 49 €).",
          explanation_vi: "App bám sát bài học trên lớp – nên chỉ dành cho học viên, và miễn phí (giá trị 49 €)."
        },
        {
          question_de: "Wie viele Personen sind in einem Online-Gruppenkurs?",
          question_vi: "Lớp nhóm online có bao nhiêu học viên?",
          options: [
            { de: "1–3", vi: "1–3" },
            { de: "5–9", vi: "5–9" },
            { de: "8–15", vi: "8–15" },
            { de: "bis zu 25", vi: "tối đa 25" }
          ],
          correct: 1,
          explanation_de: "Online 5–9, vor Ort 8–15.",
          explanation_vi: "Online 5–9, offline 8–15."
        },
        {
          question_de: "Was gilt bei der Probestunde für neue Online-Teilnehmende?",
          question_vi: "Quy định học thử với học viên online mới là gì?",
          options: [
            { de: "Eine kostenlose Probestunde ohne Zahlung", vi: "Một buổi học thử miễn phí, chưa cần đóng tiền" },
            { de: "Kurs zahlen, zwei Termine testen – passt es nicht, 100 % zurück", vi: "Đóng học phí, học thử 2 buổi – không phù hợp thì hoàn 100%" },
            { de: "Nur die zwei Termine bezahlen", vi: "Chỉ đóng tiền cho 2 buổi học thử" },
            { de: "Eine Anzahlung von 2 Mio., Rest nach dem Test", vi: "Cọc 2 triệu, phần còn lại sau khi học thử" }
          ],
          correct: 1,
          explanation_de: "Auch die zwei Testtermine kosten nichts, wenn die Person danach aufhört.",
          explanation_vi: "Kể cả 2 buổi học thử cũng không mất phí nếu khách dừng lại."
        },
        {
          question_de: "Ein Kurs bekommt nicht genug Anmeldungen. Was passiert?",
          question_vi: "Lớp không đủ học viên đăng ký. Chuyện gì xảy ra?",
          options: [
            { de: "Das Geld verfällt.", vi: "Học phí bị mất." },
            { de: "Wir bieten eine Alternative an; wer nicht will, bekommt sofort 100 % zurück.", vi: "Trung tâm đưa phương án thay thế; nếu không đồng ý được hoàn 100% ngay." },
            { de: "Der Kurs startet trotzdem mit 1–2 Personen.", vi: "Lớp vẫn khai giảng với 1–2 người." },
            { de: "Die Person bekommt einen Gutschein.", vi: "Khách nhận phiếu học bù." }
          ],
          correct: 1,
          explanation_de: "Kein Risiko für Kunden: Alternative oder volle Rückerstattung.",
          explanation_vi: "Khách không chịu rủi ro: có phương án thay thế hoặc hoàn tiền 100%."
        },
        {
          question_de: "Eine ehemalige Teilnehmerin will den nächsten Kurs buchen. Was tust du?",
          question_vi: "Học viên cũ muốn đăng ký khóa tiếp theo. Bạn làm gì?",
          options: [
            { de: "Den Ehemaligen-Rabatt von mir aus nennen", vi: "Chủ động báo ưu đãi học viên cũ" },
            { de: "Den Rabatt nur nennen, wenn sie fragt", vi: "Chỉ nói về ưu đãi khi khách hỏi" },
            { de: "Ihr den Frühbucherrabatt verweigern", vi: "Không cho khách hưởng ưu đãi đăng ký sớm" },
            { de: "An das Management weiterleiten", vi: "Chuyển cho ban điều hành" }
          ],
          correct: 0,
          explanation_de: "Vorteile, die jemandem zustehen, nennen wir von uns aus – sonst fühlt sich die Person ausgetrickst.",
          explanation_vi: "Quyền lợi của khách thì chúng ta chủ động nói – nếu không khách sẽ thấy bị thiệt."
        },
        {
          question_de: "Ein Bewerber für eine Ausbildung hat B1 in drei Fertigkeiten, das vierte Ergebnis fehlt. Was antwortest du?",
          question_vi: "Ứng viên du học nghề có B1 ba kỹ năng, chưa có điểm kỹ năng thứ tư. Bạn trả lời thế nào?",
          options: [
            { de: "Reicht, wir starten sofort.", vi: "Đủ rồi, bắt đầu ngay." },
            { de: "Wir brauchen alle vier Fertigkeiten – schick das Ergebnis, sobald es da ist.", vi: "Cần đủ 4 kỹ năng – em gửi điểm ngay khi có nhé." },
            { de: "Ohne B2 geht gar nichts.", vi: "Không có B2 thì không làm được." },
            { de: "Erst Rate 1 zahlen, dann sehen wir.", vi: "Đóng đợt 1 trước rồi tính." }
          ],
          correct: 1,
          explanation_de: "Voraussetzung ist B1 in allen vier Fertigkeiten; B2 nur für Pflege und Zahnmedizin.",
          explanation_vi: "Điều kiện là B1 đủ 4 kỹ năng; B2 chỉ bắt buộc với điều dưỡng và nha khoa."
        },
        {
          question_de: "Wie viel bekommt jemand aus Rate 1 zurück, der nach dem ersten gescheiterten Interview aufhört?",
          question_vi: "Ứng viên dừng lại sau lần phỏng vấn đầu không đậu được hoàn bao nhiêu từ đợt 1?",
          options: [
            { de: "Nichts", vi: "Không hoàn" },
            { de: "40 von 50 Mio.", vi: "40 trong 50 triệu" },
            { de: "Alle 50 Mio.", vi: "Toàn bộ 50 triệu" },
            { de: "25 Mio.", vi: "25 triệu" }
          ],
          correct: 1,
          explanation_de: "10 Mio. decken Unterlagen und Interviewtraining. Sag das, bevor jemand zahlt.",
          explanation_vi: "10 triệu là chi phí chuẩn bị hồ sơ và luyện phỏng vấn. Hãy nói rõ trước khi khách đóng tiền."
        },
        {
          question_de: "Jemand möchte B1 in zwei Monaten schaffen. Was sagst du?",
          question_vi: "Khách muốn xong B1 trong 2 tháng. Bạn nói gì?",
          options: [
            { de: "Klar, mit unserem Intensivkurs.", vi: "Được, với lớp cấp tốc." },
            { de: "Ehrlich: Jede Stufe dauert 2,5–3 Monate. Ich zeige dir den schnellsten realistischen Weg.", vi: "Nói thật: mỗi cấp độ cần 2,5–3 tháng. Mình gửi bạn lộ trình nhanh nhất có thể." },
            { de: "Nur mit 1:1-Unterricht.", vi: "Chỉ khi học kèm 1-1." },
            { de: "Gar nicht antworten.", vi: "Không trả lời." }
          ],
          correct: 1,
          explanation_de: "Ehrlich auch beim Nein – und trotzdem einen nächsten Schritt anbieten.",
          explanation_vi: "Trung thực kể cả khi câu trả lời là „không“ – nhưng vẫn đưa ra bước tiếp theo."
        }
      ]
    }
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
