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
      de: "Im Oktober mussten neue Teilnehmende oft drei- oder viermal nachfragen, bis Material, Klassengruppe und App funktionierten. Typisch: Erst klappt der App-Login nicht, dann Classroom, dann ist unklar, welche PDF gedruckt werden soll – jede Frage an einem anderen Tag. Und jede fällt in die zwei Probestunden – genau dann, wenn sie entscheidet, ob sie bleibt.",
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
          body_de: "Name, E-Mail, Telefonnummer, Klasse (Code, Niveau, Uhrzeit), gezahlter Betrag (ganzer oder halber Kurs). So fallen Tippfehler in der E-Mail sofort auf – sonst klappt später der App-Login nicht. Für die Rechnung zusätzlich Adresse und die Nummer des Personalausweises (CCCD) erfragen – siehe „Vormerken, Zahlung & Rechnung“.",
          body_vi: "Tên, email, số điện thoại, lớp (mã lớp, trình độ, giờ học), số tiền đã đóng (cả khoá hay nửa khoá). Như vậy sai sót trong email lộ ra ngay – nếu không, sau này sẽ không đăng nhập được app. Để xuất hoá đơn, xin thêm địa chỉ và số CCCD – xem trang „Ghi danh trước, đóng học phí & hoá đơn“."
        },
        {
          de: "Kanal festlegen",
          vi: "Chốt kênh liên lạc",
          body_de: "Fragen, wo die Person erreichbar ist: Zalo, WhatsApp oder Messenger. Nicht alle nutzen Zalo – siehe „Ein Kanal pro Teilnehmende“.",
          body_vi: "Hỏi học viên liên lạc qua đâu tiện nhất: Zalo, WhatsApp hay Messenger. Không phải ai cũng dùng Zalo – xem trang „Mỗi học viên một kênh“."
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
  ]
};

export default page;
