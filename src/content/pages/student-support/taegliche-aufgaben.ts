import type { PageContent } from "@/lib/types";

// Step-by-step instructions for the Customer Success daily checklist (src/content/daily/student-support.ts).
// One section per task; the heading anchor is what the task links to. Facts come from the Handbuch
// pages linked in each step – change the fact there, then here. Open points are marked „Zu klären“.
const page: PageContent = {
  slug: "taegliche-aufgaben",
  title_de: "Customer Success: tägliche Aufgaben Schritt für Schritt",
  title_vi: "Chăm sóc học viên: việc hằng ngày từng bước",
  kind: "process",
  section: "daily",
  verified_until: null,
  updated_at: "2026-11-04",
  body: [
    {
      type: "paragraph",
      de: "Hier steht zu jeder Aufgabe der Liste „Tägliche Aufgaben“, was du genau tust und wann du sie abhaken darfst. Die Regeln dahinter stehen im Handbuch. Die Links führen dorthin.",
      vi: "Trang này ghi cho từng việc trong danh sách „Việc hằng ngày“: làm cụ thể thế nào và khi nào được tick. Quy định gốc nằm trong Sổ tay, các link dẫn đến đó."
    },

    // ---------------------------------------------------------------- cs.teilnehmende-beantwortet
    { type: "heading", anchor: "nachrichten-beantworten", de: "Alle Nachrichten lesen und jedes Problem lösen", vi: "Đọc hết tin nhắn và xử lý mọi vấn đề" },
    {
      type: "steps",
      items: [
        {
          de: "Deine Gruppen kennen",
          vi: "Biết nhóm mình phụ trách",
          body_de: "Jede neue Klasse bekommt eine feste Ansprechperson aus Customer Success. Sie liest an jedem Arbeitstag die Gruppen ihrer Klassen und ihrer Lehrkräfte. Der Name der Lehrkraft-Gruppe zeigt, wer zuständig ist: „NaNu NaNa - GV [Lehrkraft] - [Name] phụ trách“. Siehe „[Wenn eine Lehrkraft ausfällt](student-support/lehrkraefte-begleiten#wenn-eine-lehrkraft-ausfallt)“.",
          body_vi: "Mỗi lớp mới có một người phụ trách cố định trong đội Chăm sóc học viên. Người đó đọc nhóm các lớp và nhóm giáo viên của mình mỗi ngày làm việc. Tên nhóm giáo viên cho biết ai phụ trách: „NaNu NaNa - GV [giáo viên] - [tên] phụ trách“. Xem „[Khi giáo viên nghỉ](student-support/lehrkraefte-begleiten#wenn-eine-lehrkraft-ausfallt)“."
        },
        {
          de: "Alle Kanäle durchgehen",
          vi: "Kiểm tra hết các kênh",
          body_de: "Lies die Klassengruppen und die Einzelchats in Zalo, WhatsApp und Messenger. Lies auch die Gruppen deiner Lehrkräfte. Montags beantwortest du zuerst die Nachrichten vom Wochenende.",
          body_vi: "Đọc nhóm lớp và tin nhắn riêng trên Zalo, WhatsApp và Messenger. Đọc cả nhóm giáo viên của mình. Thứ Hai thì trả lời tin nhắn cuối tuần trước tiên."
        },
        {
          de: "Am selben Tag antworten – im selben Kanal",
          vi: "Trả lời trong ngày – đúng kênh khách hỏi",
          body_de: "Antworte dort, wo die Person geschrieben hat. Prüf vorher den Namen, vor allem wenn Eltern für ihr Kind schreiben. Siehe „[Jeden Tag](student-support/aufgaben-und-rhythmus#allen-antworten)“.",
          body_vi: "Trả lời ở đúng kênh học viên đã nhắn. Kiểm tra tên trước, nhất là khi phụ huynh nhắn thay con. Xem „[Mỗi ngày](student-support/aufgaben-und-rhythmus#allen-antworten)“."
        },
        {
          de: "Das Problem mit der passenden Seite lösen",
          vi: "Xử lý theo trang hướng dẫn phù hợp",
          body_de: "– Material, Hausaufgaben, Buch: „[Material & Hausaufgaben](student-support/material-und-hausaufgaben)“\n– NaNu Go, Classroom, Zoom: „[Technik-Hilfe](student-support/technik-hilfe)“\n– Kurs pausieren: „[Kurs pausieren](student-support/kurs-pausieren)“\n– Aufhören nach den Probestunden: „[Probestunden & Geld-zurück-Zusage](student-support/probestunden-und-rueckerstattung)“\n– Beschwerde über den Unterricht: „[Typische Beschwerden](student-support/lehrkraefte-begleiten#typische-beschwerden-uber-den-unterricht)“\n– Lehrkraft fällt aus: „[Wenn eine Lehrkraft ausfällt](student-support/lehrkraefte-begleiten#wenn-eine-lehrkraft-ausfallt)“",
          body_vi: "– Tài liệu, bài tập, sách: „[Tài liệu & bài tập](student-support/material-und-hausaufgaben)“\n– NaNu Go, Classroom, Zoom: „[Hỗ trợ kỹ thuật](student-support/technik-hilfe)“\n– Bảo lưu: „[Bảo lưu khoá học](student-support/kurs-pausieren)“\n– Muốn nghỉ sau buổi học thử: „[Học thử & hoàn tiền](student-support/probestunden-und-rueckerstattung)“\n– Phản ánh về buổi học: „[Phản ánh thường gặp](student-support/lehrkraefte-begleiten#typische-beschwerden-uber-den-unterricht)“\n– Giáo viên nghỉ: „[Khi giáo viên nghỉ](student-support/lehrkraefte-begleiten#wenn-eine-lehrkraft-ausfallt)“"
        },
        {
          de: "Wenn du die Lehrkraft brauchst",
          vi: "Khi cần giáo viên",
          body_de: "Frag die Lehrkraft. Antwortet sie nicht, schickst du der Person die Datei oder die Antwort selbst und sagst der Lehrkraft Bescheid.",
          body_vi: "Hỏi giáo viên. Giáo viên chưa trả lời thì mình tự gửi file hoặc câu trả lời cho học viên và báo lại giáo viên."
        },
        {
          de: "Wenn du die Leitung brauchst",
          vi: "Khi cần quản lý",
          body_de: "Schreib den Fall in Slack, mit allen wichtigen Infos. Sag der Person, dass du nachfragst. Versprich nichts, was die Leitung noch nicht bestätigt hat. Ernste Beschwerden gehen immer an die Leitung.",
          body_vi: "Báo lên Slack kèm đủ thông tin. Nói với học viên là mình đang hỏi lại. Không hứa điều quản lý chưa xác nhận. Phản ánh nghiêm trọng luôn báo quản lý."
        },
        {
          de: "Unzufriedene und technische Probleme sofort melden",
          vi: "Báo ngay học viên không hài lòng và lỗi kỹ thuật",
          body_de: "Wirkt jemand unzufrieden, schreibst du die Beschwerde noch am selben Tag auf. Jemand muss dafür zuständig sein. Technische Probleme (Zoom, Jotform, Drive voll) meldest du sofort im Team.",
          body_vi: "Học viên có vẻ không hài lòng thì ghi lại phản ánh ngay trong ngày. Phải có người phụ trách xử lý. Lỗi kỹ thuật (Zoom, Jotform, Drive đầy) báo team ngay."
        },
        {
          de: "Was heute nicht fertig wird, abends übergeben",
          vi: "Việc chưa xong: cuối ngày bàn giao",
          body_de: "Schreib es am Abend in Slack, mit einem Screenshot der Nachricht und dem Namen der Person, die weitermacht. Trag es auch im Schichtbericht unter „Offen“ ein.",
          body_vi: "Cuối ngày ghi lên Slack, kèm ảnh chụp tin nhắn và tên người làm tiếp. Ghi thêm vào mục „Chưa hoàn thành“ trong báo cáo cuối ca."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Zalo und WhatsApp hakst du einzeln ab. Der Punkt darüber setzt sich von selbst, wenn beide erledigt sind. Abhaken darfst du einen Kanal, wenn am Ende deiner Schicht beides stimmt: 1) Jede Nachricht von Schülern und Lehrkräften auf diesem Kanal hat eine Antwort. 2) Jedes Problem ist gelöst – oder es steht in Slack, mit Screenshot und mit dem Namen der Person, die sich weiter darum kümmert. Nur „Ich habe die Lehrkraft gefragt“ reicht nicht.",
      vi: "Zalo và WhatsApp tick riêng. Dòng phía trên tự tick khi cả hai đã xong. Tick một kênh khi cuối ca đủ cả hai: 1) Tin nhắn nào của học viên và giáo viên trên kênh đó cũng đã được trả lời. 2) Vấn đề nào cũng đã xử lý xong – hoặc đã ghi lên Slack, kèm ảnh chụp và tên người tiếp tục xử lý. Chỉ „đã hỏi giáo viên“ là chưa đủ."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Mit welchem Zalo- und WhatsApp-Konto arbeitest du, auf welchem Gerät? Wie zeigst du in einer Gruppe, dass eine Nachricht erledigt ist, damit die nächste Schicht es sieht? Welche Regeln gelten, wenn jemand die Uhrzeit oder die Klasse wechseln will? Wo schreibst du Beschwerden auf (Notion, Slack, Backoffice)? Und in welchem Kanal meldest du technische Probleme?",
      vi: "Cần làm rõ: Dùng tài khoản Zalo và WhatsApp nào, trên máy nào? Đánh dấu thế nào trong nhóm để ca sau biết tin đã xử lý? Học viên muốn đổi giờ hay đổi lớp thì theo quy định nào? Ghi phản ánh ở đâu (Notion, Slack, Backoffice)? Lỗi kỹ thuật báo ở kênh nào?"
    },

    // ---------------------------------------------------------------- cs.lehrkraefte-erinnert
    { type: "heading", anchor: "lehrkraefte-erinnert", de: "Lehrkräfte erinnern: Anwesenheit, Unterrichtsdatei, Hausaufgabe, Feedback", vi: "Nhắc giáo viên: điểm danh, bài giảng, bài tập, nhận xét" },
    {
      type: "steps",
      items: [
        {
          de: "Klassen mit Unterricht finden",
          vi: "Tìm các lớp có buổi học",
          body_de: "Im Google Kalender der Lehrkräfte siehst du, welche Klassen Unterricht hatten. Geh alle Lehrkräfte durch – jeden Kalender, jede Klasse.",
          body_vi: "Xem Google Calendar của giáo viên để biết lớp nào có buổi học. Kiểm tra hết mọi giáo viên – từng lịch, từng lớp."
        },
        {
          de: "Klassengruppe prüfen",
          vi: "Kiểm tra nhóm lớp",
          body_de: "Hat die Lehrkraft nach der Stunde die Unterrichtsdatei und die Hausaufgabe in die Gruppe geschickt?",
          body_vi: "Sau buổi học giáo viên đã gửi bài giảng và bài tập vào nhóm chưa?"
        },
        {
          de: "Excel-Liste prüfen",
          vi: "Kiểm tra file Excel",
          body_de: "Öffne einen Termin der Klasse im Kalender. Unter „Google Drive“ steht der Link zum Ordner mit der Excel-Liste. Die Lehrkraft trägt zu jedem Schüler ein:\n– ob er aktiv mitgemacht hat,\n– ob er die Hausaufgabe gemacht hat,\n– ob er zu spät kam und wie viele Minuten,\n– online: ob die Kamera an war,\n– und ein kurzes Feedback.\nSiehe „[Feedback der Lehrkräfte](student-support/lehrkraefte-begleiten#feedback-der-lehrkrafte)“.",
          body_vi: "Mở một buổi học của lớp trong lịch. Dưới „Google Drive“ có link thư mục chứa file Excel. Giáo viên ghi cho từng học viên:\n– có tích cực không,\n– có làm bài tập không,\n– có đi muộn không, mấy phút,\n– học online: có bật camera không,\n– và một nhận xét ngắn.\nXem „[Nhận xét của giáo viên](student-support/lehrkraefte-begleiten#feedback-der-lehrkrafte)“."
        },
        {
          de: "Fehlt etwas: die Lehrkraft erinnern",
          vi: "Thiếu thì nhắc giáo viên",
          body_de: "Schreib der Lehrkraft direkt, was genau fehlt, und bitte sie, es nachzutragen. Beim ersten und zweiten Mal reicht das.",
          body_vi: "Nhắn thẳng giáo viên còn thiếu gì và nhờ điền bổ sung. Lần thứ nhất và thứ hai chỉ cần nhắc vậy."
        },
        {
          de: "Fehlt es zum dritten Mal: in den Tagesbericht",
          vi: "Lần thứ ba vẫn thiếu: ghi vào báo cáo ngày",
          body_de: "Sag der Lehrkraft, dass dafür Geld abgezogen wird. Schreib im Backoffice in den Tagesbericht:\n– welche Klasse,\n– an welchen Tagen etwas fehlt,\n– dass Geld abgezogen wird,\n– und einen Screenshot als Nachweis.\nSiehe „[Feedback der Lehrkräfte](student-support/lehrkraefte-begleiten#feedback-der-lehrkrafte)“.",
          body_vi: "Nói với giáo viên là sẽ bị trừ tiền. Ghi vào báo cáo ngày trong Backoffice:\n– lớp nào,\n– ngày nào thiếu,\n– sẽ bị trừ tiền,\n– và ảnh chụp làm bằng chứng.\nXem „[Nhận xét của giáo viên](student-support/lehrkraefte-begleiten#feedback-der-lehrkrafte)“."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Das ist kein eigener Punkt auf der Liste. Du erinnerst die Lehrkraft, während du die Google-Sheet-Tabellen von gestern prüfst. Fertig ist es, wenn bei jeder Klasse mit Unterricht alles eingetragen ist – oder die Lücke im Tagesbericht steht.",
      vi: "Đây không phải một mục riêng trong danh sách. Nhắc giáo viên trong lúc kiểm tra bảng Google Sheet của các lớp hôm qua. Xong khi lớp nào có buổi học cũng đã điền đủ – hoặc phần thiếu đã ghi vào báo cáo ngày."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Bis wann muss die Lehrkraft alles eingetragen haben? Und wie viel Geld wird für einen fehlenden Eintrag abgezogen?",
      vi: "Cần làm rõ: Giáo viên phải điền xong trước lúc nào? Thiếu một lần thì trừ bao nhiêu tiền?"
    },

    // ---------------------------------------------------------------- cs.neue-eingewiesen
    { type: "heading", anchor: "neue-eingewiesen", de: "Alle neuen Schüler vollständig einweisen", vi: "Hướng dẫn đầy đủ mọi học viên mới" },
    {
      type: "paragraph",
      de: "Sales meldet jede Zahlung in Slack. Wer gerade Schicht hat, fängt sofort an – auch abends und am Wochenende. Ziel: 48 Stunden nach der Zahlung hat der Schüler alles, ohne nachzufragen. Alle Schritte mit Vorlagen stehen in „[Nach der Zahlung](student-support/nach-der-zahlung)“.",
      vi: "Sales báo mỗi lần khách đóng tiền lên Slack. Ai đang trực ca thì bắt đầu ngay – kể cả buổi tối và cuối tuần. Mục tiêu: 48 tiếng sau khi đóng tiền, học viên có đủ mọi thứ mà không phải hỏi. Các bước kèm mẫu tin nhắn xem „[Sau khi đóng tiền](student-support/nach-der-zahlung)“."
    },
    {
      type: "steps",
      items: [
        { de: "Zahlung innerhalb einer Stunde bestätigen", vi: "Xác nhận đã nhận tiền trong vòng 1 tiếng", body_de: "Antworte auf den Beleg mit „Đã nhận được“.", body_vi: "Trả lời ảnh chuyển khoản bằng „Đã nhận được“." },
        { de: "Daten zurückbestätigen", vi: "Gửi lại thông tin để học viên kiểm tra", body_de: "Name, E-Mail, Telefon, Klasse mit Code, Niveau und Uhrzeit, und wie viel bezahlt wurde. So fallen Tippfehler in der E-Mail sofort auf.", body_vi: "Tên, email, điện thoại, lớp kèm mã lớp, trình độ, giờ học và số tiền đã đóng. Như vậy phát hiện ngay email bị gõ sai." },
        { de: "Begrüßungs-E-Mail mit Material schicken", vi: "Gửi email chào mừng kèm tài liệu", body_de: "Schreib dazu, welche Datei das Kursbuch zum Ausdrucken ist und welcher Teil dran ist (A1.1 oder A1.2).", body_vi: "Ghi rõ file nào là sách để in và đang học phần nào (A1.1 hay A1.2)." },
        { de: "In die Klassengruppe aufnehmen", vi: "Thêm vào nhóm lớp", body_de: "Dort kommen Zoom-Link, Hausaufgaben und Unterrichtsdateien hinein.", body_vi: "Link Zoom, bài tập và bài giảng đều gửi trong nhóm." },
        { de: "NaNu Go und Classroom schicken", vi: "Gửi NaNu Go và Classroom", body_de: "App-Link mit dem Hinweis: mit genau der E-Mail anmelden, die du uns gegeben hast. Dazu den Classroom-Code oder Einladungslink.", body_vi: "Gửi link app kèm lưu ý: đăng nhập đúng email đã đưa cho trung tâm. Kèm mã hoặc link mời Classroom." },
        { de: "Adresse fürs Handbuch erfragen", vi: "Hỏi địa chỉ gửi sổ tay", body_de: "Nur wenn das Handbuch zum Angebot gehört.", body_vi: "Chỉ khi gói học có sổ tay." },
        { de: "Vor der ersten Stunde erinnern", vi: "Nhắc trước buổi học đầu tiên", body_de: "Datum und Uhrzeit. Online: Uhrzeit in Vietnam und in Deutschland.", body_vi: "Ngày và giờ. Học online: ghi cả giờ Việt Nam và giờ Đức." },
        { de: "Nach der ersten und zweiten Stunde nachfragen", vi: "Hỏi thăm sau buổi 1 và buổi 2", body_de: "Frag, wie es läuft. Nach der ersten Stunde soll der Schüler Lektion 1 in NaNu Go gemacht haben.", body_vi: "Hỏi học viên thấy thế nào. Sau buổi 1, học viên phải làm xong bài 1 trên NaNu Go." }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: jeder neue Schüler aus Slack alle Schritte bekommen hat, die bis heute dran sind. Schick die Infos als eine Nachricht mit der Vorlage „Alles auf einen Blick“, nicht über mehrere Tage verteilt.",
      vi: "Tick khi: mọi học viên mới trên Slack đã nhận đủ các bước đến hạn hôm nay. Gửi thông tin trong một tin nhắn theo mẫu „Tóm tắt mọi thứ“, không rải ra nhiều ngày."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Wie zeigst du in Slack, dass ein neuer Schüler fertig eingewiesen ist – z. B. mit einer Antwort unter der Meldung von Sales?",
      vi: "Cần làm rõ: Báo thế nào trên Slack là học viên mới đã được hướng dẫn xong – ví dụ trả lời dưới tin báo của Sales?"
    },

    // ---------------------------------------------------------------- cs.sheets-vortag
    { type: "heading", anchor: "klassen-vortag", de: "Google-Sheet-Tabellen aller Klassen von gestern prüfen", vi: "Kiểm tra bảng Google Sheet của mọi lớp học hôm qua" },
    {
      type: "steps",
      items: [
        { de: "Klassen von gestern finden", vi: "Tìm các lớp học hôm qua", body_de: "Im Google Kalender siehst du, welche Klassen gestern Unterricht hatten.", body_vi: "Xem Google Calendar để biết hôm qua lớp nào có buổi học." },
        { de: "Google-Sheet-Tabellen prüfen", vi: "Kiểm tra bảng Google Sheet", body_de: "Öffne die Google-Sheet-Tabelle jeder Klasse von gestern. Hat die Lehrkraft Anwesenheit und Feedback zu jedem Schüler eingetragen? Fehlt etwas, erinnere sie – auch an Unterrichtsdatei und Hausaufgabe in der Gruppe. Wie, steht unter „[Lehrkräfte erinnern](student-support/taegliche-aufgaben#lehrkraefte-erinnert)“.", body_vi: "Mở bảng Google Sheet của từng lớp học hôm qua. Giáo viên đã điểm danh và nhận xét từng học viên chưa? Thiếu thì nhắc – cả bài giảng và bài tập trong nhóm. Cách làm xem „[Nhắc giáo viên](student-support/taegliche-aufgaben#lehrkraefte-erinnert)“." },
        { de: "Wer gefehlt hat, persönlich anschreiben", vi: "Nhắn riêng cho học viên vắng", body_de: "Schreib jedem Schüler, der gefehlt hat, eine persönliche Nachricht.", body_vi: "Nhắn tin riêng cho từng học viên đã vắng." },
        { de: "In NaNu Go nachsehen", vi: "Kiểm tra trên NaNu Go", body_de: "Hat der Schüler die Aufgaben gemacht? Wenn nicht: Sag ihm, dass er die verpasste Lektion in NaNu Go nachholen soll. Sonst kann er dem Unterricht nicht mehr folgen. Siehe „[Klassen im Blick behalten](student-support/aufgaben-und-rhythmus#klassen-vortag)“.", body_vi: "Học viên đã làm bài chưa? Nếu chưa: nhắn học viên học bù bài đã lỡ trên NaNu Go. Nếu không sẽ không theo kịp lớp. Xem „[Theo dõi lớp học](student-support/aufgaben-und-rhythmus#klassen-vortag)“." },
        { de: "Mitte der Stufe: Mini-Test", vi: "Giữa trình độ: Mini Test", body_de: "Nur wenn die Klasse in der Mitte der Stufe ist. Sammle das Ergebnis des Mini-Tests und sag jedem Schüler, wo er steht. Dafür nimmst du das Testergebnis und die Einträge der Lehrkraft. Siehe „[Feedback der Lehrkräfte](student-support/lehrkraefte-begleiten#feedback-der-lehrkrafte)“.", body_vi: "Chỉ khi lớp đang ở giữa trình độ. Lấy điểm Mini Test và nói cho từng học viên biết đang ở đâu. Dựa trên điểm bài test và những gì giáo viên đã ghi. Xem „[Nhận xét của giáo viên](student-support/lehrkraefte-begleiten#feedback-der-lehrkrafte)“." }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Zwei Punkte hakst du einzeln ab: das Feedback der Lehrkräfte, und die Nachrichten an Schüler, die gefehlt haben, plus NaNu Go. Der Punkt darüber setzt sich von selbst, wenn beide erledigt sind.",
      vi: "Tick riêng hai mục: nhận xét của giáo viên, và tin nhắn cho học viên vắng cùng NaNu Go. Dòng phía trên tự tick khi cả hai đã xong."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Wo siehst du in NaNu Go, ob ein Schüler eine Lektion gemacht hat? Fehlt jemand oft oder hört auf, meldest du die Klasse der Leitung – ab wie vielen Fehlstunden?",
      vi: "Cần làm rõ: Xem ở đâu trên NaNu Go học viên đã làm bài chưa? Học viên hay vắng hoặc bỏ học thì báo quản lý – vắng bao nhiêu buổi thì báo?"
    },

    // ---------------------------------------------------------------- cs.abend-bericht
    { type: "heading", anchor: "abend-bericht", de: "Abends: Backoffice ausfüllen und Schichtbericht schicken", vi: "Cuối ngày: điền Backoffice và gửi báo cáo cuối ca" },
    {
      type: "steps",
      items: [
        { de: "Prüfen, was erledigt ist", vi: "Kiểm tra việc đã xong", body_de: "Geh die Liste „Tägliche Aufgaben“ durch. Was offen ist, steht in Slack – mit Screenshot und mit dem Namen der Person, die weitermacht.", body_vi: "Xem lại danh sách „Việc hằng ngày“. Việc còn tồn phải ghi lên Slack – kèm ảnh chụp và tên người làm tiếp." },
        { de: "Backoffice ausfüllen", vi: "Điền Backoffice", body_de: "Trag den Tagesbericht ein, z. B. fehlende Einträge der Lehrkräfte.", body_vi: "Điền báo cáo ngày, ví dụ phần giáo viên còn thiếu." },
        { de: "Schichtbericht schicken", vi: "Gửi báo cáo cuối ca", body_de: "Nimm die Vorlage „Bericht am Ende der Schicht“ in „[So arbeiten wir im Team](student-support/aufgaben-und-rhythmus#so-arbeiten-wir-im-team)“. Unter „Offen“ schreibst du, was offen ist, warum, und wer weitermacht.", body_vi: "Dùng mẫu „Báo cáo cuối ca“ trong „[Cách làm việc trong team](student-support/aufgaben-und-rhythmus#so-arbeiten-wir-im-team)“. Ở mục „Chưa hoàn thành“ ghi việc gì, vì sao và ai làm tiếp." },
        { de: "Abendschicht: so genau, dass andere weitermachen können", vi: "Ca tối: ghi đủ rõ để người khác làm tiếp", body_de: "Deine Kolleg:innen müssen damit weitermachen können, bevor die Klasse wieder Unterricht hat.", body_vi: "Đồng nghiệp phải làm tiếp được trước buổi học tiếp theo của lớp." }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: das Backoffice ausgefüllt ist und der Schichtbericht verschickt ist.",
      vi: "Tick khi: đã điền Backoffice và đã gửi báo cáo cuối ca."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Wohin schickst du den Schichtbericht? Und die Vorlage fragt nach neuen Kontakten und Stories – also nach Sales-Arbeit. Was schreibt Customer Success dort hinein?",
      vi: "Cần làm rõ: Gửi báo cáo cuối ca cho ai, ở đâu? Mẫu hỏi về khách mới và story – tức là việc của Sales. Đội Chăm sóc học viên ghi gì vào đó?"
    },

    // ---------------------------------------------------------------- cs.mo-neue-woche
    { type: "heading", anchor: "mo-neue-woche", de: "Montags: neue Woche ankündigen und Leaderboard schicken", vi: "Thứ Hai: nhắc giáo viên tuần mới và gửi bảng xếp hạng" },
    {
      type: "steps",
      items: [
        { de: "Zuerst die Nachrichten vom Wochenende", vi: "Trước tiên: tin nhắn cuối tuần", body_de: "Beantworte zuerst alles, was am Wochenende kam.", body_vi: "Trả lời hết tin nhắn cuối tuần trước." },
        { de: "Jeder Lehrkraft einzeln schreiben", vi: "Nhắn riêng từng giáo viên", body_de: "Schick am Montagmorgen jeder deiner Lehrkräfte die Vorlage „Montag an jede Lehrkraft“ und frag nach Rückmeldungen aus der Klasse. Die Antwort soll noch am selben Tag kommen. Siehe „[Was wir von Lehrkräften erwarten](student-support/lehrkraefte-begleiten#erwartungen)“.", body_vi: "Sáng thứ Hai gửi mẫu „Tin nhắn thứ Hai cho giáo viên“ và hỏi phản hồi từ lớp. Giáo viên cần trả lời ngay trong ngày. Xem „[Điều mình mong ở giáo viên](student-support/lehrkraefte-begleiten#erwartungen)“." },
        { de: "Class League öffnen", vi: "Mở trang Class League", body_de: "Geh auf [nanugo.app/admin/class-league](https://nanugo.app/admin/class-league).", body_vi: "Vào [nanugo.app/admin/class-league](https://nanugo.app/admin/class-league)." },
        { de: "Main Group Post in jede Klasse", vi: "Gửi Main Group Post vào mọi lớp", body_de: "Kopier Text und Bild bei „Main Group Post“ und schick beides in jede Klassengruppe.", body_vi: "Copy chữ và ảnh ở „Main Group Post“, gửi vào từng nhóm lớp." },
        { de: "Klassen-Post nur in die passende Klasse", vi: "Bài riêng chỉ gửi đúng lớp", body_de: "Weiter unten steht jede Klasse einzeln. Prüf vor dem Senden: Stimmt der Text, gehört das Bild zu dieser Klasse? Siehe „[Montags](student-support/aufgaben-und-rhythmus#klassengruppen-montags)“.", body_vi: "Bên dưới có từng lớp riêng. Trước khi gửi kiểm tra: nội dung đúng chưa, ảnh có đúng lớp không? Xem „[Thứ Hai](student-support/aufgaben-und-rhythmus#klassengruppen-montags)“." }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: jede deiner Lehrkräfte die Montagsnachricht hat und jede Klassengruppe das Leaderboard bekommen hat.",
      vi: "Tick khi: mọi giáo viên của bạn đã nhận tin thứ Hai và mọi nhóm lớp đã nhận bảng xếp hạng."
    },

    // ---------------------------------------------------------------- cs.mi-feedback-meeting
    { type: "heading", anchor: "mi-feedback", de: "Jeden Tag: prüfen, ob alle Lehrkräfte das Feedback ausgefüllt haben", vi: "Mỗi ngày: kiểm tra giáo viên đã điền nhận xét chưa" },
    {
      type: "steps",
      items: [
        { de: "Alle Lehrkräfte durchgehen", vi: "Kiểm tra hết giáo viên", body_de: "Jeden Kalender, jede Klasse. Wer ausgelassen wird, fällt am Monatsende niemandem auf.", body_vi: "Từng lịch, từng lớp. Ai bị bỏ sót thì cuối tháng không ai phát hiện." },
        { de: "Feedback in der Google-Sheet-Tabelle prüfen", vi: "Kiểm tra nhận xét trong bảng Google Sheet", body_de: "Steht zu jedem Schüler ein kurzes Feedback? Das gehört zur Prüfung der Tabellen von gestern, nicht nur mittwochs. Siehe „[Feedback der Lehrkräfte](student-support/lehrkraefte-begleiten#feedback-der-lehrkrafte)“.", body_vi: "Học viên nào cũng có nhận xét ngắn chưa? Việc này nằm trong phần kiểm tra bảng của hôm qua, không chỉ thứ Tư. Xem „[Nhận xét của giáo viên](student-support/lehrkraefte-begleiten#feedback-der-lehrkrafte)“." },
        { de: "Fehlt es: erinnern, ab dem dritten Mal in den Tagesbericht", vi: "Thiếu: nhắc, lần thứ ba thì ghi báo cáo ngày", body_de: "Erinnere die Lehrkraft. Erst beim dritten Mal schreibst du es in den Tagesbericht im Backoffice, wie unter „[Lehrkräfte erinnern](student-support/taegliche-aufgaben#lehrkraefte-erinnert)“.", body_vi: "Nhắc giáo viên. Chỉ lần thứ ba mới ghi vào báo cáo ngày trong Backoffice, như ở mục „[Nhắc giáo viên](student-support/taegliche-aufgaben#lehrkraefte-erinnert)“." }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: du bei jeder Lehrkraft geprüft hast, ob das Feedback ausgefüllt ist.",
      vi: "Tick khi: đã kiểm tra nhận xét của mọi giáo viên."
    },

    // ---------------------------------------------------------------- cs.fr-wochenbericht
    { type: "heading", anchor: "fr-wochenbericht", de: "Freitags: Wochenbericht mit Lösungsvorschlägen schicken", vi: "Thứ Sáu: gửi báo cáo tuần kèm đề xuất" },
    {
      type: "paragraph",
      de: "Schreib in den Wochenbericht:",
      vi: "Báo cáo tuần ghi:"
    },
    {
      type: "list",
      items: [
        { de: "wie viele Schüler gerade lernen, pausieren oder aufgehört haben,", vi: "bao nhiêu học viên đang học, bảo lưu hay đã nghỉ," },
        { de: "welche Lehrkräfte ihre Aufgaben erledigen,", vi: "giáo viên nào làm đủ việc," },
        { de: "was noch offen ist,", vi: "việc gì còn tồn," },
        { de: "und zu jedem Problem einen Vorschlag, wie wir es lösen.", vi: "và đề xuất cách xử lý cho từng vấn đề." }
      ]
    },
    {
      type: "paragraph",
      de: "Siehe „[Berichten und verbessern](student-support/aufgaben-und-rhythmus#berichten)“. Es zählt nicht, wie viele Nachrichten du schickst, sondern wie viele Probleme du findest und löst.",
      vi: "Xem „[Báo cáo và cải thiện](student-support/aufgaben-und-rhythmus#berichten)“. Không tính số tin nhắn đã gửi, mà tính số vấn đề tìm ra và xử lý được."
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: der Bericht verschickt ist und zu jedem Problem ein Vorschlag drinsteht.",
      vi: "Tick khi: đã gửi báo cáo và vấn đề nào cũng có đề xuất."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: An wen und wo schickst du den Wochenbericht? Gibt es eine Vorlage?",
      vi: "Cần làm rõ: Gửi báo cáo tuần cho ai, ở đâu? Có mẫu không?"
    }
  ]
};

export default page;
