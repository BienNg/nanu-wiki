import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "aufgaben-und-kpis",
  title_de: "Sales: Aufgaben, Wochenrhythmus & KPIs",
  title_vi: "Tư vấn tuyển sinh: công việc, lịch tuần & KPI",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Sales berät Interessierte zu Sprachkursen und zum Weg nach Deutschland, bringt sie zur Anmeldung und begleitet Studien- und Visumsunterlagen. Das Ziel ist klar: möglichst viele Anmeldungen – wenn nicht dieser Kurs, dann ein anderer. Und niemand geht verloren.",
      vi: "Sales tư vấn khoá học tiếng và con đường sang Đức, đưa khách đến đăng ký và theo dõi hồ sơ du học, visa. Mục tiêu rõ ràng: tối đa hoá số học viên đăng ký – không khoá này thì khoá khác. Và không bỏ sót khách hàng nào."
    },
    { type: "heading", de: "Die Aufgaben", vi: "Công việc chính" },
    {
      type: "steps",
      items: [
        {
          de: "Neue und mögliche Kunden betreuen",
          vi: "Chăm sóc khách mới và khách tiềm năng",
          body_de: "Alle Anfragen aus Facebook, Zalo, WhatsApp, TikTok und dem Website-Formular schnell beantworten. Wer sich noch nicht angemeldet hat, wird aktiv angeschrieben oder angerufen. Bedarf, Gesprächsverlauf und den nächsten Kontakttermin im Backoffice notieren.",
          body_vi: "Phản hồi nhanh mọi khách từ Facebook, Zalo, WhatsApp, TikTok và form website. Khách chưa đăng ký thì chủ động nhắn tin, gọi điện chăm sóc. Ghi nhu cầu, lịch sử tư vấn và ngày cần liên hệ lại vào Backoffice."
        },
        {
          de: "Beraten und abschließen",
          vi: "Tư vấn và chốt đăng ký",
          body_de: "Kurse, Preise, Aktionen, Termine und Regeln kennen. Einwände klären, ein passendes Angebot machen, nach dem Abschluss fragen und Anmeldung, Vertrag und Zahlung verfolgen.",
          body_vi: "Nắm rõ khoá học, học phí, ưu đãi, lịch học và chính sách. Giải đáp lý do khách chưa đăng ký, đề xuất lộ trình phù hợp, chủ động chốt và theo dõi đăng ký, hợp đồng, thanh toán."
        },
        {
          de: "Neue Klassen planen",
          vi: "Lên kế hoạch mở lớp",
          body_de: "Wer wartet auf welche Stufe, zu welcher Uhrzeit, online oder vor Ort, wo? Daraus Starttermin, Stundenplan und erwartete Teilnehmerzahl vorschlagen, mit der Kursplanung Lehrkraft und Raum klären und rechtzeitig eine Lösung vorschlagen, wenn eine Klasse zu klein bleibt.",
          body_vi: "Ai đang chờ trình độ nào, khung giờ nào, online hay offline, ở đâu? Từ đó đề xuất ngày khai giảng, lịch học và số học viên dự kiến, phối hợp bộ phận điều phối kiểm tra giáo viên, phòng học và chủ động đề xuất phương án khi lớp có nguy cơ thiếu học viên."
        },
        {
          de: "Zu Ausbildung und Studium beraten",
          vi: "Tư vấn du học Đức",
          body_de: "Voraussetzungen, Kosten, Dauer und Risiken klar erklären. Jede Person mit 1–5 Sternen einschätzen (5 = am vielversprechendsten) und die Sterne direkt in den Kontaktnamen schreiben.",
          body_vi: "Giải thích rõ điều kiện, chi phí, thời gian và rủi ro. Đánh giá mỗi khách từ 1–5 sao (5 sao là tiềm năng nhất) và ghi ngay vào tên khách hàng."
        },
        {
          de: "Studien- und Visumsunterlagen begleiten",
          vi: "Theo dõi hồ sơ du học và visa",
          body_de: "Liste aller laufenden Fälle mit Fristen führen, fehlende Unterlagen rechtzeitig anmahnen, Übersetzung und Beglaubigung erklären, über den Stand informieren. Nie ein Visum versprechen.",
          body_vi: "Lập danh sách hồ sơ đang làm kèm deadline, nhắc bổ sung giấy tờ đúng hạn, hướng dẫn dịch thuật, công chứng, chủ động cập nhật tình trạng cho học viên. Không bao giờ tự ý cam kết kết quả visa."
        },
        {
          de: "An Customer Success übergeben",
          vi: "Bàn giao cho đội Chăm sóc học viên",
          body_de: "Nach der Zahlung schickt Sales nichts mehr an die Person. Die Anmeldung in Slack an Customer Success melden – mit allem, was zugesagt wurde. Siehe „Vormerken, Zahlung & Rechnung“ im Bereich Student Support.",
          body_vi: "Sau khi khách đóng tiền, Sales không gửi gì thêm cho học viên. Báo lên Slack cho đội Chăm sóc học viên – kèm mọi điều đã cam kết. Xem trang „Ghi danh trước, đóng học phí & hoá đơn“ ở mục Student Support."
        }
      ]
    },
    {
      type: "callout",
      tone: "info",
      de: "Jeder Kontakt hat einen Status, eine verantwortliche Person und ein Datum für den nächsten Kontakt. „Beraten, aber keiner weiß, wie es weitergeht“ darf es nicht geben.",
      vi: "Mỗi khách hàng phải có trạng thái rõ ràng, người phụ trách và ngày liên hệ tiếp theo. Không được để khách rơi vào tình trạng „đã tư vấn rồi nhưng không biết tiếp theo phải làm gì“."
    },
    { type: "heading", de: "Der Rhythmus", vi: "Lịch làm việc" },
    {
      type: "list",
      items: [
        { de: "Morgens: alle unbeantworteten Kontakte, fällige Rückrufe und Fristen der Unterlagen prüfen.", vi: "Đầu ngày: kiểm tra toàn bộ khách chưa phản hồi, cần liên hệ lại và các deadline hồ sơ." },
        { de: "Tagsüber: neue Kontakte beraten, Vertragskunden betreuen (Teilnehmende im Kurs betreut Customer Success), abschließen, Unterlagen bearbeiten.", vi: "Trong ngày: tư vấn khách mới, chăm sóc khách đã ký hợp đồng (học viên đang học do đội Chăm sóc học viên phụ trách), chốt đăng ký, xử lý hồ sơ." },
        { de: "Abends: Backoffice ausfüllen, in den letzten 15 Minuten alles noch einmal prüfen.", vi: "Cuối ngày: điền Backoffice, 15 phút cuối kiểm tra lại trước khi về." },
        { de: "Dienstag: Bedarf für die nächsten Klassen sammeln – einen Monat und zwei Wochen vor dem Start.", vi: "Thứ Ba: tổng hợp nhu cầu mở lớp sắp tới, trước 1 tháng và trước 2 tuần." },
        { de: "Mittwoch: unentschlossene Kontakte, Visumsunterlagen und Anmeldestand je Klasse prüfen. Die Leitung kontrolliert stichprobenartig.", vi: "Thứ Tư: kiểm tra khách chưa chốt, hồ sơ visa và tiến độ tuyển sinh. Quản lý sẽ kiểm tra bất kỳ." },
        { de: "Alle zwei Wochen: Bericht an die Leitung – neue, beratene, offene und angemeldete Kontakte, wer bald abschließen könnte. Termin selbst vereinbaren.", vi: "2 tuần 1 lần: báo cáo quản lý số khách mới, đã tư vấn, đang theo dõi và đã đăng ký, khách có khả năng chốt sắp tới. Tự đặt lịch họp." },
        { de: "Monatsende: Statistik mit drei Zahlen – neue Anmeldungen im Monat, Teilnehmende je Stufe, Teilnehmende mit Vertrag.", vi: "Cuối tháng: bảng thống kê 3 nội dung – số học viên đăng ký mới trong tháng, số học viên đang học theo từng trình độ, số học viên theo hợp đồng." }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Freie Lehrkräfte sind eine Chance: Hat eine Lehrkraft Zeit, aber keine Klasse, schlag einen kurzen Kurs vor – z. B. Aussprache zu zweit – und bewirb ihn mit ihrem Profil.",
      vi: "Giáo viên trống lịch là cơ hội: nếu có giáo viên báo dạy được mà đang không có lớp, hãy đề xuất một lớp ngắn – ví dụ luyện phát âm 2 người – và quảng cáo kèm profile giáo viên."
    },
    { type: "heading", de: "KPIs", vi: "KPI" },
    {
      type: "list",
      ordered: true,
      items: [
        { de: "Neue Kontakte in der Arbeitszeit erfasst und beantwortet – 100 %", vi: "Khách hàng mới được ghi nhận và phản hồi trong giờ làm việc – 100%" },
        { de: "Vereinbarte Rückmeldungen innerhalb von 48 Stunden – 100 %", vi: "Khách cần liên hệ lại được theo dõi đúng hẹn (48 tiếng) – 100%" },
        { de: "Mindestens 50 neue Anmeldungen pro Monat", vi: "Ít nhất 50 học viên đăng ký mới mỗi tháng" },
        { de: "Für jede neue Klasse 2–4 Wochen vor dem Start ein Vorschlag: Post, Story, Anzeige bei Marketing anfragen – 100 %", vi: "Đề xuất trước ngày khai giảng dự kiến 2–4 tuần: đăng bài tuyển sinh, story, nhờ Marketing chạy quảng cáo – 100%" },
        { de: "Jede Studien- und Visumsakte hat Stand und Frist – 100 %, ohne Fehler", vi: "Hồ sơ du học và visa – 100% có tiến độ và deadline theo dõi, tuyệt đối không sai, không quên, không nhầm" }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Wird ein Ziel nicht erreicht, reicht „Die Kunden haben nicht geantwortet“ nicht. Analysiere, warum, und schlag vor, was du änderst. Notiere deshalb bei jeder Absage den Grund – die Leitung fragt danach.",
      vi: "Khi chưa đạt mục tiêu, không chỉ báo „khách chưa phản hồi“. Phân tích nguyên nhân và đề xuất phương án cải thiện. Vì vậy mỗi khách từ chối đều phải ghi lại lý do – quản lý sẽ hỏi."
    },
    {
      type: "callout",
      tone: "info",
      de: "Ruhiger Tag mit wenig neuen Nachrichten? Die Kontakte der letzten Wochen durchgehen, die noch nicht geantwortet haben, und freundlich fragen, was sie noch brauchen.",
      vi: "Hôm nào ít tin nhắn mới? Xem lại các khách mấy tuần gần đây chưa trả lời, nhắn hỏi thăm vì sao chưa đăng ký, có cần tư vấn thêm gì không."
    }
  ]
};

export default page;
