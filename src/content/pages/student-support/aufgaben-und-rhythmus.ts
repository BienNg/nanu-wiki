import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "aufgaben-und-rhythmus",
  title_de: "Customer Success: Aufgaben, Wochenrhythmus & KPIs",
  title_vi: "Chăm sóc học viên: công việc, lịch tuần & KPI",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-01",
  body: [
    {
      type: "paragraph",
      de: "Sales gewinnt neue Teilnehmende. Customer Success sorgt dafür, dass sie bleiben. Sobald eine Person bezahlt hat, ist nur noch Customer Success für sie da: Wir begrüßen sie, schicken das Material, beantworten ihre Fragen während des Kurses, sprechen mit den Lehrkräften und kümmern uns um den nächsten Kurs. So hat die Person immer dieselbe Ansprechstelle und bekommt keine widersprüchlichen Antworten.",
      vi: "Sales mang học viên về, đội Chăm sóc học viên giữ học viên ở lại. Từ lúc học viên đóng học phí, đội Chăm sóc học viên là đầu mối duy nhất: chào mừng, gửi tài liệu, giải đáp trong khoá học, làm việc với giáo viên và khoá tiếp theo. Nhờ vậy học viên không nhận ba câu trả lời khác nhau từ ba người."
    },
    {
      type: "callout",
      tone: "info",
      de: "So läuft die Übergabe von Sales: Nach der Anmeldung schreibt Sales der Person nicht mehr. Stattdessen meldet Sales die Person in Slack an Customer Success und schreibt dazu, was ihr versprochen wurde, zum Beispiel ein Sonderpreis, Ratenzahlung oder ein späterer Kursstart. Ab dann ist Customer Success zuständig. Das gilt auch abends und am Wochenende: Wer gerade Customer-Success-Schicht hat, schickt der Person Material und Zugänge.",
      vi: "Bàn giao từ Sales: sau khi học viên đăng ký, Sales không gửi gì thêm cho học viên mà báo lên Slack cho đội Chăm sóc học viên – kèm mọi điều đã hứa (giá ưu đãi riêng, chia đợt đóng, vào học trễ). Từ đó đội Chăm sóc học viên phụ trách. Buổi tối và cuối tuần cũng vậy: ai đang trực ca Chăm sóc học viên thì gửi tài liệu và quyền truy cập."
    },
    { type: "heading", de: "Die sechs Aufgaben – und wann sie dran sind", vi: "Sáu nhóm công việc và lịch làm" },
    {
      type: "steps",
      items: [
        {
          de: "Neue Teilnehmende betreuen",
          vi: "Chăm sóc học viên sau khi đăng ký",
          body_de: "Begrüße die Person und hilf ihr in die Klassengruppe, in Zoom, Classroom und NaNu Go. Prüfe, ob sie Material, Stundenplan und Regeln bekommen hat. Frag nach der ersten und nach der zweiten Stunde, wie es läuft. Wenn sie den Termin wechseln oder pausieren will, klärst du das nach unseren Regeln. Achte darauf, ob jemand unzufrieden wirkt. Technische Probleme (Zoom, Jotform, Drive voll) meldest du sofort im Team.\nJeden Tag: Allen Teilnehmenden antworten – wie genau, steht weiter unten.\nMontags: In jeder Klassengruppe daran erinnern, was die Teilnehmenden bei uns haben: Drive mit Büchern A1–B2, Classroom, NaNu Go und das Handbuch.",
          body_vi: "Chào mừng, hướng dẫn vào nhóm lớp, Zoom, Classroom và NaNu Go; kiểm tra học viên đã nhận đủ tài liệu, lịch học và nội quy; hỏi thăm sau buổi 1 và buổi 2; hỗ trợ đổi lịch, bảo lưu theo quy định; để ý học viên có dấu hiệu không hài lòng. Lỗi kỹ thuật (Zoom, Jotform, Drive đầy) báo nội bộ ngay.\nMỗi ngày: trả lời mọi học viên – cách làm xem bên dưới.\nThứ Hai: nhắn vào từng nhóm lớp nhắc học viên trung tâm có những gì: Drive sách A1–B2, Classroom, NaNu Go, Handbuch.",
          when: [{ de: "Täglich", vi: "Hằng ngày" }, { de: "Montag", vi: "Thứ Hai" }]
        },
        {
          de: "Lehrkräfte erinnern und begleiten",
          vi: "Nhắc nhở và theo dõi giáo viên",
          body_de: "Die Lehrkräfte sollen pünktlich anfangen und die volle Zeit unterrichten. Sie tragen Anwesenheit und Fortschritt ein und schicken Unterrichtsdatei und Hausaufgabe in die Gruppe. Sie füllen das Feedback zu den Teilnehmenden rechtzeitig aus und machen in den ersten zwei Stunden ein Klassenfoto. Mehr dazu auf der Seite „Lehrkräfte begleiten“.\nJeden Tag: Die Lehrkräfte an diese Punkte erinnern.\nMontags: Den Lehrkräften sagen, was in der neuen Woche ansteht.\nMittwochs: Prüfen, ob alle Lehrkräfte das Feedback ausgefüllt haben.",
          body_vi: "Đúng giờ, dạy đủ thời lượng, cập nhật điểm danh và tiến độ, gửi bài giảng và bài tập vào nhóm, điền nhận xét học viên đúng hạn, chụp ảnh lớp trong hai buổi đầu. Xem trang „Theo dõi giáo viên“.\nMỗi ngày: nhắc giáo viên những việc này.\nThứ Hai: nhắc giáo viên về tuần mới.\nThứ Tư: kiểm tra giáo viên đã điền nhận xét chưa.",
          when: [{ de: "Täglich", vi: "Hằng ngày" }, { de: "Montag", vi: "Thứ Hai" }, { de: "Mittwoch", vi: "Thứ Tư" }]
        },
        {
          de: "Klassen im Blick behalten",
          vi: "Kiểm soát chất lượng lớp học",
          body_de: "Schau, ob jede Klasse nach Plan läuft. Wer fehlt oft? Wer hat aufgehört? In welcher Klasse könnten Teilnehmende abspringen? Solche Klassen meldest du der Leitung, bevor es zu spät ist.\nJeden Tag: Am Ende der Schicht die Beobachtungsliste aktualisieren – das ist die Liste der Teilnehmenden und Klassen, die wir gerade besonders im Blick haben.\nMontags: Die Klassen heraussuchen, in denen viele fehlen. Bis 15 Uhr die Betreuungsliste an die Leitung schicken. Wenn nötig, vor 16 Uhr ein Meeting machen.",
          body_vi: "Lớp có học đúng lịch không? Ai hay vắng, ai bỏ học? Lớp nào có nguy cơ mất học viên? Báo cáo các lớp này cho quản lý trước khi quá muộn.\nMỗi ngày: cuối ca cập nhật danh sách cần theo dõi.\nThứ Hai: lọc các lớp có học viên vắng nhiều, gửi danh sách cần chăm sóc cho quản lý trước 15h, cần thì họp trước 16h.",
          when: [{ de: "Täglich", vi: "Hằng ngày" }, { de: "Montag", vi: "Thứ Hai" }]
        },
        {
          de: "Probleme und Beschwerden lösen",
          vi: "Thu thập và xử lý phản hồi",
          body_de: "Frag die Teilnehmenden selbst, wie es ihnen geht – warte nicht, bis sie sich beschweren. Ordne jedes Problem ein: Geht es um die Lehrkraft, das Programm, den Stundenplan oder die Räume? Leite es nicht nur weiter: Kläre es mit der Lehrkraft und sag der Person, was dabei herausgekommen ist. Ernste Beschwerden gibst du an die Leitung.\nJeden Tag: Neue Probleme am selben Tag angehen.\nMittwochs: Alle offenen Fälle durchgehen und mit der Leitung besprechen. Den Termin für dieses Meeting schickst du selbst.",
          body_vi: "Chủ động hỏi thay vì chờ. Phân loại: giáo viên, chương trình, lịch học, cơ sở vật chất. Không chỉ chuyển tiếp tin nhắn mà trao đổi với giáo viên, xác nhận kết quả lại với học viên và chuyển quản lý các khiếu nại nghiêm trọng.\nMỗi ngày: xử lý vấn đề phát sinh ngay trong ngày.\nThứ Tư: kiểm tra các vấn đề chưa xử lý xong và họp với quản lý – tự gửi lịch hẹn.",
          when: [{ de: "Täglich", vi: "Hằng ngày" }, { de: "Mittwoch", vi: "Thứ Tư" }]
        },
        {
          de: "Den nächsten Kurs vorbereiten",
          vi: "Theo dõi chuyển khoá",
          body_de: "Schau, wer bald mit A1, A2, B1 oder B2 fertig ist. Frag, ob die Person weiterlernen möchte und welche Uhrzeit ihr passt. Stimm das Angebot mit Sales ab. Erinnere die Person vor Kursende daran, sich anzumelden. Wenn jemand nicht weitermacht, notiere den Grund.",
          body_vi: "Ai sắp xong A1, A2, B1, B2? Hỏi nguyện vọng và giờ học phù hợp, phối hợp với Sales tư vấn khoá tiếp theo, nhắc đăng ký trước khi hết khoá và ghi lại lý do học viên không học tiếp.",
          when: [{ de: "Vor Kursende", vi: "Trước khi hết khoá" }]
        },
        {
          de: "Berichten und verbessern",
          vi: "Báo cáo và cải tiến",
          body_de: "Halte fest, wie viele Teilnehmende gerade lernen, pausieren oder aufgehört haben, welche Lehrkräfte ihre Aufgaben erledigen und was noch offen ist. Mach Vorschläge, wie Betreuung und Unterricht besser werden.\nJeden Tag: Am Ende der Schicht prüfen, was erledigt ist, und das Backoffice ausfüllen.\nFreitags: Den Wochenbericht schicken – mit Vorschlägen, wie wir die Probleme lösen.\nAm Monatsende: Die Lehrkräfte bewerten und ausrechnen, wie viele aufgehört haben und wie viele den nächsten Kurs gebucht haben.",
          body_vi: "Bao nhiêu học viên đang học, bảo lưu, đã nghỉ? Giáo viên nào hoàn thành nhiệm vụ? Việc gì còn tồn đọng? Đề xuất cách cải tiến chăm sóc và giảng dạy.\nMỗi ngày: cuối ca kiểm tra việc đã xong và điền Backoffice.\nThứ Sáu: gửi báo cáo tuần kèm đề xuất phương án xử lý.\nCuối tháng: đánh giá giáo viên, tính tỷ lệ nghỉ học và tỷ lệ học tiếp.",
          when: [{ de: "Täglich", vi: "Hằng ngày" }, { de: "Freitag", vi: "Thứ Sáu" }, { de: "Monatsende", vi: "Cuối tháng" }]
        }
      ]
    },
    { type: "heading", de: "Jeden Tag: allen Teilnehmenden antworten", vi: "Mỗi ngày: trả lời mọi học viên" },
    {
      type: "steps",
      items: [
        {
          de: "Alle Kanäle durchgehen",
          vi: "Kiểm tra hết các kênh",
          body_de: "Lies die Klassengruppen und die Einzelchats in Zalo, WhatsApp und Messenger. Montags beantwortest du zuerst die Nachrichten vom Wochenende. Mehr dazu auf der Seite „Ein Kanal pro Teilnehmende“.",
          body_vi: "Nhóm lớp và tin nhắn riêng trên Zalo, WhatsApp và Messenger. Thứ Hai thì trả lời tin nhắn cuối tuần trước tiên. Xem trang „Mỗi học viên một kênh“."
        },
        {
          de: "Am selben Tag antworten – im selben Kanal",
          vi: "Hỏi ở đâu trả lời ở đó – trong cùng ngày làm việc",
          body_de: "Antworte dort, wo die Person geschrieben hat. Schick sie nicht in einen anderen Kanal. Prüf vorher, ob du ihren Namen richtig schreibst.",
          body_vi: "Không bảo học viên chuyển sang kênh khác. Kiểm tra tên học viên trước khi trả lời."
        },
        {
          de: "Wenn du die Lehrkraft brauchst",
          vi: "Cần giáo viên: hỏi – và không để treo",
          body_de: "Frag die Lehrkraft. Wenn sie nicht antwortet, schickst du der Person die Datei oder die Antwort selbst und sagst der Lehrkraft Bescheid.",
          body_vi: "Giáo viên chưa trả lời thì mình tự gửi file hoặc câu trả lời cho học viên và báo lại giáo viên."
        },
        {
          de: "Wenn du die Leitung brauchst",
          vi: "Cần quản lý: báo lên Slack",
          body_de: "Schreib den Fall in Slack, mit allen wichtigen Infos. Sag der Person, dass du nachfragst. Versprich nichts, was die Leitung noch nicht bestätigt hat. Ernste Beschwerden gehen immer an die Leitung.",
          body_vi: "Kèm đủ thông tin. Nói với học viên là mình đang hỏi lại – không hứa điều gì quản lý chưa xác nhận. Khiếu nại nghiêm trọng luôn chuyển quản lý."
        },
        {
          de: "Wenn etwas heute nicht fertig wird",
          vi: "Việc chưa xong hôm nay: cuối ngày ghi vào Slack",
          body_de: "Schreib es am Abend in Slack, mit einem Screenshot der Nachricht. Beschreib es so, dass deine Kolleg:innen damit weitermachen können, bevor die Klasse wieder Unterricht hat. Trag es außerdem im Schichtbericht unter „Offen“ ein.",
          body_vi: "Kèm ảnh chụp tin nhắn và ghi đủ để đồng nghiệp xử lý tiếp trước buổi học tiếp theo của lớp. Ghi vào mục „Chưa hoàn thành“ trong báo cáo cuối ca."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Du kannst die Aufgabe abhaken, wenn am Ende deiner Schicht beides stimmt: 1) Jede Nachricht von Teilnehmenden hat eine Antwort. 2) Jedes Problem ist gelöst – die Person hat also ihre Antwort oder Datei bekommen. Oder es steht in Slack, mit Screenshot und mit dem Namen der Person, die sich weiter darum kümmert. Nur „Ich habe die Lehrkraft gefragt“ reicht nicht.",
      vi: "Đánh dấu xong khi cuối ca đủ cả hai điều: 1) Không còn tin nhắn nào của học viên chưa được trả lời. 2) Mọi vấn đề đã được giải quyết – kết quả đã đến được học viên – hoặc đã ghi vào Slack kèm ảnh chụp và tên người xử lý tiếp. Chỉ „đã hỏi giáo viên“ thì chưa tính là xong."
    },
    { type: "heading", de: "KPIs – Ziel ist jeweils 100 %", vi: "KPI – đều phải đạt 100%" },
    {
      type: "list",
      ordered: true,
      items: [
        { de: "Jede neue Person hat alles erklärt bekommen.", vi: "Học viên mới được hướng dẫn đầy đủ." },
        { de: "Jede neue Person wurde nach der ersten und zweiten Stunde gefragt, wie es läuft.", vi: "Học viên được hỏi thăm sau 2 buổi đầu." },
        { de: "Bei jeder Lehrkraft wurde geprüft, ob sie das Feedback ausgefüllt hat.", vi: "Giáo viên được kiểm tra việc hoàn thành nhận xét." },
        { de: "Jede Beschwerde wurde am selben Arbeitstag notiert, und jemand ist dafür zuständig, sie zu lösen.", vi: "Phản ánh của học viên được ghi nhận và có người xử lý trong ngày làm việc." },
        { de: "Jede Klasse, in der Teilnehmende abspringen könnten, wurde rechtzeitig gemeldet.", vi: "Lớp có nguy cơ mất học viên được báo cáo kịp thời." },
        {
          de: "Wenn eine Klasse in die nächste Stufe wechselt (z. B. von A1 nach A2), wurde Sales dreimal informiert: einen Monat vorher, zwei Wochen vorher und drei Arbeitstage vorher. Jedes Mal mit einem Plan, was wir der Klasse schreiben und wie wir bei den Teilnehmenden nachfragen. Diesen Plan prüft vorher die Leitung.",
          vi: "Lớp sắp học lên trình độ mới phải được báo cáo đủ: báo Sales trước 1 tháng, rồi trước 2 tuần và trước 3 ngày làm việc – mỗi lần kèm kế hoạch nhắn gì cho lớp, hỏi han học viên thế nào. Gửi kế hoạch cho quản lý duyệt trước."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Es zählt nicht, wie viele Nachrichten du schickst. Es zählt, wie viele Probleme du findest und löst, ob du bei offenen Fällen dranbleibst und wie viele Teilnehmende deshalb weiterlernen.",
      vi: "Trung tâm không đánh giá số tin nhắn đã gửi, mà đánh giá số vấn đề được phát hiện và giải quyết, khả năng theo sát và số học viên được hỗ trợ để học tiếp."
    },
    { type: "heading", de: "So arbeiten wir im Team", vi: "Cách làm việc trong team" },
    {
      type: "list",
      items: [
        {
          de: "Aufgaben, die du in Zalo bekommst, erledigst du am selben Tag. Wenn du es nicht schaffst, schreibst du die Aufgabe am Abend in Slack – mit einem Screenshot der Zalo-Nachricht.",
          vi: "Việc nhận trong Zalo phải làm xong trong ngày. Chưa kịp thì cuối ngày ghi vào Slack – kèm ảnh chụp tin nhắn Zalo."
        },
        {
          de: "Erledigt ist etwas erst, wenn die Person das Ergebnis bekommen hat. „Ich habe die Lehrkraft gefragt“ ist noch nicht erledigt – erst, wenn die Lehrkraft geantwortet hat. Wenn die Leitung etwas prüfen soll, ist es erst erledigt, wenn sie es bestätigt hat.",
          vi: "Xong nghĩa là kết quả đã đến được học viên. „Đã hỏi giáo viên“ chưa phải là xong – giáo viên trả lời rồi mới xong. Việc cần quản lý duyệt thì chỉ xong khi quản lý xác nhận."
        },
        {
          de: "In der Abendschicht schreibst du alles so genau auf, dass deine Kolleg:innen weitermachen können, bevor die Klasse wieder Unterricht hat.",
          vi: "Ca tối ghi chép thật kỹ: ít nhất đủ để đồng nghiệp xử lý tiếp trước buổi học tiếp theo của lớp."
        },
        {
          de: "Kommt eine Frage auf Deutsch (z. B. von deutschen Angehörigen), kopierst du den Text in Slack – nicht nur einen Screenshot. Dann kann jemand die Antwort direkt schreiben.",
          vi: "Câu hỏi bằng tiếng Đức (ví dụ của người nhà người Đức) thì copy nguyên văn vào Slack, đừng chỉ gửi ảnh – để người trả lời viết được ngay."
        },
        {
          de: "Prüf immer den Namen der Person – vor allem, wenn Eltern für ihr Kind schreiben. Wer mit falschem Namen angesprochen wird, hat das Gefühl, dass er uns egal ist.",
          vi: "Luôn kiểm tra tên học viên – nhất là khi phụ huynh nhắn thay con. Gọi nhầm tên khiến khách thấy mình không quan tâm."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Bericht am Ende der Schicht",
      label_vi: "Mẫu · Báo cáo cuối ca",
      text: "Báo cáo công việc hôm nay\n1. Thời gian làm việc: từ … đến …\n2. Tư vấn khách hàng:\n- Số khách mới: …\n- Từng khách: họ tên + link Facebook/SĐT/Zalo (HN/SG) + nhu cầu\n- Ảnh chụp tin nhắn cuối cùng trên Messenger, Zalo, WhatsApp, TikTok\n3. Đã hoàn thành: story đã đăng chưa, các việc khác đã xử lý\n4. Chưa hoàn thành: việc gì, vì sao, ai cần theo dõi tiếp",
      translation_de: "„Bericht von heute: 1. Arbeitszeit: von … bis … 2. Beratung: Wie viele neue Kontakte? Für jeden Kontakt: Name, Facebook-Link, Telefon oder Zalo (HN/SG) und was die Person möchte. Dazu ein Screenshot der letzten Nachricht in Messenger, Zalo, WhatsApp und TikTok. 3. Erledigt: Ist die Story gepostet? Was hast du sonst erledigt? 4. Offen: Was ist offen, warum, und wer muss weitermachen?“"
    }
  ]
};

export default page;
