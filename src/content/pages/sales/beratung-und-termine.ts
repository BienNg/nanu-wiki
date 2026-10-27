import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "beratung-und-termine",
  title_de: "Beratung: Reihenfolge, Einstufung & Termine",
  title_vi: "Tư vấn: thứ tự, xếp trình độ & lịch hẹn",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Was im Slack-Kanal immer wieder korrigiert wurde: Preis zu früh geschickt, kein Bild, Termin ohne Ort, ein Versprechen, das wir nicht halten können. Diese Seite ergänzt „Erstkontakt über Messenger“.",
      vi: "Những điều hay bị nhắc trên Slack: gửi học phí quá sớm, không có hình, hẹn mà không ghi gọi điện hay đến văn phòng, hứa điều trung tâm không làm được. Trang này bổ sung cho trang „Trả lời tin nhắn đầu tiên“."
    },
    { type: "heading", de: "Reihenfolge in der Beratung", vi: "Thứ tự tư vấn" },
    {
      type: "steps",
      items: [
        {
          de: "Kurs vorstellen – mit Bild",
          vi: "Giới thiệu lớp – luôn kèm hình",
          body_de: "Stundenplan und Start der passenden Klasse schicken, immer mit dem Bild der Klasse. Gibt es noch keins: kurz schreiben und Marketing um ein Bild bitten. Fettdruck und Kursivschrift wie in der Vorlage übernehmen.",
          body_vi: "Gửi lịch học và ngày khai giảng của lớp phù hợp, LUÔN có hình lớp học. Chưa có hình thì nhắn tạm rồi nhờ Marketing làm hình. Giữ in đậm, in nghiêng như tin nhắn mẫu."
        },
        {
          de: "Online oder vor Ort fragen",
          vi: "Hỏi học online hay trực tiếp",
          body_de: "Erst wenn das klar ist, den Preis schicken – sonst bekommt die Person einen Preis für einen Kurs, den sie gar nicht will.",
          body_vi: "Rõ rồi mới gửi học phí – nếu không khách nhận học phí của lớp mà họ không muốn học."
        },
        {
          de: "Preis und Leistungen",
          vi: "Học phí và quyền lợi",
          body_de: "Aus der aktuellen Preisliste, mit der laufenden Aktion. Siehe „FAQ Sprachkurse“ und „Aktion Oktober 2026“.",
          body_vi: "Theo bảng giá hiện hành, kèm ưu đãi đang áp dụng. Xem „FAQ khoá học tiếng“ và „Ưu đãi tháng 10/2026“."
        }
      ]
    },
    { type: "heading", de: "Einstufung", vi: "Xếp trình độ" },
    {
      type: "list",
      items: [
        {
          de: "Wer schon Deutsch gelernt hat (auch woanders): gleich den Einstufungstest der Stufe schicken, damit die Person ihn macht, während sie auf den Rückruf wartet.",
          vi: "Khách đã học tiếng Đức (kể cả ở nơi khác): hỏi học xong trình độ nào chưa và gửi luôn bài test trình độ đó, để khách làm trong lúc chờ trung tâm gọi tư vấn."
        },
        {
          de: "Wer mit B1 eine Ausbildung oder ein Programm will: erst ein kurzes Vorstellungsvideo auf Deutsch schicken lassen, dann den Sprachtest mit der Leitung vereinbaren.",
          vi: "Khách đã có B1 muốn đi du học nghề hay chương trình: xin trước một đoạn video giới thiệu bản thân bằng tiếng Đức để trung tâm check tiếng, sau đó đặt hẹn test tiếng với quản lý."
        },
        {
          de: "Lange pausiert (z. B. 2 Jahre nach B1): neu testen, bevor ein Kurs angeboten wird.",
          vi: "Ngưng học lâu (ví dụ 2 năm sau B1): cho làm test lại trước khi tư vấn lớp."
        }
      ]
    },
    { type: "heading", de: "Termine: Anruf oder Büro", vi: "Lịch hẹn: gọi điện hay đến văn phòng" },
    {
      type: "list",
      items: [
        {
          de: "Viele Eltern und ältere Kunden schreiben ungern oder ohne Akzente. Statt lange zu schreiben: Telefonnummer erfragen und einen Anruf anbieten.",
          vi: "Nhiều phụ huynh và khách lớn tuổi không thích nhắn tin, hay nhắn không dấu. Thay vì nhắn dài: xin số điện thoại và hẹn gọi tư vấn."
        },
        {
          de: "In der Terminerinnerung immer notieren, wie: Anruf über Zalo oder WhatsApp – oder Besuch im Büro Saigon oder Hanoi. Mit Datum, Uhrzeit (bei Kunden in Deutschland beide Zeitzonen) und Nummer.",
          vi: "Khi tạo nhắc hẹn luôn ghi rõ: gọi điện Zalo/WhatsApp – hay đến văn phòng Sài Gòn/Hà Nội. Kèm ngày, giờ (khách ở Đức thì ghi cả giờ VN và giờ Đức) và số điện thoại."
        },
        {
          de: "Kommt jemand ins Büro: die Wegbeschreibung schicken und das Team vor Ort informieren.",
          vi: "Khách đến văn phòng: gửi hướng dẫn đường đến và báo cho team tại văn phòng."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Terminerinnerung (intern)",
      label_vi: "Mẫu · Nhắc hẹn (nội bộ)",
      text: "(Gọi điện Zalo/WhatsApp) [tên khách] – [SĐT] – [ngày], [giờ VN] / [giờ Đức] – nhu cầu: …\n(Sài Gòn) [tên khách] đến văn phòng – [ngày], [giờ] – nhu cầu: …\n(Hà Nội) [tên khách] đến văn phòng – [ngày], [giờ] – nhu cầu: …",
      translation_de: "„(Anruf Zalo/WhatsApp) [Name] – [Telefon] – [Datum], [Uhrzeit VN] / [Uhrzeit DE] – Anliegen … · (Saigon) [Name] kommt ins Büro – [Datum], [Uhrzeit] – Anliegen … · (Hanoi) ebenso.“"
    },
    { type: "heading", de: "Was wir nicht versprechen", vi: "Những điều không được hứa" },
    {
      type: "list",
      items: [
        {
          de: "Aufzeichnungen der Stunden: gibt es nicht. Eine Teilnehmerin war sicher, dass man ihr das in der Beratung versprochen hatte.",
          vi: "Video quay lại buổi học: trung tâm không có. Đã có học viên khẳng định lúc tư vấn được hứa là có."
        },
        {
          de: "Eine bestimmte Lehrkraft oder einen bestimmten Abschluss („Unterricht mit Master“): Alle Lehrkräfte haben in Deutschland studiert – mehr nicht zusagen. Ein Teilnehmer wollte sonst sein Geld zurück.",
          vi: "Một giáo viên cụ thể hay bằng cấp cụ thể („thạc sĩ dạy“): tất cả giáo viên đều học tại Đức – không hứa hơn. Đã có học viên đòi hoàn tiền vì điều này."
        },
        {
          de: "Visum, Bestehen der Prüfung, einen bestimmten Ausbildungsort.",
          vi: "Kết quả visa, chắc chắn thi đậu, nơi học nghề cụ thể."
        },
        {
          de: "Gesundheitsfragen (z. B. „Ich habe Hepatitis B – kann ich eine Ausbildung machen?“): nie raten. An die Leitung geben und der Person sagen, bis wann sie eine Antwort bekommt.",
          vi: "Câu hỏi về sức khoẻ (ví dụ „em bị viêm gan B có đi du học nghề được không“): không tự trả lời. Chuyển quản lý và báo khách khi nào có câu trả lời."
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Welche Aussage über Lehrkräfte ist erlaubt? „FAQ Sprachkurse“ sagt „alle haben einen Bachelor oder Master“. Soll Sales Abschlüsse überhaupt nennen – und wenn ja, wie?",
      vi: "Cần làm rõ: được phép nói gì về giáo viên? Trang „FAQ khoá học tiếng“ ghi „tất cả đều tốt nghiệp đại học hoặc thạc sĩ“. Sales có nên nhắc đến bằng cấp không – nếu có thì nói thế nào?"
    },
    { type: "heading", de: "Unsere Methode erklären", vi: "Giải thích phương pháp học" },
    {
      type: "paragraph",
      de: "Fragt jemand, wie wir unterrichten, nimm die Schnellantwort: In Zalo und Messenger „phương pháp“ tippen. Kern: Wir gehen nicht Seite für Seite durch das Buch, sondern jede Stunde hat ein Ziel – Grammatik, Hören oder Sprechen.",
      vi: "Khách hỏi trung tâm dạy thế nào thì dùng tin nhắn nhanh: gõ „phương pháp“ trên Zalo và Messenger. Ý chính: không dạy từng trang sách, mà mỗi buổi có một mục tiêu – ngữ pháp, nghe hoặc nói."
    },
    {
      type: "template",
      label_de: "Vorlage · Methode (Schnellantwort „phương pháp“)",
      label_vi: "Mẫu · Phương pháp (tin nhắn nhanh „phương pháp“)",
      text: "Hallo em, chị giải thích 1 xíu về phương pháp của NaNu NaNa nha.\nThông thường, các lớp sẽ bám từng trang sách: hôm nay học bài trang này, buổi sau sang bài trang tiếp theo. Cảm giác của học viên sẽ là mình học hết sách.\nCòn ở NaNu NaNa, giáo trình vẫn là khung kiến thức chung nhưng không dạy theo kiểu đi từng trang, mà chia theo mục tiêu của từng buổi. Ví dụ:\nBuổi 1 – Ngữ pháp: tập trung hoàn toàn vào ngữ pháp trọng tâm, phải hiểu bản chất và luyện nói thật chắc.\nBuổi 2 – Nghe: nghe nhiều lần, phân tích nội dung và cách sử dụng ngôn ngữ, kết hợp đọc.\nBuổi 3 – Nói: chỉ luyện nói.\nLý do: học tiếng Đức không phải là hoàn thành từng trang sách, mà là thực sự hình thành từng kỹ năng. Mỗi buổi có một mục tiêu rõ ràng và học viên phải thật sự nắm được mục tiêu đó.",
      translation_de: "„Kurz zu unserer Methode: Viele Schulen gehen Seite für Seite durchs Buch – man hat das Gefühl, das Buch geschafft zu haben. Bei NaNu NaNa ist das Lehrbuch der Rahmen, aber jede Stunde hat ein Ziel: Stunde 1 Grammatik (verstehen und sicher sprechen), Stunde 2 Hören (mehrmals hören, analysieren, mit Lesen), Stunde 3 nur Sprechen. Deutsch lernen heißt, Fertigkeiten aufzubauen – nicht Seiten abzuhaken.“"
    }
  ]
};

export default page;
