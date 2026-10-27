-- Sample content for NaNu Wiki (German main text, Vietnamese translation).
-- Safe to run once on a fresh database: supabase db reset runs it automatically.

insert into public.areas (id, slug, name_de, name_vi, description_de, description_vi, icon, color, is_shared, sort) values
  ('00000000-0000-0000-0000-00000000a000', 'fuer-alle', 'Für alle', 'Cho tất cả mọi người',
   'Das Fundament für jede Rolle. Lies diese Seiten in deiner ersten Woche.',
   'Nền tảng cho mọi vai trò. Hãy đọc các trang này trong tuần đầu tiên.', 'users', '#0B7793', true, 0),
  ('00000000-0000-0000-0000-00000000a001', 'sales', 'Sales & Kundenservice', 'Kinh doanh & Chăm sóc khách hàng',
   'Du bist die erste Stimme von NaNu NaNa: Du beantwortest Anfragen, berätst ehrlich und begleitest bis zur Anmeldung.',
   'Bạn là tiếng nói đầu tiên của NaNu NaNa: trả lời câu hỏi, tư vấn trung thực và đồng hành đến khi học viên đăng ký.', 'chat', '#D9542C', false, 1),
  ('00000000-0000-0000-0000-00000000a002', 'student-support', 'Customer Success / Student Support', 'Hỗ trợ học viên',
   'APS, Visum, Studienkolleg – wir begleiten bis zur Ankunft in Deutschland.',
   'APS, visa, dự bị đại học – đồng hành đến khi đặt chân tới Đức.', 'heart', '#13946F', false, 2),
  ('00000000-0000-0000-0000-00000000a003', 'lehrkraft', 'Lehrkraft', 'Giáo viên',
   'Unterricht A1–C1, Prüfungsvorbereitung und Feedback.', 'Giảng dạy A1–C1, luyện thi và nhận xét học viên.', 'cap', '#4C5FD5', false, 3),
  ('00000000-0000-0000-0000-00000000a004', 'lehrmaterialien', 'Lehrmaterialien', 'Tài liệu giảng dạy',
   'Arbeitsblätter, Vokabellisten und Videolektionen.', 'Bài tập, danh sách từ vựng và video bài giảng.', 'book', '#C68A10', false, 4),
  ('00000000-0000-0000-0000-00000000a005', 'redaktion', 'Redaktion: Content & Social Media', 'Biên tập: Nội dung & mạng xã hội',
   'Facebook, TikTok, Erklärvideos und Redaktionsplan.', 'Facebook, TikTok, video giải thích và lịch nội dung.', 'pen', '#C9417F', false, 5),
  ('00000000-0000-0000-0000-00000000a006', 'operations', 'Operations Manager (je Standort)', 'Quản lý vận hành (từng cơ sở)',
   'Räume, Stundenpläne, Kasse und Team vor Ort.', 'Phòng học, lịch học, thu chi và đội ngũ tại chỗ.', 'building', '#2F7DC0', false, 6),
  ('00000000-0000-0000-0000-00000000a007', 'management', 'Management', 'Ban điều hành',
   'Strategie, Finanzen und Partner in Deutschland.', 'Chiến lược, tài chính và đối tác tại Đức.', 'compass', '#6E52C2', false, 7);

-- ---------------------------------------------------------------- Für alle
insert into public.pages (area_id, slug, title_de, title_vi, kind, section, verified_until, body) values
('00000000-0000-0000-0000-00000000a000', 'geschichte-und-werte', 'Unsere Geschichte & Werte', 'Câu chuyện & giá trị của chúng ta', 'decision', 'general', current_date + 120,
 '[{"type":"paragraph","de":"Qualität und Freundlichkeit – darauf bauen wir NaNu NaNa.","vi":"Chất lượng và sự tử tế – nền tảng của NaNu NaNa."},
   {"type":"heading","de":"Was uns wichtig ist","vi":"Điều chúng ta coi trọng"},
   {"type":"list","items":[{"de":"Ehrlich beraten – auch wenn die Antwort „Nein“ ist","vi":"Tư vấn trung thực – kể cả khi câu trả lời là „không“"},{"de":"Radikale Preistransparenz","vi":"Minh bạch học phí tuyệt đối"},{"de":"Begleitung bis zur Ankunft in Deutschland","vi":"Đồng hành đến khi đặt chân tới Đức"}]},
   {"type":"video","url":"","caption_de":"Willkommensvideo der Gründer (YouTube-Link einfügen)","caption_vi":"Video chào mừng từ nhà sáng lập (thêm link YouTube)"}]'),
