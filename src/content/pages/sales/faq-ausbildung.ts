import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "faq-ausbildung",
  title_de: "FAQ: Ausbildung in Deutschland (Du học nghề)",
  title_vi: "FAQ: Du học nghề Đức",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Etwa 35 Chats im Oktober drehten sich um die Vermittlung in eine Ausbildung. Dabei geht es um viel Geld und oft um die Zukunft eines Kindes – genau, ehrlich und ohne Versprechen antworten.",
      vi: "Khoảng 35 tin nhắn trong tháng 10 hỏi về du học nghề. Đây là khoản tiền lớn và thường là tương lai của con em – hãy trả lời chính xác, trung thực và không hứa hẹn."
    },
    { type: "heading", de: "Erste Antwort: fünf Angaben erfragen", vi: "Trả lời đầu tiên: xin 5 thông tin" },
    {
      type: "template",
      label_de: "Vorlage · Daten erfragen",
      label_vi: "Mẫu · Xin thông tin",
      text: "Trung tâm có làm hồ sơ du học nghề em nha. Em vui lòng cho trung tâm biết một số thông tin sau nhé:\n- Năm sinh\n- Nơi sống hiện tại\n- Năm tốt nghiệp cấp 3\n- Ngành nghề mong muốn học tại Đức (tối thiểu 3 ngành)\n- Đã có chứng chỉ tiếng Đức B1/B2 chưa? (gửi ảnh bằng có điểm và ngày thi)",
      translation_de: "„Ja, wir begleiten Bewerbungen für eine Ausbildung. Schick uns bitte: Geburtsjahr, aktuellen Wohnort, Jahr des Schulabschlusses, Wunschberufe in Deutschland (mindestens drei) und ob du schon B1/B2 hast (Foto des Zertifikats mit Punkten und Datum).“"
    },
    { type: "heading", de: "Voraussetzungen", vi: "Điều kiện" },
    {
      type: "list",
      items: [
        { de: "Mindestens 18 Jahre und mindestens B1 in allen vier Fertigkeiten. Drei Fertigkeiten reichen nicht – erst nach dem vierten Ergebnis weiter.", vi: "Từ 18 tuổi và có tối thiểu B1 đủ 4 kỹ năng. 3 kỹ năng là chưa đủ – chờ có điểm kỹ năng thứ 4 rồi mới tiếp tục." },
        { de: "Pflege und Zahnmedizinische Fachangestellte: mindestens B2. Hotel: zusätzlich gutes Englisch.", vi: "Điều dưỡng và trợ lý nha khoa: tối thiểu B2. Khách sạn: cần thêm tiếng Anh tốt." },
        { de: "Ein B1-Zertifikat gilt für das Visum nur 12 Monate. Deshalb früh starten.", vi: "Bằng B1 chỉ có hiệu lực 12 tháng để xin visa. Vì vậy nên bắt đầu sớm." },
        { de: "Auch Bewerber, die nicht bei uns gelernt haben, nehmen wir an – aber nur nach einem Sprachtest bei der Leitung.", vi: "Trung tâm nhận cả hồ sơ của các bạn không học tại trung tâm – nhưng phải test tiếng với quản lý trước." },
        { de: "Alter oder älterer Abschluss (z. B. 38 Jahre): ehrlich sagen, dass wir den Einzelfall nach den Unterlagen prüfen – nichts versprechen.", vi: "Lớn tuổi hoặc tốt nghiệp đã lâu (ví dụ 38 tuổi): nói thật là trung tâm cần xem hồ sơ cụ thể – không hứa trước." }
      ]
    },
    { type: "heading", de: "Kosten (Stand Oktober 2026)", vi: "Chi phí (tháng 10/2026)" },
    {
      type: "steps",
      items: [
        { de: "Paket mit B1/B2: 199.000.000 VND", vi: "Trọn gói khi đã có B1/B2: 199.000.000 VND", body_de: "Enthalten: Visumantrag, Ausbildungsvertrag, Versicherung, Flug (Wert ca. 12 Mio.) und ein kostenloser Kurs zur Vorbereitung auf das Vorstellungsgespräch. Keine weiteren Kosten.", body_vi: "Bao gồm: hồ sơ visa, hợp đồng học nghề, bảo hiểm, vé máy bay (khoảng 12 triệu) và một lớp luyện phỏng vấn miễn phí. Không phát sinh chi phí khác." },
        { de: "Rate 1: 50 Mio. bei Annahme", vi: "Đợt 1: 50 triệu khi tiếp nhận hồ sơ", body_de: "Für Unterlagen, Übersetzungen und Interviewtraining.", body_vi: "Cho việc chuẩn bị hồ sơ, dịch thuật và luyện phỏng vấn." },
        { de: "Rate 2: 50 Mio. nach dem Vertrag", vi: "Đợt 2: 50 triệu sau khi có hợp đồng", body_de: "Sobald ein Betrieb unterschrieben hat.", body_vi: "Khi doanh nghiệp đã ký hợp đồng." },
        { de: "Rate 3: 99 Mio. nach dem Visum", vi: "Đợt 3: 99 triệu sau khi có visa", body_de: "Erst wenn das Visum erteilt ist.", body_vi: "Chỉ khi đã nhận visa." }
      ]
    },
    {
      type: "list",
      items: [
        { de: "Mit Sprachkurs A1–B1 (z. B. Programm Verkäufer/in): 220.000.000 VND, nur vor Ort, weil es neben Deutsch auch Fachpraxis gibt.", vi: "Trọn gói kèm học tiếng A1–B1 (ví dụ chương trình nghề Bán hàng): 220.000.000 VND, chỉ học offline vì ngoài tiếng Đức còn có lớp thực hành chuyên ngành." },
        { de: "Flug: Ist er beim Kauf teurer als 12 Mio., zahlt die Familie den Rest; ist er billiger, gibt es nichts zurück. Bisher war keiner billiger.", vi: "Vé máy bay: nếu lúc mua đắt hơn 12 triệu thì gia đình bù phần chênh; nếu rẻ hơn thì không hoàn lại. Đến nay chưa có vé nào dưới 12 triệu." },
        { de: "Kostenloses B2-Programm: B1 in allen vier Fertigkeiten mit je mindestens 70 Punkten, nicht älter als 2 Monate. Wer teilnimmt, geht danach über unsere Ausbildungsvermittlung.", vi: "Chương trình học B2 miễn phí: B1 đủ 4 kỹ năng, mỗi kỹ năng từ 70 điểm, bằng thi chưa quá 2 tháng. Tham gia chương trình thì sau đó đi theo đơn du học nghề của trung tâm." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: (1) Paket mit Sprachkurs: In Slack wurden für Verkauf 220 Mio. in 3 Raten 54 / 50 / 116 Mio. genannt – nicht 50 / 50 / 99 wie beim Paket mit B1. Gilt das für alle Berufe? (2) Kostenloses B2-Programm: Im August hieß es „B1 noch 10 Monate gültig“ statt „nicht älter als 2 Monate“; offen ist auch, ob ÖSD zählt und wie die neue Anzahlung aussieht. Details und alle offenen Punkte: „FAQ Programme“.",
      vi: "Cần làm rõ: (1) Gói kèm học tiếng: trên Slack ngành bán hàng ghi 220 triệu chia 3 đợt 54 / 50 / 116 triệu – không phải 50 / 50 / 99 như gói đã có B1. Áp dụng cho mọi ngành không? (2) Chương trình B2 miễn phí: tháng 8 có nói „bằng B1 còn hạn 10 tháng“ thay vì „chưa quá 2 tháng“; chưa rõ ÖSD có được tính không và tiền cọc mới thế nào. Chi tiết và các điểm cần làm rõ: „FAQ các chương trình“."
    },
    { type: "heading", de: "„Was, wenn es nicht klappt?“", vi: "„Nếu không đậu thì sao?“" },
    {
      type: "paragraph",
      de: "Wer das erste Vorstellungsgespräch nicht besteht, kann weiter mit uns üben und sich erneut vorstellen. Wer aufhören will, bekommt 40 der 50 Mio. aus Rate 1 zurück (abzüglich der Vorbereitung). Sag das von dir aus, bevor jemand zahlt.",
      vi: "Nếu không đậu phỏng vấn lần đầu, học viên có thể tiếp tục luyện với trung tâm và phỏng vấn lại. Nếu dừng lại, trung tâm hoàn 40 triệu trong 50 triệu đợt 1 (đã trừ chi phí chuẩn bị). Hãy chủ động nói điều này trước khi khách đóng tiền."
    },
    { type: "heading", de: "Wunschberuf und Wunschort", vi: "Ngành và nơi mong muốn" },
    {
      type: "list",
      items: [
        { de: "Häufig: Verkauf, Hotel und Gastronomie, Pflege, Koch, Bäckerei, Logistik, Lebensmitteltechnik – oft mit Wunschregion (Bodensee, NRW, Baden-Württemberg, „ruhige Kleinstadt“ oder „große Stadt“).", vi: "Thường gặp: bán hàng, nhà hàng khách sạn, điều dưỡng, đầu bếp, làm bánh, logistics, công nghệ thực phẩm – thường kèm vùng mong muốn (Bodensee, NRW, Baden-Württemberg, „thị trấn yên bình“ hay „thành phố lớn“)." },
        { de: "Ehrlich erklären: Wer nur auf eine Stadt wartet, riskiert den Termin. Es gibt nur zwei Starttermine im Jahr und das Visum dauert oft 3–5 Monate.", vi: "Giải thích trung thực: chỉ chờ một thành phố thì dễ lỡ kỳ. Mỗi năm chỉ có 2 kỳ nhập học và visa thường mất 3–5 tháng." },
        { de: "Offene Stellen posten wir in der Story; Bewerber mit Vertrag bei uns haben Vorrang.", vi: "Các đơn trung tâm có được đăng trên story; ưu tiên các bạn đã ký hợp đồng với trung tâm." }
      ]
    },
    { type: "heading", de: "Ablauf", vi: "Quy trình" },
    {
      type: "steps",
      items: [
        { de: "Daten und Zertifikat erhalten", vi: "Nhận thông tin và bằng" },
        { de: "Kosten schicken, Fragen klären", vi: "Gửi chi phí, giải đáp thắc mắc" },
        { de: "Sprachtest bei der Leitung", vi: "Test tiếng với quản lý", body_de: "Termin aktiv vereinbaren und dem Kunden sagen, wann er von uns hört – sonst fragt die Familie nach („Niemand hat angerufen“).", body_vi: "Chủ động hẹn lịch và báo khách khi nào trung tâm liên hệ – nếu không gia đình sẽ hỏi lại („Chưa thấy ai gọi“)." },
        { de: "Rate 1, Unterlagen, Interviewtraining", vi: "Đóng đợt 1, chuẩn bị hồ sơ, luyện phỏng vấn" },
        { de: "Vorstellungsgespräch, Vertrag, Visum, Flug", vi: "Phỏng vấn, hợp đồng, visa, bay" }
      ]
    },
    {
      type: "callout",
      tone: "info",
      de: "Reicht das Niveau im Sprachtest nicht, sag es klar und nenne den nächsten Schritt (z. B. erst B2). Das ist besser als ein Vertrag, der in Deutschland scheitert.",
      vi: "Nếu trình độ chưa đạt trong buổi test, hãy nói rõ và gợi ý bước tiếp theo (ví dụ học lên B2). Như vậy tốt hơn một hợp đồng thất bại khi sang Đức."
    },
    { type: "heading", de: "Nach der Ankunft", vi: "Sau khi sang Đức" },
    {
      type: "list",
      items: [
        { de: "Wer über unseren Vertrag gekommen ist, bekommt bei Problemen mit dem Betrieb weiter Hilfe – über eine eigene Support-Gruppe, die schon in Vietnam beginnt.", vi: "Học viên đi theo hợp đồng của trung tâm được tiếp tục hỗ trợ khi có vấn đề với doanh nghiệp – qua nhóm hỗ trợ riêng từ khi còn ở Việt Nam." },
        { de: "Kam jemand über eine andere Agentur und will den Betrieb wechseln: können wir nicht übernehmen. Freundlich absagen.", vi: "Khách đi qua công ty khác và muốn đổi doanh nghiệp: trung tâm không hỗ trợ được. Từ chối nhẹ nhàng." }
      ]
    },
    { type: "heading", de: "Was wir nicht anbieten", vi: "Những gì trung tâm không làm" },
    {
      type: "list",
      items: [
        { de: "Wir begleiten Ausbildung, Bachelor und Master – keine Arbeitsprogramme (z. B. „8 Monate arbeiten“) und keine Saisonarbeit.", vi: "Trung tâm làm du học nghề, đại học và thạc sĩ – không làm chương trình lao động (ví dụ „lao động 8 tháng“) hay lao động thời vụ." },
        { de: "§18b, Finanzierungsnachweis (Sperrkonto) oder „Ist dieses Programm gut?“ (Link zu fremden Videos): erst nachfragen, was die Person genau meint und welches Zertifikat sie hat, dann ehrlich einordnen oder an Student Support übergeben.", vi: "Diện 18b, chứng minh tài chính (Sperrkonto) hoặc „Chương trình này có nên đi không?“ (gửi link video bên khác): hỏi rõ khách muốn gì và đang có bằng gì, rồi phân tích trung thực hoặc chuyển cho Hỗ trợ học viên." }
      ]
    }
  ]
};

export default page;
