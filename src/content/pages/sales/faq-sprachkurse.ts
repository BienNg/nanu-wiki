import type { PageContent } from "@/lib/types";

// Sources: 271 Messenger conversations, 27.09.–27.10.2026. Answers follow what the team actually wrote back.
const page: PageContent = {
  slug: "faq-sprachkurse",
  title_de: "FAQ: Fragen zu Sprachkursen",
  title_vi: "FAQ: Câu hỏi về khóa học tiếng",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Gut die Hälfte aller Messenger-Chats dreht sich um Sprachkurse. Hier stehen die Fragen, die wirklich kommen – in der Reihenfolge, wie oft sie kommen – und wie wir sie beantworten.",
      vi: "Hơn một nửa số tin nhắn Messenger là về khóa học tiếng. Đây là những câu hỏi khách thật sự hỏi – xếp theo mức độ thường gặp – và cách chúng ta trả lời."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Am 14.10. hat das Team diese Preise bestätigt (online und vor Ort gleich): A1 13.800.000 → 11.800.000, A2 14.500.000 → 12.300.000, B1 15.000.000 → 12.800.000, B2 17.300.000 → 13.800.000 VND (−20 %). In Messenger wurden im Oktober aber auch Listenpreise von 16.799.000 genannt. Welcher Listenpreis gilt? Bis dahin den Endpreis nennen und den Listenpreis aus „Preise & Positionierung“.",
      vi: "Cần làm rõ: Ngày 14/10 team đã xác nhận học phí (online và offline như nhau): A1 13.800.000 → 11.800.000, A2 14.500.000 → 12.300.000, B1 15.000.000 → 12.800.000, B2 17.300.000 → 13.800.000 VND (giảm 20%). Nhưng trên Messenger tháng 10 cũng có lúc báo giá gốc 16.799.000. Giá gốc nào đúng? Trong lúc chờ, báo giá sau ưu đãi và giá gốc theo trang „Học phí & định vị“."
    },
    { type: "heading", de: "1. „Wie viel kostet der Kurs?“", vi: "1. „Học phí bao nhiêu?“" },
    {
      type: "paragraph",
      de: "Die häufigste Frage überhaupt – oft nur ein Klick auf den Anzeigen-Button „Chi phí trọn gói là bao nhiêu?“. Nenne den Preis sofort und vollständig: Listenpreis, Frühbucherpreis, was enthalten ist. Online und offline kosten gleich viel.",
      vi: "Câu hỏi phổ biến nhất – thường chỉ là một cú bấm nút quảng cáo „Chi phí trọn gói là bao nhiêu?“. Báo giá ngay và đầy đủ: giá gốc, giá ưu đãi đăng ký sớm, những gì đã bao gồm. Học online và offline cùng một mức học phí."
    },
    {
      type: "template",
      label_de: "Vorlage · Preis A1",
      label_vi: "Mẫu · Học phí A1",
      text: "Học phí cả khoá A1 (bao gồm A1.1 và A1.2) là [GIÁ GỐC] VND. Nếu bạn đóng sớm trước 1 tuần thì được ưu đãi còn [GIÁ ƯU ĐÃI] VND ạ. Học phí đã bao gồm tài liệu PDF, Google Classroom và app học NaNu Go miễn phí (bên ngoài mua là 49 Euro). Bạn học được khung giờ nào để trung tâm gửi lớp phù hợp ạ?",
      translation_de: "„Der ganze A1-Kurs (A1.1 und A1.2) kostet [LISTENPREIS] VND. Wer mindestens eine Woche vorher zahlt, bekommt ihn für [FRÜHBUCHERPREIS] VND. Enthalten sind PDF-Materialien, Google Classroom und die App NaNu Go (sonst 49 Euro). Welche Uhrzeit passt dir, damit wir dir den passenden Kurs schicken?“"
    },
    { type: "heading", de: "2. „Wann beginnt der nächste Kurs?“", vi: "2. „Khi nào khai giảng?“" },
    {
      type: "list",
      items: [
        { de: "Immer ein konkretes Datum und eine Uhrzeit nennen – nie nur „bald“.", vi: "Luôn nêu ngày và giờ cụ thể – không chỉ nói „sắp tới“." },
        { de: "Läuft ein passender Kurs schon (z. B. seit 8 Einheiten): Einstieg anbieten, verpasste Einheiten werden als 1:1-Stunden nachgeholt.", vi: "Nếu lớp phù hợp đã học được vài buổi (ví dụ 8 buổi): mời vào lớp, các buổi đã qua được học bù 1-1." },
        { de: "Kein passender Kurs in Sicht: Warteliste anbieten („Wir schreiben dir, sobald der B2-Kurs feststeht“) und im CRM mit Datum eintragen.", vi: "Chưa có lớp phù hợp: ghi tên vào danh sách chờ („Trung tâm sẽ nhắn bạn khi có lớp B2“) và ghi vào CRM kèm ngày." }
      ]
    },
    { type: "heading", de: "3. Uhrzeiten passen nicht", vi: "3. Khung giờ không phù hợp" },
    {
      type: "paragraph",
      de: "Der häufigste Grund, warum Interessenten abspringen. Frag zuerst, ob die Person in Vietnam oder in Deutschland lebt, und biete dann alle Zeitfenster dieser Zeitzone auf einmal an – nicht eins nach dem anderen.",
      vi: "Lý do phổ biến nhất khiến khách bỏ đi. Hỏi trước khách đang sống ở Việt Nam hay ở Đức, rồi gửi tất cả khung giờ của múi giờ đó cùng một lúc – không gửi từng khung một."
    },
    {
      type: "list",
      items: [
        { de: "Online, deutsche Zeit: morgens 8:00–9:30 (ab Winterzeit 7:00–8:30), nachmittags 14:30–16:00, abends 21:00–22:30", vi: "Online giờ Đức: sáng 8:00–9:30 (từ giờ mùa đông 7:00–8:30), chiều 14:30–16:00, tối 21:00–22:30" },
        { de: "Online, vietnamesische Zeit: mittags 13:00–14:30, abends 18:30–20:00 oder 20:30–22:00", vi: "Online giờ Việt Nam: trưa 13:00–14:30, tối 18:30–20:00 hoặc 20:30–22:00" },
        { de: "Vor Ort in Saigon und Hanoi: 9:00–11:30, 15:30–18:00 oder 18:00–20:30, 4 Termine pro Woche (Intensivkurs)", vi: "Offline tại Sài Gòn và Hà Nội: 9:00–11:30, 15:30–18:00 hoặc 18:00–20:30, 4 buổi/tuần (lớp cấp tốc)" },
        { de: "Online meist 3–4 Termine pro Woche à 1,5 Stunden (z. B. Mo-Do-Fr-Sa oder Mo-Mi-Fr)", vi: "Online thường 3–4 buổi/tuần, mỗi buổi 1,5 tiếng (ví dụ thứ 2-5-6-7 hoặc 2-4-6)" }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Schichtarbeit, keine festen freien Tage, nur 2× pro Woche? Ehrlich sagen, dass Gruppenkurse feste Termine haben. Biete einen späteren Kurs oder die Warteliste an und frag nach dem Monat, in dem es besser passt.",
      vi: "Khách làm ca, không có ngày nghỉ cố định, chỉ học được 2 buổi/tuần? Nói thật là lớp nhóm có lịch cố định. Gợi ý lớp sau hoặc danh sách chờ, và hỏi tháng nào thì phù hợp hơn."
    },
    { type: "heading", de: "4. „Wie viele sind in einer Klasse?“", vi: "4. „Lớp bao nhiêu học viên?“" },
    {
      type: "list",
      items: [
        { de: "Online: 5–9 Teilnehmende", vi: "Online: 5–9 học viên" },
        { de: "Vor Ort: mindestens 8, höchstens 15", vi: "Offline: tối thiểu 8, tối đa 15 học viên" },
        { de: "Jede Klasse hat 1–2 feste Lehrkräfte vom Anfang bis zum Ende.", vi: "Mỗi lớp có 1–2 giáo viên cố định từ đầu đến cuối khóa." }
      ]
    },
    { type: "heading", de: "5. Online oder vor Ort? Wo seid ihr?", vi: "5. Online hay offline? Trung tâm ở đâu?" },
    {
      type: "list",
      items: [
        { de: "Vor Ort nur in Hanoi (Cầu Giấy) und Saigon (181 Cao Thắng). Keine Kurse in Đà Nẵng oder anderen Städten – dort online anbieten.", vi: "Offline chỉ có ở Hà Nội (Cầu Giấy) và Sài Gòn (181 Cao Thắng). Không có lớp ở Đà Nẵng hay tỉnh khác – hãy gợi ý học online." },
        { de: "Online-Unterricht läuft über Zoom; Termine und Links kommen in die Zalo-Klassengruppe.", vi: "Lớp online học qua Zoom; lịch và link được gửi trong nhóm lớp Zalo." },
        { de: "Wechsel zwischen Kursen (z. B. erst vor Ort in Vietnam, dann online nach deutscher Zeit) geht am besten zwischen zwei Stufen (nach A1.1 oder A1), weil jede Klasse ein anderes Tempo hat.", vi: "Muốn chuyển lớp (ví dụ học offline ở VN rồi chuyển online giờ Đức) thì nên chuyển giữa hai cấp độ (sau A1.1 hoặc A1), vì mỗi lớp có tiến độ khác nhau." },
        { de: "„Ist online genauso gut fürs Sprechen?“ – Ja: alle vier Fertigkeiten, regelmäßige Sprechübungen. Das Ergebnis hängt von Teilnahme und Hausaufgaben ab, nicht vom Format.", vi: "„Học online có luyện nói tốt không?“ – Có: đủ 4 kỹ năng, luyện nói thường xuyên. Kết quả phụ thuộc vào việc đi học đầy đủ và làm bài tập, không phụ thuộc hình thức học." }
      ]
    },
    { type: "heading", de: "6. Einzel- oder Kleingruppenunterricht", vi: "6. Lớp kèm 1-1 hoặc nhóm nhỏ" },
    {
      type: "paragraph",
      de: "Wir empfehlen ehrlich die Gruppe: allein verliert man schneller die Motivation. 1:1 bieten wir nur an, wenn kein Gruppenkurs passt (z. B. telc-Vorbereitung kurz vor der Prüfung) und eine Lehrkraft frei ist. Preis immer aus der aktuellen Liste – Beispiel Oktober: telc-B1-Vorbereitung 1:1 für 7.400.000 VND, 2–3 Termine pro Woche.",
      vi: "Chúng ta thật lòng khuyên học nhóm: học một mình dễ mất động lực. Lớp kèm 1-1 chỉ mở khi không có lớp nhóm phù hợp (ví dụ ôn thi telc sát ngày thi) và có giáo viên trống lịch. Giá luôn theo bảng hiện hành – ví dụ tháng 10: ôn thi telc B1 kèm 1-1 là 7.400.000 VND, 2–3 buổi/tuần."
    },
    { type: "heading", de: "7. Wie lange dauert es bis B1?", vi: "7. Học bao lâu thì lên B1?" },
    {
      type: "list",
      items: [
        { de: "Online: A1 = 40 Termine à 1,5 Stunden (A1.1 und A1.2 je 20), A2 = 42, B1 = 44. In Unterrichtsstunden à 45 Minuten: A1 80, A2 84, B1 88, B2 100.", vi: "Online: A1 = 40 buổi, mỗi buổi 1,5 tiếng (A1.1 và A1.2 mỗi phần 20 buổi), A2 = 42, B1 = 44. Tính theo tiết 45 phút: A1 80, A2 84, B1 88, B2 100." },
        { de: "Vor Ort: A1, A2 und B1 je 160 Unterrichtsstunden, B2 224 (à 45 Minuten).", vi: "Offline: A1, A2, B1 mỗi cấp 160 tiết, B2 224 tiết (1 tiết = 45 phút)." },
        { de: "Jede Stufe A1–B1 dauert mindestens 2,5–3 Monate. Schneller geht es nicht seriös – auch B2 nicht in 2 Monaten.", vi: "Mỗi cấp độ A1–B1 cần tối thiểu 2,5–3 tháng. Nhanh hơn thì không đảm bảo – B2 cũng không thể học trong 2 tháng." },
        { de: "Von null bis B1 also realistisch 8–9 Monate. Lieber ehrlich als ein Versprechen, das wir nicht halten.", vi: "Từ con số 0 đến B1 thực tế khoảng 8–9 tháng. Thà nói thật còn hơn hứa điều không làm được." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Wie viele Termine hat B2? Bisher stand hier 58. Die Liste vom 14.10. nennt online 100 Unterrichtsstunden (= 50 Termine); im Team wurden auch 56 Termine vor Ort und 45 Termine 1:1 genannt. Welche Zahl nennen wir?",
      vi: "Cần làm rõ: B2 có bao nhiêu buổi? Trước đây trang ghi 58. Bảng ngày 14/10 ghi online 100 tiết (= 50 buổi); trong team cũng có nhắc offline 56 buổi và kèm 1-1 45 buổi. Mình báo con số nào?"
    },
    { type: "heading", de: "8. Lehrbuch und Material", vi: "8. Giáo trình và tài liệu" },
    {
      type: "list",
      items: [
        { de: "Nach der Zahlung kommen PDF-Lehrbuch, Folien und Übungen per E-Mail, dazu Google Classroom und die App.", vi: "Sau khi đóng học phí, học viên nhận giáo trình PDF, slide và bài tập qua email, cùng Google Classroom và app." },
        { de: "Den Lehrplan hat NaNu NaNa selbst geschrieben; alle Lehrkräfte werden intern nach unserer Methode geschult.", vi: "Giáo trình do NaNu NaNa tự biên soạn; tất cả giáo viên đều được trung tâm đào tạo theo phương pháp riêng." },
        { de: "Das Arbeitsbuch lohnt sich gedruckt: in Vietnam ausdrucken, in Deutschland bei Thalia oder Amazon kaufen.", vi: "Nên in sách bài tập ra giấy: ở Việt Nam thì in, ở Đức thì mua ở Thalia hoặc Amazon." },
        { de: "Bücher verkaufen wir nicht an Nicht-Teilnehmende.", vi: "Trung tâm không bán sách cho người không học tại trung tâm." }
      ]
    },
    { type: "heading", de: "9. Wer unterrichtet?", vi: "9. Ai dạy?" },
    {
      type: "paragraph",
      de: "Je nach Klasse vietnamesische oder deutsche Lehrkräfte. Alle haben in Deutschland gelebt, studiert und einen Bachelor oder Master abgeschlossen. Wer viel Wert auf Aussprache legt, bekommt den Namen der Lehrkraft und ein Wort zu ihr (z. B. in Deutschland aufgewachsen). Eine bestimmte Lehrkraft für die ganze Zeit versprechen wir nicht.",
      vi: "Tùy lớp sẽ có giáo viên người Việt hoặc người Đức. Tất cả đều đã sống, học tập và tốt nghiệp đại học hoặc thạc sĩ tại Đức. Khách chú trọng phát âm thì gửi tên giáo viên và vài dòng giới thiệu (ví dụ lớn lên ở Đức). Không hứa một giáo viên cụ thể cho cả khoá."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Dürfen wir „Bachelor oder Master“ sagen? Im August wollte ein Teilnehmer sein Geld zurück, weil ihm „Unterricht mit Master“ versprochen worden war. Siehe „Beratung: Reihenfolge, Einstufung & Termine“.",
      vi: "Cần làm rõ: có được nói „tốt nghiệp đại học hoặc thạc sĩ“ không? Tháng 8 có học viên đòi hoàn tiền vì lúc tư vấn được hứa „thạc sĩ dạy“. Xem trang „Tư vấn: thứ tự, xếp trình độ & lịch hẹn“."
    },
    { type: "heading", de: "10. Probestunde", vi: "10. Học thử" },
    {
      type: "paragraph",
      de: "Wer zum ersten Mal einen Online-Kurs bei uns bucht, zahlt den Kurs und hat die ersten zwei Termine zum Testen. Passt es danach nicht, gibt es 100 % zurück – auch die zwei Termine kosten nichts. Details: „Probestunde buchen“.",
      vi: "Học viên lần đầu đăng ký lớp online đóng học phí và được học thử 2 buổi đầu liên tiếp. Nếu thấy không phù hợp, trung tâm hoàn 100% học phí – kể cả 2 buổi đã học. Chi tiết: „Đặt lịch học thử“."
    },
    { type: "heading", de: "11. Zahlung", vi: "11. Thanh toán" },
    {
      type: "list",
      items: [
        { de: "Normal: einmal den ganzen Kurs zahlen, damit der Platz sicher ist. Eine Anzahlung (z. B. 2 Mio.) gibt es nicht.", vi: "Thông thường: đóng một lần cả khóa để giữ chỗ. Trung tâm không nhận cọc (ví dụ 2 triệu)." },
        { de: "Auf Nachfrage geht eine Zahlung in 2 Raten (die Hälfte vorab), der Frühbucherpreis bleibt. Die zweite Rate vor Ende von A1.1.", vi: "Nếu khách hỏi, có thể chia 2 đợt (đóng nửa khóa trước) và vẫn giữ ưu đãi. Đợt 2 đóng trước khi kết thúc A1.1." },
        { de: "Noch nicht zahlen, aber Platz wollen? 1–2 Wochen vor Start vormerken – ein fester Platz gilt erst mit der Zahlung. Vorlage: „Vormerken, Zahlung & Rechnung“ (Student Support).", vi: "Khách chưa đóng tiền nhưng muốn giữ chỗ? Ghi danh trước 1–2 tuần trước khai giảng – chỉ khi đóng học phí mới được xác nhận chỗ. Mẫu tin nhắn: „Ghi danh trước, đóng học phí & hoá đơn“ (Student Support)." },
        { de: "Zahlung in Deutschland in Euro geht, 1:1 umgerechnet – nicht teurer als in Dong. Details auf derselben Seite.", vi: "Đóng bằng Euro ở Đức được, đổi ngang – không đắt hơn đóng tiền Việt. Chi tiết ở cùng trang đó." },
        { de: "Kontodaten nur aus der Standardvorlage schicken. Danach: Überweisungsbeleg + E-Mail + Zalo-Nummer erfragen und die Zahlung in Slack an Customer Success melden. Ab dann schreibt Customer Success der Person – Sales schickt nichts mehr.", vi: "Chỉ gửi thông tin tài khoản theo mẫu chuẩn. Sau đó: xin ảnh biên lai + email + số Zalo và báo lên Slack cho đội Chăm sóc học viên. Từ đây đội Chăm sóc học viên liên hệ học viên – Sales không gửi gì thêm." },
        { de: "Kein Zalo (häufig bei Kunden in Deutschland)? Dann WhatsApp.", vi: "Khách không dùng Zalo (thường gặp với khách ở Đức)? Thì dùng WhatsApp." }
      ]
    },
    { type: "heading", de: "12. Rabatte", vi: "12. Ưu đãi" },
    {
      type: "list",
      items: [
        { de: "Frühbucher: A1/A2 mindestens 1 Woche vor Start, B1 mindestens 2 Wochen (15 %).", vi: "Đăng ký sớm: A1/A2 trước ít nhất 1 tuần, B1 trước ít nhất 2 tuần (giảm 15%)." },
        { de: "Kombi-Pakete: A1+A2, A2–B1 (24.500.000 VND) und A1–B1 sind deutlich günstiger als einzeln.", vi: "Combo: A1+A2, A2–B1 (24.500.000 VND) và A1–B1 rẻ hơn nhiều so với đăng ký từng khóa." },
        { de: "Im Oktober 2026 gilt zusätzlich die Aktion – siehe „Aktion Oktober 2026“.", vi: "Trong tháng 10/2026 có thêm ưu đãi – xem „Ưu đãi tháng 10/2026“." },
        { de: "Ehemalige Teilnehmende: −500.000 VND. Zweite Person aus derselben Familie: −500.000 VND.", vi: "Học viên cũ: giảm 500.000 VND. Người thứ hai trong cùng gia đình: giảm 500.000 VND." },
        { de: "Saisonaktionen (z. B. Tết) gelten nur in ihrem Zeitraum – ehrlich sagen, wenn sie vorbei sind.", vi: "Ưu đãi theo dịp (ví dụ Tết) chỉ áp dụng trong thời gian đó – nói thật nếu đã hết." },
        { de: "Kann jemand erst ein paar Tage nach der Frist zahlen und meldet sich vorher: Frühbucherpreis nach Rücksprache halten.", vi: "Khách báo trước là chỉ đóng được trễ vài ngày: hỏi quản lý để giữ ưu đãi đăng ký sớm." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Fragt jemand nach seinem Kurs bei uns weiter, nenne den Rabatt für Ehemalige von dir aus. Eine Kundin hat sich zu Recht beschwert: „Wenn es ein Vorteil für Ehemalige ist, sollte man nicht erst fragen müssen.“",
      vi: "Khi học viên cũ hỏi học tiếp, hãy chủ động báo ưu đãi học viên cũ. Một khách đã góp ý rất đúng: „Nếu đã là quyền lợi cho học viên cũ thì không nên để hỏi mới nói.“"
    },
    { type: "heading", de: "13. Rückerstattung, Verschiebung, Absage", vi: "13. Hoàn tiền, dời lịch, hủy lớp" },
    {
      type: "list",
      items: [
        { de: "Wir garantieren, dass ein begonnener Kurs zu Ende unterrichtet wird.", vi: "Trung tâm cam kết hoàn thành khóa học đã khai giảng." },
        { de: "Kommen zu wenige Anmeldungen zusammen, bieten wir so schnell wie möglich eine Alternative an. Wer sie nicht will, bekommt sofort 100 % zurück.", vi: "Nếu không đủ học viên, trung tâm đưa ra phương án thay thế sớm nhất. Nếu khách không đồng ý, được hoàn 100% ngay lập tức." },
        { de: "Viele Kunden wurden von anderen Schulen enttäuscht. Nimm die Sorge ernst und erkläre die Regel in einfachen Worten.", vi: "Nhiều khách từng bị trung tâm khác làm thất vọng. Hãy tôn trọng nỗi lo đó và giải thích quy định thật đơn giản." }
      ]
    },
    { type: "heading", de: "14. Prüfungsziele", vi: "14. Mục tiêu thi chứng chỉ" },
    {
      type: "list",
      items: [
        { de: "Frag nach Prüfung (Goethe, telc, ÖSD) und Termin – das bestimmt den passenden Kurs.", vi: "Hỏi kỳ thi (Goethe, telc, ÖSD) và ngày thi – điều đó quyết định lớp phù hợp." },
        { de: "Unsere Gruppen bereiten nach Goethe-Format vor; für telc bieten wir 1:1-Vorbereitung an.", vi: "Lớp nhóm ôn theo form Goethe; với telc thì trung tâm có lớp ôn kèm 1-1." },
        { de: "Typische Ziele: B1 zur Verlängerung des Aufenthalts, A1/A2 für Familiennachzug, B1 für Ausbildung oder Studium.", vi: "Mục tiêu thường gặp: B1 để gia hạn cư trú, A1/A2 để đoàn tụ gia đình, B1 để du học nghề hoặc đại học." },
        { de: "Zur Prüfung melden sich Teilnehmende selbst an (persönliche Daten); wir erklären genau, wie.", vi: "Học viên tự đăng ký thi (vì cần thông tin cá nhân); trung tâm hướng dẫn cụ thể cách đăng ký." },
        { de: "Nie ein Bestehen versprechen. Wer alle Termine besucht und die Hausaufgaben macht, hat sehr gute Chancen.", vi: "Không bao giờ hứa chắc đậu. Ai đi học đủ và làm bài tập đầy đủ thì tỉ lệ đậu rất cao." }
      ]
    },
    { type: "heading", de: "15. Einstufung: „Ich habe A1 vor Jahren gelernt …“", vi: "15. Xếp lớp: „Mình học A1 lâu rồi …“" },
    {
      type: "paragraph",
      de: "Frag, wann die Person die letzte Stufe abgeschlossen hat und wie viel sie noch weiß. Bei Unsicherheit einen kurzen Einstufungstest schicken. Wer viel vergessen hat, steigt lieber in einen laufenden Kurs der Stufe darunter ein, als in der neuen Stufe zu scheitern.",
      vi: "Hỏi khách học xong cấp độ trước khi nào và còn nhớ bao nhiêu. Nếu chưa chắc, gửi bài test xếp lớp ngắn. Ai đã quên nhiều thì nên vào lớp thấp hơn đang học dở, còn hơn học lên cấp mới mà theo không kịp."
    },
    { type: "heading", de: "16. Aufzeichnungen und verpasste Termine", vi: "16. Video bài giảng và buổi nghỉ" },
    {
      type: "list",
      items: [
        { de: "Aufzeichnungen der Stunden gibt es nicht – nie versprechen.", vi: "Trung tâm không quay lại buổi học – không bao giờ hứa có video." },
        { de: "Die App NaNu Go hat vorab aufgenommene Lektionen, ist aber noch im Aufbau: Stand 27.10.2026 gibt es nur die ersten 8 Lektionen von A1.1.", vi: "App NaNu Go có bài giảng quay sẵn nhưng vẫn đang hoàn thiện: tính đến 27/10/2026 mới có 8 bài đầu của A1.1." },
        { de: "Verpasst? Wir schicken die Unterlagen der Stunde. Bei genug Interessenten öffnen wir eine Nachhilfestunde mit der Assistenz.", vi: "Nghỉ buổi nào? Trung tâm gửi file bài buổi đó. Nếu đủ học viên đăng ký, trung tâm mở lớp trợ giảng." }
      ]
    },
    { type: "heading", de: "17. Spezielle Wünsche", vi: "17. Yêu cầu đặc biệt" },
    {
      type: "list",
      items: [
        { de: "Sprechen und Aussprache: Kommunikationskurs, sinnvoll ab A2–B1. Bei A1 ehrlich sagen, dass erst Wortschatz und Grammatik kommen.", vi: "Giao tiếp và phát âm: lớp giao tiếp, phù hợp từ trình độ A2–B1. Với A1 thì nói thật là cần học từ vựng và ngữ pháp trước." },
        { de: "Fachsprache (z. B. Hotel und Gastronomie): bieten wir nicht als eigenen Kurs an – ehrlich sagen, Kommunikationskurs vorschlagen.", vi: "Tiếng Đức chuyên ngành (ví dụ nhà hàng khách sạn): chưa có lớp riêng – nói thật và gợi ý lớp giao tiếp." },
        { de: "Kurs jeden Tag, 5× pro Woche oder in 2 Monaten fertig: gibt es nicht. Intensivster Kurs: vor Ort 4× pro Woche.", vi: "Học mỗi ngày, 5 buổi/tuần hoặc xong trong 2 tháng: không có. Lớp cấp tốc nhất là offline 4 buổi/tuần." },
        { de: "A1 und A2 wiederholen: Wiederholungskurs mit der Assistenz, 2.999.000 VND, 10 Termine à 1,5 Stunden, online oder vor Ort, frei innerhalb von 5 Monaten.", vi: "Muốn ôn lại A1–A2: lớp trợ giảng ôn A1–A2, 2.999.000 VND, 10 buổi mỗi buổi 1,5 tiếng, online hoặc offline, học trong vòng 5 tháng, thích học lúc nào thì học." }
      ]
    },
    { type: "heading", de: "18. Kunden außerhalb von Vietnam", vi: "18. Khách ở ngoài Việt Nam" },
    {
      type: "paragraph",
      de: "Viele schreiben aus Deutschland, aber auch aus der Slowakei, der Schweiz, Schweden oder Japan. Immer klären: welche Zeitzone? (Mitteleuropa = deutsche Zeit). Bei der Zeitumstellung Ende Oktober verschieben sich unsere deutschen Morgenkurse um eine Stunde – sag das beim Anbieten dazu. Viele haben kein Zalo: WhatsApp und deutsche Telefonnummern sind normal.",
      vi: "Nhiều khách nhắn từ Đức, nhưng cũng có từ Slovakia, Thụy Sĩ, Thụy Điển hay Nhật. Luôn hỏi rõ: múi giờ nào? (Trung Âu = giờ Đức). Khi đổi giờ cuối tháng 10, lớp sáng giờ Đức sớm hơn 1 tiếng – hãy nói rõ khi gửi lịch. Nhiều khách không có Zalo: dùng WhatsApp và số điện thoại Đức là bình thường."
    },
    { type: "heading", de: "19. Wenn Eltern oder Verwandte fragen", vi: "19. Khi phụ huynh hoặc người thân hỏi giúp" },
    {
      type: "list",
      items: [
        { de: "Häufig: Mutter, Tante oder Geschwister fragen für ein Kind (Klasse 6, 8, 9, 11) oder einen Neffen.", vi: "Thường gặp: mẹ, cô, dì hoặc anh chị hỏi giúp cho con (lớp 6, 8, 9, 11) hoặc cháu." },
        { de: "Frag nach Alter/Klasse, Wohnort und wann das Kind Zeit hat (Schule!). Abendkurse passen meist am besten.", vi: "Hỏi tuổi/lớp, nơi ở và khung giờ rảnh của con (còn đi học!). Lớp buổi tối thường phù hợp nhất." },
        { de: "Mindestalter 14 Jahre. Fragt jemand für jüngere Kinder (z. B. 5 und 9 Jahre), nichts zusagen und an die Leitung geben.", vi: "Tuổi tối thiểu 14. Khách hỏi cho bé nhỏ hơn (ví dụ 5 và 9 tuổi) thì không tự nhận, chuyển quản lý." },
        { de: "Ziel klären: Ausbildung oder Studium – und ab wann. Wer erst nächsten Sommer starten will: Warteliste mit Datum.", vi: "Hỏi rõ mục tiêu: du học nghề hay đại học – và khi nào. Muốn bắt đầu vào hè năm sau: ghi danh sách chờ kèm ngày." },
        { de: "Ältere Kunden reden uns oft familiär an („cháu“, „con“). Antworte in derselben Anrede.", vi: "Khách lớn tuổi hay xưng hô thân mật („cháu“, „con“). Hãy trả lời theo đúng cách xưng hô đó." }
      ]
    }
  ]
};

export default page;