('00000000-0000-0000-0000-00000000a000', 'kurse-und-leistungen', 'Kurse & Leistungen', 'Khóa học & dịch vụ', 'reference', 'general', current_date + 90,
 '[{"type":"list","items":[{"de":"A1 – 40 Einheiten","vi":"A1 – 40 buổi"},{"de":"A2 – 42 Einheiten","vi":"A2 – 42 buổi"},{"de":"B1 & Prüfungsvorbereitung – 44 Einheiten","vi":"B1 & luyện thi – 44 buổi"},{"de":"B2 – 58 Einheiten","vi":"B2 – 58 buổi"},{"de":"C1 – 58 Einheiten (TestDaF, DSH, Goethe C1)","vi":"C1 – 58 buổi (TestDaF, DSH, Goethe C1)"},{"de":"Kommunikationskurs","vi":"Lớp giao tiếp"}]}]'),
('00000000-0000-0000-0000-00000000a000', 'preise-und-positionierung', 'Preise & Positionierung', 'Học phí & định vị', 'decision', 'general', current_date + 60,
 '[{"type":"callout","tone":"info","de":"Radikale Preistransparenz: keine versteckten Gebühren, gleicher Preis für alle.","vi":"Minh bạch học phí tuyệt đối: không phí ẩn, một mức giá cho tất cả."},
   {"type":"paragraph","de":"[PREISLISTE EINFÜGEN]","vi":"[THÊM BẢNG HỌC PHÍ]"}]'),
('00000000-0000-0000-0000-00000000a000', 'standorte-und-team', 'Standorte & Team', 'Cơ sở & đội ngũ', 'reference', 'general', current_date + 90,
 '[{"type":"list","items":[{"de":"Hồ Chí Minh","vi":"Hồ Chí Minh"},{"de":"Hà Nội","vi":"Hà Nội"},{"de":"Stuttgart","vi":"Stuttgart"}]}]'),
('00000000-0000-0000-0000-00000000a000', 'tools', 'Tools, die wir nutzen', 'Công cụ chúng ta dùng', 'process', 'general', null,
 '[{"type":"paragraph","de":"Slack, Notion, Zalo, Facebook Messenger, Google Workspace und Canva. Facebook Messenger ist unser erster Kontaktkanal, Zalo nutzen wir für alles danach.","vi":"Slack, Notion, Zalo, Facebook Messenger, Google Workspace và Canva. Messenger là kênh liên hệ đầu tiên, Zalo dùng cho các bước sau."}]'),
('00000000-0000-0000-0000-00000000a000', 'allgemeine-regeln', 'Allgemeine Regeln', 'Quy định chung', 'reference', 'general', current_date + 180,
 '[{"type":"paragraph","de":"Arbeitszeiten, Urlaub, Datenschutz und Kommunikation.","vi":"Giờ làm, nghỉ phép, bảo mật dữ liệu và giao tiếp."}]');

