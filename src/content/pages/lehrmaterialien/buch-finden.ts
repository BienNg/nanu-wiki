import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "buch-finden",
  title_de: "Wo finde ich was im Buch?",
  title_vi: "Tìm bài trong sách ở đâu?",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Viele Studierende finden die Hausaufgabe im PDF nicht. Mit diesen Punkten kannst du schnell helfen.",
      vi: "Nhiều học viên không tìm được bài tập trong file PDF. Những điểm này giúp bạn hỗ trợ nhanh."
    },
    {
      type: "list",
      items: [
        { de: "Jedes Niveau hat zwei Bücher: A1.1 und A1.2 [ERGÄNZEN: bei A2 und B1 auch?]. Häufigster Fehler: das falsche Buch geöffnet. Frag zuerst, welche Datei offen ist.", vi: "Mỗi trình độ có 2 quyển: A1.1 và A1.2 [ERGÄNZEN: A2 và B1 cũng vậy?]. Lỗi hay gặp nhất: mở nhầm quyển. Hỏi trước học viên đang mở file nào." },
        { de: "Ein Buch = vorne Kursbuch, hinten Arbeitsbuch. Bei A1.1 beginnt das Arbeitsbuch auf Seite 93.", vi: "Một quyển = nửa đầu sách giáo khoa, nửa sau sách bài tập. Với A1.1, sách bài tập bắt đầu từ trang 93." },
        { de: "Die Seitenzahl der Hausaufgabe bezieht sich auf das Arbeitsbuch, nicht auf die PDF-Seite.", vi: "Số trang của bài tập về nhà là số trang trong sách bài tập, không phải số trang của file PDF." },
        { de: "Unsicher? Um einen Screenshot der Seite bitten und die Seitenzahl darauf prüfen.", vi: "Chưa chắc? Xin ảnh chụp trang đó và kiểm tra số trang." }
      ]
    },
    {
      type: "callout",
      tone: "info",
      de: "[ERGÄNZEN: Ab welcher Seite beginnt das Arbeitsbuch in A1.2, A2 und B1?]",
      vi: "[ERGÄNZEN: Sách bài tập của A1.2, A2 và B1 bắt đầu từ trang nào?]"
    },
    { type: "heading", de: "Drucken oder kaufen?", vi: "In hay mua sách?" },
    {
      type: "paragraph",
      de: "Das Buch wird den ganzen Kurs über genutzt und man schreibt direkt hinein. Darum empfehlen wir, es einmal zu drucken oder zu kaufen. In Vietnam einfach drucken; in Deutschland bei Thalia oder Amazon bestellen.",
      vi: "Sách dùng xuyên suốt cả khóa và làm bài trực tiếp lên giấy. Vì vậy nên in hoặc mua 1 lần. Ở Việt Nam có thể in; ở Đức thì ra Thalia hoặc đặt Amazon."
    },
    {
      type: "template",
      label_de: "Vorlage · Hausaufgabe finden",
      label_vi: "Mẫu · Tìm bài tập",
      text: "Dạ bạn mở quyển [A1.1] giúp trung tâm nha, rồi kéo đến trang [93] là sang phần sách bài tập ạ. Bài tập hôm nay là bài [9–12] ở trang [21] của sách bài tập nhé.",
      translation_de: "„Öffne bitte das Buch [A1.1] und scroll bis Seite [93] – dort beginnt das Arbeitsbuch. Die Hausaufgabe heute sind die Übungen [9–12] auf Seite [21] im Arbeitsbuch.“"
    }
  ]
};

export default page;
