import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "nach-der-zahlung",
  title_de: "Nach der Zahlung: die ersten 48 Stunden",
  title_vi: "Sau khi khách chuyển khoản: 48 giờ đầu tiên",
  kind: "process",
  section: "handbook",
  verified_until: "2027-05-01",
  updated_at: "2026-11-01",
  body: [
    {
      type: "paragraph",
      de: "Im Oktober mussten neue Schüler oft drei- oder viermal nachfragen, bis alles lief. Erst klappte der Login in der App nicht, dann Classroom, dann wussten sie nicht, welche PDF sie drucken sollen. Jede Frage kam an einem anderen Tag.\nDas alles passierte in den ersten zwei Stunden. Das sind Probestunden: Danach entscheidet der Schüler, ob er bleibt.",
      vi: "Tháng 10, học viên mới thường phải hỏi ba, bốn lần thì mọi thứ mới chạy được. Đầu tiên không đăng nhập được app, rồi đến Classroom, rồi không biết in file PDF nào. Mỗi câu hỏi đến vào một ngày khác nhau.\nTất cả xảy ra trong hai buổi học đầu. Đây là hai buổi học thử: sau đó học viên quyết định có học tiếp hay không."
    },
    {
      type: "callout",
      tone: "info",
      de: "Ziel: 48 Stunden nach der Zahlung hat der Schüler alles, was er braucht, ohne nachzufragen. Und er weiß, wo er was findet.",
      vi: "Mục tiêu: 48 giờ sau khi đóng tiền, học viên có đủ mọi thứ cần thiết mà không phải hỏi. Và học viên biết tìm cái gì ở đâu."
    },
    {
      type: "paragraph",
      de: "Diese Schritte macht Customer Success. Das ist das Team, das sich ab der Zahlung um die Schüler kümmert. Wer gerade Schicht hat, macht sie – auch abends und am Wochenende.\nSales meldet die Zahlung nur in Slack und schickt dem Schüler danach nichts mehr.",
      vi: "Các bước này do đội Chăm sóc học viên làm. Đây là đội lo cho học viên từ lúc học viên đóng tiền. Ai đang trực ca thì làm – kể cả buổi tối và cuối tuần.\nSales chỉ báo việc đóng tiền lên Slack và sau đó không gửi gì thêm cho học viên."
    },
    { type: "heading", de: "Die Schritte", vi: "Các bước" },
    {
      type: "steps",
      items: [
        {
          de: "Zahlung sofort bestätigen",
          vi: "Xác nhận đã nhận tiền ngay",
          body_de: "Der Schüler schickt dir einen Beleg, also ein Foto oder einen Screenshot der Überweisung. Antworte innerhalb einer Stunde mit „Đã nhận được“ („Ist angekommen“). Das gilt in der Arbeitszeit.\nHört der Schüler nichts, fragt er nach und macht sich Sorgen um sein Geld.",
          body_vi: "Học viên gửi cho bạn biên lai, tức là ảnh hoặc ảnh chụp màn hình chuyển khoản. Bạn trả lời „Đã nhận được“ trong vòng một tiếng. Việc này áp dụng trong giờ làm việc.\nNếu không ai trả lời, học viên sẽ hỏi lại và lo cho tiền của mình."
        },
        {
          de: "Daten zurückbestätigen",
          vi: "Xác nhận lại thông tin",
          body_de: "Schick dem Schüler seine Daten zur Kontrolle zurück (Vorlage unten):\n– Name,\n– E-Mail,\n– Telefonnummer,\n– Klasse mit Code, Niveau und Uhrzeit,\n– und wie viel er bezahlt hat (ganzer oder halber Kurs).\nSo fallen Tippfehler in der E-Mail sofort auf. Sonst klappt später der Login in der App nicht.\nFür die Rechnung fragst du zusätzlich nach der Adresse – siehe „[Vormerken, Zahlung & Rechnung](sales/anmeldung-und-zahlung)“.",
          body_vi: "Gửi lại thông tin cho học viên kiểm tra (mẫu ở dưới):\n– họ tên,\n– email,\n– số điện thoại,\n– lớp gồm mã lớp, trình độ và giờ học,\n– và số tiền đã đóng (cả khoá hay nửa khoá).\nNhư vậy lỗi gõ sai email lộ ra ngay. Nếu không, sau này học viên sẽ không đăng nhập được app.\nĐể xuất hoá đơn, bạn xin thêm địa chỉ – xem trang „[Ghi danh trước, đóng học phí & hoá đơn](sales/anmeldung-und-zahlung)“."
        },
        {
          de: "Begrüßungs-E-Mail mit Material schicken",
          vi: "Gửi email chào mừng kèm tài liệu",
          body_de: "Schreib in die E-Mail, welche Datei das Kursbuch zum Ausdrucken ist. Schreib auch, welcher Teil gerade dran ist: A1.1 oder A1.2.",
          body_vi: "Ghi trong email file nào là sách để in. Ghi luôn phần nào đang học: A1.1 hay A1.2."
        },
        {
          de: "In die Klassengruppe aufnehmen",
          vi: "Thêm vào nhóm lớp",
          body_de: "Die Klassengruppe ist der Gruppenchat der Klasse. Dort kommen der Zoom-Link, die Hausaufgaben und die Unterrichtsdateien hinein.\nIst ein Schüler nicht in der Gruppe, bekommt er den Zoom-Link vor jeder Stunde persönlich.",
          body_vi: "Nhóm lớp là nhóm chat chung của lớp. Link Zoom, bài tập và file bài giảng đều được gửi trong nhóm.\nHọc viên nào không ở trong nhóm thì nhận link Zoom riêng trước mỗi buổi."
        },
        {
          de: "Zugang zu NaNu Go und Classroom schicken",
          vi: "Gửi quyền vào NaNu Go và Classroom",
          body_de: "Schick den Link zur App NaNu Go. Schreib dazu: „Melde dich mit genau der E-Mail an, die du uns gegeben hast.“\nFür Google Classroom schickst du gleich den Klassencode oder den Einladungslink mit. Warte damit nicht bis zur ersten Stunde.",
          body_vi: "Gửi link app NaNu Go. Ghi kèm: „Đăng nhập bằng đúng email đã gửi cho trung tâm.“\nVới Google Classroom, gửi luôn mã lớp hoặc link mời. Đừng đợi đến buổi học đầu."
        },
        {
          de: "Adresse fürs Handbuch erfragen",
          vi: "Xin địa chỉ gửi sách Handbuch",
          body_de: "Gehört das Handbuch zum Angebot, schicken wir es per Post. Dann fragst du nach Adresse und Telefonnummer für den Versand.\nSag dazu: Das Kursbuch selbst kommt als PDF.",
          body_vi: "Nếu gói học có sách Handbuch, trung tâm gửi sách qua bưu điện. Khi đó bạn xin địa chỉ và số điện thoại nhận hàng.\nNói rõ thêm: sách giáo khoa thì gửi dạng file PDF."
        },
        {
          de: "Vor der ersten Stunde erinnern",
          vi: "Nhắc trước buổi đầu",
          body_de: "Nenn Datum und Uhrzeit der ersten Stunde. Bei Online-Kursen schreibst du die Uhrzeit in Vietnam und in Deutschland.\nKommt bald die Zeitumstellung, schreib die neue Uhrzeit dazu (siehe Tipp unten).",
          body_vi: "Nêu ngày và giờ của buổi đầu. Lớp online thì ghi cả giờ Việt Nam và giờ Đức.\nNếu sắp đổi giờ, ghi luôn giờ mới (xem mẹo ở dưới)."
        },
        {
          de: "Direkt nach der ersten Stunde: erste Lektion in der App",
          vi: "Ngay sau buổi đầu: bài 1 trong app",
          body_de: "Ziel: Jeder Schüler hat nach der ersten Stunde die erste Lektion in der App NaNu Go gemacht. So sieht er, was die App bringt. Und er merkt, wie einfach er den Unterricht damit vor- und nachbereiten kann.\nSchreib dem Schüler deshalb sofort nach der ersten Stunde (Vorlage unten). Hat er die Lektion noch nicht gemacht, bring ihn dazu, sie gleich zu machen.\nKlappt der Login nicht, löst du das Problem sofort. Mit der zweiten Stunde enden schon die Probestunden.",
          body_vi: "Mục tiêu: học viên nào cũng làm xong bài 1 trong app NaNu Go ngay sau buổi học đầu. Như vậy học viên thấy app có ích thế nào. Và học viên thấy chuẩn bị bài trước và ôn bài sau buổi học bằng app rất dễ.\nVì vậy hãy nhắn học viên ngay sau buổi đầu (mẫu ở dưới). Nếu học viên chưa làm, hãy khuyến khích học viên làm luôn.\nNếu không đăng nhập được, giải quyết ngay. Buổi thứ hai đã là buổi học thử cuối cùng.",
          template: {
            label_de: "Vorlage · Nach der ersten Stunde",
            label_vi: "Mẫu · Sau buổi học đầu",
            text: "Dạ buổi học đầu tiên thế nào [chị/anh/bạn]? [Chị/Anh/Bạn] đã vào app NaNu Go và làm bài 1 chưa ạ?\nNếu chưa thì [chị/anh/bạn] làm luôn hôm nay nha – ôn lại bài trên app dễ hơn nhiều, và buổi sau [chị/anh/bạn] sẽ theo kịp lớp nhẹ nhàng hơn.\nNếu chưa đăng nhập được thì nhắn trung tâm ở đây, trung tâm hỗ trợ ngay ạ!",
            translation_de: "„Wie war die erste Stunde? Hast du dich schon in der App NaNu Go angemeldet und Lektion 1 gemacht? Wenn nicht, mach sie am besten heute noch – mit der App wiederholst du viel leichter, und in der nächsten Stunde kommst du entspannter mit. Klappt der Login nicht, schreib uns hier, wir helfen sofort!“"
          }
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Daten zurückbestätigen",
      label_vi: "Mẫu · Xác nhận lại thông tin",
      text: "Dạ trung tâm đã nhận được học phí của [tên] rồi ạ, cảm ơn [chị/anh/bạn] nhiều! Trung tâm xác nhận lại thông tin nha:\n- Tên: …\n- Email: …\n- SĐT: …\n- Lớp: … (khai giảng …, học … giờ VN / … giờ Đức)\n- Đã đóng: …\n[Chị/Anh/Bạn] kiểm tra giúp trung tâm, nhất là email, vì [chị/anh/bạn] sẽ đăng nhập app bằng email này ạ. Trung tâm sẽ gửi tài liệu, link app và thêm [chị/anh/bạn] vào nhóm lớp ngay hôm nay ạ.",
      translation_de: "„Wir haben die Kursgebühr von [Name] erhalten, vielen Dank! Kurz zur Bestätigung: Name, E-Mail, Telefon, Klasse (Start …, Uhrzeit VN / DE), gezahlt: … Bitte prüf alles, vor allem die E-Mail – mit ihr meldest du dich in der App an. Material, App-Link und Klassengruppe kommen noch heute.“"
    },
    {
      type: "template",
      label_de: "Vorlage · Alles auf einen Blick",
      label_vi: "Mẫu · Tóm tắt mọi thứ",
      text: "Dạ trung tâm gửi [chị/anh/bạn] mọi thứ để bắt đầu nha:\n📧 Tài liệu: đã gửi qua mail – sách để in là file „…“, mình đang học quyển A1.1\n👥 Nhóm lớp: link Zoom, bài tập và bài giảng sau mỗi buổi đều ở trong nhóm\n📱 App NaNu Go: [link] – đăng nhập bằng email …\n📝 Classroom: mã lớp …\n🗓 Buổi đầu: thứ … ngày …, … giờ VN / … giờ Đức\nCó gì chưa rõ [chị/anh/bạn] cứ nhắn trung tâm ở đây nha!",
      translation_de: "„Hier alles für den Start: Material per Mail (Druckdatei „…“, wir sind bei A1.1), Klassengruppe mit Zoom-Link und Hausaufgaben, App-Link mit Login-E-Mail, Classroom-Code, erste Stunde am … um … (VN) / … (DE). Bei Fragen einfach hier schreiben!“"
    },
    {
      type: "callout",
      tone: "warning",
      de: "Mail, Klassengruppe, App, Classroom und Zoom: Fünf Kanäle auf einmal verwirren. Schick deshalb die Vorlage „Alles auf einen Blick“ als eine einzige Nachricht. Verteil die Infos nicht über mehrere Tage.",
      vi: "Mail, nhóm lớp, app, Classroom và Zoom: năm kênh cùng lúc rất dễ rối. Vì vậy hãy gửi mẫu „Tóm tắt mọi thứ“ thành một tin nhắn duy nhất. Đừng rải thông tin ra nhiều ngày."
    },
    {
      type: "callout",
      tone: "tip",
      de: "Zeitumstellung: Ende Oktober und Ende März stellt Deutschland die Uhr um, Vietnam nicht. Dadurch verschiebt sich die Uhrzeit im anderen Land um eine Stunde. Sag es der Klasse eine Woche vorher und nenn beide Uhrzeiten.",
      vi: "Đổi giờ: cuối tháng 10 và cuối tháng 3, Đức đổi giờ, Việt Nam thì không. Vì vậy giờ học ở nước còn lại lệch đi một tiếng. Báo cho lớp trước một tuần và ghi cả hai giờ."
    }
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "Was ist das Ziel der ersten 48 Stunden nach der Zahlung?",
        question_vi: "Mục tiêu của 48 giờ đầu sau khi đóng tiền là gì?",
        options: [
          { de: "Der Schüler hat alles, ohne selbst nachfragen zu müssen, und weiß, wo er was findet", vi: "Học viên có đủ mọi thứ mà không cần hỏi và biết tìm gì ở đâu" },
          { de: "Der Schüler hat die Rechnung bekommen", vi: "Học viên nhận được hóa đơn" },
          { de: "Der Schüler hat den nächsten Kurs gebucht", vi: "Học viên đã đăng ký khóa tiếp" },
          { de: "Der Schüler hat die erste Hausaufgabe abgegeben", vi: "Học viên đã nộp bài tập đầu tiên" }
        ],
        correct: 0
      },
      {
        question_de: "Wie schnell bestätigst du den Zahlungsbeleg?",
        question_vi: "Bạn xác nhận biên lai chuyển khoản nhanh thế nào?",
        section: "die-schritte",
        options: [
          { de: "Am nächsten Tag", vi: "Ngày hôm sau" },
          { de: "Wenn die Buchhaltung es geprüft hat, nach einer Woche", vi: "Sau một tuần khi kế toán kiểm tra" },
          { de: "Gar nicht, das sieht der Schüler selbst", vi: "Không cần, khách tự biết" },
          { de: "Innerhalb einer Stunde (in der Arbeitszeit)", vi: "Trong vòng một giờ (giờ làm việc)" }
        ],
        correct: 3
      },
      {
        question_de: "Warum bestätigst du Name, E-Mail und Telefonnummer noch einmal zurück?",
        question_vi: "Vì sao bạn xác nhận lại tên, email và số điện thoại?",
        section: "die-schritte",
        options: [
          { de: "Weil es das Gesetz verlangt", vi: "Vì luật yêu cầu" },
          { de: "Damit Tippfehler in der E-Mail sofort auffallen – sonst klappt später der App-Login nicht", vi: "Để phát hiện ngay lỗi gõ email – nếu không sau này không đăng nhập app được" },
          { de: "Damit der Schüler sich nicht langweilt", vi: "Để khách không chán" },
          { de: "Für die Werbung", vi: "Để làm quảng cáo" }
        ],
        correct: 1
      },
      {
        question_de: "Was schreibst du in die Begrüßungs-E-Mail?",
        question_vi: "Bạn ghi gì trong email chào mừng?",
        section: "die-schritte",
        options: [
          { de: "Welche Datei das Kursbuch zum Ausdrucken ist und welcher Teil (A1.1 oder A1.2) jetzt dran ist", vi: "File nào là sách để in và đang học phần nào (A1.1 hay A1.2)" },
          { de: "Nur „Willkommen“", vi: "Chỉ „Chào mừng“" },
          { de: "Die Preise der nächsten Kurse", vi: "Giá các khóa tiếp theo" },
          { de: "Die Kontonummer", vi: "Số tài khoản" }
        ],
        correct: 0
      },
      {
        question_de: "Wie schickst du die Infos zum Start (Mail, Gruppe, App, Classroom, Zoom)?",
        question_vi: "Bạn gửi thông tin bắt đầu học (mail, nhóm, app, Classroom, Zoom) thế nào?",
        section: "die-schritte",
        options: [
          { de: "Über mehrere Tage verteilt", vi: "Chia ra nhiều ngày" },
          { de: "Als eine Zusammenfassung in einer Nachricht", vi: "Gom thành một tin nhắn tóm tắt" },
          { de: "Jede Info in einem anderen Kanal", vi: "Mỗi thông tin một kênh" },
          { de: "Nur auf Nachfrage", vi: "Chỉ khi khách hỏi" }
        ],
        correct: 1
      },
      {
        question_de: "Ende Oktober ist Zeitumstellung. Was machst du?",
        question_vi: "Cuối tháng 10 đổi giờ. Bạn làm gì?",
        section: "die-schritte",
        options: [
          { de: "Nichts, das merken alle selbst", vi: "Không làm gì, ai cũng tự biết" },
          { de: "Am Tag selbst Bescheid geben", vi: "Báo ngay trong ngày" },
          { de: "Der Klasse eine Woche vorher Bescheid geben, mit beiden Uhrzeiten", vi: "Báo lớp trước một tuần, ghi cả hai múi giờ" },
          { de: "Den Unterricht eine Woche ausfallen lassen", vi: "Cho lớp nghỉ một tuần" }
        ],
        correct: 2
      },
      {
        question_de: "Wann soll der Schüler die erste Lektion in der App NaNu Go gemacht haben?",
        question_vi: "Khi nào học viên cần làm xong bài 1 trong app NaNu Go?",
        section: "die-schritte",
        options: [
          { de: "Irgendwann während des Kurses, wenn er Lust hat", vi: "Lúc nào trong khoá cũng được, khi học viên muốn" },
          { de: "Direkt nach der ersten Stunde – du schreibst ihm sofort und bringst ihn dazu", vi: "Ngay sau buổi đầu – bạn nhắn ngay và khuyến khích học viên làm" },
          { de: "Erst nach dem Ende der Probestunden", vi: "Chỉ sau khi hết buổi học thử" },
          { de: "Vor dem Mini-Test am Ende der Stufe", vi: "Trước bài kiểm tra cuối trình độ" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
