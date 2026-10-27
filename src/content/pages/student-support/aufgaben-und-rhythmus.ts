import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "aufgaben-und-rhythmus",
  title_de: "Customer Success: Aufgaben, Wochenrhythmus & KPIs",
  title_vi: "Chăm sóc học viên: công việc, lịch tuần & KPI",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Sales gewinnt die Teilnehmenden, Customer Success hält sie. Ab der Zahlung ist Customer Success die einzige Ansprechstelle: Begrüßung, Material, Fragen während des Kurses, Kontakt zu den Lehrkräften und der nächste Kurs. So bekommt die Person nicht von drei Leuten drei verschiedene Antworten.",
      vi: "Sales mang học viên về, đội Chăm sóc học viên giữ học viên ở lại. Từ lúc học viên đóng học phí, đội Chăm sóc học viên là đầu mối duy nhất: chào mừng, gửi tài liệu, giải đáp trong khoá học, làm việc với giáo viên và khoá tiếp theo. Nhờ vậy học viên không nhận ba câu trả lời khác nhau từ ba người."
    },
    {
      type: "callout",
      tone: "info",
      de: "Übergabe von Sales: Sales schickt nach der Anmeldung nichts mehr an die Person, sondern meldet sie in Slack an Customer Success – mit allem, was zugesagt wurde (Sonderpreis, Ratenzahlung, späterer Einstieg). Ab da übernimmt Customer Success. Das gilt auch abends und am Wochenende: Wer gerade Customer-Success-Schicht hat, schickt Material und Zugänge.",
      vi: "Bàn giao từ Sales: sau khi học viên đăng ký, Sales không gửi gì thêm cho học viên mà báo lên Slack cho đội Chăm sóc học viên – kèm mọi điều đã hứa (giá ưu đãi riêng, chia đợt đóng, vào học trễ). Từ đó đội Chăm sóc học viên phụ trách. Buổi tối và cuối tuần cũng vậy: ai đang trực ca Chăm sóc học viên thì gửi tài liệu và quyền truy cập."
    },
    { type: "heading", de: "Die sechs Aufgaben", vi: "Sáu nhóm công việc" },
    {
      type: "steps",
      items: [
        {
          de: "Teilnehmende nach der Anmeldung betreuen",
          vi: "Chăm sóc học viên sau khi đăng ký",
          body_de: "Begrüßen, in Klassengruppe, Zoom, Classroom und NaNu Go bringen; prüfen, dass Material, Stundenplan und Regeln angekommen sind; nach der ersten und zweiten Stunde nachfragen; Terminwechsel und Pausieren nach den Regeln klären; auf Unzufriedenheit achten. Technische Störungen (Zoom, Jotform, Drive voll) sofort intern melden.",
          body_vi: "Chào mừng, hướng dẫn vào nhóm lớp, Zoom, Classroom và NaNu Go; kiểm tra học viên đã nhận đủ tài liệu, lịch học và nội quy; hỏi thăm sau buổi 1 và buổi 2; hỗ trợ đổi lịch, bảo lưu theo quy định; để ý học viên có dấu hiệu không hài lòng. Lỗi kỹ thuật (Zoom, Jotform, Drive đầy) báo nội bộ ngay."
        },
        {
          de: "Lehrkräfte erinnern und begleiten",
          vi: "Nhắc nhở và theo dõi giáo viên",
          body_de: "Pünktlich, volle Unterrichtszeit, Anwesenheit und Fortschritt eingetragen, Unterrichtsdatei und Hausaufgabe in der Gruppe, Feedback zu den Teilnehmenden rechtzeitig ausgefüllt, Klassenfoto in den ersten zwei Stunden. Siehe „Lehrkräfte begleiten“.",
          body_vi: "Đúng giờ, dạy đủ thời lượng, cập nhật điểm danh và tiến độ, gửi bài giảng và bài tập vào nhóm, điền nhận xét học viên đúng hạn, chụp ảnh lớp trong hai buổi đầu. Xem trang „Theo dõi giáo viên“."
        },
        {
          de: "Qualität der Klassen prüfen",
          vi: "Kiểm soát chất lượng lớp học",
          body_de: "Läuft die Klasse nach Plan? Wer fehlt oft, wer hört auf? Welche Klasse droht Teilnehmende zu verlieren? Diese Klassen melden, bevor es zu spät ist.",
          body_vi: "Lớp có học đúng lịch không? Ai hay vắng, ai bỏ học? Lớp nào có nguy cơ mất học viên? Báo cáo các lớp này trước khi quá muộn."
        },
        {
          de: "Feedback sammeln und lösen",
          vi: "Thu thập và xử lý phản hồi",
          body_de: "Selbst nachfragen statt warten. Einordnen: Lehrkraft, Programm, Stundenplan, Räume. Nicht nur weiterleiten, sondern mit der Lehrkraft klären, das Ergebnis der Person bestätigen und ernste Beschwerden an die Leitung geben.",
          body_vi: "Chủ động hỏi thay vì chờ. Phân loại: giáo viên, chương trình, lịch học, cơ sở vật chất. Không chỉ chuyển tiếp tin nhắn mà trao đổi với giáo viên, xác nhận kết quả lại với học viên và chuyển quản lý các khiếu nại nghiêm trọng."
        },
        {
          de: "Den nächsten Kurs vorbereiten",
          vi: "Theo dõi chuyển khoá",
          body_de: "Wer bald mit A1, A2, B1 oder B2 fertig ist? Wunsch und passende Uhrzeit erfragen, mit Sales das Angebot abstimmen, vor Kursende an die Anmeldung erinnern und notieren, warum jemand nicht weitermacht.",
          body_vi: "Ai sắp xong A1, A2, B1, B2? Hỏi nguyện vọng và giờ học phù hợp, phối hợp với Sales tư vấn khoá tiếp theo, nhắc đăng ký trước khi hết khoá và ghi lại lý do học viên không học tiếp."
        },
        {
          de: "Berichten und verbessern",
          vi: "Báo cáo và cải tiến",
          body_de: "Wie viele lernen, pausieren, haben aufgehört? Welche Lehrkraft erledigt ihre Aufgaben? Was ist offen? Vorschläge machen, wie Betreuung und Unterricht besser werden.",
          body_vi: "Bao nhiêu học viên đang học, bảo lưu, đã nghỉ? Giáo viên nào hoàn thành nhiệm vụ? Việc gì còn tồn đọng? Đề xuất cách cải tiến chăm sóc và giảng dạy."
        }
      ]
    },
    { type: "heading", de: "Der Rhythmus", vi: "Lịch làm việc" },
    {
      type: "list",
      items: [
        {
          de: "Jeden Tag: Teilnehmenden antworten, Lehrkräfte erinnern, Probleme lösen. Am Ende des Tages prüfen, was erledigt ist, die Beobachtungsliste aktualisieren und das Backoffice ausfüllen.",
          vi: "Mỗi ngày: trả lời học viên, nhắc giáo viên, xử lý vấn đề phát sinh. Cuối ngày kiểm tra việc đã xong, cập nhật danh sách cần theo dõi và điền Backoffice."
        },
        {
          de: "Montag: Klassen mit vielen Fehlzeiten heraussuchen, Betreuungsliste bis 15 Uhr an die Leitung, bei Bedarf Meeting vor 16 Uhr. Den Lehrkräften die neue Woche ankündigen. In jeder Klassengruppe erinnern, was wir den Teilnehmenden bieten: Drive mit Büchern A1–B2, Classroom, NaNu Go, Handbuch.",
          vi: "Thứ Hai: lọc các lớp có học viên vắng nhiều, gửi danh sách cần chăm sóc cho quản lý trước 15h, cần thì họp trước 16h. Nhắc giáo viên về tuần mới. Nhắn vào từng nhóm lớp nhắc học viên trung tâm có những gì: Drive sách A1–B2, Classroom, NaNu Go, Handbuch."
        },
        {
          de: "Mittwoch: Feedback der Lehrkräfte und offene Fälle prüfen, Meeting mit der Leitung – Termin selbst schicken.",
          vi: "Thứ Tư: kiểm tra nhận xét của giáo viên và các vấn đề chưa xử lý xong, họp với quản lý – tự gửi lịch hẹn."
        },
        {
          de: "Freitag: Wochenbericht mit Lösungsvorschlägen.",
          vi: "Thứ Sáu: báo cáo tuần kèm đề xuất phương án xử lý."
        },
        {
          de: "Monatsende: Lehrkräfte bewerten, Abbruchquote und Weitermach-Quote berechnen.",
          vi: "Cuối tháng: đánh giá giáo viên, tỷ lệ nghỉ học, tỷ lệ học tiếp."
        }
      ]
    },
    { type: "heading", de: "KPIs – jeweils 100 %", vi: "KPI – đều phải đạt 100%" },
    {
      type: "list",
      ordered: true,
      items: [
        { de: "Jede neue Person ist vollständig eingewiesen.", vi: "Học viên mới được hướng dẫn đầy đủ." },
        { de: "Jede Person wird nach den ersten zwei Stunden gefragt, wie es läuft.", vi: "Học viên được hỏi thăm sau 2 buổi đầu." },
        { de: "Bei jeder Lehrkraft ist geprüft, ob das Feedback ausgefüllt ist.", vi: "Giáo viên được kiểm tra việc hoàn thành nhận xét." },
        { de: "Jede Beschwerde ist am selben Arbeitstag notiert und hat jemanden, der sie löst.", vi: "Phản ánh của học viên được ghi nhận và có người xử lý trong ngày làm việc." },
        { de: "Klassen, die Teilnehmende zu verlieren drohen, sind rechtzeitig gemeldet.", vi: "Lớp có nguy cơ mất học viên được báo cáo kịp thời." },
        {
          de: "Jeder Stufenwechsel einer Klasse ist gemeldet: an Sales einen Monat vorher, dann zwei Wochen und drei Arbeitstage vorher – jeweils mit einem Plan, was wir der Klasse schreiben. Den Plan vorher von der Leitung prüfen lassen.",
          vi: "Lớp sắp học lên trình độ mới phải được báo cáo đủ: báo Sales trước 1 tháng, rồi trước 2 tuần và trước 3 ngày làm việc – mỗi lần kèm kế hoạch nhắn gì cho lớp, hỏi han học viên thế nào. Gửi kế hoạch cho quản lý duyệt trước."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Gezählt wird nicht, wie viele Nachrichten du schickst, sondern wie viele Probleme du findest und löst, wie gut du dranbleibst und wie viele Teilnehmende dadurch weiterlernen.",
      vi: "Trung tâm không đánh giá số tin nhắn đã gửi, mà đánh giá số vấn đề được phát hiện và giải quyết, khả năng theo sát và số học viên được hỗ trợ để học tiếp."
    },
    { type: "heading", de: "So arbeiten wir im Team", vi: "Cách làm việc trong team" },
    {
      type: "list",
      items: [
        {
          de: "Aufgaben aus Zalo am selben Tag erledigen. Schaffst du es nicht, kommt die Aufgabe am Abend in Slack – mit Screenshot der Zalo-Nachricht.",
          vi: "Việc nhận trong Zalo phải làm xong trong ngày. Chưa kịp thì cuối ngày ghi vào Slack – kèm ảnh chụp tin nhắn Zalo."
        },
        {
          de: "Erledigt heißt: Das Ergebnis ist bei der Person angekommen. „Lehrkraft gefragt“ ist nicht erledigt – erst wenn die Lehrkraft geantwortet hat. Was die Leitung prüfen soll, ist erst erledigt, wenn sie es sagt.",
          vi: "Xong nghĩa là kết quả đã đến được học viên. „Đã hỏi giáo viên“ chưa phải là xong – giáo viên trả lời rồi mới xong. Việc cần quản lý duyệt thì chỉ xong khi quản lý xác nhận."
        },
        {
          de: "Abends gut dokumentieren: mindestens so, dass die Kolleg:innen bis zur nächsten Stunde der Klasse weiterarbeiten können.",
          vi: "Ca tối ghi chép thật kỹ: ít nhất đủ để đồng nghiệp xử lý tiếp trước buổi học tiếp theo của lớp."
        },
        {
          de: "Fragen auf Deutsch (z. B. von deutschen Angehörigen) als Text in Slack kopieren, nicht nur als Screenshot – dann kann die Antwort direkt geschrieben werden.",
          vi: "Câu hỏi bằng tiếng Đức (ví dụ của người nhà người Đức) thì copy nguyên văn vào Slack, đừng chỉ gửi ảnh – để người trả lời viết được ngay."
        },
        {
          de: "Den Namen der Person immer prüfen – gerade wenn Eltern für ihr Kind schreiben. Ein falscher Name wirkt, als wäre sie uns egal.",
          vi: "Luôn kiểm tra tên học viên – nhất là khi phụ huynh nhắn thay con. Gọi nhầm tên khiến khách thấy mình không quan tâm."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Bericht am Ende der Schicht",
      label_vi: "Mẫu · Báo cáo cuối ca",
      text: "Báo cáo công việc hôm nay\n1. Thời gian làm việc: từ … đến …\n2. Tư vấn khách hàng:\n- Số khách mới: …\n- Từng khách: họ tên + link Facebook/SĐT/Zalo (HN/SG) + nhu cầu\n- Ảnh chụp tin nhắn cuối cùng trên Messenger, Zalo, WhatsApp, TikTok\n3. Đã hoàn thành: story đã đăng chưa, các việc khác đã xử lý\n4. Chưa hoàn thành: việc gì, vì sao, ai cần theo dõi tiếp",
      translation_de: "„Bericht heute: 1. Arbeitszeit von … bis … 2. Beratung: Zahl der neuen Kontakte; je Kontakt Name + Facebook-Link/Telefon/Zalo (HN/SG) + Anliegen; Screenshot der letzten Nachricht in Messenger, Zalo, WhatsApp, TikTok. 3. Erledigt: Story gepostet? Andere Aufgaben. 4. Offen: was, warum, wer muss weitermachen.“"
    }
  ]
};

export default page;
