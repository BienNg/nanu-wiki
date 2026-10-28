import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "interview",
  title_de: "Die Rolle in Kürze",
  title_vi: "Tóm tắt vai trò",
  kind: "reference",
  section: "interview",
  verified_until: null,
  updated_at: "2026-10-28",
  body: [
    {
      type: "paragraph",
      de: "Du beantwortest Anfragen von jungen Menschen, die in Deutschland studieren oder eine Ausbildung machen möchten – schnell, freundlich und ehrlich.",
      vi: "Bạn trả lời câu hỏi của các bạn trẻ muốn du học hoặc học nghề tại Đức – nhanh, thân thiện và trung thực."
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
      de: "Multiple-Choice-Runde",
      vi: "Câu hỏi trắc nghiệm"
    },
    {
      type: "mcq",
      id: "sales-mc",
      intro_de: "Eine Frage nach der anderen. Wähl die Antwort, die du im Job geben würdest. Mit „Zurück“ kannst du deine Antworten bis zum Abschicken noch ändern.",
      intro_vi: "Từng câu một. Chọn câu trả lời bạn sẽ làm khi đang làm việc. Bấm „Quay lại“ để sửa câu trả lời trước khi gửi.",
      questions: [
        {
          question_de: "Was ist das Erste, was du morgens machst, wenn du mit der Arbeit anfängst?",
          question_vi: "Việc đầu tiên bạn làm vào buổi sáng khi bắt đầu làm việc là gì?",
          options: [
            { de: "Die Statistik vom Vortag ausfüllen", vi: "Điền thống kê của ngày hôm trước" },
            { de: "Alle Anfragen und Nachrichten auf allen Plattformen beantworten", vi: "Trả lời tất cả yêu cầu và tin nhắn trên mọi nền tảng" },
            { de: "Neue Posts für Facebook planen", vi: "Lên kế hoạch bài đăng Facebook mới" },
            { de: "Die Stundenpläne der nächsten Klassen planen", vi: "Lên lịch học cho các lớp sắp tới" }
          ],
          correct: 1
        },
        {
          question_de: "Jemand fragt auf Messenger: „Was kostet der A1-Kurs?“ Was machst du zuerst?",
          question_vi: "Một người hỏi trên Messenger: „Khoá A1 bao nhiêu tiền?“ Bạn làm gì trước tiên?",
          options: [
            { de: "Erst viele Fragen stellen, um den Bedarf genau zu verstehen", vi: "Hỏi thật nhiều để hiểu rõ nhu cầu trước" },
            { de: "Die ganze Preisliste schicken und auf eine Antwort warten", vi: "Gửi cả bảng giá rồi chờ khách trả lời" },
            { de: "Die Frage beantworten und dann nur nach Wohnort und Niveau fragen", vi: "Trả lời câu hỏi, sau đó chỉ hỏi nơi ở và trình độ" },
            { de: "Um die Telefonnummer bitten und morgen anrufen", vi: "Xin số điện thoại và gọi lại vào ngày mai" }
          ],
          correct: 2
        },
        {
          question_de: "Eine Person antwortet seit 24 Stunden nicht mehr. Was tust du?",
          question_vi: "Một người đã 24 giờ không trả lời. Bạn làm gì?",
          options: [
            { de: "Einmal freundlich nachfassen", vi: "Nhắn lại một lần thật nhẹ nhàng" },
            { de: "Warten, bis sie sich selbst meldet", vi: "Chờ đến khi khách tự liên hệ lại" },
            { de: "Jede Stunde wieder schreiben", vi: "Cứ mỗi giờ lại nhắn một lần" },
            { de: "Den Kontakt aus dem CRM löschen", vi: "Xoá liên hệ khỏi CRM" }
          ],
          correct: 0
        },
        {
          question_de: "„Bei der anderen Schule ist es 2 Millionen günstiger. Gibt es Rabatt?“ Wie reagierst du?",
          question_vi: "„Trung tâm kia rẻ hơn 2 triệu. Có giảm giá không?“ Bạn phản hồi thế nào?",
          options: [
            { de: "Selbst 2 Millionen Rabatt geben, damit die Person bleibt", vi: "Tự giảm 2 triệu để giữ khách" },
            { de: "Einen Rabatt versprechen und später mit der Leitung klären", vi: "Hứa giảm giá rồi sau đó hỏi lại quản lý" },
            { de: "Sagen, dass die andere Schule schlecht ist", vi: "Nói rằng trung tâm kia không tốt" },
            { de: "Zeigen, was im Preis enthalten ist, und nur offizielle Aktionen nennen", vi: "Cho khách thấy học phí bao gồm những gì và chỉ nói về ưu đãi chính thức" }
          ],
          correct: 3
        },
        {
          question_de: "Du schickst ein Angebot. Womit endet die Nachricht?",
          question_vi: "Bạn gửi báo giá. Tin nhắn kết thúc bằng gì?",
          options: [
            { de: "„Melde dich, wenn du Fragen hast.“", vi: "„Bạn có câu hỏi gì thì nhắn mình nhé.“" },
            { de: "Mit der konkreten Frage, ob wir einen Platz reservieren sollen", vi: "Bằng câu hỏi cụ thể có giữ chỗ cho khách không" },
            { de: "Mit drei weiteren Kursen zur Auswahl", vi: "Bằng ba khoá học khác để khách chọn" },
            { de: "Mit nichts – die Person soll in Ruhe überlegen", vi: "Không thêm gì – để khách tự suy nghĩ" }
          ],
          correct: 1
        },
        {
          question_de: "Ein Teilnehmer schreibt: „Auf Zalo antwortet niemand, morgen ist Kursstart und ich habe keinen Link.“ Was tust du?",
          question_vi: "Một học viên nhắn: „Trên Zalo không ai trả lời, mai học rồi mà em chưa có link.“ Bạn làm gì?",
          options: [
            { de: "Sagen, dass er weiter auf Zalo schreiben soll", vi: "Bảo học viên tiếp tục nhắn trên Zalo" },
            { de: "Nicht antworten – Sales ist nur für neue Kunden da", vi: "Không trả lời – Sales chỉ lo khách mới" },
            { de: "Sofort entschuldigen, den Link selbst schicken oder mit Uhrzeit an Student Support geben", vi: "Xin lỗi ngay, tự gửi link hoặc chuyển cho Hỗ trợ học viên kèm thời gian sẽ phản hồi" },
            { de: "Morgen früh antworten, wenn das Büro offen ist", vi: "Sáng mai trả lời khi văn phòng mở cửa" }
          ],
          correct: 2
        },
        {
          question_de: "Eine Person hat den Kurs bezahlt. Was ist dein nächster Schritt?",
          question_vi: "Một người đã đóng học phí. Bước tiếp theo của bạn là gì?",
          options: [
            { de: "Material, Zalo-Gruppe und Zoom-Link selbst schicken", vi: "Tự gửi tài liệu, nhóm Zalo và link Zoom" },
            { de: "Die Zahlung in Slack an Customer Success melden – mit allem, was zugesagt wurde", vi: "Báo thanh toán trên Slack cho Customer Success – kèm mọi điều đã hứa với khách" },
            { de: "Nichts, die Arbeit ist erledigt", vi: "Không làm gì, việc đã xong" },
            { de: "Gleich das nächste Niveau anbieten", vi: "Mời khách đăng ký luôn trình độ tiếp theo" }
          ],
          correct: 1
        },
        {
          question_de: "„Bekomme ich mit euch sicher das Visum?“ Was antwortest du?",
          question_vi: "„Học bên mình thì chắc chắn em có visa không ạ?“ Bạn trả lời thế nào?",
          options: [
            { de: "„Ja, zu 100 %.“", vi: "„Có, chắc chắn 100 %.“" },
            { de: "„Bei uns haben alle das Visum bekommen.“", vi: "„Ở trung tâm ai cũng có visa hết.“" },
            { de: "Die Frage überspringen und über den Kurs sprechen", vi: "Bỏ qua câu hỏi và nói về khoá học" },
            { de: "Ehrlich sagen, dass niemand ein Visum versprechen kann, und Voraussetzungen und Risiken erklären", vi: "Nói thật rằng không ai hứa được visa, và giải thích điều kiện cũng như rủi ro" }
          ],
          correct: 3
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
      intro_de: "Linh schreibt der NaNu-NaNa-Seite auf Messenger. Antworte so, wie du es im Job tun würdest – auf Vietnamesisch. Die Zeit läuft, sobald die Nachricht da ist.",
      intro_vi: "Linh nhắn tin cho trang NaNu NaNa trên Messenger. Hãy trả lời như khi bạn đang làm việc – bằng tiếng Việt. Thời gian được tính từ lúc tin nhắn đến.",
      message: {
        text: "Chào ad\n\nCho mình hỏi học phí khoá A1 bao nhiêu vậy ạ?",
        translation_de: "„Hallo Admin! Darf ich fragen, wie viel der A1-Kurs kostet?“"
      }
    },
    {
      type: "chat",
      id: "sales-test-pflege",
      customer: "Nam",
      intro_de: "Nam schreibt zum ersten Mal auf Messenger.",
      intro_vi: "Nam nhắn tin lần đầu trên Messenger.",
      message: {
        text: "Mình đang học lớp 12, muốn sang Đức học nghề điều dưỡng. Giờ mới bắt đầu học tiếng Đức thì có kịp không ạ?",
        translation_de: "„Ich bin in der 12. Klasse und möchte in Deutschland eine Pflege-Ausbildung machen. Schaffe ich das, wenn ich jetzt erst mit Deutsch anfange?“"
      }
    },
    {
      type: "chat",
      id: "sales-test-rabatt",
      customer: "Mai",
      intro_de: "Mai hat den Preis für den A1-Kurs schon bekommen und schreibt zurück.",
      intro_vi: "Mai đã nhận được báo giá khoá A1 và nhắn lại.",
      message: {
        text: "Trung tâm kia rẻ hơn bên mình 2 triệu lận\n\nBên mình có giảm giá gì không ad?",
        translation_de: "„Bei der anderen Schule ist es ganze 2 Millionen günstiger. Gibt es bei euch irgendeinen Rabatt?“"
      }
    }
  ]
};

export default page;
