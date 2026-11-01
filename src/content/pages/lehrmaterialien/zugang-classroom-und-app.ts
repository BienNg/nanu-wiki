import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "zugang-classroom-und-app",
  title_de: "Zugang zu Classroom und Hör-App",
  title_vi: "Vào Classroom và app luyện nghe",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Anmeldeprobleme sind die häufigste Nachricht von bestehenden Studierenden. Sie sind oft gestresst und haben wenig Zeit – hilf schnell und lass niemanden allein mit dem Problem.",
      vi: "Lỗi đăng nhập là tin nhắn hay gặp nhất từ học viên đang học. Học viên thường căng thẳng và ít thời gian – hãy hỗ trợ nhanh, đừng để ai một mình với lỗi."
    },
    { type: "heading", de: "Was Studierende wissen müssen", vi: "Học viên cần biết" },
    {
      type: "list",
      items: [
        { de: "Die App gibt es nicht im App Store. Sie läuft im Browser auf Handy oder Computer, ohne Installation.", vi: "App không có trên App Store. Học thẳng trên web bằng điện thoại hoặc máy tính, không cần cài đặt." },
        { de: "Anmelden mit der E-Mail, die die Person uns gegeben hat.", vi: "Đăng nhập bằng email học viên đã gửi trung tâm." },
        { de: "Classroom: Die Anmeldung muss nur einmal gemacht werden. Einen Klassencode erklärt die Lehrkraft in der ersten Stunde.", vi: "Classroom: chỉ cần làm 1 lần là vào được cho các lần sau. Mã lớp thì giáo viên hướng dẫn trong buổi học đầu." }
      ]
    },
    { type: "heading", de: "Wenn es nicht klappt", vi: "Khi không vào được" },
    {
      type: "steps",
      items: [
        { de: "Screenshot vom Fehler erbitten", vi: "Xin ảnh chụp màn hình lỗi", body_de: "Und fragen, welche E-Mail die Person benutzt.", body_vi: "Và hỏi học viên đang dùng email nào." },
        { de: "Link noch einmal schicken", vi: "Gửi lại link", body_de: "[ERGÄNZEN: aktuelle Adressen von App und Hör-App]", body_vi: "[ERGÄNZEN: địa chỉ hiện hành của app và app luyện nghe]" },
        { de: "Andere E-Mail vorschlagen", vi: "Gợi ý dùng email khác", body_de: "Wenn das Passwort immer als falsch gilt. Die neue E-Mail dann freischalten lassen.", body_vi: "Khi mật khẩu cứ báo sai. Rồi nhờ duyệt email mới." },
        { de: "Zalo-Videoanruf anbieten", vi: "Gọi video qua Zalo", body_de: "Gemeinsam durchklicken geht meist schneller als viele Nachrichten.", body_vi: "Cùng làm từng bước thường nhanh hơn nhắn nhiều tin." },
        { de: "Bis dahin: Hausaufgabe aus Datei oder Screenshot", vi: "Trong lúc chờ: làm bài từ file hoặc ảnh chụp", body_de: "Die Hausaufgaben stehen auch in der Zalo-Gruppe. Auf Papier machen ist völlig in Ordnung.", body_vi: "Bài tập về nhà cũng có trong nhóm Zalo. Làm ra giấy là hoàn toàn được." }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Beruhigen",
      label_vi: "Mẫu · Trấn an học viên",
      text: "Dạ bạn đừng lo nha, Classroom chỉ là phần làm thêm thôi ạ. Bài học hôm trước và hình ảnh bài tập về nhà đã có trong nhóm Zalo lớp rồi, bạn làm ra giấy trước nhé. Trung tâm gọi video qua Zalo để hướng dẫn bạn vào luôn được không ạ?",
      translation_de: "„Keine Sorge, Classroom ist nur zusätzlich. Die letzte Stunde und die Hausaufgabe sind schon in der Zalo-Gruppe – mach sie erst mal auf Papier. Sollen wir per Zalo-Video zusammen den Zugang einrichten?“"
    },
    {
      type: "callout",
      tone: "info",
      de: "[ERGÄNZEN: Wer ist für Zugangsprobleme zuständig – Sales, Student Support oder die Lehrkraft? Und wer schaltet neue E-Mails frei?]",
      vi: "[ERGÄNZEN: Ai phụ trách lỗi đăng nhập – Sales, Hỗ trợ học viên hay giáo viên? Ai duyệt email mới?]"
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Ein Student sucht die App im App Store und findet sie nicht. Was erklärst du?",
        question_vi: "Học viên tìm app trên App Store mà không thấy. Bạn giải thích gì?",
        section: "was-studierende-wissen-mussen",
        options: [
          { de: "Sie gibt es nur für Android", vi: "Chỉ có cho Android" },
          { de: "Er muss sie bei Google Play kaufen", vi: "Phải mua trên Google Play" },
          { de: "Die App läuft im Browser auf Handy oder Computer, ohne Installation", vi: "App chạy trên trình duyệt điện thoại hoặc máy tính, không cần cài" },
          { de: "Die App gibt es erst ab A2", vi: "App chỉ có từ A2" }
        ],
        correct: 2
      },
      {
        question_de: "Mit welcher E-Mail meldet man sich an?",
        question_vi: "Đăng nhập bằng email nào?",
        section: "was-studierende-wissen-mussen",
        options: [
          { de: "Mit irgendeiner Gmail-Adresse", vi: "Bất kỳ địa chỉ Gmail nào" },
          { de: "Mit der E-Mail der Lehrkraft", vi: "Email của giáo viên" },
          { de: "Mit der E-Mail, die die Person uns gegeben hat", vi: "Email mà học viên đã đưa cho trung tâm" },
          { de: "Ohne E-Mail, nur mit Telefonnummer", vi: "Không cần email, chỉ số điện thoại" }
        ],
        correct: 2
      },
      {
        question_de: "Was ist dein erster Schritt, wenn die Anmeldung nicht klappt?",
        question_vi: "Bước đầu tiên khi đăng nhập không được là gì?",
        section: "wenn-es-nicht-klappt",
        options: [
          { de: "Sagen, dass es morgen wieder geht", vi: "Nói ngày mai sẽ được" },
          { de: "Um einen Screenshot vom Fehler bitten und fragen, welche E-Mail benutzt wird", vi: "Xin ảnh chụp lỗi và hỏi đang dùng email nào" },
          { de: "Ein neues Konto für die Person anlegen", vi: "Tạo tài khoản mới cho học viên" },
          { de: "Die Person an Google verweisen", vi: "Bảo học viên hỏi Google" }
        ],
        correct: 1
      },
      {
        question_de: "Der Zugang klappt noch nicht, aber heute ist Hausaufgabe. Was sagst du?",
        question_vi: "Chưa vào được, nhưng hôm nay có bài tập. Bạn nói gì?",
        section: "wenn-es-nicht-klappt",
        options: [
          { de: "Dann fällt die Hausaufgabe aus", vi: "Vậy không cần làm bài" },
          { de: "Keine Sorge – die Hausaufgabe steht in der Zalo-Gruppe, auf Papier machen ist völlig in Ordnung", vi: "Đừng lo – bài tập có trong nhóm Zalo, làm ra giấy hoàn toàn được" },
          { de: "Ohne Classroom kann sie nicht am Kurs teilnehmen", vi: "Không có Classroom thì không học được" },
          { de: "Sie soll warten, bis die Lehrkraft sich meldet", vi: "Chờ giáo viên liên hệ" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
