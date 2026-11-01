import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "lehrbuch-und-methode",
  title_de: "Lehrbuch und Unterrichtsmethode",
  title_vi: "Giáo trình và phương pháp giảng dạy",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    { type: "heading", de: "Welches Lehrbuch?", vi: "Giáo trình nào?" },
    {
      type: "paragraph",
      de: "Grundlage ist Schritte Plus, das in Deutschland weit verbreitete Lehrwerk. Darauf baut unser eigener Unterrichtsplan auf, den Chị Phương geschrieben hat; alle Lehrkräfte sind von ihr geschult.",
      vi: "Nền tảng là Schritte Plus, bộ giáo trình được dùng phổ biến tại Đức. Trên đó là lộ trình giảng dạy riêng do chị Phương biên soạn; tất cả giáo viên đều được chị Phương đào tạo."
    },
    {
      type: "callout",
      tone: "info",
      de: "[ERGÄNZEN: Stimmt die Formulierung „Schritte Plus als Basis, eigener Plan darauf“? In den Chats steht mal das eine, mal das andere.]",
      vi: "[ERGÄNZEN: Cách nói „Schritte Plus là nền, lộ trình riêng ở trên“ có đúng không? Trong chat lúc nói thế này, lúc nói thế kia.]"
    },
    {
      type: "template",
      label_de: "Vorlage · „Welches Lehrbuch nutzt ihr?“",
      label_vi: "Mẫu · „Bên mình học giáo trình nào?“",
      text: "Dạ giáo trình là Schritte Plus, đang được sử dụng phổ biến tại Đức ạ. Lộ trình từng buổi do chị Phương trực tiếp biên soạn và tất cả giáo viên đều được chị Phương đào tạo kỹ lưỡng nên bạn yên tâm nhé.",
      translation_de: "„Wir nutzen Schritte Plus, das in Deutschland weit verbreitet ist. Den Plan für jede Stunde hat Chị Phương selbst geschrieben, und alle Lehrkräfte sind von ihr geschult.“"
    },
    { type: "heading", de: "Nicht Seite für Seite", vi: "Không học theo từng trang sách" },
    {
      type: "paragraph",
      de: "Viele Schulen gehen das Buch Seite für Seite durch. Bei uns ist das Buch nur der Rahmen: Jede Stunde hat ein klares Ziel, und die Studierenden müssen dieses Ziel wirklich erreichen.",
      vi: "Nhiều nơi dạy bám từng trang sách. Ở NaNu NaNa, giáo trình chỉ là khung: mỗi buổi có một mục tiêu rõ ràng và học viên phải thật sự nắm được mục tiêu đó."
    },
    {
      type: "steps",
      items: [
        { de: "Stunde 1 – Grammatik", vi: "Buổi 1 – Ngữ pháp", body_de: "Nur die Kerngrammatik: verstehen und laut üben. Das Buch bleibt zu.", body_vi: "Chỉ ngữ pháp trọng tâm: hiểu bản chất và luyện nói thật chắc. Gạt sách sang một bên." },
        { de: "Stunde 2 – Hören", vi: "Buổi 2 – Nghe", body_de: "Mehrmals hören, Inhalt und Sprache analysieren, mit Lesen verbunden.", body_vi: "Nghe nhiều lần, phân tích nội dung và cách dùng ngôn ngữ, kết hợp đọc." },
        { de: "Stunde 3 – Sprechen", vi: "Buổi 3 – Nói", body_de: "Nur sprechen, ohne Buch.", body_vi: "Chỉ luyện nói, không dùng sách." }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Der Satz, der überzeugt: Deutsch lernen heißt nicht, ein Buch fertig zu machen, sondern jede Fertigkeit wirklich aufzubauen.",
      vi: "Câu nói thuyết phục: Học tiếng Đức không phải là hoàn thành từng trang sách, mà là thực sự hình thành từng kỹ năng."
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Welches Lehrbuch ist die Grundlage unserer Kurse?",
        question_vi: "Giáo trình nền tảng của các khóa học là gì?",
        section: "welches-lehrbuch",
        options: [
          { de: "Schritte Plus, mit einem eigenen Unterrichtsplan von Chị Phương darauf", vi: "Schritte Plus, cùng lộ trình riêng do chị Phương soạn" },
          { de: "Menschen", vi: "Menschen" },
          { de: "Nur unser eigenes Buch, kein Lehrwerk", vi: "Chỉ sách riêng, không dùng giáo trình nào" },
          { de: "Netzwerk neu", vi: "Netzwerk neu" }
        ],
        correct: 0
      },
      {
        question_de: "Wie arbeiten wir mit dem Buch im Unterricht?",
        question_vi: "Chúng ta dùng sách trong lớp như thế nào?",
        section: "nicht-seite-fur-seite",
        options: [
          { de: "Das Buch ist nur der Rahmen – jede Stunde hat ein klares Ziel, das erreicht werden muss", vi: "Sách chỉ là khung – mỗi buổi có mục tiêu rõ ràng và phải đạt được" },
          { de: "Wir gehen es Seite für Seite durch", vi: "Học lần lượt từng trang" },
          { de: "Wir benutzen es gar nicht", vi: "Hoàn toàn không dùng sách" },
          { de: "Die Studierenden lesen es allein, die Stunde ist nur für Fragen", vi: "Học viên tự đọc, buổi học chỉ để hỏi" }
        ],
        correct: 0
      },
      {
        question_de: "Was passiert in der Sprech-Stunde?",
        question_vi: "Trong buổi luyện nói diễn ra gì?",
        section: "nicht-seite-fur-seite",
        options: [
          { de: "Grammatikübungen im Buch schriftlich lösen", vi: "Làm bài tập ngữ pháp trong sách" },
          { de: "Nur sprechen, ohne Buch", vi: "Chỉ nói, không dùng sách" },
          { de: "Mehrmals hören und den Text analysieren", vi: "Nghe nhiều lần và phân tích bài" },
          { de: "Einen Test schreiben", vi: "Làm bài kiểm tra" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
