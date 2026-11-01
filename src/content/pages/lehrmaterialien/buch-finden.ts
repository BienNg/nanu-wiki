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
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Eine Studentin findet die Hausaufgabe im PDF nicht. Was fragst du zuerst?",
        question_vi: "Học viên không tìm thấy bài tập trong PDF. Bạn hỏi gì trước tiên?",
        options: [
          { de: "Ob sie die Stunde verpasst hat", vi: "Bạn ấy có nghỉ buổi học không" },
          { de: "Ob sie das Buch schon gekauft hat", vi: "Bạn ấy đã mua sách chưa" },
          { de: "Welche Lehrkraft sie hat", vi: "Giáo viên của bạn ấy là ai" },
          { de: "Welche Datei sie gerade offen hat – oft ist es das falsche Buch", vi: "Bạn ấy đang mở file nào – thường là mở nhầm sách" }
        ],
        correct: 3
      },
      {
        question_de: "Worauf bezieht sich die Seitenzahl der Hausaufgabe?",
        question_vi: "Số trang của bài tập về nhà là số trang nào?",
        options: [
          { de: "Auf die Seite im Arbeitsbuch, nicht auf die PDF-Seite", vi: "Trang trong sách bài tập, không phải trang của file PDF" },
          { de: "Auf die PDF-Seite", vi: "Trang của file PDF" },
          { de: "Auf die Seite im Kursbuch", vi: "Trang trong sách giáo khoa" },
          { de: "Auf die Folie aus dem Unterricht", vi: "Slide trong buổi học" }
        ],
        correct: 0
      },
      {
        question_de: "Wo beginnt bei A1.1 das Arbeitsbuch?",
        question_vi: "Ở A1.1, sách bài tập bắt đầu từ trang nào?",
        options: [
          { de: "Auf Seite 1", vi: "Trang 1" },
          { de: "Auf Seite 21", vi: "Trang 21" },
          { de: "Auf Seite 150", vi: "Trang 150" },
          { de: "Auf Seite 93", vi: "Trang 93" }
        ],
        correct: 3
      },
      {
        question_de: "Was empfehlen wir: das Buch drucken oder nur am Bildschirm nutzen?",
        question_vi: "Chúng ta khuyên gì: in sách hay chỉ dùng trên màn hình?",
        section: "drucken-oder-kaufen",
        options: [
          { de: "Einmal drucken oder kaufen – man nutzt es den ganzen Kurs und schreibt hinein", vi: "In hoặc mua một lần – dùng cả khóa và viết trực tiếp vào sách" },
          { de: "Nur am Bildschirm, Drucken ist verboten", vi: "Chỉ dùng trên màn hình, không được in" },
          { de: "Jede Lektion einzeln drucken und danach wegwerfen", vi: "In từng bài rồi bỏ đi" },
          { de: "Egal, das Buch braucht man im Kurs kaum", vi: "Sao cũng được, gần như không cần sách trong khóa học" }
        ],
        correct: 0
      }
    ]
  }
};

export default page;
