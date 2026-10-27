import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "bestandskunden-im-messenger",
  title_de: "Wenn Teilnehmende im Messenger schreiben",
  title_vi: "Khi học viên đang học nhắn qua Messenger",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Nicht jede Nachricht ist ein neuer Lead. Teilnehmende schreiben auf die Seite, wenn sie woanders keine Antwort bekommen. Für sie ist jede Minute Warten ein Zeichen, dass wir sie vergessen haben.",
      vi: "Không phải tin nhắn nào cũng là khách mới. Học viên nhắn lên trang khi họ không nhận được trả lời ở kênh khác. Với họ, mỗi phút chờ là dấu hiệu trung tâm đã quên họ."
    },
    { type: "heading", de: "Typische Anliegen", vi: "Các yêu cầu thường gặp" },
    {
      type: "list",
      items: [
        { de: "„Schickt mir bitte das Video und die Hausaufgabe von gestern.“", vi: "„Cho em xin video bài giảng và bài tập hôm qua.“" },
        { de: "„Auf WhatsApp/Zalo antwortet niemand.“", vi: "„Em nhắn WhatsApp/Zalo mà không ai trả lời.“" },
        { de: "„Das Buch ist noch nicht angekommen.“ / „Kann ich das A2-Material schon haben?“", vi: "„Chưa thấy gửi sách.“ / „Cho em xin tài liệu A2 trước được không?“" },
        { de: "„Ich komme nicht in die App / in Classroom.“ – siehe FAQ App.", vi: "„Em không vào được app / Classroom.“ – xem FAQ App." },
        { de: "Prüfungstag: Wann muss ich da sein, wie lange dauert es, was, wenn ich durchfalle?", vi: "Ngày thi: mấy giờ có mặt, thi bao lâu, nếu trượt thì sao?" },
        { de: "„Ich bin im Büro – wo seid ihr?“ (Termin vor Ort)", vi: "„Em tới văn phòng rồi – mọi người đâu ạ?“ (hẹn trực tiếp)" }
      ]
    },
    { type: "heading", de: "So gehst du vor", vi: "Cách xử lý" },
    {
      type: "steps",
      items: [
        { de: "Sofort bestätigen und entschuldigen", vi: "Xác nhận ngay và xin lỗi", body_de: "„Danke, dass du hier schreibst – sorry, dass du warten musstest.“ Auch wenn die Ursache in einem anderen Kanal liegt.", body_vi: "„Cảm ơn em đã nhắn ở đây – xin lỗi vì để em phải chờ.“ Kể cả khi lỗi nằm ở kênh khác." },
        { de: "Selbst lösen, wenn es geht", vi: "Tự giải quyết nếu được", body_de: "Unterlagen, Links oder Material direkt hier schicken – nicht auf einen anderen Kanal verweisen.", body_vi: "Gửi tài liệu, link hoặc file ngay tại đây – không bảo khách sang kênh khác." },
        { de: "Sonst weitergeben – mit Uhrzeit", vi: "Nếu không thì chuyển tiếp – kèm thời gian", body_de: "An Lehrkraft oder Student Support weitergeben und sagen, bis wann die Person eine Antwort bekommt.", body_vi: "Chuyển cho giáo viên hoặc Hỗ trợ học viên và nói rõ khi nào khách sẽ nhận được trả lời." },
        { de: "Nachhalten", vi: "Theo dõi đến cùng", body_de: "Prüfen, ob die Antwort angekommen ist, und den Fall schließen.", body_vi: "Kiểm tra khách đã nhận được câu trả lời chưa rồi mới đóng." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Vereinbarst du einen Termin im Büro, nenne Uhrzeit, Ansprechperson und Adresse – und sag dem Team vor Ort Bescheid. Eine Kundin stand im Oktober im Büro und schrieb nur noch „C ơi???“.",
      vi: "Khi hẹn khách tới văn phòng, nêu rõ giờ, người tiếp và địa chỉ – và báo cho đội ở văn phòng. Tháng 10 có khách đã tới văn phòng mà chỉ còn biết nhắn „C ơi???“."
    },
    {
      type: "callout",
      tone: "tip",
      de: "Nachricht übersehen oder am Wochenende liegen geblieben? Offen sagen und entschuldigen („Trung tâm bị trôi mất tin nhắn của chị ạ“). Ehrlichkeit wirkt besser als Ausreden.",
      vi: "Bỏ sót tin nhắn hoặc để qua cuối tuần? Nói thẳng và xin lỗi („Trung tâm bị trôi mất tin nhắn của chị ạ“). Thành thật hiệu quả hơn biện hộ."
    }
  ]
};

export default page;
