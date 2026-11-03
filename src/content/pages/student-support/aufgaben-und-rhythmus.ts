import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "aufgaben-und-rhythmus",
  title_de: "Customer Success: Aufgaben, Wochenrhythmus & KPIs",
  title_vi: "Chăm sóc học viên: công việc, lịch tuần & KPI",
  kind: "process",
  section: "handbook",
  verified_until: "2027-05-01",
  updated_at: "2026-11-03",
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
          de: "Neue und aktuelle Schüler betreuen",
          anchor: "schueler-betreuen",
          vi: "Chăm sóc học viên mới và học viên đang học",
          parts: [
            { de: "Nach jeder Zahlung", anchor: "nach-jeder-zahlung", vi: "Sau mỗi lần đóng tiền", body_de: "Sobald Sales in Slack eine neue Zahlung meldet, fängt an, wer gerade Schicht hat – auch abends und am Wochenende. Begrüße die Person und hilf ihr in die Klassengruppe, in Zoom, Classroom und NaNu Go. Prüfe, ob sie Material, Stundenplan und Regeln bekommen hat. Frag nach der ersten und nach der zweiten Stunde, wie es läuft. Die genauen Schritte für die ersten 48 Stunden stehen auf der Seite „[Nach der Zahlung](student-support/nach-der-zahlung)“.", body_vi: "Ngay khi Sales báo trên Slack có học viên mới đóng tiền, ai đang trực ca thì bắt đầu – kể cả buổi tối và cuối tuần. Chào mừng, hướng dẫn vào nhóm lớp, Zoom, Classroom và NaNu Go; kiểm tra học viên đã nhận đủ tài liệu, lịch học và nội quy; hỏi thăm sau buổi 1 và buổi 2. Các bước cụ thể trong 48 giờ đầu xem trang „[Sau khi khách chuyển khoản](student-support/nach-der-zahlung)“." },
            {
              de: "Jeden Tag",
              anchor: "allen-antworten",
              vi: "Mỗi ngày",
              body_de: "Allen Schülern antworten. Wenn jemand den Termin wechseln oder pausieren will, klärst du das nach unseren Regeln. Achte darauf, ob jemand unzufrieden wirkt. Technische Probleme (Zoom, Jotform, Drive voll) meldest du sofort im Team. So gehst du beim Antworten vor:",
              body_vi: "Trả lời mọi học viên. Hỗ trợ đổi lịch, bảo lưu theo quy định; để ý học viên có dấu hiệu không hài lòng. Lỗi kỹ thuật (Zoom, Jotform, Drive đầy) báo nội bộ ngay. Cách trả lời:",
              steps: [
                { de: "Alle Kanäle durchgehen", vi: "Kiểm tra hết các kênh", body_de: "Lies die Klassengruppen und die Einzelchats in Zalo, WhatsApp und Messenger. Montags beantwortest du zuerst die Nachrichten vom Wochenende.", body_vi: "Nhóm lớp và tin nhắn riêng trên Zalo, WhatsApp và Messenger. Thứ Hai thì trả lời tin nhắn cuối tuần trước tiên." },
                { de: "Am selben Tag antworten – im selben Kanal", vi: "Hỏi ở đâu trả lời ở đó – trong cùng ngày làm việc", body_de: "Antworte dort, wo die Person geschrieben hat. Schick sie nicht in einen anderen Kanal.", body_vi: "Không bảo học viên chuyển sang kênh khác." },
                { de: "Wenn du die Lehrkraft brauchst", vi: "Cần giáo viên: hỏi – và không để treo", body_de: "Frag die Lehrkraft. Wenn sie nicht antwortet, schickst du der Person die Datei oder die Antwort selbst und sagst der Lehrkraft Bescheid.", body_vi: "Giáo viên chưa trả lời thì mình tự gửi file hoặc câu trả lời cho học viên và báo lại giáo viên." },
                { de: "Wenn du die Leitung brauchst", vi: "Cần quản lý: báo lên Slack", body_de: "Schreib den Fall in Slack, mit allen wichtigen Infos. Sag der Person, dass du nachfragst. Versprich nichts, was die Leitung noch nicht bestätigt hat. Ernste Beschwerden gehen immer an die Leitung.", body_vi: "Kèm đủ thông tin. Nói với học viên là mình đang hỏi lại – không hứa điều gì quản lý chưa xác nhận. Khiếu nại nghiêm trọng luôn chuyển quản lý." },
                { de: "Wenn etwas heute nicht fertig wird", vi: "Việc chưa xong hôm nay: cuối ngày ghi vào Slack", body_de: "Schreib es am Abend in Slack, mit einem Screenshot der Nachricht. Beschreib es so, dass deine Kolleg:innen damit weitermachen können, bevor die Klasse wieder Unterricht hat. Trag es außerdem im Schichtbericht unter „Offen“ ein.", body_vi: "Kèm ảnh chụp tin nhắn và ghi đủ để đồng nghiệp xử lý tiếp trước buổi học tiếp theo của lớp. Ghi vào mục „Chưa hoàn thành“ trong báo cáo cuối ca." }
              ],
              done: {
                de: "am Ende deiner Schicht beides stimmt:\n1) Jede Nachricht von Schülern hat eine Antwort.\n2) Jedes Problem ist gelöst – die Person hat also ihre Antwort oder Datei bekommen. Oder es steht in Slack, mit Screenshot und mit dem Namen der Person, die sich weiter darum kümmert.\nNur „Ich habe die Lehrkraft gefragt“ reicht nicht.",
                vi: "cuối ca đủ cả hai điều:\n1) Không còn tin nhắn nào của học viên chưa được trả lời.\n2) Mọi vấn đề đã được giải quyết – kết quả đã đến được học viên – hoặc đã ghi vào Slack kèm ảnh chụp và tên người xử lý tiếp.\nChỉ „đã hỏi giáo viên“ thì chưa tính là xong."
              }
            },
            {
              de: "Montags",
              anchor: "klassengruppen-montags",
              vi: "Thứ Hai",
              body_de: "Schick das Leaderboard der letzten Woche in jede Klassengruppe:",
              body_vi: "Gửi bảng xếp hạng (Leaderboard) của tuần trước vào từng nhóm lớp:",
              steps: [
                { de: "Class League öffnen", vi: "Mở trang Class League", body_de: "Geh auf [nanugo.app/admin/class-league](https://nanugo.app/admin/class-league).", body_vi: "Vào [nanugo.app/admin/class-league](https://nanugo.app/admin/class-league)." },
                { de: "Main Group Post in jede Klasse senden", vi: "Gửi Main Group Post vào mọi lớp", body_de: "Kopier bei „Main Group Post“ den Text und das Bild. Schick beides in jede Klassengruppe.", body_vi: "Ở mục „Main Group Post“, copy chữ và ảnh. Gửi cả hai vào từng nhóm lớp.", image: { src: "/student-support/class-league-main-group-post.webp", alt_de: "Class League: rechts der Bereich „Main group post“ mit den Knöpfen „Chép ảnh“ (Bild kopieren) und „Chép tin nhóm chung“ (Text kopieren)", alt_vi: "Class League: bên phải là mục „Main group post“ với nút „Chép ảnh“ và „Chép tin nhóm chung“" } },
                { de: "Klassen-Post in die passende Klasse senden", vi: "Gửi bài riêng của từng lớp", body_de: "Weiter unten steht jede Klasse einzeln. Kopier dort den Text und das Bild der Klasse. Schick beides nur in diese Klassengruppe.", body_vi: "Bên dưới có từng lớp riêng. Copy chữ và ảnh của lớp đó và gửi vào đúng nhóm lớp đó.", image: { src: "/student-support/class-league-klassen-post.webp", alt_de: "Class League: Tabelle „Class champions“ mit jeder Klasse in einer Zeile und rechts den Knöpfen „Chép ảnh“ (Bild kopieren) und „Chép tin lớp“ (Text der Klasse kopieren)", alt_vi: "Class League: bảng „Class champions“, mỗi lớp một dòng, bên phải có nút „Chép ảnh“ và „Chép tin lớp“" } },
                { de: "Vor dem Senden alles prüfen", vi: "Kiểm tra kỹ trước khi gửi", body_de: "Lies jeden Text, bevor du ihn sendest: Stimmt er? Passt das Bild, und gehört es zu dieser Klasse? Schick nie eine Nachricht, ohne vorher hinzuschauen.", body_vi: "Đọc lại từng tin trước khi gửi: nội dung có đúng không? Ảnh có đúng và đúng lớp không? Không bao giờ gửi tin mà chưa xem lại." }
              ]
            }
          ]
        },
        {
          de: "Klassen im Blick behalten",
          anchor: "klassen-im-blick",
          vi: "Kiểm soát chất lượng lớp học",
          body_de: "Schau, ob jede Klasse nach Plan läuft. Wer fehlt oft? Wer hat aufgehört? In welcher Klasse könnten Schüler abspringen? Solche Klassen meldest du der Leitung, bevor es zu spät ist.\nDazu gehört, die Lehrkräfte zu begleiten: Sie sollen pünktlich anfangen und die volle Zeit unterrichten. Sie tragen Anwesenheit und Fortschritt ein und schicken Unterrichtsdatei und Hausaufgabe in die Gruppe. Sie füllen das Feedback zu den Schülern rechtzeitig aus und machen in den ersten zwei Stunden ein Klassenfoto. Mehr dazu auf der Seite „[Lehrkräfte begleiten](student-support/lehrkraefte-begleiten)“.",
          body_vi: "Lớp có học đúng lịch không? Ai hay vắng, ai bỏ học? Lớp nào có nguy cơ mất học viên? Báo cáo các lớp này cho quản lý trước khi quá muộn.\nViệc này gồm cả theo dõi giáo viên: đúng giờ, dạy đủ thời lượng, cập nhật điểm danh và tiến độ, gửi bài giảng và bài tập vào nhóm, điền nhận xét học viên đúng hạn, chụp ảnh lớp trong hai buổi đầu. Xem trang „[Theo dõi giáo viên](student-support/lehrkraefte-begleiten)“.",
          parts: [
            {
              de: "Jeden Tag",
              anchor: "klassen-vortag",
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
            { de: "Montags", anchor: "lehrkraefte-montags", vi: "Thứ Hai", body_de: "Den Lehrkräften sagen, was in der neuen Woche ansteht.", body_vi: "Nhắc giáo viên về tuần mới." },
            { de: "Mittwochs", anchor: "feedback-mittwochs", vi: "Thứ Tư", body_de: "Prüfen, ob alle Lehrkräfte das Feedback ausgefüllt haben.", body_vi: "Kiểm tra giáo viên đã điền nhận xét chưa." }
          ]
        },
        {
          de: "Den nächsten Kurs vorbereiten",
          anchor: "naechster-kurs",
          vi: "Theo dõi chuyển khoá",
          body_de: "Schau, wer bald mit A1, A2, B1 oder B2 fertig ist. Frag, ob die Person weiterlernen möchte und welche Uhrzeit ihr passt. Stimm das Angebot mit Sales ab. Erinnere die Person vor Kursende daran, sich anzumelden. Wenn jemand nicht weitermacht, notiere den Grund.",
          body_vi: "Ai sắp xong A1, A2, B1, B2? Hỏi nguyện vọng và giờ học phù hợp, phối hợp với Sales tư vấn khoá tiếp theo, nhắc đăng ký trước khi hết khoá và ghi lại lý do học viên không học tiếp.",
          parts: [
            {
              de: "Vor Kursende",
              anchor: "vor-kursende",
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
          anchor: "berichten",
          vi: "Báo cáo và cải tiến",
          body_de: "Halte fest, wie viele Schüler gerade lernen, pausieren oder aufgehört haben, welche Lehrkräfte ihre Aufgaben erledigen und was noch offen ist. Mach Vorschläge, wie Betreuung und Unterricht besser werden.",
          body_vi: "Bao nhiêu học viên đang học, bảo lưu, đã nghỉ? Giáo viên nào hoàn thành nhiệm vụ? Việc gì còn tồn đọng? Đề xuất cách cải tiến chăm sóc và giảng dạy.",
          parts: [
            { de: "Jeden Tag", anchor: "bericht-schicht", vi: "Mỗi ngày", body_de: "Am Ende der Schicht prüfen, was erledigt ist, und das Backoffice ausfüllen.", body_vi: "Cuối ca kiểm tra việc đã xong và điền Backoffice." },
            { de: "Freitags", anchor: "wochenbericht", vi: "Thứ Sáu", body_de: "Den Wochenbericht schicken – mit Vorschlägen, wie wir die Probleme lösen.", body_vi: "Gửi báo cáo tuần kèm đề xuất phương án xử lý." },
            { de: "Am Monatsende", anchor: "monatsende", vi: "Cuối tháng", body_de: "Die Lehrkräfte bewerten und ausrechnen, wie viele aufgehört haben und wie viele den nächsten Kurs gebucht haben.", body_vi: "Đánh giá giáo viên, tính tỷ lệ nghỉ học và tỷ lệ học tiếp." }
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
          de: "Was in Slack steht, geht nicht verloren: Jede Aufgabe bekommt eine Rückmeldung, wenn sie erledigt ist. Ohne Rückmeldung ist sie nicht erledigt. Was du heute nicht schaffst, schiebst du auf den nächsten Tag – die Leitung erinnert nicht noch einmal.",
          vi: "Việc gì đã ghi trên Slack thì không được quên: làm xong phải báo lại. Chưa báo lại là chưa xong. Hôm nay chưa xong thì chuyển sang ngày tiếp theo – quản lý sẽ không kiểm tra và nhắc lại nữa."
        },
        {
          de: "Notizen in Notion so genau schreiben, dass später niemand die Nachrichten noch einmal lesen muss: was die Person gemacht hat, was das Problem ist, was das Zentrum entschieden hat – dazu ein Screenshot.",
          vi: "Ghi chú trên Notion kỹ đến mức sau này chỉ cần xem Notion, không cần đọc lại tin nhắn mà vẫn đủ thông tin: học viên đã làm gì, vướng gì, trung tâm quyết định thế nào – kèm ảnh chụp màn hình."
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
      translation_de: "„Bericht von heute\n1. Arbeitszeit: von … bis …\n2. Beratung:\n- Neue Kontakte: …\n- Für jeden Kontakt: Name + Facebook-Link/Telefon/Zalo (HN/SG) + was die Person möchte\n- Screenshot der letzten Nachricht in Messenger, Zalo, WhatsApp, TikTok\n3. Erledigt: Story gepostet? Was hast du sonst erledigt?\n4. Offen: Was, warum, und wer muss weitermachen?“"
    }
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "Wer schreibt einer Person, nachdem sie bezahlt hat?",
        question_vi: "Sau khi khách đóng tiền, ai sẽ nhắn tin với khách?",
        options: [
          { de: "Sales und Customer Success abwechselnd", vi: "Sales và Customer Success thay phiên" },
          { de: "Nur noch Customer Success", vi: "Chỉ Customer Success" },
          { de: "Weiter Sales, bis der Kurs beginnt", vi: "Vẫn là Sales cho đến khi khai giảng" },
          { de: "Die Lehrkraft", vi: "Giáo viên" }
        ],
        correct: 1
      },
      {
        question_de: "Was schreibt Sales bei der Übergabe in Slack dazu?",
        question_vi: "Khi chuyển khách trên Slack, Sales ghi thêm gì?",
        options: [
          { de: "Was der Person versprochen wurde, z. B. Sonderpreis, Ratenzahlung oder späterer Start", vi: "Những gì đã hứa với khách, ví dụ giá đặc biệt, trả góp hay khai giảng muộn" },
          { de: "Nichts, nur den Namen", vi: "Không gì, chỉ tên" },
          { de: "Den ganzen Chatverlauf als Text", vi: "Toàn bộ đoạn chat dạng văn bản" },
          { de: "Wie lange das Gespräch gedauert hat", vi: "Cuộc trò chuyện kéo dài bao lâu" }
        ],
        correct: 0
      },
      {
        question_de: "Eine neue Zahlung kommt am Sonntagabend. Wer kümmert sich?",
        question_vi: "Có khoản thanh toán mới vào tối Chủ nhật. Ai xử lý?",
        section: "die-vier-aufgaben-und-wann-sie-dran-sind",
        options: [
          { de: "Niemand bis Montag", vi: "Không ai cho đến thứ Hai" },
          { de: "Sales", vi: "Sales" },
          { de: "Wer gerade Customer-Success-Schicht hat – auch abends und am Wochenende", vi: "Người đang trực ca Customer Success – kể cả buổi tối và cuối tuần" },
          { de: "Die Leitung", vi: "Quản lý" }
        ],
        correct: 2
      },
      {
        question_de: "Eine Schülerin schreibt auf WhatsApp. Wo antwortest du?",
        question_vi: "Học viên nhắn qua WhatsApp. Bạn trả lời ở đâu?",
        section: "die-vier-aufgaben-und-wann-sie-dran-sind",
        options: [
          { de: "In Zalo, das ist unser Kanal", vi: "Trên Zalo, vì đó là kênh của mình" },
          { de: "Am selben Tag auf WhatsApp – im selben Kanal", vi: "Trong ngày, trên WhatsApp – cùng kênh" },
          { de: "Per E-Mail", vi: "Qua email" },
          { de: "In der Klassengruppe", vi: "Trong nhóm lớp" }
        ],
        correct: 1
      },
      {
        question_de: "Was zählt bei den KPIs von Customer Success?",
        question_vi: "Điều gì được tính trong KPI của Customer Success?",
        section: "kpis-ziel-ist-jeweils-100",
        options: [
          { de: "Wie viele Nachrichten du schickst", vi: "Bạn gửi bao nhiêu tin nhắn" },
          { de: "Wie schnell du die Schicht beendest", vi: "Bạn kết thúc ca nhanh thế nào" },
          { de: "Wie viele Kurse du verkaufst", vi: "Bạn bán được bao nhiêu khóa" },
          { de: "Wie viele Probleme du findest und löst und wie viele Schüler deshalb weiterlernen", vi: "Bạn tìm ra và giải quyết bao nhiêu vấn đề và bao nhiêu học viên vì thế học tiếp" }
        ],
        correct: 3
      },
      {
        question_de: "Eine Klasse wechselt bald von A1 nach A2. Wann informierst du Sales?",
        question_vi: "Một lớp sắp lên từ A1 lên A2. Khi nào bạn báo Sales?",
        section: "kpis-ziel-ist-jeweils-100",
        options: [
          { de: "Einmal, am letzten Kurstag", vi: "Một lần, vào buổi cuối" },
          { de: "Gar nicht, Sales sieht es selbst", vi: "Không báo, Sales tự thấy" },
          { de: "Erst wenn Schüler abspringen", vi: "Chỉ khi có học viên bỏ học" },
          { de: "Dreimal: einen Monat, zwei Wochen und drei Arbeitstage vorher", vi: "Ba lần: trước một tháng, hai tuần và ba ngày làm việc" }
        ],
        correct: 3
      },
      {
        question_de: "Du hast die Lehrkraft gefragt, sie hat noch nicht geantwortet. Ist die Aufgabe erledigt?",
        question_vi: "Bạn đã hỏi giáo viên nhưng chưa có trả lời. Việc đã xong chưa?",
        section: "so-arbeiten-wir-im-team",
        options: [
          { de: "Ja, ich habe meinen Teil gemacht", vi: "Rồi, mình đã làm phần của mình" },
          { de: "Ja, wenn ich es im Bericht notiere", vi: "Rồi, nếu ghi vào báo cáo" },
          { de: "Ja, nach 24 Stunden automatisch", vi: "Rồi, tự động sau 24 giờ" },
          { de: "Nein – erledigt ist sie erst, wenn die Person das Ergebnis bekommen hat", vi: "Chưa – chỉ xong khi khách nhận được kết quả" }
        ],
        correct: 3
      },
      {
        question_de: "Eine Aufgabe aus Zalo schaffst du heute nicht mehr. Was machst du?",
        question_vi: "Bạn không kịp làm một việc được giao qua Zalo hôm nay. Bạn làm gì?",
        section: "so-arbeiten-wir-im-team",
        options: [
          { de: "Morgen weitermachen, ohne es aufzuschreiben", vi: "Mai làm tiếp, không cần ghi lại" },
          { de: "Die Aufgabe ignorieren", vi: "Bỏ qua việc đó" },
          { de: "Der Person schreiben, dass es nicht geht", vi: "Nhắn khách là không làm được" },
          { de: "Am Abend in Slack schreiben, mit Screenshot der Zalo-Nachricht", vi: "Buổi tối ghi lên Slack, kèm ảnh chụp tin nhắn Zalo" }
        ],
        correct: 3
      },
      {
        question_de: "Eine Aufgabe steht seit heute Morgen in Slack, du schaffst sie nicht. Was machst du?",
        question_vi: "Một việc được giao trên Slack từ sáng mà bạn chưa làm kịp. Bạn làm gì?",
        section: "so-arbeiten-wir-im-team",
        options: [
          { de: "Warten, bis die Leitung nachfragt", vi: "Chờ quản lý hỏi lại" },
          { de: "Sie als erledigt markieren", vi: "Đánh dấu là đã xong" },
          { de: "Sie vergessen, sie war nicht wichtig", vi: "Bỏ qua, không quan trọng" },
          { de: "Auf den nächsten Tag schieben – und Rückmeldung geben, sobald sie erledigt ist", vi: "Chuyển sang ngày tiếp theo – và báo lại khi đã xong" }
        ],
        correct: 3
      }
    ]
  }
};

export default page;
