import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "lehrkraefte-begleiten",
  title_de: "Lehrkräfte begleiten & Unterricht prüfen",
  title_vi: "Theo dõi giáo viên & chất lượng lớp học",
  kind: "process",
  section: "handbook",
  verified_until: "2027-05-01",
  updated_at: "2026-11-03",
  body: [
    {
      type: "paragraph",
      de: "Ob jemand weiterlernt, entscheidet sich im Unterricht. Customer Success sieht, was die Schüler sagen, und was die Lehrkräfte eintragen – und bringt beides zusammen, bevor aus einer kleinen Unzufriedenheit eine Kündigung wird.",
      vi: "Học viên có học tiếp hay không được quyết định trong lớp học. Đội Chăm sóc học viên nắm được học viên nói gì và giáo viên ghi nhận gì – và kết nối hai bên trước khi một chút không hài lòng trở thành bỏ học."
    },
    { type: "heading", de: "Feedback der Lehrkräfte", vi: "Nhận xét hằng ngày của giáo viên" },
    {
      type: "paragraph",
      de: "Jede Klasse hat eine eigene Excel-Liste. Nach jeder Stunde trägt die Lehrkraft dort zu jedem Schüler ein:",
      vi: "Mỗi lớp có một file Excel riêng. Sau mỗi buổi học, giáo viên ghi vào đó cho từng học viên:"
    },
    {
      type: "list",
      items: [
        { de: "ob der Schüler im Unterricht aktiv mitgemacht hat,", vi: "học viên có tích cực tham gia buổi học không," },
        { de: "ob er die Hausaufgabe von der letzten Stunde gemacht hat,", vi: "học viên đã làm bài tập về nhà của buổi trước chưa," },
        { de: "ob er zu spät gekommen ist und wenn ja, wie viele Minuten,", vi: "học viên có vào lớp trễ không, nếu có thì trễ bao nhiêu phút," },
        { de: "bei Online-Unterricht: ob seine Kamera an oder aus war,", vi: "với lớp online: học viên bật hay tắt camera," },
        { de: "und ein kurzes Feedback, wie es mit dem Schüler insgesamt läuft.", vi: "và một nhận xét ngắn về tình hình chung của học viên." }
      ]
    },
    {
      type: "paragraph",
      de: "Jeden Tag prüfst du, ob die Lehrkräfte alles eingetragen haben. Fehlt etwas, schreibst du es im Backoffice in den Tagesbericht:",
      vi: "Mỗi ngày bạn kiểm tra xem giáo viên đã điền đủ chưa. Nếu thiếu, bạn ghi vào báo cáo cuối ngày trên Backoffice:"
    },
    {
      type: "list",
      items: [
        { de: "welche Klasse es ist,", vi: "lớp nào," },
        { de: "an welchen Tagen etwas fehlt,", vi: "thiếu những ngày nào," },
        { de: "wie viel Geld der Lehrkraft dafür abgezogen wird,", vi: "giáo viên bị trừ bao nhiêu tiền," },
        { de: "und einen Screenshot als Nachweis.", vi: "và một ảnh chụp màn hình làm bằng chứng." }
      ]
    },
    {
      type: "paragraph",
      de: "Das Geld wird am Monatsende abgezogen. Außerdem:",
      vi: "Tiền sẽ bị trừ vào cuối tháng. Ngoài ra:"
    },
    {
      type: "list",
      items: [
        {
          de: "Loben Schüler eine Lehrkraft, schreibst du das auf und gibst es weiter. Sonst weiß am Monatsende niemand mehr, wer gut unterrichtet hat.",
          vi: "Học viên khen giáo viên nào thì bạn ghi lại và chuyển tiếp. Nếu không, đến cuối tháng không ai còn nhớ ai dạy tốt."
        },
        {
          de: "In der Mitte jeder Stufe gibt es einen kurzen Test, den Mini-Test. Danach sagen wir jedem Schüler, wo er gerade steht. Dafür nehmen wir sein Testergebnis und die Einträge der Lehrkraft.",
          vi: "Giữa mỗi khoá có một bài kiểm tra ngắn, gọi là Mini Test. Sau đó chúng ta cho từng học viên biết trình độ hiện tại, dựa trên điểm bài test và những gì giáo viên đã ghi."
        }
      ]
    },
    {
      type: "paragraph",
      de: "Die Excel-Liste einer Klasse findest du im Google Kalender der Lehrkraft: Öffne einen Termin der Klasse. In der Beschreibung steht unter „Google Drive“ der Link zum Ordner der Klasse, darin liegt die Excel-Liste. Geh beim Prüfen alle Lehrkräfte durch – jeden Kalender, jede Klasse. Wer ausgelassen wird, fällt am Monatsende niemandem auf.",
      vi: "File Excel của từng lớp nằm trong Google Calendar của giáo viên: mở một buổi học của lớp. Trong phần mô tả, mục „Google Drive“ có link đến thư mục của lớp, file Excel nằm trong đó. Khi kiểm tra phải đi qua tất cả giáo viên – từng lịch, từng lớp. Bỏ sót ai thì đến cuối tháng cũng không ai phát hiện."
    },
    {
      type: "image",
      src: "/student-support/kalender-excel-liste.webp",
      alt_de: "Termin einer Klasse im Google Kalender der Lehrkraft: in der Beschreibung Zoom-Link und darunter der Google-Drive-Link zum Ordner der Klasse",
      alt_vi: "Buổi học trong Google Calendar của giáo viên: phần mô tả có link Zoom và bên dưới là link Google Drive đến thư mục của lớp",
      caption_de: "Der Link unter „Google Drive“ führt zum Ordner der Klasse mit der Excel-Liste.",
      caption_vi: "Link dưới mục „Google Drive“ dẫn đến thư mục của lớp có file Excel."
    },
    { type: "heading", de: "Wenn eine Lehrkraft ausfällt", vi: "Khi giáo viên xin nghỉ" },
    {
      type: "steps",
      items: [
        {
          de: "Die Lehrkraft meldet sich zuerst beim Zentrum",
          vi: "Giáo viên báo trung tâm trước",
          body_de: "Nie direkt der Klasse ankündigen. Erst wenn klar ist, ob es Ersatz gibt, erfährt die Klasse davon.",
          body_vi: "Không báo thẳng cho lớp. Chỉ khi đã rõ có giáo viên dạy thay hay không thì mới báo lớp."
        },
        {
          de: "Ersatz suchen",
          vi: "Tìm giáo viên dạy thay",
          body_de: "Ist es dringend (die Stunde ist morgen), nicht bis Montag warten: sofort über Zalo Bescheid geben und in Slack festhalten.",
          body_vi: "Nếu gấp (buổi học ngày mai), đừng đợi đến thứ Hai: nhắn Zalo ngay và ghi lại trên Slack."
        },
        {
          de: "Der Klasse erklären",
          vi: "Giải thích với lớp",
          body_de: "Wechselt die Lehrkraft, sagen wir warum: „In der ersten Stunde unterrichtet … , weil …“. Ohne Erklärung denken die Schüler, wir hätten etwas versprochen und nicht gehalten.",
          body_vi: "Đổi giáo viên thì nói rõ lý do: „Buổi 1 thầy/cô … dạy, vì …“. Không giải thích, học viên sẽ nghĩ trung tâm hứa một đằng làm một nẻo."
        },
        {
          de: "Kein Ersatz: Stunde verschieben",
          vi: "Không có người thay: dời buổi",
          body_de: "Der Klasse den Nachholtermin gleich mitnennen.",
          body_vi: "Báo lớp luôn ngày học bù."
        },
        {
          de: "Vergessen, der Klasse Bescheid zu geben? Am nächsten Tag entschuldigen",
          vi: "Quên báo lớp? Xin lỗi lớp ngay hôm sau",
          body_de: "Ehrlich sagen, was passiert ist, und dass es unser Fehler war (Vorlage unten). Erst der Leitung zum Freigeben schicken. Ist es schon ein paar Tage her, lieber jedem Schüler einzeln schreiben als in die Gruppe.",
          body_vi: "Nói thật chuyện gì đã xảy ra và đây là lỗi của trung tâm (mẫu bên dưới). Gửi quản lý duyệt trước. Nếu đã qua vài hôm thì nhắn riêng từng bạn thay vì nhắn nhóm."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Entschuldigung an die Klasse",
      label_vi: "Mẫu · Xin lỗi lớp",
      text: "Hallo lớp mình,\nBuổi học [thứ …] vừa rồi, [thầy/cô …] báo [lý do] nên không thể lên lớp. Tuy nhiên, trung tâm đã chậm trễ trong việc thông báo đến lớp. Đây là thiếu sót từ phía trung tâm và trung tâm thành thật xin lỗi vì đã để lớp mình mất thời gian và ảnh hưởng đến kế hoạch cá nhân.\nTrung tâm sẽ nghiêm túc rút kinh nghiệm và cải thiện quy trình sắp xếp, thông báo để hạn chế tối đa những trường hợp tương tự xảy ra trong thời gian tới.\nLớp mình sẽ học lại bình thường với [thầy/cô …] từ [ngày] theo lịch học.\nMột lần nữa, trung tâm thành thật xin lỗi và cảm ơn lớp mình đã thông cảm, đồng hành cùng trung tâm. Chúc cả lớp một buổi học thật hiệu quả!\nWir danken euch für euer Verständnis und entschuldigen uns nochmals aufrichtig.",
      translation_de: "„Hallo zusammen, letzten [Tag] konnte [Lehrkraft] wegen [Grund] nicht unterrichten. Wir haben euch zu spät informiert – das war unser Fehler, und wir entschuldigen uns, dass ihr Zeit verloren habt. Wir verbessern unsere Planung und Benachrichtigung. Ab [Datum] geht es normal mit [Lehrkraft] weiter. Danke für euer Verständnis!“"
    },
    {
      type: "callout",
      tone: "info",
      de: "Jede neue Klasse bekommt eine feste Ansprechperson aus Customer Success. Sie liest an jedem Arbeitstag die Gruppen ihrer Klassen und ihrer Lehrkräfte. Der Name der Lehrkraft-Gruppe zeigt, wer zuständig ist: „NaNu NaNa - GV [Lehrkraft] - [Name] phụ trách“.",
      vi: "Mỗi lớp mới có một người phụ trách cố định trong đội Chăm sóc học viên. Mỗi ngày đi làm, người đó đọc tin nhắn trong nhóm các lớp và nhóm giáo viên mình phụ trách. Tên nhóm giáo viên ghi rõ ai phụ trách: „NaNu NaNa - GV [tên giáo viên] - [tên] phụ trách“."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Feiertage: Fällt ein Feiertag an (in Vietnam z. B. 2.9., in Deutschland 3.10.), allen Lehrkräften und Klassen frühzeitig Bescheid geben. Frei hat nur, wer an genau diesem Tag Unterricht hätte – Klassen nach deutscher Abendzeit können trotzdem stattfinden. Im September fiel eine Klasse aus, die gar nicht hätte frei haben sollen.",
      vi: "Ngày lễ: khi có ngày lễ (ở Việt Nam ví dụ 2/9, ở Đức 3/10) thì báo sớm cho tất cả giáo viên và các lớp. Chỉ lớp nào có buổi học đúng vào ngày đó mới nghỉ – các lớp tối giờ Đức vẫn có thể học bình thường. Tháng 9 đã có một lớp nghỉ nhầm."
    },
    { type: "heading", de: "Was wir von Lehrkräften erwarten", vi: "Những điều trung tâm yêu cầu ở giáo viên", anchor: "erwartungen" },
    {
      type: "list",
      items: [
        { de: "Nicht zu spät kommen, nicht früher gehen – auch nicht eine Minute.", vi: "Không đi muộn, không về sớm – 1 phút cũng không." },
        { de: "Freundlich lächeln und mehr Deutsch sprechen (langsam ist in Ordnung – Hauptsache Deutsch).", vi: "Tươi cười với học viên và nói tiếng Đức nhiều hơn (nói chậm cũng được, cốt là nói tiếng Đức)." },
        { de: "Im Unterricht immer den Bildschirm mit Classroom teilen und „Tipps anzeigen“ anklicken, damit die Schüler sehen, dass der Text zum Hören schon hochgeladen ist. Wörter direkt auf dem Bildschirm erklären. So wissen die Schüler: Zu Hause können sie genau so wiederholen.", vi: "Khi dạy luôn share màn hình Classroom và ấn „Tipps anzeigen“ để học viên thấy trung tâm đã tải text bài nghe lên. Giải thích từ vựng thẳng trên màn hình. Để học viên hiểu: về nhà có thể học lại y hệt như vậy." },
        { de: "Lehrkräfte und Assistenz drucken ihr Material selbst: früh kommen und den Drucker mit dem eigenen Laptop verbinden.", vi: "Giáo viên và trợ giảng tự in bài: đến sớm và tự kết nối máy in với máy tính." }
      ]
    },
    {
      type: "paragraph",
      de: "Jeden Montagmorgen schreibst du jeder deiner Lehrkräfte einzeln diese Erinnerung und fragst nach Rückmeldungen aus der Klasse. Die Antwort soll noch am selben Tag kommen – auch eine kleine.",
      vi: "Mỗi sáng thứ Hai bạn nhắn riêng cho từng giáo viên mình phụ trách lời nhắc này và hỏi lớp có feedback gì không. Giáo viên trả lời trong ngày – dù chỉ là một feedback nhỏ."
    },
    {
      type: "template",
      label_de: "Vorlage · Montag an jede Lehrkraft",
      label_vi: "Mẫu · Tin nhắn thứ Hai cho giáo viên",
      text: "1. Không đi muộn, về sớm (1 phút cũng không)\n2. Tươi cười với học viên\n3. Nói tiếng Đức nhiều hơn\n\nGuten Morgen [anh/chị] …,\ncó bạn nào feedback gì không [anh/chị]?\nVà trên là 1 số lời dặn dò về phong cách làm việc của trung tâm cho tất cả các giáo viên của NaNu NaNa, [anh/chị] lưu ý giúp em nha.\nFeedback [anh/chị] trả lời hôm nay giúp em (bất cứ 1 feedback nhỏ gì).\nCảm ơn [anh/chị]!\n\nLG\n[Tên]",
      translation_de: "„1. Nicht zu spät kommen, nicht früher gehen (auch nicht 1 Minute). 2. Freundlich lächeln. 3. Mehr Deutsch sprechen. – Guten Morgen …, gab es Rückmeldungen aus der Klasse? Oben stehen ein paar Punkte zu unserem Arbeitsstil für alle Lehrkräfte von NaNu NaNa, bitte achte darauf. Bitte antworte heute (auch eine Kleinigkeit). Danke!“"
    },
    { type: "heading", de: "Im Unterricht hospitieren (dự giờ)", vi: "Dự giờ giáo viên", anchor: "hospitieren" },
    {
      type: "steps",
      items: [
        { de: "Die Lehrkraft vorher informieren", vi: "Báo giáo viên trước", body_de: "Ein, zwei Tage vorher Bescheid geben, dass jemand aus dem Zentrum zuschaut.", body_vi: "Báo trước 1–2 hôm là trung tâm sẽ vào dự giờ." },
        { de: "Still dabei sein", vi: "Vào lớp im lặng", body_de: "Kamera und Mikrofon aus, Name in Zoom: „NaNuNaNa - Dự giờ“. 10–20 Minuten reichen.", body_vi: "Tắt cam, tắt mic, đặt tên Zoom là „NaNuNaNa - Dự giờ“. Vào khoảng 10–20 phút là đủ." },
        { de: "Wie ein Schüler bewerten", vi: "Đánh giá như một học viên", body_de: "Technik: Ton (Mikrofon, Nebengeräusche), Licht, ob die Folien vom Zentrum gezeigt werden, Kamerawinkel. Lehrkraft: Kleidung, Haltung zu den Schülern (z. B. lobt sie richtige Antworten?), wie verständlich und lebendig sie erklärt.", body_vi: "Kỹ thuật: âm thanh (micro, tạp âm), ánh sáng, có trình chiếu đúng slide trung tâm không, góc quay. Giáo viên: trang phục, thái độ với học viên (ví dụ có khen khi trả lời đúng không), phong cách giảng dạy có dễ hiểu, vui vẻ không." },
        { de: "Ergebnis melden", vi: "Báo lại kết quả", body_de: "Die Bewertung in Slack schreiben und im Backoffice ablegen. Fällt etwas auf, das alle Lehrkräfte betrifft (z. B. Classroom wird nicht geteilt), schreibt die Leitung es in die Gruppe der Lehrkräfte.", body_vi: "Ghi đánh giá lên Slack và lưu vào Backoffice. Nếu có điểm liên quan đến tất cả giáo viên (ví dụ không share Classroom), quản lý sẽ nhắc vào nhóm giáo viên." }
      ]
    },
    { type: "heading", de: "Typische Beschwerden über den Unterricht", vi: "Các phản ánh thường gặp về lớp học" },
    {
      type: "list",
      items: [
        {
          de: "„Die Lehrkraft ist zu schnell“: Erst die Person fragen, wo sie hängt und ob sie in der Stunde nachgefragt hat. Dann der Lehrkraft Bescheid geben, auf diese Person zu achten.",
          vi: "„Giáo viên dạy nhanh“: hỏi học viên đang vướng phần nào, đã hỏi lại giáo viên trong giờ chưa. Sau đó nhắn giáo viên chú ý hơn đến bạn này."
        },
        {
          de: "„Die Klasse ist zu groß, ich komme selten dran“ oder „Andere sind noch nicht so weit“: Das kann nur die Lehrkraft im Unterricht ändern. Leite die Nachricht also nicht einfach weiter, sondern schreib der Lehrkraft, was genau gesagt wurde, und bitte um etwas Konkretes. Zum Beispiel: alle der Reihe nach drannehmen, in Zoom Breakout-Räume zum Sprechen nutzen oder Schnelleren eine Zusatzaufgabe geben. Notiere das Feedback in der Excel-Liste der Klasse. Nach der nächsten Stunde fragst du die Person, ob es besser war. Wenn nicht, gibst du es an die Leitung.",
          vi: "„Lớp đông, giáo viên gọi không hết“ hay „có bạn trình độ chưa tới“: chỉ giáo viên mới thay đổi được điều này trong giờ học. Vì vậy đừng chỉ chuyển tiếp tin nhắn, mà hãy nhắn giáo viên học viên đã nói gì và đề nghị một việc cụ thể. Ví dụ: gọi lần lượt từng bạn, dùng phòng nhỏ (Breakout Room) trên Zoom để luyện nói, hoặc giao thêm bài cho bạn học nhanh hơn. Ghi phản hồi vào file Excel của lớp. Sau buổi học tiếp theo, hỏi lại học viên xem đã đỡ hơn chưa. Nếu chưa thì báo quản lý."
        },
        {
          de: "„Ich passe nicht zu dieser Lehrkraft“ oder Zweifel an ihrer Qualifikation: Ernst nehmen, Grund erfragen, an die Leitung geben. Alle Lehrkräfte haben in Deutschland studiert; die Zeugnisse liegen im Drive. Sie werden nicht einfach an Schüler verschickt – vorher die Leitung fragen.",
          vi: "„Em không hợp giáo viên này“ hay nghi ngờ bằng cấp giáo viên: xem trọng, hỏi lý do, báo quản lý. Tất cả giáo viên đều học tại Đức; bằng đã scan lưu trên Drive. Không tự gửi bằng cho học viên – hỏi quản lý trước."
        },
        {
          de: "Probleme mit Lehrplan oder Programm („Der Unterricht wirkt wie reine Prüfungsvorbereitung“) und Bitten außerhalb der Regeln: in der Gruppe melden, dort wird entschieden.",
          vi: "Vấn đề về giáo án, chương trình („lớp học giống ôn đề thi“) và các yêu cầu ngoài quy định: báo vào nhóm để được đưa hướng giải quyết."
        }
      ]
    }
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "Was trägt die Lehrkraft nach jeder Stunde in die Excel-Liste ein?",
        question_vi: "Sau mỗi buổi, giáo viên ghi gì vào file Excel?",
        section: "feedback-der-lehrkrafte",
        options: [
          { de: "Für jeden Schüler: aktiv mitgemacht, Hausaufgabe, Verspätung, Kamera (online) und kurzes Feedback", vi: "Với từng học viên: tham gia tích cực, bài tập, đi trễ, camera (online) và nhận xét ngắn" },
          { de: "Nur, wer anwesend war", vi: "Chỉ ai có mặt" },
          { de: "Nur die Noten vom Mini-Test", vi: "Chỉ điểm mini-test" },
          { de: "Nichts, das macht Customer Success", vi: "Không gì, Customer Success ghi" }
        ],
        correct: 0
      },
      {
        question_de: "Eine Lehrkraft hat zwei Tage nichts eingetragen. Was machst du?",
        question_vi: "Giáo viên không ghi gì trong hai ngày. Bạn làm gì?",
        section: "feedback-der-lehrkrafte",
        options: [
          { de: "Nichts, sie trägt es schon nach", vi: "Không làm gì, giáo viên sẽ bổ sung" },
          { de: "Die Klasse informieren", vi: "Báo cho lớp" },
          { de: "Im Tagesbericht im Backoffice notieren: Klasse, Tage, Abzug und Screenshot", vi: "Ghi vào báo cáo ngày trong Backoffice: lớp, ngày, số tiền trừ và ảnh chụp" },
          { de: "Selbst für sie ausfüllen", vi: "Tự điền giúp" }
        ],
        correct: 2
      },
      {
        question_de: "Wo findest du die Excel-Liste einer Klasse?",
        question_vi: "Bạn tìm file Excel của một lớp ở đâu?",
        section: "feedback-der-lehrkrafte",
        options: [
          { de: "In der Zalo-Gruppe der Klasse", vi: "Trong nhóm Zalo của lớp" },
          { de: "In NaNu Go", vi: "Trong NaNu Go" },
          { de: "Im Google Kalender der Lehrkraft: Termin öffnen, Link unter „Google Drive“", vi: "Trên Google Calendar của giáo viên: mở lịch, link dưới „Google Drive“" },
          { de: "Im Messenger-Postfach", vi: "Trong hộp thư Messenger" }
        ],
        correct: 2
      },
      {
        question_de: "Eine Lehrkraft fällt morgen aus. Was passiert zuerst?",
        question_vi: "Giáo viên sẽ vắng ngày mai. Việc gì xảy ra trước?",
        section: "wenn-eine-lehrkraft-ausfallt",
        options: [
          { de: "Sie meldet sich beim Zentrum – die Klasse erfährt es erst, wenn klar ist, ob es Ersatz gibt", vi: "Giáo viên báo trung tâm – lớp chỉ được báo khi đã rõ có người thay hay không" },
          { de: "Sie sagt es direkt der Klasse", vi: "Giáo viên báo thẳng cho lớp" },
          { de: "Wir warten bis Montag", vi: "Chờ đến thứ Hai" },
          { de: "Die Stunde fällt ohne Nachricht aus", vi: "Buổi học bị hủy không báo" }
        ],
        correct: 0
      },
      {
        question_de: "In Deutschland ist am 3.10. Feiertag. Wer hat frei?",
        question_vi: "Ngày 3.10 là ngày lễ ở Đức. Ai được nghỉ?",
        section: "wenn-eine-lehrkraft-ausfallt",
        options: [
          { de: "Alle Klassen die ganze Woche", vi: "Tất cả các lớp cả tuần" },
          { de: "Nur wer an genau diesem Tag Unterricht hätte – andere Klassen finden statt", vi: "Chỉ lớp có lịch học đúng ngày đó – các lớp khác vẫn học" },
          { de: "Nur Klassen in Vietnam", vi: "Chỉ các lớp ở Việt Nam" },
          { de: "Niemand", vi: "Không ai" }
        ],
        correct: 1
      },
      {
        question_de: "Ein Schüler sagt: „Die Klasse ist zu groß, ich komme selten dran.“ Was machst du?",
        question_vi: "Học viên nói: „Lớp đông quá, ít khi được gọi.“ Bạn làm gì?",
        section: "typische-beschwerden-uber-den-unterricht",
        options: [
          { de: "Die Nachricht einfach an die Lehrkraft weiterleiten", vi: "Chỉ chuyển tiếp tin nhắn cho giáo viên" },
          { de: "Der Lehrkraft genau schreiben, was gesagt wurde, um etwas Konkretes bitten und nach der nächsten Stunde nachfragen", vi: "Nhắn giáo viên đúng điều học viên nói, đề nghị cụ thể và hỏi lại sau buổi sau" },
          { de: "Sagen, dass man das nicht ändern kann", vi: "Nói là không thay đổi được" },
          { de: "Sofort eine andere Klasse anbieten", vi: "Đề nghị chuyển lớp ngay" }
        ],
        correct: 1
      },
      {
        question_de: "Ein Schüler zweifelt an der Qualifikation der Lehrkraft und will ihr Zeugnis sehen. Was machst du?",
        question_vi: "Học viên nghi ngờ trình độ giáo viên và muốn xem bằng cấp. Bạn làm gì?",
        section: "typische-beschwerden-uber-den-unterricht",
        options: [
          { de: "Das Zeugnis sofort aus dem Drive schicken", vi: "Gửi ngay bằng từ Drive" },
          { de: "Sagen, dass das nicht seine Sache ist", vi: "Nói đó không phải việc của học viên" },
          { de: "Ernst nehmen, Grund erfragen, an die Leitung geben – Zeugnisse nur nach Rücksprache verschicken", vi: "Coi trọng, hỏi lý do, chuyển quản lý – chỉ gửi bằng cấp khi đã hỏi quản lý" },
          { de: "Die Lehrkraft austauschen", vi: "Đổi giáo viên" }
        ],
        correct: 2
      },
      {
        question_de: "Eine Lehrkraft fiel aus und niemand hat es der Klasse gesagt. Was machst du?",
        question_vi: "Giáo viên nghỉ mà không ai báo lớp. Bạn làm gì?",
        section: "wenn-eine-lehrkraft-ausfallt",
        options: [
          { de: "Nichts mehr sagen, es ist schon vorbei", vi: "Không nói gì nữa, chuyện đã qua" },
          { de: "Der Lehrkraft die Schuld geben", vi: "Đổ lỗi cho giáo viên" },
          { de: "Am nächsten Tag ehrlich entschuldigen – es war unser Fehler – und den Text vorher der Leitung zeigen", vi: "Ngay hôm sau xin lỗi lớp thật lòng – đây là lỗi của trung tâm – và gửi quản lý duyệt trước" },
          { de: "Eine Gutschrift anbieten, ohne zu fragen", vi: "Tự đề nghị bù tiền mà không hỏi ai" }
        ],
        correct: 2
      },
      {
        question_de: "Was muss eine Lehrkraft im Unterricht immer tun?",
        question_vi: "Giáo viên luôn phải làm gì khi dạy?",
        section: "erwartungen",
        options: [
          { de: "Den Bildschirm mit Classroom teilen und „Tipps anzeigen“ anklicken, damit die Schüler den Text zum Hören sehen", vi: "Share màn hình Classroom và ấn „Tipps anzeigen“ để học viên thấy text bài nghe" },
          { de: "Nur aus dem Buch vorlesen", vi: "Chỉ đọc theo sách" },
          { de: "Die Kamera ausschalten", vi: "Tắt camera" },
          { de: "Am Ende 10 Minuten früher Schluss machen", vi: "Cho lớp nghỉ sớm 10 phút" }
        ],
        correct: 0
      },
      {
        question_de: "Du hospitierst in einer Online-Stunde. Wie trittst du in Zoom auf?",
        question_vi: "Bạn vào dự giờ một lớp online. Bạn vào Zoom thế nào?",
        section: "hospitieren",
        options: [
          { de: "Mit Kamera, damit die Lehrkraft dich sieht", vi: "Bật cam để giáo viên thấy mình" },
          { de: "Mit deinem Vornamen, und du stellst Fragen", vi: "Dùng tên riêng và đặt câu hỏi" },
          { de: "Ohne die Lehrkraft vorher zu informieren", vi: "Không báo giáo viên trước" },
          { de: "Kamera und Mikrofon aus, Name „NaNuNaNa - Dự giờ“, 10–20 Minuten", vi: "Tắt cam và mic, tên „NaNuNaNa - Dự giờ“, 10–20 phút" }
        ],
        correct: 3
      }
    ]
  }
};

export default page;
