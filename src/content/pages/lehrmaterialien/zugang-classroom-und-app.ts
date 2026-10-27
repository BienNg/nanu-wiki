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
  ]
};

export default page;