-- ---------------------------------------------------------------- Sales
insert into public.pages (id, area_id, slug, title_de, title_vi, kind, section, verified_until, body) values
('00000000-0000-0000-0000-0000000b0001', '00000000-0000-0000-0000-00000000a001', 'erstkontakt-messenger',
 'Erstkontakt über Messenger beantworten', 'Trả lời tin nhắn đầu tiên qua Messenger', 'process', 'handbook', current_date + 80,
 '[{"type":"heading","de":"Ziel","vi":"Mục tiêu"},
   {"type":"paragraph","de":"Jede neue Anfrage auf Facebook Messenger wird während der Geschäftszeiten innerhalb von 15 Minuten beantwortet – persönlich, ehrlich und mit einem klaren nächsten Schritt.","vi":"Mọi tin nhắn mới trên Facebook Messenger được trả lời trong vòng 15 phút trong giờ làm việc – thân thiện, trung thực và có bước tiếp theo rõ ràng."},
   {"type":"callout","tone":"info","de":"Die erste Nachricht entscheidet über den Eindruck. Lieber kurz und herzlich als lang und perfekt.","vi":"Tin nhắn đầu tiên quyết định ấn tượng. Ngắn gọn và ấm áp tốt hơn dài và hoàn hảo."},
   {"type":"video","url":"","caption_de":"So beantwortest du eine Anfrage (Erklärvideo – YouTube-Link einfügen)","caption_vi":"Cách trả lời tin nhắn (video hướng dẫn – thêm link YouTube)"},
   {"type":"heading","de":"Schritt für Schritt","vi":"Từng bước"},
   {"type":"steps","items":[
     {"de":"Anfrage öffnen und Kontext prüfen","vi":"Mở tin nhắn và kiểm tra bối cảnh","body_de":"Schau, über welche Anzeige die Person kam, und suche im Notion-CRM nach früheren Gesprächen.","body_vi":"Xem khách đến từ quảng cáo nào và tìm lịch sử trò chuyện trong CRM Notion."},
     {"de":"Persönlich begrüßen","vi":"Chào hỏi thân thiện","body_de":"Sprich die Person mit Namen an und stell dich vor. Kunden schreiben wir auf Vietnamesisch.","body_vi":"Gọi tên khách và giới thiệu bản thân. Với khách hàng, chúng ta nhắn bằng tiếng Việt."},
     {"de":"Bedarf mit drei Fragen klären","vi":"Làm rõ nhu cầu bằng ba câu hỏi","body_de":"Ziel (Studium, Ausbildung, Arbeit), aktuelles Niveau, Zeitplan.","body_vi":"Mục tiêu (du học, du học nghề, đi làm), trình độ hiện tại, thời gian."},
     {"de":"Passendes Angebot und Preis offen nennen","vi":"Đề xuất khóa phù hợp và nói rõ học phí","body_de":"Empfiehl den passenden Kurs und nenne den Preis aus der aktuellen Preisliste.","body_vi":"Giới thiệu khóa học phù hợp và báo học phí theo bảng giá hiện hành."},
     {"de":"Nächsten Schritt vereinbaren und eintragen","vi":"Hẹn bước tiếp theo và ghi lại","body_de":"Probestunde oder Beratung anbieten, zu Zalo wechseln und den Kontakt im CRM anlegen.","body_vi":"Mời học thử hoặc tư vấn, chuyển sang Zalo và tạo liên hệ trong CRM."}]},
   {"type":"template","label_de":"Vorlage · Vietnamesisch","label_vi":"Mẫu tin nhắn","text":"Chào bạn [Tên] ạ! Mình là [Tên nhân viên] từ NaNu NaNa. Cảm ơn bạn đã nhắn tin cho tụi mình. Bạn đang muốn học tiếng Đức để du học, học nghề hay đi làm vậy?","translation_de":"„Hallo [Name]! Ich bin [Name] von NaNu NaNa. Danke für deine Nachricht. Möchtest du Deutsch für Studium, Ausbildung oder Arbeit lernen?“"},
   {"type":"callout","tone":"warning","de":"Versprich nie Rabatte oder Leistungen, die nicht in der Preisliste stehen.","vi":"Không bao giờ hứa giảm giá hay quyền lợi không có trong bảng giá."},
   {"type":"heading","de":"Häufige Fehler","vi":"Lỗi thường gặp"},
   {"type":"list","items":[{"de":"Nur den Preis schicken, ohne nach dem Ziel zu fragen.","vi":"Chỉ gửi giá mà không hỏi mục tiêu."},{"de":"Das Gespräch ohne nächsten Schritt beenden.","vi":"Kết thúc trò chuyện mà không có bước tiếp theo."},{"de":"Den Kontakt nicht im CRM eintragen.","vi":"Quên ghi liên hệ vào CRM."}]}]'),
('00000000-0000-0000-0000-0000000b0002', '00000000-0000-0000-0000-00000000a001', 'probestunde-buchen',
 'Probestunde buchen', 'Đặt lịch học thử', 'process', 'handbook', current_date + 40,
 '[{"type":"paragraph","de":"[SCHRITTE EINFÜGEN]","vi":"[THÊM CÁC BƯỚC]"}]'),
('00000000-0000-0000-0000-0000000b0003', '00000000-0000-0000-0000-00000000a001', 'keine-rabatte',
 'Warum wir keine Rabatte am Telefon geben', 'Vì sao không giảm giá qua điện thoại', 'decision', 'handbook', current_date + 150,
 '[{"type":"paragraph","de":"Gleicher, transparenter Preis für alle – Rabatte am Telefon würden dieses Versprechen brechen.","vi":"Giá minh bạch, như nhau cho mọi người – giảm giá qua điện thoại sẽ phá vỡ lời hứa này."}]'),
