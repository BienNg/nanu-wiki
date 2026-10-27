import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "material-und-hausaufgaben",
  title_de: "Material & Hausaufgaben",
  title_vi: "Tài liệu & bài tập",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Wer im Kurs ist, fragt vor allem nach Material. Die Antwort muss so konkret sein, dass die Person sofort loslegen kann – oft lernt sie nebenbei, zwischen Arbeit und Kindern.",
      vi: "Học viên đang học hỏi nhiều nhất về tài liệu. Câu trả lời phải cụ thể đến mức học viên bắt tay vào làm được ngay – nhiều người học xen giữa giờ làm và việc chăm con."
    },
    { type: "heading", de: "Typische Anfragen", vi: "Các yêu cầu thường gặp" },
    {
      type: "list",
      items: [
        { de: "Unterrichtsdatei und Hausaufgabe der letzten Stunde", vi: "File bài giảng và bài tập của buổi trước" },
        { de: "Eine Aufzeichnung der Stunde – gibt es nicht (siehe unten)", vi: "Video quay lại buổi học – trung tâm không có (xem bên dưới)" },
        { de: "Die Unterrichtsdatei fehlt noch in der Gruppe", vi: "File bài giảng chưa có trong nhóm" },
        { de: "Welche Datei aus der Mail gedruckt werden soll", vi: "File nào trong mail là file cần in" },
        { de: "Material der nächsten Stufe, bevor der Kurs zu Ende ist", vi: "Tài liệu trình độ tiếp theo khi khoá hiện tại chưa kết thúc" },
        { de: "Wo das gedruckte Buch bleibt – oft fragen Angehörige", vi: "Sách in đã gửi chưa – thường là người nhà hỏi" },
        { de: "Ob es Nachholstunden gibt, wenn man einen Termin verpasst", vi: "Nghỉ một buổi thì có được học bù không" }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Immer die neueste Version aus Google Drive schicken. Nie eine Datei, die du dir einmal heruntergeladen hast: Drive wird ständig geändert, kleine Änderungen werden nicht angekündigt. Mit einer alten Datei schickst du schnell falsche Infos.",
      vi: "Luôn lấy bản mới nhất trên Google Drive mỗi lần gửi. Tuyệt đối không dùng file đã tải về máy từ trước: Drive được cập nhật liên tục, các thay đổi nhỏ không được thông báo riêng. Dùng file cũ rất dễ gửi thông tin sai cho học viên."
    },
    { type: "heading", de: "So antwortest du", vi: "Cách trả lời" },
    {
      type: "list",
      items: [
        {
          de: "Aufzeichnung gewünscht: Unsere Live-Stunden werden nicht aufgezeichnet – auch wenn in einem Beratungsgespräch etwas anderes angekommen ist. Biete stattdessen Unterrichtsdatei, Hausaufgabe und die Trợ-giảng-Stunde an. In NaNu Go gibt es aufgezeichnete Lektionen, bisher aber nur die ersten 8 von A1.1.",
          vi: "Học viên xin video buổi học: trung tâm không quay lại các buổi học trực tiếp – kể cả khi lúc tư vấn học viên hiểu khác. Thay vào đó gửi file bài giảng, bài tập và nhắc buổi trợ giảng. App NaNu Go có bài giảng quay sẵn, nhưng hiện mới có 8 bài đầu của A1.1."
        },
        {
          de: "Nur schicken, was gefragt ist: Fragt jemand nach B2 online, nicht auch die Datei für B2 vor Ort mitschicken.",
          vi: "Học viên hỏi cái nào thì gửi cái đó: hỏi B2 online thì không gửi kèm file B2 offline."
        },
        {
          de: "Seite und Aufgabe nennen, nicht nur die Datei: „Buch A1.1, ab Seite 93 beginnt das Arbeitsbuch; Hausaufgabe sind Übung 9–12 auf Seite 21.“",
          vi: "Nêu trang và số bài, không chỉ gửi file: „Quyển A1.1, từ trang 93 là phần sách bài tập; bài về nhà là bài 9–12 ở trang 21.“"
        },
        {
          de: "Große Dateien gehen über Messenger nicht durch. Hier einen Drive-Link schicken, die Datei selbst über Zalo.",
          vi: "File lớn không gửi được qua Messenger. Ở đây gửi link Drive, còn file thì gửi qua Zalo."
        },
        {
          de: "Fehlt eine Unterrichtsdatei: der Lehrkraft Bescheid geben, der Person eine Uhrzeit nennen und prüfen, ob die Datei wirklich in der Gruppe ist. Sonst muss die Person am nächsten Tag noch einmal nachhaken.",
          vi: "Thiếu file bài giảng: báo giáo viên, hẹn học viên giờ cụ thể và kiểm tra file đã thật sự có trong nhóm. Nếu không, hôm sau học viên lại phải nhắc lần nữa."
        },
        {
          de: "Online-Teilnehmende bekommen das Kursbuch als PDF. Das gedruckte Handbuch wird verschickt, wenn es zum Angebot gehört – Versandstatus nennen.",
          vi: "Học viên online nhận sách giáo khoa dạng PDF. Sách Handbuch in thì gửi về nhà nếu thuộc ưu đãi – báo tình trạng gửi hàng."
        },
        {
          de: "Material der nächsten Stufe erst kurz vor Kursende schicken – zusammen mit der Info zum Folgekurs (siehe „Nächster Kurs & Treue“).",
          vi: "Tài liệu trình độ tiếp theo chỉ gửi khi gần hết khoá – kèm thông tin về khoá tiếp theo (xem „Khoá tiếp theo & giữ chân học viên“)."
        },
        {
          de: "Verpasste Stunde: Unterrichtsdatei schicken und auf die Trợ-giảng-Stunde hinweisen. Wer später in eine laufende Klasse einsteigt, bekommt 1-zu-1-Nachholstunden, bis er aufgeholt hat.",
          vi: "Nghỉ một buổi: gửi file bài giảng và nhắc buổi trợ giảng. Ai vào lớp đang học giữa chừng thì được xếp buổi 1-1 để học bù đến khi theo kịp lớp."
        }
      ]
    },
    {
      type: "conversation",
      customer: "Minh Thư",
      label_de: "Beispiel: das falsche Buch",
      label_vi: "Ví dụ: mở nhầm quyển",
      note_de: "Häufigster Fehler: Die Person hat A1.2 offen, wir sprechen von A1.1. Eine Frage nach dem Buch und ein Foto der ersten Seite klären das in zwei Minuten – ohne diese Frage dauert es oft eine Dreiviertelstunde.",
      note_vi: "Lỗi hay gặp nhất: học viên mở quyển A1.2, còn mình đang nói quyển A1.1. Hỏi đang mở quyển nào và xin ảnh trang đầu là rõ trong hai phút – không hỏi thì thường mất gần một tiếng.",
      messages: [
        {
          from: "customer",
          stamp_de: "14:05",
          stamp_vi: "14:05",
          text: "Em mở file rồi mà không thấy bài 9 đâu ạ 😥",
          translation_de: "„Ich habe die Datei offen, finde aber Übung 9 nicht 😥“"
        },
        {
          from: "me",
          text: "Dạ bạn đang mở quyển nào ạ? Bạn chụp giúp trung tâm trang đầu tiên của file nhé.",
          translation_de: "„Welches Buch hast du gerade offen? Schick mir bitte ein Foto der ersten Seite.“"
        },
        {
          from: "customer",
          text: "Đây ạ",
          translation_de: "„Hier.“"
        },
        {
          from: "me",
          text: "À, đây là quyển A1.2 rồi bạn ơi 😊 Hôm nay mình làm quyển A1.1 nha: bạn mở link này, từ trang 93 là sách bài tập, bài 9–12 ở trang 21 ạ.",
          translation_de: "„Ah, das ist A1.2 😊 Heute arbeiten wir mit A1.1: Öffne diesen Link, ab Seite 93 kommt das Arbeitsbuch, Übung 9–12 stehen auf Seite 21.“"
        },
        {
          from: "customer",
          stamp_de: "14:07",
          stamp_vi: "14:07",
          text: "Thấy rồi ạ, em cảm ơn!",
          translation_de: "„Gefunden, danke!“"
        }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Der Satz „Alle wichtigen Infos stehen in der Gruppe“ stimmt – hilft aber nur, wenn du gleich dazu schickst, was gesucht wird.",
      vi: "Câu „Các thông tin quan trọng đều có trong nhóm“ là đúng – nhưng chỉ có ích khi mình gửi kèm luôn thứ học viên đang tìm."
    }
  ]
};

export default page;
