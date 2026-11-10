import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "tools",
  title_de: "Tools, die wir nutzen",
  title_vi: "Công cụ chúng ta dùng",
  kind: "process",
  section: "general",
  verified_until: null,
  updated_at: "2026-11-04",
  body: [
    {
      type: "paragraph",
      de: "Wir nutzen diese Tools. Jedes hat eine eigene Aufgabe.",
      vi: "Chúng ta dùng các công cụ này. Mỗi công cụ có một việc riêng."
    },
    { type: "heading", de: "Slack", vi: "Slack", anchor: "slack" },
    {
      type: "paragraph",
      de: "Slack ist für Gespräche im Team. Kunden und Schüler schreiben dort nicht.",
      vi: "Slack dùng để trao đổi trong team. Khách và học viên không nhắn ở đó."
    },
    {
      type: "paragraph",
      de: "Jede Klasse und jedes Thema hat einen eigenen Kanal. Dort besprichst du die Aufgaben und Probleme von genau dieser Klasse oder genau diesem Thema.",
      vi: "Mỗi lớp và mỗi chủ đề có một kênh riêng. Bạn trao đổi việc cần làm và vấn đề của đúng lớp hoặc đúng chủ đề đó trong kênh đó."
    },
    {
      type: "paragraph",
      de: "So heißen die Kanäle:",
      vi: "Kênh được đặt tên như sau:"
    },
    {
      type: "list",
      items: [
        { de: "Klassenkanäle wie die Klasse, zum Beispiel #g88, #g121 und #g135,", vi: "kênh lớp theo tên lớp, ví dụ #g88, #g121 và #g135," },
        { de: "und Themenkanäle nach dem Thema, zum Beispiel #customer-support, #student-support, #classroom, #einkommen, #ausgabe und #import.", vi: "và kênh chủ đề theo tên chủ đề, ví dụ #customer-support, #student-support, #classroom, #einkommen, #ausgabe và #import." }
      ]
    },
    { type: "heading", de: "Zalo", vi: "Zalo", anchor: "zalo" },
    {
      type: "paragraph",
      de: "Zalo hat zwei Aufgaben.",
      vi: "Zalo có hai việc."
    },
    {
      type: "paragraph",
      de: "Im Team gibt es eigene Gruppen, zum Beispiel für Customer Support und für Sales. Dort erledigst du Aufgaben, die sofort erledigt werden müssen.",
      vi: "Trong team có nhóm riêng, ví dụ cho Chăm sóc học viên và cho Sales. Ở đó bạn xử lý việc phải làm ngay."
    },
    {
      type: "paragraph",
      de: "Mit Menschen außerhalb des Teams sprichst du über Zalo:",
      vi: "Với người bên ngoài team, bạn nói chuyện qua Zalo:"
    },
    {
      type: "list",
      items: [
        { de: "mit Kunden,", vi: "với khách," },
        { de: "mit Schülern,", vi: "với học viên," },
        { de: "und in der Gruppe jeder Klasse.", vi: "và trong nhóm của từng lớp." }
      ]
    },
    { type: "heading", de: "Facebook Messenger", vi: "Facebook Messenger", anchor: "messenger" },
    {
      type: "paragraph",
      de: "Facebook Messenger ist vor allem für Menschen, die einen Kurs buchen wollen und noch keine Schüler sind.",
      vi: "Facebook Messenger chủ yếu dành cho người muốn đăng ký khóa học và chưa phải học viên."
    },
    {
      type: "paragraph",
      de: "Nach der Anmeldung sprichst du weiter über Zalo oder WhatsApp. Meistens über Zalo.",
      vi: "Sau khi đăng ký, bạn tiếp tục nói chuyện qua Zalo hoặc WhatsApp. Thường là qua Zalo."
    },
    { type: "heading", de: "Google Workspace", vi: "Google Workspace", anchor: "google-workspace" },
    {
      type: "paragraph",
      de: "In Google Workspace liegen alle unsere Dateien. Dort liegen auch die Klassenlisten für die Lehrkräfte, die Class Sheets.",
      vi: "Mọi file của chúng ta nằm trong Google Workspace. Danh sách lớp cho giáo viên, tức Class Sheets, cũng nằm ở đó."
    },
    {
      type: "paragraph",
      de: "Wie du die wichtigsten Ordner auch ohne Internet auf dem PC hast, steht auf „[Google Drive auf dem PC](fuer-alle/google-drive-offline)“.",
      vi: "Cách để các thư mục quan trọng vẫn có trên máy khi không có mạng nằm ở trang „[Google Drive trên máy tính](fuer-alle/google-drive-offline)“."
    },
    { type: "heading", de: "Canva", vi: "Canva", anchor: "canva" },
    {
      type: "paragraph",
      de: "In Canva erstellst du Dokumente und Designs:",
      vi: "Trong Canva bạn tạo tài liệu và thiết kế:"
    },
    {
      type: "list",
      items: [
        { de: "Grafiken und Beiträge für Social Media,", vi: "hình và bài cho mạng xã hội," },
        { de: "und Dokumente für Schüler, zum Beispiel Anleitungen.", vi: "và tài liệu cho học viên, ví dụ hướng dẫn." }
      ]
    },
    { type: "heading", de: "Notion", vi: "Notion", anchor: "notion" },
    {
      type: "paragraph",
      de: "In Notion pflegt Sales die Klassen und die Kundendaten. Die Klassen auf der Website kommen direkt aus Notion. Steht dort etwas falsch, sieht das jeder Kunde.",
      vi: "Sales cập nhật các lớp và dữ liệu khách trên Notion. Lịch lớp trên website lấy thẳng từ Notion. Notion ghi sai thì khách nào cũng thấy."
    }
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "Über welchen Kanal schreiben Menschen, die einen Kurs buchen wollen, aber noch keine Schüler sind?",
        question_vi: "Người muốn đăng ký khóa học nhưng chưa phải học viên nhắn qua kênh nào?",
        section: "messenger",
        options: [
          { de: "Zalo", vi: "Zalo" },
          { de: "Slack", vi: "Slack" },
          { de: "Facebook Messenger", vi: "Facebook Messenger" },
          { de: "E-Mail", vi: "Email" }
        ],
        correct: 2
      },
      {
        question_de: "Eine Person hat sich angemeldet. Über welchen Kanal sprichst du danach meistens mit ihr?",
        question_vi: "Một người đã đăng ký. Sau đó bạn thường nói chuyện với người đó qua kênh nào?",
        section: "zalo",
        options: [
          { de: "Slack", vi: "Slack" },
          { de: "Notion", vi: "Notion" },
          { de: "Canva", vi: "Canva" },
          { de: "Zalo", vi: "Zalo" }
        ],
        correct: 3
      },
      {
        question_de: "Wo besprichst du intern die Aufgaben und Probleme einer Klasse?",
        question_vi: "Bạn trao đổi nội bộ việc cần làm và vấn đề của một lớp ở đâu?",
        section: "slack",
        options: [
          { de: "In der Zalo-Gruppe der Klasse", vi: "Trong nhóm Zalo của lớp" },
          { de: "Im Slack-Kanal dieser Klasse", vi: "Trong kênh Slack của lớp đó" },
          { de: "In Google Workspace", vi: "Trong Google Workspace" },
          { de: "Im Messenger", vi: "Trên Messenger" }
        ],
        correct: 1
      },
      {
        question_de: "Wo liegen alle Dateien und die Klassenlisten für die Lehrkräfte?",
        question_vi: "Mọi file và danh sách lớp cho giáo viên nằm ở đâu?",
        section: "google-workspace",
        options: [
          { de: "In Canva", vi: "Trong Canva" },
          { de: "In Slack", vi: "Trong Slack" },
          { de: "In Notion", vi: "Trong Notion" },
          { de: "In Google Workspace", vi: "Trong Google Workspace" }
        ],
        correct: 3
      }
    ]
  }
};

export default page;
