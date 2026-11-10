import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "faq-app",
  title_de: "FAQ: Die App NaNu Go",
  title_vi: "FAQ: App học NaNu Go",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-04",
  body: [
    {
      type: "paragraph",
      de: "Viele schreiben zuerst wegen der App, noch nicht wegen eines Kurses. Beantworte die Frage kurz und lenke dann auf den Kurs.",
      vi: "Nhiều khách nhắn trước về app, chưa hỏi về khoá học. Trả lời ngắn rồi dẫn sang khoá học."
    },
    { type: "heading", de: "Die Antwort", vi: "Câu trả lời" },
    {
      type: "list",
      items: [
        { de: "Die App ist für unsere Schüler zu 100 % kostenlos. Einzeln verkaufen wir sie nicht – ihr Inhalt folgt genau dem Unterricht.", vi: "App miễn phí 100% cho học viên đang học tại trung tâm. App không bán riêng – nội dung bám sát bài học trên lớp." },
        { de: "Wer neu einen A1-Kurs bucht, bekommt die App als Erstes. Ihr Wert außerhalb: 49 Euro (ca. 1.300.000 VND).", vi: "Học viên mới đăng ký khóa A1 được dùng app đầu tiên. Giá trị nếu mua ngoài: 49 Euro (khoảng 1.300.000 VND)." },
        { de: "Was sie kann: vorab aufgenommene Lektionen, Wortschatz und Hörübungen, Lernfortschritt, Rangliste und Duelle mit der Klasse.", vi: "App có: bài giảng quay sẵn, từ vựng và bài luyện nghe, theo dõi tiến độ, bảng xếp hạng và thách đấu với cả lớp." },
        { de: "Die App ist noch im Aufbau: Stand 27.10.2026 gibt es nur die ersten 8 Lektionen von A1.1. Wer A2 oder höher lernt, findet dort noch nichts zu seiner Stufe.", vi: "App vẫn đang hoàn thiện: tính đến 27/10/2026 mới có 8 bài đầu của A1.1. Học viên A2 trở lên hiện chưa có nội dung cho trình độ của mình." },
        { de: "Wer gleich nach der Zahlung einsteigt, kann schon vor Kursbeginn in der App lernen.", vi: "Đóng học phí xong là có thể vào app học trước khi lớp khai giảng." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Nicht „Videos zu jeder Lektion“ versprechen und die App nicht als Ersatz für verpasste Stunden anbieten. Aufzeichnungen der Stunden gibt es nicht.",
      vi: "Không hứa „có video cho từng bài“ và không giới thiệu app như cách bù buổi nghỉ. Trung tâm không quay lại buổi học."
    },
    {
      type: "template",
      label_de: "Vorlage · App-Anfrage",
      label_vi: "Mẫu · Hỏi về app",
      text: "Chào bạn ạ! App NaNu Go là miễn phí 100% cho học viên đang theo học tại trung tâm, vì nội dung app bám sát bài trên lớp nên app không bán riêng ạ. Bạn đang ở Việt Nam hay ở Đức, và đã học tiếng Đức chưa ạ? Trung tâm gửi bạn lớp phù hợp để bạn dùng app luôn nha.",
      translation_de: "„Hallo! Die App NaNu Go ist für unsere Schüler 100 % kostenlos. Weil sie genau dem Unterricht folgt, verkaufen wir sie nicht einzeln. Bist du in Vietnam oder in Deutschland, und hast du schon Deutsch gelernt? Wir schicken dir den passenden Kurs, dann kannst du die App gleich nutzen.“"
    },
    {
      type: "callout",
      tone: "tip",
      de: "Fragt jemand mehrmals dasselbe oder schreibt danach nichts mehr: Eine Antwort reicht. Kommt nach 24 Stunden nichts, einmal nachfassen.",
      vi: "Khách hỏi đi hỏi lại cùng một câu hoặc sau đó không nhắn gì thêm: trả lời một lần là đủ. Sau 24 giờ không thấy trả lời thì nhắn lại một lần."
    },
    { type: "heading", de: "Probleme von Schülern mit der App", vi: "Học viên gặp sự cố với app" },
    {
      type: "list",
      items: [
        { de: "„Die App will einen Klassencode“: Das ist Google Classroom, nicht NaNu Go. Schick den Klassencode oder den Einladungslink direkt.", vi: "„App yêu cầu mã lớp“: đó là Google Classroom, không phải NaNu Go. Gửi ngay mã lớp hoặc link mời." },
        { de: "„Das Passwort stimmt nicht“: Das ist NaNu Go. Frag nach einem Screenshot, prüfe die richtige Anmelde-E-Mail und schick den Link [nanugo.app](https://nanugo.app) noch einmal.", vi: "„Mật khẩu sai“: đó là NaNu Go. Xin ảnh chụp màn hình, kiểm tra đúng email đăng nhập và gửi lại link [nanugo.app](https://nanugo.app)." },
        { de: "Google Classroom: Die Anmeldung muss nur einmal gemacht werden. Klappt es nicht, die Hausaufgabe vorerst als Datei oder Screenshot schicken – damit niemand eine Lektion verpasst.", vi: "Google Classroom: chỉ cần đăng nhập một lần. Nếu chưa vào được, tạm thời gửi bài tập dạng file hoặc ảnh chụp – để học viên không bị lỡ bài." },
        { de: "Technikprobleme intern weitergeben, damit sie für alle gelöst werden.", vi: "Báo lỗi kỹ thuật cho nội bộ để sửa cho tất cả học viên." }
      ]
    }
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "„App này giá bao nhiêu?“ Was antwortest du?",
        question_vi: "„App này giá bao nhiêu?“ Bạn trả lời gì?",
        section: "die-antwort",
        options: [
          { de: "49 Euro", vi: "49 Euro" },
          { de: "1.300.000 VND im Monat", vi: "1.300.000 VND mỗi tháng" },
          { de: "Für unsere Schüler 100 % kostenlos – einzeln verkaufen wir sie nicht", vi: "Miễn phí 100 % cho học viên – không bán riêng" },
          { de: "Kostenlos für alle, auch ohne Kurs", vi: "Miễn phí cho mọi người, kể cả không học" }
        ],
        correct: 2
      },
      {
        question_de: "Was gibt es Stand 27.10.2026 in der App?",
        question_vi: "Đến ngày 27.10.2026 app có gì?",
        section: "die-antwort",
        options: [
          { de: "Alle Lektionen von A1 bis B2", vi: "Tất cả bài từ A1 đến B2" },
          { de: "Aufzeichnungen aller Live-Stunden", vi: "Video tất cả buổi học trực tiếp" },
          { de: "Nur Spiele", vi: "Chỉ trò chơi" },
          { de: "Nur die ersten 8 Lektionen von A1.1 – für A2 oder höher noch nichts", vi: "Chỉ 8 bài đầu của A1.1 – A2 trở lên chưa có" }
        ],
        correct: 3
      },
      {
        question_de: "Was darfst du über die App NICHT versprechen?",
        question_vi: "Điều gì về app bạn KHÔNG được hứa?",
        section: "die-antwort",
        options: [
          { de: "Dass sie für Schüler kostenlos ist", vi: "Miễn phí cho học viên" },
          { de: "Dass es Wortschatz und Hörübungen gibt", vi: "Có từ vựng và bài nghe" },
          { de: "Dass es eine Rangliste gibt", vi: "Có bảng xếp hạng" },
          { de: "Videos zu jeder Lektion oder die App als Ersatz für verpasste Stunden", vi: "Có video cho mọi bài hoặc dùng app thay buổi học đã nghỉ" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand fragt dreimal nach der App und schreibt dann nichts mehr. Was machst du?",
        question_vi: "Khách hỏi về app ba lần rồi không nhắn gì nữa. Bạn làm gì?",
        section: "die-antwort",
        options: [
          { de: "Auf jede Frage einzeln antworten", vi: "Trả lời từng câu một" },
          { de: "Gar nicht antworten", vi: "Không trả lời" },
          { de: "Einmal antworten – nach 24 Stunden einmal nachfassen", vi: "Trả lời một lần – sau 24 giờ nhắn lại một lần" },
          { de: "Jeden Tag nachfassen", vi: "Nhắn lại mỗi ngày" }
        ],
        correct: 2
      },
      {
        question_de: "Ein Schüler sagt: „Das Passwort stimmt nicht.“ Was machst du?",
        question_vi: "Học viên nói: „Mật khẩu không đúng.“ Bạn làm gì?",
        section: "probleme-von-schulern-mit-der-app",
        options: [
          { de: "Nach Screenshot fragen, die richtige Anmelde-E-Mail prüfen und nanugo.app erneut schicken – das ist NaNu Go, nicht Classroom", vi: "Xin ảnh chụp màn hình, kiểm tra email đăng nhập và gửi lại nanugo.app – đây là NaNu Go, không phải Classroom" },
          { de: "Sagen, er soll ein neues Konto anlegen", vi: "Bảo tạo tài khoản mới" },
          { de: "Ihn an Google verweisen", vi: "Bảo hỏi Google" },
          { de: "Ihm einen anderen Kurs anbieten", vi: "Giới thiệu khóa khác" }
        ],
        correct: 0
      }
    ]
  }
};

export default page;