('00000000-0000-0000-0000-0000000b0004', '00000000-0000-0000-0000-00000000a001', 'kampagne-probestunde',
 'Kampagne „Kostenlose Probestunde“', 'Chiến dịch „Học thử miễn phí“', 'living', 'handbook', null,
 '[{"type":"paragraph","de":"Laufende Facebook-Anzeige. Wer über die Anzeige im Messenger schreibt, bekommt zuerst das Antwort-Skript unten.","vi":"Quảng cáo Facebook đang chạy. Ai nhắn qua quảng cáo trên Messenger sẽ nhận kịch bản trả lời bên dưới."}]'),
('00000000-0000-0000-0000-0000000b0005', '00000000-0000-0000-0000-00000000a001', 'interview',
 'Die Rolle in Kürze', 'Tóm tắt vai trò', 'reference', 'interview', null,
 '[{"type":"paragraph","de":"Du beantwortest Anfragen von jungen Menschen, die in Deutschland studieren oder eine Ausbildung machen möchten – schnell, freundlich und ehrlich.","vi":"Bạn trả lời câu hỏi của các bạn trẻ muốn du học hoặc học nghề tại Đức – nhanh, thân thiện và trung thực."},
   {"type":"video","url":"","caption_de":"Ein Tag im Sales-Team (YouTube-Link einfügen)","caption_vi":"Một ngày của đội Sales (thêm link YouTube)"},
   {"type":"heading","de":"Aufgaben","vi":"Nhiệm vụ"},
   {"type":"list","items":[{"de":"Anfragen über Messenger, Zalo und Telefon beantworten","vi":"Trả lời yêu cầu qua Messenger, Zalo và điện thoại"},{"de":"Zu Kurs, Niveau und Weg nach Deutschland beraten","vi":"Tư vấn khóa học, trình độ và con đường sang Đức"},{"de":"Probestunden, Anmeldung und Übergabe an Student Support","vi":"Học thử, đăng ký và bàn giao cho Hỗ trợ học viên"}]},
   {"type":"heading","de":"So sieht „großartig“ aus","vi":"Thế nào là „xuất sắc“"},
   {"type":"list","items":[{"de":"Antwortet ehrlich – auch wenn die Antwort „Nein“ ist","vi":"Trả lời trung thực – kể cả khi câu trả lời là „không“"},{"de":"Nennt Preise offen und erklärt, was enthalten ist","vi":"Nói rõ học phí và những gì đã bao gồm"},{"de":"Jedes Gespräch endet mit einem klaren nächsten Schritt","vi":"Mỗi cuộc trò chuyện kết thúc bằng bước tiếp theo rõ ràng"}]},
   {"type":"heading","de":"Anforderungen","vi":"Yêu cầu"},
   {"type":"list","items":[{"de":"Vietnamesisch (Muttersprache)","vi":"Tiếng Việt bản ngữ"},{"de":"Deutsch: [NIVEAU]","vi":"Tiếng Đức: [TRÌNH ĐỘ]"},{"de":"Klare schriftliche Kommunikation, Empathie","vi":"Viết rõ ràng, đồng cảm"}]},
   {"type":"heading","de":"Interviewfragen","vi":"Câu hỏi phỏng vấn"},
   {"type":"list","ordered":true,"items":[{"de":"Erzähl von einem Gespräch, in dem jemand unsicher war. Was hast du getan?","vi":"Kể về một lần khách hàng còn phân vân. Bạn đã làm gì?"},{"de":"„Bei einer anderen Schule ist es günstiger.“ Wie antwortest du?","vi":"„Trung tâm khác rẻ hơn.“ Bạn trả lời thế nào?"},{"de":"Wie organisierst du 40 offene Chats an einem Montagmorgen?","vi":"Bạn sắp xếp 40 tin nhắn chưa trả lời vào sáng thứ Hai thế nào?"}]},
   {"type":"heading","de":"Testaufgabe: Messenger-Simulation","vi":"Bài test: Mô phỏng Messenger"},
   {"type":"callout","tone":"tip","de":"Beantworte drei Nachrichten einer erfundenen Interessentin direkt hier. Wir achten auf Ton, Richtigkeit und den nächsten Schritt. Du hast einen Versuch.","vi":"Trả lời ba tin nhắn của một khách hàng giả định ngay tại đây. Chúng tôi đánh giá giọng điệu, độ chính xác và bước tiếp theo. Bạn có một lượt làm."},
   {"type":"chat","id":"sales-test","customer":"Linh",
    "intro_de":"Linh schreibt der NaNu-NaNa-Seite auf Messenger. Antworte so, wie du es im Job tun würdest – auf Vietnamesisch. Die Zeit läuft ab jeder neuen Nachricht.",
    "intro_vi":"Linh nhắn tin cho trang NaNu NaNa trên Messenger. Hãy trả lời như khi bạn đang làm việc – bằng tiếng Việt. Thời gian được tính từ mỗi tin nhắn mới.",
    "messages":[
      {"text":"Chào ad\n\nCho mình hỏi học phí khoá A1 bao nhiêu vậy ạ?","translation_de":"„Hallo Admin! Darf ich fragen, wie viel der A1-Kurs kostet?“"},
      {"text":"Mình đang học lớp 12, muốn sang Đức học nghề điều dưỡng. Giờ mới bắt đầu học tiếng Đức thì có kịp không ạ?","translation_de":"„Ich bin in der 12. Klasse und möchte in Deutschland eine Pflege-Ausbildung machen. Schaffe ich das, wenn ich jetzt erst mit Deutsch anfange?“"},
      {"text":"Trung tâm kia rẻ hơn bên mình 2 triệu lận\n\nBên mình có giảm giá gì không ad?","translation_de":"„Bei der anderen Schule ist es ganze 2 Millionen günstiger. Gibt es bei euch irgendeinen Rabatt?“"}]}]');

