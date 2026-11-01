import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "nach-der-zahlung",
  title_de: "Nach der Zahlung: die ersten 48 Stunden",
  title_vi: "Sau khi khách chuyển khoản: 48 giờ đầu tiên",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Im Oktober mussten neue Schüler oft drei- oder viermal nachfragen, bis Material, Klassengruppe und App funktionierten. Typisch: Erst klappt der App-Login nicht, dann Classroom, dann ist unklar, welche PDF gedruckt werden soll – jede Frage an einem anderen Tag. Und jede fällt in die zwei Probestunden – genau dann, wenn sie entscheidet, ob sie bleibt.",
      vi: "Tháng 10, học viên mới thường phải hỏi ba, bốn lần mới nhận đủ tài liệu, vào được nhóm lớp và app. Thường gặp: đầu tiên không đăng nhập được app, rồi đến Classroom, rồi không biết in file nào – mỗi câu hỏi một ngày khác nhau. Và tất cả đều rơi vào hai buổi học thử – đúng lúc học viên quyết định có học tiếp hay không."
    },
    {
      type: "callout",
      tone: "info",
      de: "Ziel: Nach 48 Stunden hat die Person alles, ohne selbst nachfragen zu müssen – und weiß, wo sie was findet.",
      vi: "Mục tiêu: sau 48 giờ học viên có đủ mọi thứ mà không phải tự hỏi – và biết tìm cái gì ở đâu."
    },
    {
      type: "paragraph",
      de: "Diese Schritte macht Customer Success – wer gerade Schicht hat, auch abends und am Wochenende. Sales meldet die Zahlung nur in Slack weiter und schickt selbst nichts mehr.",
      vi: "Các bước này do đội Chăm sóc học viên làm – ai đang trực ca thì làm, kể cả buổi tối và cuối tuần. Sales chỉ báo việc đóng tiền lên Slack và không tự gửi gì thêm cho học viên."
    },
    { type: "heading", de: "Die Schritte", vi: "Các bước" },
    {
      type: "steps",
      items: [
        {
          de: "Beleg sofort bestätigen",
          vi: "Xác nhận biên lai ngay",
          body_de: "„Đã nhận được“ innerhalb einer Stunde (in der Arbeitszeit). Wer nach dem Beleg nichts hört, fragt nach – und macht sich Sorgen um sein Geld.",
          body_vi: "Trả lời „đã nhận được“ trong vòng một tiếng (trong giờ làm việc). Gửi biên lai mà không thấy ai xác nhận, học viên sẽ phải hỏi lại – và lo cho khoản tiền của mình."
        },
        {
          de: "Daten zurückbestätigen",
          vi: "Xác nhận lại thông tin",
          body_de: "Name, E-Mail, Telefonnummer, Klasse (Code, Niveau, Uhrzeit), gezahlter Betrag (ganzer oder halber Kurs). So fallen Tippfehler in der E-Mail sofort auf – sonst klappt später der App-Login nicht. Für die Rechnung zusätzlich die Adresse erfragen – siehe „[Vormerken, Zahlung & Rechnung](sales/anmeldung-und-zahlung)“.",
          body_vi: "Tên, email, số điện thoại, lớp (mã lớp, trình độ, giờ học), số tiền đã đóng (cả khoá hay nửa khoá). Như vậy sai sót trong email lộ ra ngay – nếu không, sau này sẽ không đăng nhập được app. Để xuất hoá đơn, xin thêm địa chỉ – xem trang „[Ghi danh trước, đóng học phí & hoá đơn](sales/anmeldung-und-zahlung)“."
        },
        {
          de: "Kanal festlegen",
          vi: "Chốt kênh liên lạc",
          body_de: "Fragen, wo die Person erreichbar ist: Zalo, WhatsApp oder Messenger. Nicht alle nutzen Zalo.",
          body_vi: "Hỏi học viên liên lạc qua đâu tiện nhất: Zalo, WhatsApp hay Messenger. Không phải ai cũng dùng Zalo."
        },
        {
          de: "Onboarding-E-Mail mit Material",
          vi: "Gửi email onboarding kèm tài liệu",
          body_de: "Im Text sagen, welche Datei das Kursbuch zum Ausdrucken ist und welcher Teil (A1.1 oder A1.2) jetzt dran ist.",
          body_vi: "Ghi rõ trong mail file nào là sách để in và phần nào (A1.1 hay A1.2) đang học."
        },
        {
          de: "In die Klassengruppe aufnehmen",
          vi: "Thêm vào nhóm lớp",
          body_de: "Zoom-Link, Hausaufgaben und Unterrichtsdateien kommen in die Gruppe. Wer nicht in der Gruppe ist, bekommt den Zoom-Link vor jeder Stunde persönlich.",
          body_vi: "Link Zoom, bài tập và file bài giảng đều gửi trong nhóm. Ai không ở trong nhóm thì nhận link Zoom riêng trước mỗi buổi."
        },
        {
          de: "NaNu Go und Classroom freischalten",
          vi: "Mở quyền NaNu Go và Classroom",
          body_de: "App-Link schicken und dazuschreiben: Anmelden mit genau der E-Mail, die wir haben. Für Classroom gleich den Klassencode oder Einladungslink mitschicken – nicht auf die erste Stunde warten.",
          body_vi: "Gửi link app và ghi rõ: đăng nhập bằng đúng email đã gửi trung tâm. Với Classroom gửi luôn mã lớp hoặc link mời – đừng đợi đến buổi đầu."
        },
        {
          de: "Adresse fürs Handbuch",
          vi: "Xin địa chỉ gửi sách Handbuch",
          body_de: "Wenn das Handbuch zum Angebot gehört: Adresse und Telefonnummer für den Versand erfragen – und sagen, dass das Kursbuch selbst als PDF kommt.",
          body_vi: "Nếu gói học có tặng sách Handbuch: xin địa chỉ và số điện thoại nhận hàng – và nói rõ sách giáo khoa sẽ gửi dạng file PDF."
        },
        {
          de: "Erinnerung vor der ersten Stunde",
          vi: "Nhắc trước buổi đầu",
          body_de: "Datum und Uhrzeit nennen – bei Online-Kursen in beiden Zeitzonen. Steht die Zeitumstellung an, die neue Uhrzeit dazuschreiben.",
          body_vi: "Nêu ngày và giờ – lớp online thì ghi cả giờ VN và giờ Đức. Nếu sắp đổi giờ mùa đông/hè thì ghi luôn giờ mới."
        },
        {
          de: "Nach der zweiten Stunde nachfragen",
          vi: "Hỏi thăm sau buổi thứ hai",
          body_de: "„Konntest du dich in der App anmelden und schon eine Übung machen?“ Das ist das Ende der Probezeit – Probleme jetzt lösen, nicht später.",
          body_vi: "„Chị đã vào được app và làm bài nào chưa ạ?“ Đây là lúc kết thúc học thử – giải quyết vướng mắc ngay bây giờ, đừng để sau."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Daten zurückbestätigen",
      label_vi: "Mẫu · Xác nhận lại thông tin",
      text: "Dạ trung tâm đã nhận được học phí của [tên] rồi ạ, cảm ơn [chị/anh/bạn] nhiều! Trung tâm xác nhận lại thông tin nha:\n- Tên: …\n- Email: …\n- SĐT: …\n- Lớp: … (khai giảng …, học … giờ VN / … giờ Đức)\n- Đã đóng: …\n[Chị/Anh/Bạn] tiện liên lạc qua Zalo, WhatsApp hay Messenger ạ? Trung tâm sẽ gửi tài liệu, link app và thêm [chị/anh/bạn] vào nhóm lớp ngay hôm nay ạ.",
      translation_de: "„Wir haben die Kursgebühr von [Name] erhalten, vielen Dank! Kurz zur Bestätigung: Name, E-Mail, Telefon, Klasse (Start …, Uhrzeit VN / DE), gezahlt: … Wo erreichen wir dich am besten – Zalo, WhatsApp oder Messenger? Material, App-Link und Klassengruppe kommen noch heute.“"
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
      de: "Fünf Kanäle auf einmal (Mail, Zalo-Gruppe, App, Classroom, Zoom) verwirren. Schick die Zusammenfassung oben als eine Nachricht – nicht verteilt über mehrere Tage.",
      vi: "Năm kênh cùng lúc (mail, nhóm Zalo, app, Classroom, Zoom) rất dễ rối. Gửi bản tóm tắt ở trên thành một tin – đừng rải ra nhiều ngày."
    },
    {
      type: "callout",
      tone: "tip",
      de: "Zeitumstellung: Ende Oktober und Ende März verschiebt sich die Uhrzeit im anderen Land um eine Stunde. Sag es der Klasse eine Woche vorher, mit beiden Uhrzeiten.",
      vi: "Đổi giờ: cuối tháng 10 và cuối tháng 3, giờ học ở nước còn lại sẽ lệch đi một tiếng. Báo cho lớp trước một tuần, ghi cả hai múi giờ."
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Was ist das Ziel der ersten 48 Stunden nach der Zahlung?",
        question_vi: "Mục tiêu của 48 giờ đầu sau khi đóng tiền là gì?",
        options: [
          { de: "Die Person hat alles, ohne selbst nachfragen zu müssen, und weiß, wo sie was findet", vi: "Học viên có đủ mọi thứ mà không cần hỏi và biết tìm gì ở đâu" },
          { de: "Die Person hat die Rechnung bekommen", vi: "Học viên nhận được hóa đơn" },
          { de: "Die Person hat den nächsten Kurs gebucht", vi: "Học viên đã đăng ký khóa tiếp" },
          { de: "Die Person hat die erste Hausaufgabe abgegeben", vi: "Học viên đã nộp bài tập đầu tiên" }
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
          { de: "Gar nicht, das sieht die Person selbst", vi: "Không cần, khách tự biết" },
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
          { de: "Damit die Person sich nicht langweilt", vi: "Để khách không chán" },
          { de: "Für die Werbung", vi: "Để làm quảng cáo" }
        ],
        correct: 1
      },
      {
        question_de: "Was schreibst du in die Onboarding-E-Mail?",
        question_vi: "Bạn ghi gì trong email onboarding?",
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
      }
    ]
  }
};

export default page;
