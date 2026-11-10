import type { PageContent } from "@/lib/types";

// Step-by-step instructions for the Sales daily checklist (src/content/daily/sales.ts).
// One section per task; the heading anchor is what the task links to. Facts come from the Handbuch
// pages linked in each step – change the fact there, then here. Open points are marked „Zu klären“.
const page: PageContent = {
  slug: "taegliche-aufgaben",
  title_de: "Sales: tägliche Aufgaben Schritt für Schritt",
  title_vi: "Sales: việc hằng ngày từng bước",
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

    // ---------------------------------------------------------------- sales.morgen-pruefen
    { type: "heading", anchor: "morgen-pruefen", de: "Morgens: offene Kontakte, Rückrufe und Fristen prüfen", vi: "Đầu ngày: kiểm tra khách đang chờ, lịch gọi lại và deadline hồ sơ" },
    {
      type: "paragraph",
      de: "Das machst du als Erstes, bevor du neue Gespräche beginnst. So geht niemand verloren, der schon auf uns wartet.",
      vi: "Đây là việc làm đầu tiên, trước khi bắt đầu tư vấn khách mới. Như vậy không bỏ sót ai đang chờ mình."
    },
    {
      type: "steps",
      items: [
        {
          de: "Nachrichten ohne Antwort beantworten",
          vi: "Trả lời tin nhắn chưa được phản hồi",
          body_de: "Geh Facebook Messenger, Zalo, WhatsApp, TikTok und das Website-Formular durch. Hat die Person zuletzt geschrieben, antwortest du jetzt – die ältesten zuerst. Wie, steht in „[Erstkontakt über Messenger](sales/erstkontakt-messenger)“. Ist es gar keine Kursanfrage, hilft „[Nachrichten, die keine Kundenanfragen sind](sales/keine-kunden)“.",
          body_vi: "Kiểm tra Facebook Messenger, Zalo, WhatsApp, TikTok và form website. Tin nào khách nhắn sau cùng thì trả lời ngay – tin cũ nhất trước. Cách trả lời xem „[Trả lời khách mới qua Messenger](sales/erstkontakt-messenger)“. Không phải khách hỏi khoá học thì xem „[Tin nhắn không phải của khách](sales/keine-kunden)“."
        },
        {
          de: "Kontakte anschreiben, die nicht geantwortet haben",
          vi: "Nhắn lại khách chưa trả lời mình",
          body_de: "Hat jemand 24 Stunden nicht auf deine letzte Nachricht geantwortet, schreib noch einmal. Frag freundlich, was die Person noch braucht.",
          body_vi: "Khách 24 tiếng chưa trả lời tin cuối của mình thì nhắn lại. Hỏi thăm nhẹ nhàng khách còn cần gì."
        },
        {
          de: "Fällige Rückrufe und Termine finden",
          vi: "Tìm các cuộc gọi lại và lịch hẹn đến hạn",
          body_de: "Jeder Kontakt hat ein Datum für den nächsten Kontakt (siehe „[Kunden betreuen](sales/aufgaben-und-kpis#kunden-betreuen)“). Such alle Kontakte, deren Datum heute ist oder schon vorbei ist. Dazu kommen die Terminerinnerungen für Anrufe und Besuche im Büro (siehe „[Termine: Anruf oder Büro](sales/beratung-und-termine#termine-anruf-oder-buro)“). Plan sie für heute ein.",
          body_vi: "Mỗi khách đều có ngày liên hệ tiếp theo (xem „[Chăm sóc khách](sales/aufgaben-und-kpis#kunden-betreuen)“). Tìm mọi khách có ngày đó là hôm nay hoặc đã qua. Thêm các nhắc hẹn gọi điện và hẹn đến văn phòng (xem „[Lịch hẹn: gọi điện hay đến văn phòng](sales/beratung-und-termine#termine-anruf-oder-buro)“). Xếp lịch làm trong hôm nay."
        },
        {
          de: "Fälle über 48 Stunden zuerst",
          vi: "Ưu tiên khách đã quá 48 tiếng",
          body_de: "Eine vereinbarte Rückmeldung darf höchstens 48 Stunden alt werden (siehe „[KPIs](sales/aufgaben-und-kpis#kpis)“). Wer schon darüber ist, kommt an erster Stelle.",
          body_vi: "Khách đã hẹn liên hệ lại không được để quá 48 tiếng (xem „[KPI](sales/aufgaben-und-kpis#kpis)“). Ai đã quá thì liên hệ trước tiên."
        },
        {
          de: "Fristen der Studien- und Visumsunterlagen prüfen",
          vi: "Kiểm tra deadline hồ sơ du học và visa",
          body_de: "Öffne die Liste aller laufenden Fälle mit Fristen (siehe „[Die Aufgaben](sales/aufgaben-und-kpis#die-aufgaben)“). Schau bei jedem Fall, welche Frist als Nächstes kommt. Fehlt eine Unterlage, schreib der Person heute. Wichtige Fristen stehen in „[Fristen, die alles entscheiden](visa/visum-ausbildung#fristen-die-alles-entscheiden)“. Versprich nie ein Visum.",
          body_vi: "Mở danh sách hồ sơ đang làm kèm deadline (xem „[Công việc chính](sales/aufgaben-und-kpis#die-aufgaben)“). Xem từng hồ sơ: deadline gần nhất là gì. Thiếu giấy tờ thì nhắn khách ngay hôm nay. Các mốc quan trọng xem „[Các mốc thời gian quyết định](visa/visum-ausbildung#fristen-die-alles-entscheiden)“. Không bao giờ hứa chắc có visa."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: keine Nachricht mehr ohne Antwort ist, jeder fällige Rückruf für heute eingeplant ist und du bei jedem laufenden Fall die nächste Frist kennst.",
      vi: "Tick khi: không còn tin nhắn nào chưa trả lời, mọi cuộc gọi lại đến hạn đã xếp lịch trong hôm nay và bạn biết deadline tiếp theo của từng hồ sơ."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Wo steht das Datum für den nächsten Kontakt, und wie findest du alle fälligen Kontakte? Das Handbuch nennt das Backoffice, „[Erstkontakt](sales/erstkontakt-messenger)“ nennt ein CRM, und „[Tools](fuer-alle/tools)“ sagt, dass die Kundendaten in Notion liegen. Wo liegt die Liste der laufenden Fälle mit Fristen? Und wer verfolgt die Visumsunterlagen: Sales oder Student Support (siehe „[Wer macht was](visa/ueberblick#wer-macht-was)“)?",
      vi: "Cần làm rõ: Ngày liên hệ tiếp theo ghi ở đâu, và lọc khách đến hạn thế nào? Sổ tay ghi là Backoffice, trang „[Khách mới](sales/erstkontakt-messenger)“ ghi là CRM, còn trang „[Công cụ](fuer-alle/tools)“ nói dữ liệu khách nằm trong Notion. Danh sách hồ sơ kèm deadline nằm ở đâu? Và ai theo dõi hồ sơ visa: Sales hay Student Support (xem „[Ai làm gì](visa/ueberblick#wer-macht-was)“)?"
    },

    // ---------------------------------------------------------------- sales.anfragen-beantwortet
    { type: "heading", anchor: "anfragen-beantwortet", de: "Alle neuen Anfragen beantworten", vi: "Trả lời mọi khách mới" },
    {
      type: "steps",
      items: [
        {
          de: "Alle Kanäle offen halten",
          vi: "Theo dõi mọi kênh",
          body_de: "Neue Anfragen kommen über Facebook, Zalo, WhatsApp, TikTok und das Website-Formular. Schau den ganzen Tag in alle Kanäle. Jede neue Anfrage beantwortest du sofort.",
          body_vi: "Khách mới đến từ Facebook, Zalo, WhatsApp, TikTok và form website. Kiểm tra mọi kênh suốt cả ngày. Khách mới nào cũng trả lời ngay."
        },
        {
          de: "Persönlich begrüßen und die Frage beantworten",
          vi: "Chào theo tên và trả lời câu hỏi",
          body_de: "Sprich die Person mit Namen an und schreib auf Vietnamesisch. Beantworte zuerst ihre Frage, auch wenn sie nur einen Anzeigen-Button gedrückt hat. Antworten findest du in den FAQs, z. B. „[FAQ Sprachkurse](sales/faq-sprachkurse)“.",
          body_vi: "Gọi tên khách và nhắn bằng tiếng Việt. Trả lời câu hỏi của khách trước, kể cả khi khách chỉ bấm nút quảng cáo. Câu trả lời có trong FAQ, ví dụ „[FAQ khoá học tiếng](sales/faq-sprachkurse)“."
        },
        {
          de: "Nur zwei Fragen stellen",
          vi: "Chỉ hỏi hai câu",
          body_de: "Wo wohnst du? Welches Niveau hast du? Mehr nicht. Danach schickst du nur die Kurse, die passen, und nennst den Preis aus der aktuellen Preisliste. Siehe „[Schritt für Schritt](sales/erstkontakt-messenger#schritt-fur-schritt)“.",
          body_vi: "Bạn ở đâu? Bạn đang ở trình độ nào? Không hỏi thêm. Sau đó chỉ gửi khoá phù hợp và báo giá theo bảng giá hiện tại. Xem „[Từng bước](sales/erstkontakt-messenger#schritt-fur-schritt)“."
        },
        {
          de: "Nächsten Schritt vereinbaren",
          vi: "Hẹn bước tiếp theo",
          body_de: "Biete eine Probestunde oder eine Beratung an und wechsle zu Zalo. Kein Gespräch endet ohne nächsten Schritt.",
          body_vi: "Mời học thử hoặc hẹn tư vấn và chuyển sang Zalo. Không cuộc trò chuyện nào kết thúc mà không có bước tiếp theo."
        },
        {
          de: "Schüler, die im Messenger schreiben, weitergeben",
          vi: "Học viên nhắn qua Messenger: chuyển tiếp",
          body_de: "Schreibt jemand, der schon Schüler ist, hilf sofort oder gib es mit Uhrzeit weiter. Wie, steht in „[Wenn Schüler im Messenger schreiben](sales/bestandskunden-im-messenger)“.",
          body_vi: "Người đã là học viên nhắn tin thì giúp ngay hoặc chuyển tiếp kèm thời gian trả lời. Cách làm xem „[Khi học viên nhắn qua Messenger](sales/bestandskunden-im-messenger)“."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: jede Anfrage von heute eine Antwort und einen vereinbarten nächsten Schritt hat.",
      vi: "Tick khi: mọi khách mới hôm nay đều đã được trả lời và có bước tiếp theo."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Wo kommen die Nachrichten aus TikTok und dem Website-Formular an, und wer sieht sie?",
      vi: "Cần làm rõ: Tin nhắn từ TikTok và form website về đâu, và ai nhìn thấy?"
    },

    // ---------------------------------------------------------------- sales.kontakt-status
    { type: "heading", anchor: "kontakt-status", de: "Jeder Kontakt hat Status, Zuständige und nächsten Termin", vi: "Mỗi khách có trạng thái, người phụ trách và ngày liên hệ tiếp" },
    {
      type: "steps",
      items: [
        {
          de: "Jeden Kontakt von heute öffnen",
          vi: "Mở từng khách đã liên hệ hôm nay",
          body_de: "Geh alle Personen durch, mit denen du heute geschrieben oder telefoniert hast.",
          body_vi: "Xem lại tất cả khách đã nhắn tin hoặc gọi điện hôm nay."
        },
        {
          de: "Drei Dinge eintragen",
          vi: "Ghi ba thông tin",
          body_de: "Trag bei jedem Kontakt im Backoffice ein:\n– den Status,\n– wer zuständig ist,\n– und wann der nächste Kontakt ist.\nSchreib dazu, was die Person braucht und was ihr besprochen habt. Siehe „[Kunden betreuen](sales/aufgaben-und-kpis#kunden-betreuen)“.",
          body_vi: "Ghi cho từng khách vào Backoffice:\n– trạng thái,\n– người phụ trách,\n– và ngày liên hệ tiếp theo.\nGhi thêm nhu cầu của khách và nội dung đã tư vấn. Xem „[Chăm sóc khách](sales/aufgaben-und-kpis#kunden-betreuen)“."
        },
        {
          de: "Ausbildung und Studium: Sterne vergeben",
          vi: "Du học nghề và đại học: chấm sao",
          body_de: "Schätze jede Person mit 1–5 Sternen ein (5 = am vielversprechendsten). Schreib die Sterne direkt in den Kontaktnamen.",
          body_vi: "Đánh giá mỗi khách từ 1–5 sao (5 = tiềm năng nhất). Ghi số sao ngay vào tên khách."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: es keinen Kontakt gibt, bei dem niemand weiß, wie es weitergeht.",
      vi: "Tick khi: không còn khách nào mà không ai biết bước tiếp theo."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Welche Status gibt es zur Auswahl? Und ist das Backoffice dasselbe wie das CRM und die Kundendaten in Notion?",
      vi: "Cần làm rõ: Có những trạng thái nào để chọn? Backoffice có phải là CRM và dữ liệu khách trong Notion không?"
    },

    // ---------------------------------------------------------------- sales.rueckmeldungen-48h
    { type: "heading", anchor: "rueckmeldungen-48h", de: "Vereinbarte Rückmeldungen innerhalb von 48 Stunden", vi: "Liên hệ lại đúng hẹn trong 48 tiếng" },
    {
      type: "steps",
      items: [
        {
          de: "Alle Zusagen sammeln",
          vi: "Gom mọi lời hẹn",
          body_de: "Such alle Kontakte, denen du eine Antwort, einen Anruf oder eine Info versprochen hast. Die ältesten kommen zuerst.",
          body_vi: "Tìm mọi khách mình đã hẹn trả lời, gọi lại hay gửi thông tin. Hẹn cũ nhất làm trước."
        },
        {
          de: "Anrufe richtig vorbereiten",
          vi: "Chuẩn bị cuộc gọi",
          body_de: "Schreib in die Terminerinnerung, wie ihr sprecht: Anruf über Zalo oder WhatsApp oder Besuch im Büro. Dazu Datum, Uhrzeit und Nummer. Bei Kunden in Deutschland nennst du beide Uhrzeiten. Siehe „[Termine: Anruf oder Büro](sales/beratung-und-termine#termine-anruf-oder-buro)“.",
          body_vi: "Ghi trong nhắc hẹn: gọi Zalo, WhatsApp hay đến văn phòng. Kèm ngày, giờ và số điện thoại. Khách ở Đức thì ghi cả giờ VN và giờ Đức. Xem „[Lịch hẹn](sales/beratung-und-termine#termine-anruf-oder-buro)“."
        },
        {
          de: "Melden und das nächste Datum eintragen",
          vi: "Liên hệ và ghi ngày tiếp theo",
          body_de: "Halte jede Zusage ein. Danach trägst du sofort das nächste Kontaktdatum ein.",
          body_vi: "Giữ đúng mọi lời hẹn. Xong thì ghi ngay ngày liên hệ tiếp theo."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: keine vereinbarte Rückmeldung älter als 48 Stunden ist.",
      vi: "Tick khi: không có lời hẹn liên hệ lại nào quá 48 tiếng."
    },

    // ---------------------------------------------------------------- sales.absagegruende
    { type: "heading", anchor: "absagegruende", de: "Bei jeder Absage den Grund aufschreiben", vi: "Ghi lý do mỗi khi khách từ chối" },
    {
      type: "steps",
      items: [
        {
          de: "Nach dem Grund fragen",
          vi: "Hỏi lý do",
          body_de: "Sagt jemand ab, frag freundlich, warum. Ist es der Preis, die Uhrzeit, der Ort oder etwas anderes?",
          body_vi: "Khách từ chối thì hỏi nhẹ nhàng vì sao. Do học phí, giờ học, địa điểm hay lý do khác?"
        },
        {
          de: "Einen anderen Kurs anbieten",
          vi: "Đề xuất khoá khác",
          body_de: "Unser Ziel: wenn nicht dieser Kurs, dann ein anderer. Passt eine andere Uhrzeit oder Klasse, biete sie an.",
          body_vi: "Mục tiêu: không khoá này thì khoá khác. Có giờ học hay lớp khác phù hợp thì đề xuất."
        },
        {
          de: "Den Grund beim Kontakt eintragen",
          vi: "Ghi lý do vào thông tin khách",
          body_de: "Die Leitung fragt danach, wenn ein Ziel nicht erreicht wird. „Die Kunden haben nicht geantwortet“ reicht dann nicht. Siehe „[KPIs](sales/aufgaben-und-kpis#kpis)“.",
          body_vi: "Khi chưa đạt mục tiêu, quản lý sẽ hỏi. Lúc đó chỉ nói „khách không trả lời“ là chưa đủ. Xem „[KPI](sales/aufgaben-und-kpis#kpis)“."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: bei jeder Absage von heute ein Grund steht.",
      vi: "Tick khi: mọi khách từ chối hôm nay đều có ghi lý do."
    },

    // ---------------------------------------------------------------- sales.uebergabe-cs
    { type: "heading", anchor: "uebergabe-cs", de: "Neue Anmeldungen an Customer Success übergeben", vi: "Bàn giao học viên mới cho đội Chăm sóc học viên" },
    {
      type: "steps",
      items: [
        {
          de: "Die Daten haben",
          vi: "Có đủ thông tin",
          body_de: "Du brauchst den vollständigen Namen, E-Mail, Telefonnummer und Adresse. Siehe „[Was wir nach der Zahlung brauchen](sales/anmeldung-und-zahlung#was-wir-nach-der-zahlung-brauchen)“.",
          body_vi: "Cần họ tên đầy đủ, email, số điện thoại và địa chỉ. Xem „[Thông tin cần sau khi đóng tiền](sales/anmeldung-und-zahlung#was-wir-nach-der-zahlung-brauchen)“."
        },
        {
          de: "Im Messenger das Label „Kurs“ setzen",
          vi: "Gắn nhãn „Kurs“ trên Messenger",
          body_de: "Sobald die Person bezahlt hat. War sie vorgemerkt, schreibst du unter den Post in Slack „bezahlt“.",
          body_vi: "Ngay khi khách đã đóng tiền. Nếu khách đã ghi danh trước thì viết „bezahlt“ dưới bài đăng trên Slack."
        },
        {
          de: "In Slack an Customer Success melden",
          vi: "Báo lên Slack cho đội Chăm sóc học viên",
          body_de: "Schreib alles dazu, was du versprochen hast, z. B. einen Sonderpreis, Ratenzahlung oder einen späteren Kursstart. Zahlungen am Wochenende meldest du mit Name, E-Mail, Telefon, Klasse, Betrag und Beleg.",
          body_vi: "Ghi rõ mọi điều đã hứa, ví dụ giá đặc biệt, trả góp hay khai giảng muộn. Khách đóng tiền cuối tuần thì báo kèm tên, email, điện thoại, lớp, số tiền và ảnh chuyển khoản."
        },
        {
          de: "Firmenkonto: der Buchhaltung Bescheid geben",
          vi: "Chuyển khoản công ty: báo kế toán",
          body_de: "Hat die Person auf das Firmenkonto gezahlt, sag es der Buchhaltung. Dann stellt sie die Rechnung aus.",
          body_vi: "Khách chuyển vào tài khoản công ty thì báo kế toán để xuất hoá đơn."
        },
        {
          de: "Danach nichts mehr schicken",
          vi: "Sau đó không gửi gì thêm",
          body_de: "Ab jetzt ist nur Customer Success für die Person da. So bekommt sie keine verschiedenen Antworten. Siehe „[An Customer Success übergeben](sales/aufgaben-und-kpis#uebergabe)“.",
          body_vi: "Từ đây chỉ đội Chăm sóc học viên phụ trách. Như vậy học viên không nhận câu trả lời khác nhau. Xem „[Bàn giao](sales/aufgaben-und-kpis#uebergabe)“."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: jede Zahlung von heute in Slack gemeldet ist – mit allem, was zugesagt wurde.",
      vi: "Tick khi: mọi khách đóng tiền hôm nay đã được báo lên Slack – kèm mọi điều đã hứa."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: In welchem Slack-Kanal meldet Sales neue Anmeldungen, z. B. #student-support oder #customer-support?",
      vi: "Cần làm rõ: Sales báo học viên mới ở kênh Slack nào, ví dụ #student-support hay #customer-support?"
    },

    // ---------------------------------------------------------------- sales.abend-backoffice
    { type: "heading", anchor: "abend-backoffice", de: "Abends: Backoffice ausfüllen und alles prüfen", vi: "Cuối ngày: điền Backoffice và kiểm tra lại" },
    {
      type: "steps",
      items: [
        {
          de: "Backoffice ausfüllen",
          vi: "Điền Backoffice",
          body_de: "Trag alle Kontakte von heute ein, wie unter „[Jeder Kontakt hat Status, Zuständige und nächsten Termin](sales/taegliche-aufgaben#kontakt-status)“ beschrieben.",
          body_vi: "Ghi mọi khách hôm nay, như ở mục „[Mỗi khách có trạng thái, người phụ trách và ngày liên hệ tiếp](sales/taegliche-aufgaben#kontakt-status)“."
        },
        {
          de: "In den letzten 15 Minuten alles prüfen",
          vi: "15 phút cuối kiểm tra lại",
          body_de: "Geh die Liste „Tägliche Aufgaben“ noch einmal durch:\n– Hat jede Nachricht eine Antwort?\n– Hat jeder Kontakt einen nächsten Termin?\n– Ist keine Rückmeldung älter als 48 Stunden?\nWas offen ist, erledigst du jetzt oder planst es für morgen ein.",
          body_vi: "Xem lại danh sách „Việc hằng ngày“:\n– Tin nhắn nào cũng đã trả lời chưa?\n– Khách nào cũng có ngày liên hệ tiếp chưa?\n– Có lời hẹn nào quá 48 tiếng không?\nViệc còn lại thì làm ngay hoặc xếp lịch cho ngày mai."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: das Backoffice für heute vollständig ist und du die Prüfung gemacht hast.",
      vi: "Tick khi: Backoffice hôm nay đã đầy đủ và bạn đã kiểm tra lại."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Gilt die Vorlage „[Bericht am Ende der Schicht](student-support/aufgaben-und-rhythmus#so-arbeiten-wir-im-team)“ auch für Sales? Sie fragt nach neuen Kontakten und Stories, also nach Sales-Arbeit. Und wohin schickt Sales den Bericht?",
      vi: "Cần làm rõ: Mẫu „[Báo cáo cuối ca](student-support/aufgaben-und-rhythmus#so-arbeiten-wir-im-team)“ có áp dụng cho Sales không? Mẫu hỏi về khách mới và story, tức là việc của Sales. Sales gửi báo cáo cho ai?"
    },

    // ---------------------------------------------------------------- sales.di-klassenbedarf
    { type: "heading", anchor: "di-klassenbedarf", de: "Dienstags: Bedarf für die nächsten Klassen sammeln", vi: "Thứ Ba: tổng hợp nhu cầu mở lớp" },
    {
      type: "steps",
      items: [
        {
          de: "Wartende Kontakte sammeln",
          vi: "Gom khách đang chờ lớp",
          body_de: "Schreib für jede Person auf:\n– welche Stufe,\n– welche Uhrzeit,\n– online oder vor Ort,\n– und wo.\nDas machst du einen Monat und noch einmal zwei Wochen vor dem Start.",
          body_vi: "Ghi cho từng khách:\n– trình độ nào,\n– khung giờ nào,\n– online hay offline,\n– và ở đâu.\nLàm trước khai giảng 1 tháng và lần nữa trước 2 tuần."
        },
        {
          de: "Einen Vorschlag machen",
          vi: "Đưa ra đề xuất",
          body_de: "Schlag Starttermin, Stundenplan und die erwartete Zahl der Schüler vor. Klär mit der Kursplanung, ob es Lehrkraft und Raum gibt. Siehe „[Neue Klassen planen](sales/aufgaben-und-kpis#die-aufgaben)“.",
          body_vi: "Đề xuất ngày khai giảng, lịch học và số học viên dự kiến. Kiểm tra với bộ phận điều phối xem có giáo viên và phòng học không. Xem „[Lên kế hoạch mở lớp](sales/aufgaben-und-kpis#die-aufgaben)“."
        },
        {
          de: "Werbung bei Marketing anfragen",
          vi: "Nhờ Marketing quảng cáo",
          body_de: "2–4 Wochen vor dem Start fragst du bei Marketing einen Post, eine Story oder eine Anzeige an.",
          body_vi: "Trước khai giảng 2–4 tuần, nhờ Marketing đăng bài, story hoặc chạy quảng cáo."
        },
        {
          de: "Zu kleine Klassen früh melden",
          vi: "Báo sớm lớp có nguy cơ thiếu học viên",
          body_de: "Bleibt eine Klasse zu klein, schlag rechtzeitig eine Lösung vor. Hat eine Lehrkraft Zeit, aber keine Klasse, kannst du einen kurzen Kurs vorschlagen, z. B. Aussprache zu zweit.",
          body_vi: "Lớp có nguy cơ thiếu học viên thì đề xuất phương án sớm. Giáo viên trống lịch thì có thể đề xuất lớp ngắn, ví dụ luyện phát âm 2 người."
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: für jede Klasse, die in einem Monat oder in zwei Wochen startet, der Bedarf gesammelt und ein Vorschlag gemacht ist.",
      vi: "Tick khi: mọi lớp khai giảng trong 1 tháng hoặc 2 tuần tới đều đã có tổng hợp nhu cầu và đề xuất."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Zu klären: Wo führt Sales die Liste der wartenden Kontakte? Und wen fragst du bei der Kursplanung, in welchem Kanal?",
      vi: "Cần làm rõ: Sales ghi danh sách khách chờ lớp ở đâu? Hỏi ai ở bộ phận điều phối, qua kênh nào?"
    },

    // ---------------------------------------------------------------- sales.mi-pruefen
    { type: "heading", anchor: "mi-pruefen", de: "Mittwochs: Unentschlossene, Visumsunterlagen und Anmeldestand prüfen", vi: "Thứ Tư: kiểm tra khách chưa chốt, hồ sơ visa và tiến độ tuyển sinh" },
    {
      type: "steps",
      items: [
        {
          de: "Unentschlossene Kontakte anschreiben",
          vi: "Nhắn khách chưa chốt",
          body_de: "Such alle, die beraten wurden, sich aber noch nicht angemeldet haben. Frag jede Person, was sie noch braucht, und schlag einen nächsten Schritt vor.",
          body_vi: "Tìm mọi khách đã được tư vấn nhưng chưa đăng ký. Hỏi từng người còn cần gì và đề xuất bước tiếp theo."
        },
        {
          de: "Jede Visumsakte prüfen",
          vi: "Kiểm tra từng hồ sơ visa",
          body_de: "Jede Akte hat einen Stand und eine Frist. Fehlt etwas, trägst du es nach. Siehe „[KPIs](sales/aufgaben-und-kpis#kpis)“.",
          body_vi: "Mỗi hồ sơ đều phải có tiến độ và deadline. Thiếu thì bổ sung ngay. Xem „[KPI](sales/aufgaben-und-kpis#kpis)“."
        },
        {
          de: "Anmeldestand je Klasse prüfen",
          vi: "Kiểm tra tiến độ tuyển sinh từng lớp",
          body_de: "Zähl für jede kommende Klasse, wie viele schon bezahlt haben und wie viele vorgemerkt sind. Ist eine Klasse zu klein, schlag eine Lösung vor (siehe Dienstag).",
          body_vi: "Đếm cho từng lớp sắp mở: bao nhiêu khách đã đóng tiền, bao nhiêu đã ghi danh trước. Lớp có nguy cơ thiếu học viên thì đề xuất phương án (xem thứ Ba)."
        }
      ]
    },
    {
      type: "callout",
      tone: "info",
      de: "Die Leitung kontrolliert diese Punkte stichprobenartig.",
      vi: "Quản lý sẽ kiểm tra bất kỳ."
    },
    {
      type: "callout",
      tone: "tip",
      de: "Abhaken, wenn: jeder unentschlossene Kontakt eine Nachricht bekommen hat, jede Akte Stand und Frist hat und du für jede Klasse den Anmeldestand kennst.",
      vi: "Tick khi: mọi khách chưa chốt đã được nhắn, mọi hồ sơ đều có tiến độ và deadline, và bạn biết tiến độ tuyển sinh của từng lớp."
    }
  ]
};

export default page;
