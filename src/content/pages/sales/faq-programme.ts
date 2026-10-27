import type { PageContent } from "@/lib/types";

// Source: #customer-support Slack, Aug–Oct 2026. Open points are marked "Zu klären" directly where they apply.
const page: PageContent = {
  slug: "faq-programme",
  title_de: "FAQ: Programme – Pflege-Anerkennung, Verkauf, Bau, B2 gratis",
  title_vi: "FAQ: Các chương trình – chuyển đổi bằng điều dưỡng, bán hàng, xây dựng, B2 miễn phí",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Seit August sind mehrere Programme dazugekommen. Hier steht, was im Team dazu verschickt wurde. Wo Angaben fehlen oder sich widersprechen, steht ein „Zu klären“ – dann nichts zusagen, sondern bei der Leitung nachfragen. Allgemeines zur Ausbildung: „FAQ Ausbildung“.",
      vi: "Từ tháng 8 có thêm nhiều chương trình mới. Trang này tổng hợp những gì đã được gửi trong team. Chỗ nào thiếu thông tin hoặc mâu thuẫn thì có ghi „Cần làm rõ“ – khi đó không tự cam kết mà hỏi lại quản lý. Thông tin chung về du học nghề: xem „FAQ du học nghề“."
    },
    { type: "heading", de: "Anerkennung als Pflegefachkraft (Chuyển đổi bằng điều dưỡng)", vi: "Chuyển đổi bằng điều dưỡng" },
    { type: "paragraph", de: "Für ausgebildete Pflegekräfte, die in Deutschland als Pflegefachkraft arbeiten wollen.", vi: "Dành cho người đã có bằng điều dưỡng muốn sang Đức làm điều dưỡng." },
    {
      type: "list",
      items: [
        { de: "Voraussetzungen: Abschluss Pflege an College oder Universität (auch über Aufbaustudium), gültige Berufszulassung (CCHN), Deutsch ab B1 (Goethe, telc, ÖSD), kein Eintrag im Führungszeugnis. Wer noch kein B1 hat, bucht erst einen Kurs.", vi: "Điều kiện: tốt nghiệp cao đẳng/đại học điều dưỡng (kể cả liên thông), có chứng chỉ hành nghề (CCHN) còn hiệu lực, tiếng Đức từ B1 (Goethe, telc, ÖSD), lý lịch tư pháp trong sạch. Chưa có B1 thì đăng ký học trước." },
        { de: "Ablauf: Interview und Sprachtest → Arbeitsvertrag → B2-Kurs online (parallel Anerkennungsunterlagen und Visum) → Flug in der Gruppe mit Abholung → 6 Monate Anpassungsqualifizierung in Vollzeit, zu 100 % finanziert → Kenntnisprüfung (Theorie und Praxis) → Anerkennung und unbefristete Stelle.", vi: "Lộ trình: phỏng vấn và đánh giá tiếng Đức → ký hợp đồng lao động → khoá B2 online (song song hoàn thiện hồ sơ thẩm định bằng và visa) → bay theo đoàn, có người đón → đào tạo chuyển đổi 6 tháng toàn thời gian, tài trợ 100% → thi Kenntnisprüfung (lý thuyết + thực hành) → được công nhận và làm việc dài hạn." },
        { de: "Die 6 Monate finden in Hannover statt; erst nach der bestandenen Prüfung geht es in andere Städte.", vi: "6 tháng học tại Hannover; sau khi thi đậu mới chuyển sang các thành phố khác." },
        { de: "Gehalt während der Qualifizierung (Pflegehelfer:in): 2.500–3.500 € brutto, etwa 2.100 € netto. Nach Wohnung und Versicherung bleiben rund 800 € übrig.", vi: "Lương trong thời gian học (trợ lý điều dưỡng): 2.500–3.500 €/tháng trước thuế, thực nhận khoảng 2.100 €. Sau khi trừ nhà ở, bảo hiểm vẫn để ra được khoảng 800 €." },
        { de: "Nach der Anerkennung: 3.300–4.000 € brutto plus Zulagen (Stand 2026), Weiterbildung zur Fachpflege oder Leitung möglich, nach einigen Jahren Niederlassungserlaubnis, Familiennachzug.", vi: "Sau khi được công nhận: lương khởi điểm 3.300–4.000 €/tháng trước thuế + phụ cấp (năm 2026), có cơ hội học chuyên khoa hoặc lên quản lý, sau vài năm đủ điều kiện xin định cư, bảo lãnh người thân." },
        { de: "Unterstützung vor Ort: Abholung am Flughafen, möblierte Unterkunft, Hilfe bei Anmeldung, Bankkonto und Krankenversicherung.", vi: "Hỗ trợ tại Đức: đón sân bay, chỗ ở đầy đủ tiện nghi, hỗ trợ đăng ký cư trú, mở tài khoản ngân hàng, bảo hiểm y tế." }
      ]
    },
    { type: "heading", de: "Kosten Pflege-Anerkennung", vi: "Chi phí chuyển đổi bằng điều dưỡng" },
    {
      type: "steps",
      items: [
        { de: "3.000 € bis Ende 12/2026 – ab 01/2027: 5.000 €", vi: "3.000 € đến hết tháng 12/2026 – từ 01/2027: 5.000 €", body_de: "Enthalten: beglaubigte Übersetzungen, Visumgebühr, 3 Monate Versicherung, berufsbezogener B2-Kurs. Nicht enthalten: Flug und 500 € für das beschleunigte Verfahren (Fast-Track), das in Deutschland bezahlt wird – wir können es auslegen, die Person zahlt es zurück.", body_vi: "Bao gồm: dịch thuật công chứng, phí xin visa, bảo hiểm 3 tháng, khoá B2 nghề nghiệp. Không bao gồm: vé máy bay và 500 € phí xử lý nhanh hồ sơ (Fast-Track) trả cho bên Đức – trung tâm chuyển hộ được nhưng học viên phải trả lại." },
        { de: "Rate 1: 500 € bei Annahme der Unterlagen", vi: "Đợt 1: 500 € khi nhận làm hồ sơ", body_de: "Wird nicht erstattet. Gezahlt wird erst, wenn der Sprachtest bestanden ist.", body_vi: "Không hoàn lại. Học viên chỉ đóng khi đã test tiếng đạt." },
        { de: "Rate 2: 1.000 € wenn die Unterlagen aus Deutschland zurück sind", vi: "Đợt 2: 1.000 € khi giấy tờ về Việt Nam" },
        { de: "Rate 3: 1.500 € mit dem Visum", vi: "Đợt 3: 1.500 € khi có visa" }
      ]
    },
    {
      type: "list",
      items: [
        { de: "Wir behalten keine Originale – Scans reichen. Nach Eingang prüfen wir die Unterlagen und testen gleichzeitig das Deutsch.", vi: "Trung tâm không thu hồ sơ gốc, chỉ cần bản scan. Nhận hồ sơ xong trung tâm kiểm tra và đồng thời test tiếng Đức." },
        { de: "Kein separater Test beim Arbeitgeber nötig, weil zuerst Deutsch gelernt wird (B2-Kurs kostenlos).", vi: "Không cần test với doanh nghiệp vì học viên sẽ học tiếng Đức trước (miễn phí khoá B2 nghề nghiệp)." },
        { de: "Nach dem Beratungsgespräch die Infos noch einmal schriftlich über Zalo schicken.", vi: "Sau khi tư vấn xong gửi lại thông tin một lần nữa qua Zalo cho khách." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: (1) Gibt es Geld zurück, wenn das Visum abgelehnt wird? Im August wurde intern „10 Mio. zurück, wenn noch nicht geprüft“ erwähnt – für welchen Fall gilt das? (2) Werden neben Goethe, telc und ÖSD weitere B1-Zertifikate anerkannt (z. B. ECL)? (3) Ein Post nannte „ab 800 € netto“, ein anderer „2.100 € netto, 800 € übrig“ – was sagen wir?",
      vi: "Cần làm rõ: (1) Nếu trượt visa có được hoàn tiền không? Tháng 8 có nhắc „nếu chưa thẩm tra thì hỗ trợ hoàn 10 triệu“ – áp dụng cho trường hợp nào? (2) Ngoài Goethe, telc, ÖSD có nhận chứng chỉ B1 khác không (ví dụ ECL)? (3) Một bài đăng ghi „từ 800 € cầm tay“, bài khác ghi „thực nhận 2.100 €, để ra 800 €“ – mình nói theo cách nào?"
    },
    { type: "heading", de: "Ausbildung im Verkauf (Du học nghề bán hàng)", vi: "Du học nghề ngành bán hàng" },
    {
      type: "list",
      items: [
        { de: "Beruf allgemein als „Verkauf“ beraten – es kann z. B. Bäckerei- oder Fleischereiverkauf sein.", vi: "Tư vấn chung là ngành bán hàng – có thể là bán bánh, bán thịt." },
        { de: "Aufnahme ab 09.10.2026, geplanter Flug 08.10.2027.", vi: "Bắt đầu nhận học viên: 09.10.2026, dự kiến bay: 08.10.2027." },
        { de: "Enthalten: Deutsch A0 → B1 (4 Termine/Woche), Praxis Verkauf auf Deutsch (1 Termin/Woche), Bewerbung bei Betrieben, B1-Prüfungsvorbereitung und Anmeldung (telc), Interviewtraining, Fachunterricht nach bestandenem Interview, Visum und Flug.", vi: "Bao gồm: tiếng Đức A0 → B1 (4 buổi/tuần), lớp thực hành ngành bán hàng bằng tiếng Đức (1 buổi/tuần), chuẩn bị và nộp hồ sơ cho doanh nghiệp, ôn và đăng ký thi B1 (telc), luyện phỏng vấn, học chuyên ngành sau khi đỗ phỏng vấn, xin visa và vé máy bay." }
      ]
    },
    {
      type: "steps",
      items: [
        { de: "Paket: 220.000.000 VND in 3 Raten", vi: "Trọn gói: 220.000.000 VND chia 3 đợt" },
        { de: "Rate 1: 54 Mio.", vi: "Đợt 1: 54 triệu", body_de: "Deutsch A1–B1 (8 Monate), Praxis Verkauf (8 Monate), B1-Vorbereitung und Anmeldung, Bewerbungsunterlagen.", body_vi: "Học tiếng Đức A1–B1 (8 tháng), thực hành ngành bán hàng (8 tháng), ôn + đăng ký thi B1, chuẩn bị hồ sơ gửi doanh nghiệp." },
        { de: "Rate 2: 50 Mio. nach dem B1", vi: "Đợt 2: 50 triệu (sau khi có B1)", body_de: "Interviewtraining, Fachunterricht nach bestandenem Interview.", body_vi: "Luyện phỏng vấn doanh nghiệp, học lớp chuyên sâu sau khi đỗ phỏng vấn." },
        { de: "Rate 3: 116 Mio. nach dem Visum", vi: "Đợt 3: 116 triệu (sau khi có visa)", body_de: "Visum und Flug.", body_vi: "Xin visa và vé máy bay." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: „FAQ Ausbildung“ nennt für das Paket mit Sprachkurs 220 Mio. VND „nur vor Ort“, aber keine Raten; für das Paket mit B1 gelten 50 / 50 / 99 Mio. Gelten für Verkauf 54 / 50 / 116 Mio.? Gibt es das Programm auch online? Und was passiert mit den Raten, wenn das Interview nicht klappt?",
      vi: "Cần làm rõ: trang „FAQ du học nghề“ ghi gói kèm học tiếng 220 triệu „chỉ học offline“ nhưng không có các đợt đóng; gói đã có B1 là 50 / 50 / 99 triệu. Ngành bán hàng áp dụng 54 / 50 / 116 triệu đúng không? Có học online được không? Nếu không đỗ phỏng vấn thì các đợt đã đóng xử lý thế nào?"
    },
    { type: "heading", de: "Ausbildung am Bau", vi: "Du học nghề ngành xây dựng" },
    {
      type: "list",
      items: [
        { de: "Wir suchen 10–20 Bewerber:innen. B1 spätestens im März–Juni 2027 für den nächsten Start. Wer B1 schon hat, kann sich sofort bewerben.", vi: "Cần tuyển 10–20 học viên. Cần B1 muộn nhất tháng 03–06/2027 để nhập học kỳ tiếp theo. Ai có B1 rồi có thể xin đơn luôn." },
        { de: "Berufe: Gartenbau (Garten- und Landschaftsbau), Stuckateur (Putz und Innenausbau), Maurer, Betonstahlbauer, Klempner (Rohr- und Blecharbeiten).", vi: "Các ngành: Gartenbau – làm vườn/cảnh quan, Stuckateur – thợ trát, hoàn thiện tường, Maurer – thợ xây, Betonstahlbauer – thợ gia công, lắp đặt cốt thép, Klempner – thợ kỹ thuật đường ống, kim loại." },
        { de: "Ausbildungsvergütung: 1. Jahr 1.080 €, 2. Jahr 1.350 €, 3. Jahr 1.550 €.", vi: "Lương học nghề: năm 1: 1.080 €, năm 2: 1.350 €, năm 3: 1.550 €." },
        { de: "Nach dem Abschluss: 3.500–4.000 € brutto (ca. 110–125 Mio. VND), netto 2.600–2.650 € (ca. 75–85 Mio. VND).", vi: "Sau khi tốt nghiệp: trước thuế 3.500–4.000 € (110–125 triệu/tháng), sau thuế 2.600–2.650 € (khoảng 75–85 triệu/tháng)." },
        { de: "Elektriker in München: Start 02/2027, B1 reicht für die Bewerbung, Interviews bis 11/2026.", vi: "Elektriker – thợ điện tại München: nhập học 02/2027, có B1 là apply được, phỏng vấn từ nay đến 11/2026." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Eine Nachricht nannte nach dem Abschluss „ab 18 €/Stunde brutto“, eine andere „3.500–4.000 € brutto“. Welche Zahl gilt? Und was kostet die Vermittlung am Bau – das reguläre Paket von 199 Mio. VND?",
      vi: "Cần làm rõ: một tin nhắn ghi sau tốt nghiệp „từ 18 €/giờ trước thuế“, tin khác ghi „3.500–4.000 € trước thuế“. Dùng con số nào? Và chi phí đơn xây dựng là bao nhiêu – theo gói thường 199 triệu?"
    },
    { type: "heading", de: "B2-Kurs gratis (Viethoga/Dehoga)", vi: "Khoá B2 miễn phí (Viethoga/Dehoga)" },
    {
      type: "paragraph",
      de: "Über einen Partner gibt es einen kostenlosen B2-Kurs für Bewerber:innen mit gutem B1. Wer teilnimmt, geht danach über unsere Ausbildungsvermittlung. Partnergruppen kommen im Oktober zu Veranstaltungen ins Büro Saigon.",
      vi: "Qua đối tác có khoá B2 miễn phí cho các bạn có B1 tốt. Tham gia thì sau đó đi theo đơn du học nghề của trung tâm. Đoàn đối tác đến văn phòng Sài Gòn tổ chức sự kiện vào tháng 10."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären – zur Zeit nichts zusagen außer „B1 nötig“: (1) Wie alt darf das B1 sein? „FAQ Ausbildung“ sagt „nicht älter als 2 Monate“, im August hieß es „noch 10 Monate gültig“. (2) Mindestens 70 Punkte pro Fertigkeit – stimmt das? (3) Zählen nur telc und Goethe oder auch ÖSD? (4) Was kostet die Teilnahme über uns, und wie hoch ist die Anzahlung, die dieses Jahr neu ist? (5) Wie lange dauert es bis zur Ausreise?",
      vi: "Cần làm rõ – hiện tại chỉ tư vấn „cần có B1“: (1) Bằng B1 được bao lâu? Trang „FAQ du học nghề“ ghi „chưa quá 2 tháng“, tháng 8 lại nói „còn hạn 10 tháng“. (2) Đủ 70 điểm mỗi kỹ năng – có đúng không? (3) Chỉ nhận telc, Goethe hay cả ÖSD? (4) Đi qua trung tâm thì chi phí bao nhiêu, tiền cọc năm nay thay đổi thế nào? (5) Bao lâu thì có thể bay?"
    },
    { type: "heading", de: "Weitere neue Programme", vi: "Các chương trình mới khác" },
    {
      type: "list",
      items: [
        { de: "Programm „70–100 % Deutsch“, Sommercamp, Schulaustausch in Deutschland: Bisher gibt es nur die Canva-Vorlagen.", vi: "Chương trình „tiếng Đức 70–100%“, trại hè, trao đổi tại trường ở Đức: hiện mới có bản Canva." },
        { de: "Wer im August beim Generalkonsulat Frankfurt Kontakte gesammelt hat: Kursangebot mit Uhrzeit schicken und fragen, ob schon Deutsch gelernt wurde.", vi: "Các khách đã gặp ở lãnh sự quán Frankfurt hồi tháng 8: gửi lịch lớp và hỏi đã học tiếng Đức chưa." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Für „70–100 % Deutsch“, Sommercamp und Schulaustausch fehlen Inhalt, Preis, Zielgruppe und Termine. Bis dahin Interesse notieren und an die Leitung geben.",
      vi: "Cần làm rõ: chương trình „tiếng Đức 70–100%“, trại hè và trao đổi tại trường còn thiếu nội dung, chi phí, đối tượng và lịch. Trong lúc chờ, ghi nhận khách quan tâm và chuyển quản lý."
    }
  ]
};

export default page;
