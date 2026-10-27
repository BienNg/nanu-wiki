import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "kanaele",
  title_de: "Ein Kanal pro Teilnehmende: Zalo, WhatsApp, Messenger",
  title_vi: "Mỗi học viên một kênh: Zalo, WhatsApp, Messenger",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Unsere Klassen laufen über Zalo-Gruppen. Aber nicht alle sind dort zu Hause – und wer keine Antwort bekommt, sucht sich den nächsten Kanal. Im Oktober kamen Teilnehmende auf Messenger, weil:",
      vi: "Các lớp của mình chạy qua nhóm Zalo. Nhưng không phải ai cũng dùng Zalo – và ai không được trả lời sẽ tìm sang kênh khác. Tháng 10, học viên nhắn qua Messenger vì:"
    },
    {
      type: "list",
      items: [
        { de: "sie Zalo kaum nutzen und lieber über Messenger schreiben – oft Teilnehmende, die in Deutschland leben,", vi: "họ ít dùng Zalo và thích nhắn qua Messenger hơn – thường là học viên đang sống ở Đức," },
        { de: "sie gar kein Zalo haben, nur WhatsApp,", vi: "họ không có Zalo, chỉ có WhatsApp," },
        { de: "ihre Nachricht auf Zalo unbeantwortet blieb,", vi: "tin nhắn trên Zalo không được trả lời," },
        { de: "die Lehrkraft eine Frage nach Video und Hausaufgabe nicht gelesen hatte.", vi: "giáo viên chưa đọc tin hỏi về video bài giảng và bài tập." }
      ]
    },
    { type: "heading", de: "Die Regeln", vi: "Nguyên tắc" },
    {
      type: "steps",
      items: [
        {
          de: "Bei der Anmeldung fragen und notieren",
          vi: "Hỏi khi đăng ký và ghi lại",
          body_de: "„Wo erreichen wir dich am besten?“ Den Kanal in die Teilnehmendenliste schreiben, damit alle im Team ihn kennen.",
          body_vi: "„Mình liên lạc với bạn qua đâu tiện nhất?“ Ghi kênh đó vào danh sách học viên để cả đội đều biết."
        },
        {
          de: "Wer nicht in der Zalo-Gruppe ist, bekommt die Gruppen-Infos persönlich",
          vi: "Ai không ở nhóm Zalo thì nhận thông tin nhóm riêng",
          body_de: "Zoom-Link, Hausaufgaben, Unterrichtsdatei, Terminänderungen – an den gewählten Kanal weiterleiten.",
          body_vi: "Link Zoom, bài tập, file bài giảng, thay đổi lịch – chuyển tiếp sang kênh học viên đã chọn."
        },
        {
          de: "Dort antworten, wo gefragt wurde",
          vi: "Hỏi ở đâu thì trả lời ở đó",
          body_de: "Kommt eine Frage auf Messenger, weil Zalo still war: hier lösen. Nicht „Bitte schreib auf Zalo“.",
          body_vi: "Câu hỏi đến qua Messenger vì Zalo không ai trả lời: giải quyết ngay tại đây. Không bảo „bạn nhắn qua Zalo nhé“."
        },
        {
          de: "Fragen an die Lehrkraft nicht hängen lassen",
          vi: "Không để câu hỏi gửi giáo viên bị treo",
          body_de: "Hat eine Lehrkraft nicht geantwortet, schicken wir die Datei selbst und sagen ihr Bescheid.",
          body_vi: "Giáo viên chưa trả lời thì mình tự gửi file cho học viên và báo lại giáo viên."
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Im Oktober begann fast jede zweite Antwort mit „Ngoài hành chính nên trung tâm phản hồi hơi chậm …“. Die Entschuldigung ist richtig – aber bei Teilnehmenden im laufenden Kurs gehört die Nachricht am selben Arbeitstag beantwortet, Wochenend-Nachrichten am Montag früh zuerst.",
      vi: "Tháng 10, gần như cứ hai câu trả lời thì có một câu mở đầu bằng „Ngoài hành chính nên trung tâm phản hồi hơi chậm …“. Xin lỗi là đúng – nhưng với học viên đang học, tin nhắn cần được trả lời trong cùng ngày làm việc, tin nhắn cuối tuần thì trả lời đầu tiên vào sáng thứ Hai."
    },
    { type: "heading", de: "Wenn Angehörige schreiben", vi: "Khi người nhà nhắn thay" },
    {
      type: "paragraph",
      de: "Eltern, Verwandte oder Geschwister fragen oft für die Teilnehmenden – nach Prüfungsterminen oder nach dem Buch. Allgemeine Infos – Termin, Dauer, Ablauf – gerne beantworten. Wichtige Hinweise zusätzlich direkt an die Person selbst schicken: Oft weiß die Familie nichts von dem, was wir der Person längst geschickt haben – und umgekehrt.",
      vi: "Bố mẹ, người thân hay anh chị em thường hỏi thay học viên – về lịch thi hay về sách. Thông tin chung – lịch, thời lượng, cách thức – cứ trả lời. Thông tin quan trọng thì gửi thêm trực tiếp cho học viên: nhiều khi gia đình không biết những gì trung tâm đã gửi cho học viên từ trước – và ngược lại."
    }
  ]
};

export default page;
