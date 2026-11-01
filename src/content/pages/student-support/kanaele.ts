import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "kanaele",
  title_de: "Ein Kanal pro Schüler: Zalo, WhatsApp, Messenger",
  title_vi: "Mỗi học viên một kênh: Zalo, WhatsApp, Messenger",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-01",
  body: [
    {
      type: "paragraph",
      de: "Jede Klasse hat eine Gruppe in Zalo. Aber nicht alle Schüler nutzen Zalo. Und wer auf Zalo keine Antwort bekommt, schreibt uns oft noch einmal woanders, zum Beispiel auf Messenger. Im Oktober haben uns Schüler aus diesen Gründen auf Messenger geschrieben:",
      vi: "Mỗi lớp có một nhóm Zalo. Nhưng không phải học viên nào cũng dùng Zalo. Và ai nhắn trên Zalo mà không được trả lời thì thường nhắn lại qua kênh khác, ví dụ Messenger. Tháng 10, học viên nhắn cho mình qua Messenger vì những lý do sau:"
    },
    {
      type: "list",
      items: [
        { de: "Sie nutzen Zalo kaum und schreiben lieber auf Messenger. Das sind oft Schüler, die in Deutschland leben.", vi: "Họ ít dùng Zalo và thích nhắn qua Messenger hơn. Thường là học viên đang sống ở Đức." },
        { de: "Sie haben gar kein Zalo, nur WhatsApp.", vi: "Họ không có Zalo, chỉ có WhatsApp." },
        { de: "Sie haben auf Zalo geschrieben und keine Antwort bekommen.", vi: "Họ đã nhắn trên Zalo nhưng không được trả lời." },
        { de: "Sie haben die Lehrkraft nach dem Video oder der Hausaufgabe gefragt, aber die Lehrkraft hat die Nachricht nicht gelesen.", vi: "Họ hỏi giáo viên về video bài giảng hoặc bài tập, nhưng giáo viên chưa đọc tin nhắn." }
      ]
    },
    { type: "heading", de: "Die Regeln", vi: "Nguyên tắc" },
    {
      type: "steps",
      items: [
        {
          de: "Bei der Anmeldung fragen, wo die Person erreichbar ist",
          vi: "Khi đăng ký, hỏi học viên liên lạc qua đâu",
          body_de: "Frag: „Wo erreichen wir dich am besten?“ Schreib den Kanal in die Schülerliste. So weiß das ganze Team, wo es die Person erreicht.",
          body_vi: "Hỏi: „Mình liên lạc với bạn qua đâu tiện nhất?“ Ghi kênh đó vào danh sách học viên. Như vậy cả đội đều biết liên lạc với học viên ở đâu."
        },
        {
          de: "Wer nicht in der Zalo-Gruppe ist, bekommt alles einzeln",
          vi: "Ai không ở trong nhóm Zalo thì nhận thông tin riêng",
          body_de: "Alles, was in die Gruppe kommt, schickst du dieser Person auch direkt in ihrem Kanal: Zoom-Link, Hausaufgaben, Unterrichtsdatei und Terminänderungen.",
          body_vi: "Mọi thứ gửi vào nhóm thì gửi riêng cho học viên đó qua kênh của họ: link Zoom, bài tập, file bài giảng và thay đổi lịch."
        },
        {
          de: "Dort antworten, wo die Person geschrieben hat",
          vi: "Học viên nhắn ở đâu thì trả lời ở đó",
          body_de: "Schreibt jemand auf Messenger, weil auf Zalo niemand geantwortet hat, löst du das Problem direkt auf Messenger. Schreib nicht „Bitte schreib uns auf Zalo“.",
          body_vi: "Học viên nhắn qua Messenger vì trên Zalo không ai trả lời: giải quyết ngay trên Messenger. Không bảo „bạn nhắn qua Zalo nhé“."
        },
        {
          de: "Wenn die Lehrkraft nicht antwortet, hilfst du selbst",
          vi: "Giáo viên chưa trả lời thì mình tự hỗ trợ",
          body_de: "Hat die Lehrkraft eine Frage nicht beantwortet, schickst du der Person die Datei selbst und sagst der Lehrkraft Bescheid.",
          body_vi: "Giáo viên chưa trả lời thì mình tự gửi file cho học viên và báo lại giáo viên."
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Im Oktober begann fast jede zweite Antwort mit „Ngoài hành chính nên trung tâm phản hồi hơi chậm …“ („Wir antworten etwas spät, weil gerade keine Arbeitszeit ist …“). Sich zu entschuldigen ist gut. Aber wer gerade einen Kurs macht, bekommt die Antwort am selben Arbeitstag. Nachrichten vom Wochenende beantwortest du am Montagmorgen als Erstes.",
      vi: "Tháng 10, gần như cứ hai câu trả lời thì có một câu mở đầu bằng „Ngoài hành chính nên trung tâm phản hồi hơi chậm …“. Xin lỗi là tốt. Nhưng học viên đang học phải được trả lời trong cùng ngày làm việc. Tin nhắn cuối tuần thì trả lời đầu tiên vào sáng thứ Hai."
    },
    { type: "heading", de: "Wenn die Familie für die Person schreibt", vi: "Khi người nhà nhắn thay" },
    {
      type: "paragraph",
      de: "Oft schreiben Eltern, Verwandte oder Geschwister für die Schüler, zum Beispiel wegen eines Prüfungstermins oder des Buchs. Allgemeine Fragen beantwortest du gern: Termin, Dauer, Ablauf. Wichtige Infos schickst du zusätzlich direkt an die Person selbst. Denn oft weiß die Familie nicht, was wir der Person schon geschickt haben – und umgekehrt.",
      vi: "Bố mẹ, người thân hay anh chị em thường hỏi thay học viên – về lịch thi hay về sách. Thông tin chung – lịch, thời lượng, cách thức – cứ trả lời. Thông tin quan trọng thì gửi thêm trực tiếp cho học viên: nhiều khi gia đình không biết những gì trung tâm đã gửi cho học viên từ trước – và ngược lại."
    }
  ]
};

export default page;