-- Onboarding: 4 weeks with checklists and quizzes
insert into public.onboarding_weeks (id, area_id, week, title_de, title_vi) values
 ('00000000-0000-0000-0000-0000000c0001', '00000000-0000-0000-0000-00000000a001', 1, 'Ankommen & Grundlagen', 'Làm quen & nền tảng'),
 ('00000000-0000-0000-0000-0000000c0002', '00000000-0000-0000-0000-00000000a001', 2, 'Produkte & Preise', 'Sản phẩm & học phí'),
 ('00000000-0000-0000-0000-0000000c0003', '00000000-0000-0000-0000-00000000a001', 3, 'Beratung & Abschluss', 'Tư vấn & chốt đăng ký'),
 ('00000000-0000-0000-0000-0000000c0004', '00000000-0000-0000-0000-00000000a001', 4, 'Selbstständig arbeiten', 'Làm việc độc lập');

insert into public.checklist_items (week_id, sort, label_de, label_vi, page_id) values
 ('00000000-0000-0000-0000-0000000c0001', 1, 'Seiten „Für alle“ lesen', 'Đọc các trang „Cho tất cả“', null),
 ('00000000-0000-0000-0000-0000000c0001', 2, 'Zugänge: Slack, Notion, Zalo OA, Messenger', 'Tài khoản: Slack, Notion, Zalo OA, Messenger', null),
 ('00000000-0000-0000-0000-0000000c0001', 3, 'Kursniveaus A1–C1 kennenlernen', 'Tìm hiểu các trình độ A1–C1', null),
 ('00000000-0000-0000-0000-0000000c0001', 4, '3 Beratungsgespräche mithören', 'Nghe 3 buổi tư vấn của đồng nghiệp', null),
 ('00000000-0000-0000-0000-0000000c0002', 1, 'Preisliste und Positionierung lesen', 'Đọc bảng học phí và định vị', null),
 ('00000000-0000-0000-0000-0000000c0002', 2, 'SOP: Erstkontakt über Messenger', 'SOP: Trả lời tin nhắn đầu tiên qua Messenger', '00000000-0000-0000-0000-0000000b0001'),
 ('00000000-0000-0000-0000-0000000c0002', 3, 'Skript Probestunde üben', 'Luyện kịch bản buổi học thử', '00000000-0000-0000-0000-0000000b0002'),
 ('00000000-0000-0000-0000-0000000c0002', 4, '5 Antworten mit Buddy-Feedback schreiben', 'Viết 5 câu trả lời có góp ý của người hướng dẫn', null),
 ('00000000-0000-0000-0000-0000000c0003', 1, 'Studium vs. Ausbildung erklären können', 'Giải thích được du học và du học nghề', null),
 ('00000000-0000-0000-0000-0000000c0003', 2, 'Einwände ehrlich behandeln', 'Xử lý phản đối một cách trung thực', null),
 ('00000000-0000-0000-0000-0000000c0003', 3, 'CRM in Notion pflegen', 'Cập nhật CRM trên Notion', null),
 ('00000000-0000-0000-0000-0000000c0003', 4, 'Erstes eigenes Beratungsgespräch', 'Buổi tư vấn đầu tiên của riêng bạn', null),
 ('00000000-0000-0000-0000-0000000c0004', 1, 'Eigene Messenger-Schicht übernehmen', 'Tự trực một ca Messenger', null),
 ('00000000-0000-0000-0000-0000000c0004', 2, 'Ersten Wochenreport schreiben', 'Viết báo cáo tuần đầu tiên', null),
 ('00000000-0000-0000-0000-0000000c0004', 3, 'Feedbackgespräch mit Sales Lead', 'Buổi góp ý với Sales Lead', null),
 ('00000000-0000-0000-0000-0000000c0004', 4, 'Abschlussquiz bestehen', 'Hoàn thành quiz cuối khóa', null);

