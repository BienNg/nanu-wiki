import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "faq-app",
  title_de: "FAQ: Die App NaNu Go",
  title_vi: "FAQ: App học NaNu Go",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Rund 40 Chats im Oktober kamen über die App-Anzeige – fast alle mit einer Standardfrage per Button. Diese Leute haben noch keine Frage zu einem Kurs, sondern zur App. Beantworte sie kurz und lenke dann auf den Kurs.",
      vi: "Khoảng 40 tin nhắn trong tháng 10 đến từ quảng cáo app – hầu hết là câu hỏi mẫu bấm từ nút. Những khách này chưa hỏi về khóa học, mà hỏi về app. Trả lời ngắn gọn rồi dẫn sang khóa học."
    },
    { type: "heading", de: "Die drei Button-Fragen", vi: "Ba câu hỏi từ nút bấm" },
    {
      type: "list",
      items: [
        { de: "„App này giá bao nhiêu?“ (Was kostet die App?) – 24 Chats", vi: "„App này giá bao nhiêu?“ – 24 cuộc trò chuyện" },
        { de: "„Tôi cần đăng ký lớp học để sử dụng app?“ (Muss ich einen Kurs buchen?) – 13 Chats", vi: "„Tôi cần đăng ký lớp học để sử dụng app?“ – 13 cuộc trò chuyện" },
        { de: "„App này có miễn phí không?“ (Ist die App kostenlos?) – 7 Chats", vi: "„App này có miễn phí không?“ – 7 cuộc trò chuyện" }
      ]
    },
    { type: "heading", de: "Die Antwort", vi: "Câu trả lời" },
    {
      type: "list",
      items: [
        { de: "Die App ist für unsere Kursteilnehmenden zu 100 % kostenlos. Einzeln verkaufen wir sie nicht – ihr Inhalt folgt genau dem Unterricht.", vi: "App miễn phí 100% cho học viên đang học tại trung tâm. App không bán riêng – nội dung bám sát bài học trên lớp." },
        { de: "Wer neu einen A1-Kurs bucht, bekommt die App als Erstes. Ihr Wert außerhalb: 49 Euro (ca. 1.300.000 VND).", vi: "Học viên mới đăng ký khóa A1 được dùng app đầu tiên. Giá trị nếu mua ngoài: 49 Euro (khoảng 1.300.000 VND)." },
        { de: "Was sie kann: Lernvideos wie im Unterricht, Wortschatz und Hörübungen zu jeder Lektion, Lernfortschritt, Rangliste und Duelle mit der Klasse.", vi: "App có: video bài giảng giống trên lớp, từ vựng và bài luyện nghe cho từng bài, theo dõi tiến độ, bảng xếp hạng và thách đấu với cả lớp." },
        { de: "Wer gleich nach der Zahlung einsteigt, kann schon vor Kursbeginn in der App lernen.", vi: "Đóng học phí xong là có thể vào app học trước khi lớp khai giảng." }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · App-Anfrage",
      label_vi: "Mẫu · Hỏi về app",
      text: "Chào bạn ạ! App NaNu Go là miễn phí 100% cho học viên đang theo học tại trung tâm, vì nội dung app bám sát bài trên lớp nên app không bán riêng ạ. Bạn đang ở Việt Nam hay ở Đức, và đã học tiếng Đức chưa ạ? Trung tâm gửi bạn lớp phù hợp để bạn dùng app luôn nha.",
      translation_de: "„Hallo! Die App NaNu Go ist für unsere Kursteilnehmenden 100 % kostenlos. Weil sie genau dem Unterricht folgt, verkaufen wir sie nicht einzeln. Bist du in Vietnam oder in Deutschland, und hast du schon Deutsch gelernt? Wir schicken dir den passenden Kurs, dann kannst du die App gleich nutzen.“"
    },
    {
      type: "callout",
      tone: "tip",
      de: "Viele klicken den Button mehrmals oder schreiben danach nichts mehr. Eine Antwort reicht – keine Wiederholungen. Kommt nach 24 Stunden nichts, einmal nachfassen.",
      vi: "Nhiều khách bấm nút nhiều lần hoặc sau đó không nhắn gì thêm. Trả lời một lần là đủ – không lặp lại. Sau 24 giờ không thấy trả lời thì nhắn lại một lần."
    },
    { type: "heading", de: "Probleme von Teilnehmenden mit der App", vi: "Học viên gặp sự cố với app" },
    {
      type: "list",
      items: [
        { de: "„Die App will einen Klassencode“ oder „Das Passwort stimmt nicht“: Nach Screenshot fragen, die richtige Anmelde-E-Mail prüfen und den Link der Hör-App erneut schicken.", vi: "„App yêu cầu mã lớp“ hoặc „Mật khẩu sai“: xin ảnh chụp màn hình, kiểm tra đúng email đăng nhập và gửi lại link app luyện nghe." },
        { de: "Google Classroom: Die Anmeldung muss nur einmal gemacht werden. Klappt es nicht, die Hausaufgabe vorerst als Datei oder Screenshot schicken – damit niemand eine Lektion verpasst.", vi: "Google Classroom: chỉ cần đăng nhập một lần. Nếu chưa vào được, tạm thời gửi bài tập dạng file hoặc ảnh chụp – để học viên không bị lỡ bài." },
        { de: "Technikprobleme intern weitergeben, damit sie für alle gelöst werden.", vi: "Báo lỗi kỹ thuật cho nội bộ để sửa cho tất cả học viên." }
      ]
    }
  ]
};

export default page;
