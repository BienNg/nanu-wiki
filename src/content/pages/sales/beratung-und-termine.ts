import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "beratung-und-termine",
  title_de: "Beratung: Reihenfolge, Einstufung & Termine",
  title_vi: "Tư vấn: thứ tự, xếp trình độ & lịch hẹn",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-03",
  body: [
    {
      type: "paragraph",
      de: "Was im Slack-Kanal immer wieder korrigiert wurde: Preis zu früh geschickt, kein Bild, Termin ohne Ort, ein Versprechen, das wir nicht halten können. Diese Seite ergänzt „[Erstkontakt über Messenger](sales/erstkontakt-messenger)“.",
      vi: "Những điều hay bị nhắc trên Slack: gửi học phí quá sớm, không có hình, hẹn mà không ghi gọi điện hay đến văn phòng, hứa điều trung tâm không làm được. Trang này bổ sung cho trang „[Trả lời tin nhắn đầu tiên](sales/erstkontakt-messenger)“."
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
          body_de: "Aus der aktuellen Preisliste, mit der laufenden Aktion. Siehe „[FAQ Sprachkurse](sales/faq-sprachkurse)“ und „[Aktion Oktober 2026](sales/aktion-oktober-2026)“.",
          body_vi: "Theo bảng giá hiện hành, kèm ưu đãi đang áp dụng. Xem „[FAQ khoá học tiếng](sales/faq-sprachkurse)“ và „[Ưu đãi tháng 10/2026](sales/aktion-oktober-2026)“."
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
          de: "Eine bestimmte Lehrkraft oder einen bestimmten Abschluss für eine Klasse („bei dir unterrichtet ein Master“). Was du sagen darfst, steht unten bei „[Über Lehrkräfte sprechen](#uber-lehrkrafte-sprechen)“. Ein Teilnehmer wollte sein Geld zurück, weil ihm das versprochen worden war.",
          vi: "Một giáo viên cụ thể hay bằng cấp cụ thể cho một lớp („lớp em có thạc sĩ dạy“). Được nói gì thì xem phần „[Nói về giáo viên](#uber-lehrkrafte-sprechen)“ bên dưới. Đã có học viên đòi hoàn tiền vì được hứa như vậy."
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
    { type: "heading", de: "Gruppe zuerst, 1:1 nur auf Wunsch", vi: "Ưu tiên lớp nhóm, 1-1 chỉ khi khách yêu cầu" },
    {
      type: "list",
      items: [
        {
          de: "Immer zuerst eine passende Gruppe anbieten – wir brauchen volle Gruppen. Erst wenn die Person wirklich keine Gruppe kann und weiter 1:1 will, den Preis nennen und den Plan der Lehrkräfte prüfen. Regeln für 1:1: „[FAQ Sprachkurse](sales/faq-sprachkurse#6-einzel-oder-kleingruppenunterricht)“.",
          vi: "Luôn gợi ý lớp nhóm phù hợp trước – trung tâm đang rất cần mở lớp nhóm. Chỉ khi khách thật sự không học nhóm được mà vẫn muốn 1-1 thì mới báo học phí và kiểm tra lịch giáo viên. Quy định lớp 1-1: „[FAQ khoá học tiếng](sales/faq-sprachkurse#6-einzel-oder-kleingruppenunterricht)“."
        },
        {
          de: "Vor dem Anbieten in Notion schauen, welche Klasse bald startet und wie viele Plätze noch fehlen – und diese Klasse zuerst anbieten.",
          vi: "Trước khi tư vấn, vào Notion xem lớp nào sắp khai giảng và còn thiếu bao nhiêu chỗ – rồi ưu tiên đẩy lớp đó."
        }
      ]
    },
    { type: "heading", de: "Über Lehrkräfte sprechen", vi: "Nói về giáo viên" },
    {
      type: "list",
      items: [
        {
          de: "Das darfst du sagen (Phương, Februar 2026): „Alle Lehrkräfte haben in Deutschland studiert und gelebt und dort einen Bachelor oder Master abgeschlossen.“ Wir stellen nicht massenhaft ein – alle sind Deutsche oder leben schon lange in Deutschland. Das gilt für die Schule, nie als Versprechen für eine bestimmte Klasse.",
          vi: "Được nói (chị Phương, tháng 2/2026): „Thầy cô đều đã học và sống tại Đức, tốt nghiệp đại học hoặc thạc sĩ tại Đức.“ Trung tâm không tuyển giáo viên ồ ạt – tất cả là người Đức hoặc đã sống ở Đức lâu năm. Đây là nói về đội ngũ, không bao giờ hứa cho một lớp cụ thể."
        },
        {
          de: "Nie sagen, dass eine Lehrkraft leicht oder schwer zu verstehen ist, schnell spricht o. Ä. Sonst wollen die Leute nur noch zu einer Lehrkraft – und gehen woanders hin, wenn es deren Klasse nicht gibt. Ein Schüler hat im Juli genau deshalb gewechselt.",
          vi: "Không bao giờ nói giáo viên nào giọng dễ nghe hay khó nghe, nói nhanh… Nếu vậy học viên chỉ muốn học một người – không có lớp người đó dạy thì đi trung tâm khác. Tháng 7 đã có học viên bỏ đi vì đúng lý do này."
        },
        {
          de: "Immer positiv und mit Lösung: „Alle unsere Lehrkräfte sind sehr gut. Wenn dir etwas zu schnell geht, sag Bescheid – wir geben es an die Lehrkraft weiter und helfen dir.“",
          vi: "Luôn nói tích cực và đưa cách giải quyết: „Các giáo viên đều rất giỏi. Nếu thầy nói nhanh quá thì em báo lại để trung tâm feedback cho thầy cải thiện và hỗ trợ em luôn.“"
        },
        {
          de: "Möchte jemand Phương als Lehrerin: Sie pendelt zwischen Vietnam und Deutschland und kann keine feste Klasse übernehmen. Eine Gruppe anbieten. Die Qualität kommt aus unserem System, nicht von einer Person.",
          vi: "Khách muốn chị Phương dạy: chị di chuyển giữa Việt Nam và Đức nên không nhận lớp cố định được. Gợi ý lớp nhóm. Chất lượng đến từ hệ thống của trung tâm, không phải từ một người."
        }
      ]
    },
    { type: "heading", de: "So schreiben wir", vi: "Cách nhắn tin" },
    {
      type: "list",
      items: [
        {
          de: "Jede Nachricht endet mit einer Frage oder einem klaren Abschluss – sonst antwortet niemand. Und immer mit Bild, wenn es um einen Kurs geht.",
          vi: "Mỗi tin nhắn kết thúc bằng một câu hỏi hoặc câu chốt rõ ràng – nếu không khách sẽ không trả lời. Khi nói về lớp học thì luôn kèm hình."
        },
        {
          de: "Mehr fragen, nicht drängen. Lieber herausfinden, was die Person braucht, als sofort verkaufen.",
          vi: "Hỏi nhiều hơn, không ép bán. Tìm hiểu khách cần gì trước khi chốt."
        },
        {
          de: "Anrede: Die Person mit anh, chị oder bạn ansprechen, sich selbst „trung tâm“ oder em/chị nennen – und dabei bleiben. „Mình“ nur ganz selten, sonst ist unklar, wer gemeint ist.",
          vi: "Xưng hô: gọi khách là anh/chị/bạn, tự xưng là „trung tâm“ hoặc em/chị – và giữ nhất quán. Hạn chế chữ „mình“ vì dễ nhầm ai với ai."
        },
        {
          de: "Wir schreiben wie eine Person: Wer den Chat übernimmt, liest vorher alles und macht dort weiter – nie so fragen, als hätte noch niemand mit der Person gesprochen.",
          vi: "Nhắn như cùng một người: ai tiếp nhận cuộc trò chuyện thì đọc lại toàn bộ trước rồi nhắn tiếp – không hỏi lại như thể chưa ai tư vấn khách."
        },
        {
          de: "In WhatsApp gleich nach dem Namen fragen. Partner und Bewerber: höflich und förmlich. Bei Partnern schreibt NaNu immer die letzte Nachricht.",
          vi: "Trên WhatsApp hỏi tên khách ngay. Với đối tác và ứng viên xin việc: lịch sự, trang trọng. Với đối tác thì NaNu luôn là người nhắn tin cuối cùng."
        },
        {
          de: "Was du nicht sicher weißt, nicht beantworten. Neue Infos (auch Antworten aus ChatGPT oder unter Posts) erst prüfen lassen: suchen, fragen, OK bekommen, dann schicken. Zu Aufenthaltsrecht oder Familiennachzug nur allgemein antworten – keine Rechtsberatung.",
          vi: "Điều gì không chắc thì không trả lời. Thông tin mới (kể cả câu trả lời từ ChatGPT hay trong bình luận) phải được duyệt trước: tìm, hỏi, được OK rồi mới gửi. Về luật cư trú hay đoàn tụ gia đình chỉ trả lời chung chung – không tư vấn pháp lý."
        },
        {
          de: "Nie auf unbekannte Links klicken.",
          vi: "Không bao giờ bấm vào link lạ."
        }
      ]
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
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "Wann schickst du den Preis?",
        question_vi: "Khi nào bạn gửi giá?",
        section: "reihenfolge-in-der-beratung",
        options: [
          { de: "Gleich in der ersten Nachricht", vi: "Ngay tin nhắn đầu tiên" },
          { de: "Erst nach der Zahlung", vi: "Chỉ sau khi đóng tiền" },
          { de: "Erst wenn klar ist, ob die Person online oder vor Ort lernen will", vi: "Chỉ khi đã rõ khách học online hay trực tiếp" },
          { de: "Nur wenn die Person dreimal fragt", vi: "Chỉ khi khách hỏi ba lần" }
        ],
        correct: 2
      },
      {
        question_de: "Du stellst einen Kurs vor. Was gehört immer dazu?",
        question_vi: "Khi giới thiệu khóa học, luôn phải có gì?",
        section: "reihenfolge-in-der-beratung",
        options: [
          { de: "Nur der Preis", vi: "Chỉ giá" },
          { de: "Die Kontonummer", vi: "Số tài khoản" },
          { de: "Stundenplan, Start und das Bild der Klasse", vi: "Lịch học, ngày khai giảng và hình ảnh lớp" },
          { de: "Ein Video der Lehrkraft", vi: "Video của giáo viên" }
        ],
        correct: 2
      },
      {
        question_de: "Jemand hat schon woanders Deutsch gelernt. Was schickst du gleich?",
        question_vi: "Khách đã học tiếng Đức ở nơi khác. Bạn gửi gì ngay?",
        section: "einstufung",
        options: [
          { de: "Den A1-Kurs", vi: "Khóa A1" },
          { de: "Den Einstufungstest der Stufe, damit sie ihn macht, während sie auf den Rückruf wartet", vi: "Bài kiểm tra xếp lớp của trình độ đó, để làm trong lúc chờ gọi lại" },
          { de: "Nichts, erst muss sie zahlen", vi: "Không gì, phải đóng tiền trước" },
          { de: "Ein Prüfungszertifikat zum Ausfüllen", vi: "Mẫu chứng chỉ để điền" }
        ],
        correct: 1
      },
      {
        question_de: "Was gehört in jede Terminerinnerung?",
        question_vi: "Nhắc lịch hẹn luôn phải ghi gì?",
        section: "termine-anruf-oder-buro",
        options: [
          { de: "Nur das Datum", vi: "Chỉ ngày" },
          { de: "Nur der Name", vi: "Chỉ tên" },
          { de: "Der Preis des Kurses", vi: "Giá khóa học" },
          { de: "Wie: Anruf über Zalo/WhatsApp oder Büro Saigon/Hanoi – mit Datum, Uhrzeit (bei Deutschland beide Zeitzonen) und Nummer", vi: "Hình thức: gọi Zalo/WhatsApp hay đến văn phòng Sài Gòn/Hà Nội – kèm ngày, giờ (khách ở Đức ghi cả hai múi giờ) và số điện thoại" }
        ],
        correct: 3
      },
      {
        question_de: "Was versprechen wir NIE?",
        question_vi: "Điều gì chúng ta KHÔNG BAO GIỜ hứa?",
        section: "was-wir-nicht-versprechen",
        options: [
          { de: "Dass die Lehrkräfte in Deutschland studiert haben", vi: "Giáo viên đã học tại Đức" },
          { de: "Den Preis aus der Preisliste", vi: "Giá trong bảng giá" },
          { de: "Dass es eine Probestunden-Regel gibt", vi: "Có quy định học thử" },
          { de: "Aufzeichnungen der Stunden, eine bestimmte Lehrkraft, ein Visum oder das Bestehen der Prüfung", vi: "Video ghi buổi học, giáo viên cụ thể, visa hay đậu kỳ thi" }
        ],
        correct: 3
      },
      {
        question_de: "„Ich habe Hepatitis B – kann ich eine Ausbildung machen?“ Was machst du?",
        question_vi: "„Tôi bị viêm gan B – có đi du học nghề được không?“ Bạn làm gì?",
        section: "was-wir-nicht-versprechen",
        options: [
          { de: "Nie raten – an die Leitung geben und sagen, bis wann die Antwort kommt", vi: "Không đoán – chuyển quản lý và báo khi nào có trả lời" },
          { de: "„Ja, kein Problem“", vi: "„Được, không sao“" },
          { de: "„Nein, das geht nicht“", vi: "„Không, không được“" },
          { de: "Im Internet nachsehen und antworten", vi: "Tra trên mạng rồi trả lời" }
        ],
        correct: 0
      },
      {
        question_de: "Jemand fragt nach unserer Methode. Welche Schnellantwort nimmst du?",
        question_vi: "Khách hỏi về phương pháp. Bạn dùng trả lời nhanh nào?",
        section: "unsere-methode-erklaren",
        options: [
          { de: "„phương pháp“ – jede Stunde hat ein Ziel: Grammatik, Hören oder Sprechen", vi: "„phương pháp“ – mỗi buổi có một mục tiêu: ngữ pháp, nghe hoặc nói" },
          { de: "„giá“ – mit der Preisliste", vi: "„giá“ – kèm bảng giá" },
          { de: "„lịch“ – mit dem Stundenplan", vi: "„lịch“ – kèm lịch học" },
          { de: "Keine, ich erkläre es frei", vi: "Không dùng, tự giải thích" }
        ],
        correct: 0
      },
      {
        question_de: "Ein Schüler sagt, er versteht eine Lehrkraft schlecht. Was antwortest du?",
        question_vi: "Học viên nói khó nghe thầy giảng. Bạn trả lời thế nào?",
        section: "uber-lehrkrafte-sprechen",
        options: [
          { de: "„Ja, er spricht sehr schnell, nimm lieber die andere Lehrerin.“", vi: "„Đúng rồi, thầy nói nhanh lắm, em học cô kia đi.“" },
          { de: "Positiv bleiben: „Unsere Lehrkräfte sind sehr gut. Wenn es zu schnell geht, sag Bescheid – wir geben es weiter und helfen dir.“", vi: "Nói tích cực: „Giáo viên đều rất giỏi. Nếu thầy nói nhanh quá thì em báo lại để trung tâm feedback và hỗ trợ em.“" },
          { de: "Gar nicht antworten", vi: "Không trả lời" },
          { de: "Sofort Geld zurück anbieten", vi: "Đề nghị hoàn tiền ngay" }
        ],
        correct: 1
      },
      {
        question_de: "Jemand möchte Phương als feste Lehrerin. Was sagst du?",
        question_vi: "Khách muốn chị Phương dạy cố định. Bạn nói gì?",
        section: "uber-lehrkrafte-sprechen",
        options: [
          { de: "Dass sie zwischen Vietnam und Deutschland pendelt und keine feste Klasse übernimmt – und eine Gruppe anbieten", vi: "Chị di chuyển giữa Việt Nam và Đức nên không nhận lớp cố định – và gợi ý lớp nhóm" },
          { de: "„Kein Problem, ich trage dich bei ihr ein.“", vi: "„Không sao, em ghi tên chị vào lớp của chị Phương.“" },
          { de: "„Nur 1:1 und gegen Aufpreis.“", vi: "„Chỉ học 1-1 và trả thêm phí.“" },
          { de: "„Das weiß ich nicht.“", vi: "„Em không biết.“" }
        ],
        correct: 0
      },
      {
        question_de: "Wie sprichst du Kunden im Chat an?",
        question_vi: "Bạn xưng hô với khách trên chat thế nào?",
        section: "so-schreiben-wir",
        options: [
          { de: "Immer „mình“ und „bạn“", vi: "Luôn xưng „mình“ – „bạn“" },
          { de: "Jedes Mal anders", vi: "Mỗi lần một kiểu" },
          { de: "Ohne Anrede", vi: "Không xưng hô" },
          { de: "Kunde: anh, chị oder bạn; ich: „trung tâm“ oder em/chị – und dabei bleiben", vi: "Gọi khách anh/chị/bạn; tự xưng „trung tâm“ hoặc em/chị – và giữ nhất quán" }
        ],
        correct: 3
      }
    ]
  }
};

export default page;