insert into public.quizzes (id, week_id, pass_percent) values
 ('00000000-0000-0000-0000-0000000d0002', '00000000-0000-0000-0000-0000000c0002', 75);

insert into public.quiz_questions (quiz_id, sort, question_de, question_vi, options, correct_index, explanation_de, explanation_vi) values
 ('00000000-0000-0000-0000-0000000d0002', 1,
  'Ein Interessent fragt auf Messenger nach dem Preis für A1. Was tust du?', 'Một khách hỏi học phí khóa A1 qua Messenger. Bạn làm gì?',
  '[{"de":"Preis aus der Preisliste nennen und erklären, was enthalten ist","vi":"Báo giá theo bảng học phí và giải thích những gì đã bao gồm"},{"de":"Erst nach der Telefonnummer fragen, dann den Preis nennen","vi":"Hỏi số điện thoại trước rồi mới báo giá"},{"de":"Einen Rabatt anbieten, wenn heute gezahlt wird","vi":"Đề nghị giảm giá nếu thanh toán hôm nay"},{"de":"An das Management weiterleiten","vi":"Chuyển cho ban điều hành"}]',
  0, 'Radikale Preistransparenz: Wir nennen Preise offen und für alle gleich.', 'Minh bạch học phí tuyệt đối: báo giá công khai và như nhau cho mọi người.'),
 ('00000000-0000-0000-0000-0000000d0002', 2,
  'Wie viele Unterrichtseinheiten hat der A1-Kurs?', 'Khóa A1 có bao nhiêu buổi học?',
  '[{"de":"30","vi":"30"},{"de":"40","vi":"40"},{"de":"44","vi":"44"},{"de":"58","vi":"58"}]',
  1, 'A1 hat 40 Einheiten, A2 42, B1 44, B2 und C1 je 58.', 'A1 có 40 buổi, A2 42, B1 44, B2 và C1 mỗi khóa 58 buổi.'),
 ('00000000-0000-0000-0000-0000000d0002', 3,
  'In welcher Zeit beantworten wir neue Messenger-Anfragen?', 'Chúng ta trả lời tin nhắn mới trong bao lâu?',
  '[{"de":"Innerhalb von 15 Minuten","vi":"Trong vòng 15 phút"},{"de":"Innerhalb von 2 Stunden","vi":"Trong vòng 2 giờ"},{"de":"Am selben Tag","vi":"Trong ngày"},{"de":"Innerhalb von 24 Stunden","vi":"Trong vòng 24 giờ"}]',
  0, 'So steht es in der SOP „Erstkontakt über Messenger“.', 'Đây là quy định trong SOP „Trả lời tin nhắn đầu tiên qua Messenger“.'),
 ('00000000-0000-0000-0000-0000000d0002', 4,
  'Wann übergibst du eine neue Studentin an Student Support?', 'Khi nào bạn bàn giao học viên mới cho Hỗ trợ học viên?',
  '[{"de":"Nach der ersten Nachricht","vi":"Sau tin nhắn đầu tiên"},{"de":"Nach der Probestunde","vi":"Sau buổi học thử"},{"de":"Nach Anmeldung und Zahlung","vi":"Sau khi đăng ký và thanh toán"},{"de":"Erst bei Kursbeginn","vi":"Khi khóa học bắt đầu"}]',
  2, 'Die Übergabe erfolgt nach unterschriebener Anmeldung und Zahlung.', 'Bàn giao sau khi đã ký đăng ký và thanh toán.');
