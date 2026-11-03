import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "ueberblick",
  title_de: "Überblick: Welche Visa wir begleiten",
  title_vi: "Tổng quan: Các loại visa trung tâm hỗ trợ",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-03",
  body: [
    {
      type: "callout",
      tone: "info",
      de: "Entwurf: Diese Seite wird noch ergänzt. Stellen mit [ERGÄNZEN] bitte nicht an Kunden weitergeben.",
      vi: "Bản nháp: Trang này sẽ được bổ sung thêm. Các chỗ có [ERGÄNZEN] thì không gửi cho khách."
    },
    {
      type: "paragraph",
      de: "NaNu NaNa begleitet junge Menschen bis zur Ankunft in Deutschland. Das Visum ist der letzte und oft nervenaufreibendste Schritt – für die Familie geht es um viel Geld und Zeit.",
      vi: "NaNu NaNa đồng hành cùng các bạn trẻ đến khi đặt chân tới Đức. Visa là bước cuối cùng và thường căng thẳng nhất – với gia đình, đó là rất nhiều tiền bạc và thời gian."
    },
    { type: "heading", de: "Was wir begleiten", vi: "Những gì trung tâm hỗ trợ" },
    {
      type: "list",
      items: [
        { de: "Visum zur Ausbildung – im Paket der Ausbildungsvermittlung enthalten", vi: "Visa du học nghề – đã bao gồm trong gói du học nghề" },
        { de: "Visum zum Studium (Studienkolleg, Bachelor, Master) – inkl. APS und Finanzierungsnachweis", vi: "Visa du học đại học (dự bị, cử nhân, thạc sĩ) – gồm APS và chứng minh tài chính" },
        { de: "Sprachkursvisum (§16f) – Deutsch in Deutschland lernen, danach in eine Ausbildung wechseln (siehe unten)", vi: "Visa học tiếng (§16f) – sang Đức học tiếng Đức, sau đó chuyển sang học nghề (xem bên dưới)" }
      ]
    },
    { type: "heading", de: "Sprachkursvisum (§16f)", vi: "Visa học tiếng (§16f)", anchor: "sprachkursvisum" },
    {
      type: "paragraph",
      de: "Mit diesem Visum reist man nach Deutschland, um dort einen längeren Deutschkurs zu machen. Danach sucht man in Deutschland einen Ausbildungsvertrag und wechselt in das Ausbildungsvisum. Wir machen das, wenn Kunden danach fragen.",
      vi: "Với visa này, học viên sang Đức để học một khoá tiếng Đức dài hạn. Sau đó tìm hợp đồng học nghề ngay tại Đức và đổi sang visa du học nghề. Trung tâm có làm diện này nếu khách hỏi."
    },
    {
      type: "list",
      items: [
        { de: "Möglich ab jedem Niveau, auch ab A0.", vi: "Trình độ nào cũng làm được, kể cả từ A0." },
        { de: "Der Kurs dauert meist 4 bis 12 Monate, das Visum gilt für die Kursdauer, meist höchstens 12 Monate.", vi: "Khoá học thường 4–12 tháng, visa cấp theo thời gian khoá học, thường tối đa 12 tháng." },
        { de: "Neben dem Kurs darf man meist bis zu 20 Stunden pro Woche arbeiten.", vi: "Trong lúc học thường được làm thêm tối đa 20 giờ/tuần." },
        { de: "Nötig: Finanzierungsnachweis (Sperrkonto mit genug Geld für die Zeit des Aufenthalts) und eine gültige Krankenversicherung.", vi: "Cần có: chứng minh tài chính (tài khoản phong tỏa đủ tiền cho thời gian ở Đức) và bảo hiểm y tế hợp lệ." },
        { de: "Für Schüler mit Ausbildungsvertrag, die lange auf ihr B1 warten (nur A2 oder B1 mit fehlenden Fertigkeiten), ist es ein Plan B: Sie machen die Prüfung in Deutschland und wechseln danach in die Ausbildung. Sie zahlen uns dafür nichts extra – der Paketpreis bleibt wie im Vertrag.", vi: "Với học viên đã có hợp đồng du học nghề mà phải chờ B1 lâu (mới có A2 hoặc B1 còn thiếu kỹ năng), đây là phương án dự phòng: thi tiếng ở Đức rồi chuyển sang học nghề. Học viên không phải đóng thêm gì cho trung tâm – chi phí giữ nguyên như hợp đồng." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Sag „Deutsch in Deutschland lernen“ (học tiếng Đức tại Đức), nicht „Sprachstudium“ (du học ngôn ngữ) – wir unterrichten Deutsch. Stand Januar–Juni 2026: Die Regeln zum Visum ändern sich. Vor jeder Zusage auf der Seite der Deutschen Botschaft prüfen und keinen Preis nennen, den die Leitung nicht bestätigt hat.",
      vi: "Nói „học tiếng Đức tại Đức“, không nói „du học ngôn ngữ“ – trung tâm dạy tiếng Đức. Thông tin tháng 1–6/2026: quy định visa có thể thay đổi. Trước khi hứa gì phải kiểm tra trang Đại sứ quán Đức và không báo giá nào mà quản lý chưa xác nhận."
    },
    { type: "heading", de: "Was wir nicht begleiten", vi: "Những gì trung tâm không làm" },
    {
      type: "list",
      items: [
        { de: "Arbeitsvisa und Arbeitsprogramme (z. B. „8 Monate arbeiten“), Saisonarbeit", vi: "Visa lao động và chương trình lao động (ví dụ „lao động 8 tháng“), lao động thời vụ" },
        { de: "Familiennachzug und Verlängerungen bestehender Aufenthalte – hier helfen wir nur mit dem Sprachkurs (A1/A2 bzw. B1).", vi: "Đoàn tụ gia đình và gia hạn cư trú – trung tâm chỉ hỗ trợ khóa học tiếng (A1/A2 hoặc B1)." },
        { de: "Wechsel des Ausbildungsbetriebs für Personen, die über eine andere Agentur gekommen sind", vi: "Đổi doanh nghiệp cho các bạn sang Đức qua công ty khác" }
      ]
    },
    { type: "heading", de: "Wer macht was", vi: "Ai làm gì" },
    {
      type: "list",
      items: [
        { de: "Sales: erste Fragen beantworten, Kosten nennen, an Student Support übergeben", vi: "Sales: trả lời câu hỏi đầu tiên, báo chi phí, bàn giao cho Hỗ trợ học viên" },
        { de: "Student Support: Unterlagen, Termin bei der Botschaft, Nachverfolgung bis zum Visum", vi: "Hỗ trợ học viên: hồ sơ, lịch hẹn Đại sứ quán, theo dõi đến khi có visa" },
        { de: "[ERGÄNZEN: Ansprechperson Visa, Vertretung]", vi: "[ERGÄNZEN: người phụ trách visa, người thay thế]" }
      ]
    }
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "Welche Visa begleiten wir?",
        question_vi: "Chúng ta hỗ trợ những loại visa nào?",
        section: "was-wir-begleiten",
        options: [
          { de: "Arbeitsvisa und Saisonarbeit", vi: "Visa lao động và lao động thời vụ" },
          { de: "Familiennachzug", vi: "Đoàn tụ gia đình" },
          { de: "Alle Visaarten", vi: "Mọi loại visa" },
          { de: "Visum zur Ausbildung und Visum zum Studium", vi: "Visa du học nghề và visa du học đại học" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand fragt nach einem Programm „8 Monate arbeiten in Deutschland“. Begleiten wir das?",
        question_vi: "Có người hỏi chương trình „làm việc 8 tháng ở Đức“. Chúng ta có hỗ trợ không?",
        section: "was-wir-nicht-begleiten",
        options: [
          { de: "Ja, im Paket der Ausbildungsvermittlung", vi: "Có, trong gói du học nghề" },
          { de: "Nein, Arbeitsvisa und Arbeitsprogramme begleiten wir nicht", vi: "Không, không hỗ trợ visa và chương trình lao động" },
          { de: "Ja, gegen Aufpreis", vi: "Có, trả thêm phí" },
          { de: "Nur, wenn die Person B2 hat", vi: "Chỉ khi có B2" }
        ],
        correct: 1
      },
      {
        question_de: "Ein Schüler mit Ausbildungsvertrag hat erst A2 und wartet lange auf sein B1. Welchen Plan B gibt es?",
        question_vi: "Học viên đã có hợp đồng du học nghề mới có A2 và phải chờ B1 lâu. Có phương án dự phòng nào?",
        section: "sprachkursvisum",
        options: [
          { de: "Keinen – er muss in Vietnam warten", vi: "Không có – phải chờ ở Việt Nam" },
          { de: "Ein Arbeitsvisum für 8 Monate", vi: "Visa lao động 8 tháng" },
          { de: "Das Sprachkursvisum (§16f): Deutsch in Deutschland lernen, dort die Prüfung machen und danach in die Ausbildung wechseln – ohne Extrakosten für ihn", vi: "Visa học tiếng (§16f): sang Đức học tiếng, thi ở Đức rồi chuyển sang học nghề – không phải đóng thêm" },
          { de: "Das Sprachkursvisum, aber nur gegen 50 Mio. Aufpreis", vi: "Visa học tiếng, nhưng phải đóng thêm 50 triệu" }
        ],
        correct: 2
      },
      {
        question_de: "Wie viel darf man mit dem Sprachkursvisum neben dem Kurs meist arbeiten?",
        question_vi: "Với visa học tiếng, thường được làm thêm bao nhiêu?",
        section: "sprachkursvisum",
        options: [
          { de: "Bis zu 20 Stunden pro Woche", vi: "Tối đa 20 giờ/tuần" },
          { de: "Gar nicht", vi: "Không được làm" },
          { de: "Vollzeit", vi: "Toàn thời gian" },
          { de: "Nur in den Ferien", vi: "Chỉ trong kỳ nghỉ" }
        ],
        correct: 0
      },
      {
        question_de: "Wer kümmert sich um Unterlagen und Botschaftstermin?",
        question_vi: "Ai lo hồ sơ và lịch hẹn Đại sứ quán?",
        section: "wer-macht-was",
        options: [
          { de: "Sales", vi: "Sales" },
          { de: "Student Support", vi: "Student Support" },
          { de: "Die Lehrkraft", vi: "Giáo viên" },
          { de: "Die Familie allein, wir nicht", vi: "Gia đình tự lo, trung tâm không" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
