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
      de: "Sales gewinnt neue Schüler. Customer Success sorgt dafür, dass sie bleiben. Sobald eine Person bezahlt hat, ist nur noch Customer Success für sie da: Wir begrüßen sie, schicken das Material, beantworten ihre Fragen während des Kurses, sprechen mit den Lehrkräften und kümmern uns um den nächsten Kurs. So hat die Person immer dieselbe Ansprechstelle und bekommt keine widersprüchlichen Antworten.",
      vi: "Sales mang học viên về, đội Chăm sóc học viên giữ học viên ở lại. Từ lúc học viên đóng học phí, đội Chăm sóc học viên là đầu mối duy nhất: chào mừng, gửi tài liệu, giải đáp trong khoá học, làm việc với giáo viên và khoá tiếp theo. Nhờ vậy học viên không nhận ba câu trả lời khác nhau từ ba người."
    },
    {
      type: "callout",
      tone: "info",
      de: "So läuft die Übergabe von Sales: Nach der Anmeldung schreibt Sales der Person nicht mehr. Stattdessen meldet Sales die Person in Slack an Customer Success und schreibt dazu, was ihr versprochen wurde, zum Beispiel ein Sonderpreis, Ratenzahlung oder ein späterer Kursstart. Ab dann ist Customer Success zuständig. Das gilt auch abends und am Wochenende: Wer gerade Customer-Success-Schicht hat, schickt der Person Material und Zugänge.",
      vi: "Bàn giao từ Sales: sau khi học viên đăng ký, Sales không gửi gì thêm cho học viên mà báo lên Slack cho đội Chăm sóc học viên – kèm mọi điều đã hứa (giá ưu đãi riêng, chia đợt đóng, vào học trễ). Từ đó đội Chăm sóc học viên phụ trách. Buổi tối và cuối tuần cũng vậy: ai đang trực ca Chăm sóc học viên thì gửi tài liệu và quyền truy cập."
    },
    { type: "heading", de: "Die vier Aufgaben – und wann sie dran sind", vi: "Bốn nhóm công việc và lịch làm" },
    {
      type: "steps",
      items: [
        {
          de: "Neue Schüler betreuen",
          vi: "Chăm sóc học viên sau khi đăng ký",
          parts: [
            { de: "Nach jeder Zahlung", vi: "Sau mỗi lần đóng tiền", body_de: "Sobald Sales in Slack eine neue Zahlung meldet, fängt an, wer gerade Schicht hat – auch abends und am Wochenende. Begrüße die Person und hilf ihr in die Klassengruppe, in Zoom, Classroom und NaNu Go. Prüfe, ob sie Material, Stundenplan und Regeln bekommen hat. Frag nach der ersten und nach der zweiten Stunde, wie es läuft. Die genauen Schritte für die ersten 48 Stunden stehen auf der Seite „[Nach der Zahlung](student-support/nach-der-zahlung)“.", body_vi: "Ngay khi Sales báo trên Slack có học viên mới đóng tiền, ai đang trực ca thì bắt đầu – kể cả buổi tối và cuối tuần. Chào mừng, hướng dẫn vào nhóm lớp, Zoom, Classroom và NaNu Go; kiểm tra học viên đã nhận đủ tài liệu, lịch học và nội quy; hỏi thăm sau buổi 1 và buổi 2. Các bước cụ thể trong 48 giờ đầu xem trang „[Sau khi khách chuyển khoản](student-support/nach-der-zahlung)“." },
            {
              de: "Jeden Tag",
              vi: "Mỗi ngày",
              body_de: "Allen Schülern antworten. Wenn jemand den Termin wechseln oder pausieren will, klärst du das nach unseren Regeln. Achte darauf, ob jemand unzufrieden wirkt. Technische Probleme (Zoom, Jotform, Drive voll) meldest du sofort im Team. So gehst du beim Antworten vor:",
              body_vi: "Trả lời mọi học viên. Hỗ trợ đổi lịch, bảo lưu theo quy định; để ý học viên có dấu hiệu không hài lòng. Lỗi kỹ thuật (Zoom, Jotform, Drive đầy) báo nội bộ ngay. Cách trả lời:",
              steps: [
                { de: "Alle Kanäle durchgehen", vi: "Kiểm tra hết các kênh", body_de: "Lies die Klassengruppen und die Einzelchats in Zalo, WhatsApp und Messenger. Montags beantwortest du zuerst die Nachrichten vom Wochenende. Mehr dazu auf der Seite „[Ein Kanal pro Schüler](student-support/kanaele)“.", body_vi: "Nhóm lớp và tin nhắn riêng trên Zalo, WhatsApp và Messenger. Thứ Hai thì trả lời tin nhắn cuối tuần trước tiên. Xem trang „[Mỗi học viên một kênh](student-support/kanaele)“." },
                { de: "Am selben Tag antworten – im selben Kanal", vi: "Hỏi ở đâu trả lời ở đó – trong cùng ngày làm việc", body_de: "Antworte dort, wo die Person geschrieben hat. Schick sie nicht in einen anderen Kanal. Prüf vorher, ob du ihren Namen richtig schreibst.", body_vi: "Không bảo học viên chuyển sang kênh khác. Kiểm tra tên học viên trước khi trả lời." },
                { de: "Wenn du die Lehrkraft brauchst", vi: "Cần giáo viên: hỏi – và không để treo", body_de: "Frag die Lehrkraft. Wenn sie nicht antwortet, schickst du der Person die Datei oder die Antwort selbst und sagst der Lehrkraft Bescheid.", body_vi: "Giáo viên chưa trả lời thì mình tự gửi file hoặc câu trả lời cho học viên và báo lại giáo viên." },
                { de: "Wenn du die Leitung brauchst", vi: "Cần quản lý: báo lên Slack", body_de: "Schreib den Fall in Slack, mit allen wichtigen Infos. Sag der Person, dass du nachfragst. Versprich nichts, was die Leitung noch nicht bestätigt hat. Ernste Beschwerden gehen immer an die Leitung.", body_vi: "Kèm đủ thông tin. Nói với học viên là mình đang hỏi lại – không hứa điều gì quản lý chưa xác nhận. Khiếu nại nghiêm trọng luôn chuyển quản lý." },
                { de: "Wenn etwas heute nicht fertig wird", vi: "Việc chưa xong hôm nay: cuối ngày ghi vào Slack", body_de: "Schreib es am Abend in Slack, mit einem Screenshot der Nachricht. Beschreib es so, dass deine Kolleg:innen damit weitermachen können, bevor die Klasse wieder Unterricht hat. Trag es außerdem im Schichtbericht unter „Offen“ ein.", body_vi: "Kèm ảnh chụp tin nhắn và ghi đủ để đồng nghiệp xử lý tiếp trước buổi học tiếp theo của lớp. Ghi vào mục „Chưa hoàn thành“ trong báo cáo cuối ca." }
              ],
              done: {
                de: "am Ende deiner Schicht beides stimmt: 1) Jede Nachricht von Schülern hat eine Antwort. 2) Jedes Problem ist gelöst – die Person hat also ihre Antwort oder Datei bekommen. Oder es steht in Slack, mit Screenshot und mit dem Namen der Person, die sich weiter darum kümmert. Nur „Ich habe die Lehrkraft gefragt“ reicht nicht.",
                vi: "cuối ca đủ cả hai điều: 1) Không còn tin nhắn nào của học viên chưa được trả lời. 2) Mọi vấn đề đã được giải quyết – kết quả đã đến được học viên – hoặc đã ghi vào Slack kèm ảnh chụp và tên người xử lý tiếp. Chỉ „đã hỏi giáo viên“ thì chưa tính là xong."
              }
            },            { de: "Montags", vi: "Thứ Hai", body_de: "In jeder Klassengruppe daran erinnern, was die Schüler bei uns haben: Drive mit Büchern A1–B2, Classroom, NaNu Go und das Handbuch.", body_vi: "Nhắn vào từng nhóm lớp nhắc học viên trung tâm có những gì: Drive sách A1–B2, Classroom, NaNu Go, Handbuch." }
          ]
        },
        {
          de: "Klassen im Blick behalten",
          vi: "Kiểm soát chất lượng lớp học",
          body_de: "Schau, ob jede Klasse nach Plan läuft. Wer fehlt oft? Wer hat aufgehört? In welcher Klasse könnten Schüler abspringen? Solche Klassen meldest du der Leitung, bevor es zu spät ist.\nDazu gehört, die Lehrkräfte zu begleiten: Sie sollen pünktlich anfangen und die volle Zeit unterrichten. Sie tragen Anwesenheit und Fortschritt ein und schicken Unterrichtsdatei und Hausaufgabe in die Gruppe. Sie füllen das Feedback zu den Schülern rechtzeitig aus und machen in den ersten zwei Stunden ein Klassenfoto. Mehr dazu auf der Seite „[Lehrkräfte begleiten](student-support/lehrkraefte-begleiten)“.",
          body_vi: "Lớp có học đúng lịch không? Ai hay vắng, ai bỏ học? Lớp nào có nguy cơ mất học viên? Báo cáo các lớp này cho quản lý trước khi quá muộn.\nViệc này gồm cả theo dõi giáo viên: đúng giờ, dạy đủ thời lượng, cập nhật điểm danh và tiến độ, gửi bài giảng và bài tập vào nhóm, điền nhận xét học viên đúng hạn, chụp ảnh lớp trong hai buổi đầu. Xem trang „[Theo dõi giáo viên](student-support/lehrkraefte-begleiten)“.",
          parts: [
            {
              de: "Jeden Tag",
              vi: "Mỗi ngày",
              body_de: "Prüf die Klassen, die am Vortag Unterricht hatten:",
              body_vi: "Kiểm tra các lớp có buổi học hôm trước:",
              steps: [
                { de: "Klassen von gestern finden", vi: "Tìm các lớp học hôm qua", body_de: "Im Google Kalender siehst du, welche Klassen gestern Unterricht hatten.", body_vi: "Xem Google Calendar để biết hôm qua lớp nào có buổi học." },
                { de: "Excel-Listen prüfen", vi: "Kiểm tra file Excel", body_de: "Öffne die Excel-Liste jeder dieser Klassen. Prüf, ob die Lehrkraft die Stunde ausgefüllt hat: Anwesenheit und Feedback zu jedem Schüler. Fehlt etwas, erinnere die Lehrkraft daran – auch an Unterrichtsdatei und Hausaufgabe in der Gruppe.", body_vi: "Mở file Excel của từng lớp đó. Kiểm tra giáo viên đã điền buổi học chưa: điểm danh và nhận xét cho từng học viên. Thiếu gì thì nhắc giáo viên – cả việc gửi bài giảng và bài tập vào nhóm." },
                { de: "Wer gefehlt hat, persönlich anschreiben", vi: "Nhắn riêng cho học viên vắng", body_de: "Schreib jedem Schüler, der gefehlt hat, eine persönliche Nachricht.", body_vi: "Nhắn tin riêng cho từng học viên đã vắng buổi học." },
                { de: "In NaNu Go nachsehen", vi: "Kiểm tra trên NaNu Go", body_de: "Prüf in der App NaNu Go, ob der Schüler die Aufgaben gemacht hat. Wenn nicht: Sag ihm, dass er die verpasste Lektion in NaNu Go nachholen soll. Sonst kann er dem Unterricht nicht mehr folgen.", body_vi: "Kiểm tra trên app NaNu Go xem học viên đã làm bài chưa. Nếu chưa: nhắn học viên học bù bài đã nghỉ trên NaNu Go. Nếu không, học viên sẽ không theo kịp lớp." }
              ]
            },
            { de: "Montags", vi: "Thứ Hai", body_de: "Den Lehrkräften sagen, was in der neuen Woche ansteht.", body_vi: "Nhắc giáo viên về tuần mới." },
            { de: "Mittwochs", vi: "Thứ Tư", body_de: "Prüfen, ob alle Lehrkräfte das Feedback ausgefüllt haben.", body_vi: "Kiểm tra giáo viên đã điền nhận xét chưa." }
          ]
        },
        {
          de: "Den nächsten Kurs vorbereiten",
          vi: "Theo dõi chuyển khoá",
          body_de: "Schau, wer bald mit A1, A2, B1 oder B2 fertig ist. Frag, ob die Person weiterlernen möchte und welche Uhrzeit ihr passt. Stimm das Angebot mit Sales ab. Erinnere die Person vor Kursende daran, sich anzumelden. Wenn jemand nicht weitermacht, notiere den Grund.",
          body_vi: "Ai sắp xong A1, A2, B1, B2? Hỏi nguyện vọng và giờ học phù hợp, phối hợp với Sales tư vấn khoá tiếp theo, nhắc đăng ký trước khi hết khoá và ghi lại lý do học viên không học tiếp.",
          parts: [
            {
              de: "Vor Kursende",
              vi: "Trước khi hết khoá",
              body_de: "Bei jedem Kurs: Online-Klassen 6 Lektionen vor Kursende, Klassen vor Ort 2 Wochen vor Kursende.",
              body_vi: "Với mọi khoá: lớp online trước khi hết khoá 6 buổi, lớp offline trước khi hết khoá 2 tuần.",
              steps: [
                { de: "Wer noch nicht gezahlt hat, anschreiben", vi: "Nhắn học viên chưa đóng tiền", body_de: "Schreib jeden Schüler an, der für den nächsten Kurs noch nicht gezahlt hat.", body_vi: "Nhắn cho từng học viên chưa đóng tiền khoá tiếp theo." },
                { de: "Dranbleiben, bis eine klare Antwort kommt", vi: "Nhắn đến khi có câu trả lời rõ ràng", body_de: "Schreib so lange nach, bis die Person klar antwortet: „Ja, ich mache weiter“ oder „Nein, ich mache nicht weiter“.", body_vi: "Nhắn lại cho đến khi học viên trả lời rõ: „Có, mình học tiếp“ hoặc „Không, mình không học tiếp“." },
                { de: "Bei Nein: den Grund genau erfragen", vi: "Nếu không học tiếp: hỏi rõ lý do", body_de: "Frag genau nach, warum. „Keine Zeit“ reicht nicht: Liegt es am Preis, an der Uhrzeit, an der Lehrkraft, am Lernfortschritt oder an etwas anderem? Notiere den Grund.", body_vi: "Hỏi kỹ vì sao. „Không có thời gian“ là chưa đủ: do học phí, giờ học, giáo viên, tiến độ học hay lý do khác? Ghi lại lý do." }
              ]
            }
          ]
        },
        {
          de: "Berichten und verbessern",
          vi: "Báo cáo và cải tiến",
          body_de: "Halte fest, wie viele Schüler gerade lernen, pausieren oder aufgehört haben, welche Lehrkräfte ihre Aufgaben erledigen und was noch offen ist. Mach Vorschläge, wie Betreuung und Unterricht besser werden.",
          body_vi: "Bao nhiêu học viên đang học, bảo lưu, đã nghỉ? Giáo viên nào hoàn thành nhiệm vụ? Việc gì còn tồn đọng? Đề xuất cách cải tiến chăm sóc và giảng dạy.",
          parts: [
            { de: "Jeden Tag", vi: "Mỗi ngày", body_de: "Am Ende der Schicht prüfen, was erledigt ist, und das Backoffice ausfüllen.", body_vi: "Cuối ca kiểm tra việc đã xong và điền Backoffice." },
            { de: "Freitags", vi: "Thứ Sáu", body_de: "Den Wochenbericht schicken – mit Vorschlägen, wie wir die Probleme lösen.", body_vi: "Gửi báo cáo tuần kèm đề xuất phương án xử lý." },
            { de: "Am Monatsende", vi: "Cuối tháng", body_de: "Die Lehrkräfte bewerten und ausrechnen, wie viele aufgehört haben und wie viele den nächsten Kurs gebucht haben.", body_vi: "Đánh giá giáo viên, tính tỷ lệ nghỉ học và tỷ lệ học tiếp." }
          ]
        }
      ]
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
        { de: "Jede Klasse, in der Schüler abspringen könnten, wurde rechtzeitig gemeldet.", vi: "Lớp có nguy cơ mất học viên được báo cáo kịp thời." },
        {
          de: "Wenn eine Klasse in die nächste Stufe wechselt (z. B. von A1 nach A2), wurde Sales dreimal informiert: einen Monat vorher, zwei Wochen vorher und drei Arbeitstage vorher. Jedes Mal mit einem Plan, was wir der Klasse schreiben und wie wir bei den Schülern nachfragen. Diesen Plan prüft vorher die Leitung.",
          vi: "Lớp sắp học lên trình độ mới phải được báo cáo đủ: báo Sales trước 1 tháng, rồi trước 2 tuần và trước 3 ngày làm việc – mỗi lần kèm kế hoạch nhắn gì cho lớp, hỏi han học viên thế nào. Gửi kế hoạch cho quản lý duyệt trước."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Es zählt nicht, wie viele Nachrichten du schickst. Es zählt, wie viele Probleme du findest und löst, ob du bei offenen Fällen dranbleibst und wie viele Schüler deshalb weiterlernen.",
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
