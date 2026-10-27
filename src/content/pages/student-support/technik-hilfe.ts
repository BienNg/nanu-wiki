import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "technik-hilfe",
  title_de: "Technik-Hilfe: NaNu Go, Classroom & Zoom",
  title_vi: "Hỗ trợ kỹ thuật: NaNu Go, Classroom & Zoom",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Technik ist die häufigste Frage in den ersten zwei Wochen. Wer sich nicht anmelden kann, verliert Zeit und Lust – und schreibt oft mehrmals, bevor es klappt. Für Fragen von Interessierten zur App siehe die FAQ App im Sales-Bereich.",
      vi: "Kỹ thuật là câu hỏi nhiều nhất trong hai tuần đầu. Không đăng nhập được thì học viên mất thời gian và mất hứng – và thường phải nhắn nhiều lần mới xong. Câu hỏi về app của khách chưa đăng ký: xem trang FAQ App ở mục Sales."
    },
    { type: "heading", de: "Grundregel", vi: "Nguyên tắc chung" },
    {
      type: "steps",
      items: [
        {
          de: "Screenshot erbitten",
          vi: "Xin ảnh chụp màn hình",
          body_de: "„Schick mir bitte einen Screenshot vom Bildschirm“ – so siehst du, welche App, welches Konto und welche Meldung.",
          body_vi: "„Chị chụp lại giúp em màn hình nhé“ – để biết học viên đang mở app nào, tài khoản nào, báo lỗi gì."
        },
        {
          de: "Nicht „bei uns ist kein Fehler“ antworten",
          vi: "Đừng trả lời „bên trung tâm không có lỗi“",
          body_de: "Auch wenn es stimmt: Die Person kommt trotzdem nicht rein. Hilf beim nächsten Schritt.",
          body_vi: "Dù đúng là vậy, học viên vẫn không vào được. Hãy giúp họ bước tiếp theo."
        },
        {
          de: "Nach zwei Versuchen: Videoanruf",
          vi: "Sau hai lần thử: gọi video",
          body_de: "Per Zalo- oder WhatsApp-Videoanruf gemeinsam durchklicken. Im Oktober hat das in zehn Minuten gelöst, was per Text tagelang hing.",
          body_vi: "Gọi video qua Zalo hoặc WhatsApp và làm cùng học viên. Tháng 10, cách này giải quyết trong mười phút điều mà nhắn tin mấy ngày không xong."
        },
        {
          de: "Übergangslösung geben",
          vi: "Đưa giải pháp tạm",
          body_de: "Bis es klappt: Hausaufgabe als Foto oder PDF schicken. Sie soll keine Stunde verpassen, nur weil das Login hängt.",
          body_vi: "Trong lúc chờ: gửi bài tập dạng ảnh hoặc PDF. Đừng để học viên lỡ bài chỉ vì chưa đăng nhập được."
        }
      ]
    },
    { type: "heading", de: "Die häufigsten Fälle", vi: "Các trường hợp hay gặp" },
    {
      type: "list",
      items: [
        {
          de: "Die App fragt nach einem Klassencode: Meist ist das die Google-Classroom-App, nicht NaNu Go. Klassencode oder Einladungslink direkt schicken, nicht auf die Lehrkraft in der ersten Stunde warten.",
          vi: "App hỏi mã lớp: thường đó là app Google Classroom, không phải NaNu Go. Gửi luôn mã lớp hoặc link mời, đừng đợi giáo viên hướng dẫn trong buổi đầu."
        },
        {
          de: "Das Passwort wird nicht angenommen: Anmelden geht nur mit der E-Mail, die wir freigeschaltet haben. Fragen, mit welcher Adresse sie es versucht. Will sie eine andere nutzen: Adresse notieren und freischalten lassen.",
          vi: "Báo sai mật khẩu: chỉ đăng nhập được bằng email trung tâm đã duyệt. Hỏi học viên đang dùng email nào. Muốn dùng email khác: ghi lại và nhờ duyệt email mới."
        },
        {
          de: "Classroom klappt nicht: Die Anmeldung ist nur einmal nötig – danach geht es immer. Bis dahin ist Classroom ein Extra; die Hausaufgabe aus der Klassengruppe reicht.",
          vi: "Không vào được Classroom: chỉ cần vào thành công một lần là các lần sau vào được luôn. Trong lúc đó Classroom chỉ là phần làm thêm; bài tập trong nhóm lớp là đủ."
        },
        {
          de: "Zoom-Link fehlt: Er steht in der Klassengruppe. Wer nicht in der Gruppe ist, bekommt ihn vor jeder Stunde persönlich.",
          vi: "Không có link Zoom: link nằm trong nhóm lớp. Ai không ở trong nhóm thì nhận link riêng trước mỗi buổi."
        },
        {
          de: "Frage nach etwas Einfacherem als Classroom: Ja, NaNu Go hat Videos, Wortschatz und Hörübungen zu jeder Lektion. Login dort zuerst lösen.",
          vi: "Học viên hỏi có gì dễ dùng hơn Classroom không: có, NaNu Go có video, từ vựng và bài nghe cho từng bài. Ưu tiên giúp học viên vào được NaNu Go trước."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Videoanruf anbieten",
      label_vi: "Mẫu · Đề nghị gọi video",
      text: "Dạ [chị/anh/bạn] ơi, để em gọi video qua Zalo hướng dẫn [chị/anh/bạn] vào luôn nhé, chỉ mất vài phút thôi ạ. Chỉ cần vào được một lần là các lần sau vào được luôn. Trong lúc đó em gửi [chị/anh/bạn] bài tập về nhà ở đây để [chị/anh/bạn] làm trước nha.",
      translation_de: "„Ich rufe dich kurz per Zalo-Video an und wir machen es gemeinsam – dauert nur ein paar Minuten. Einmal drin, klappt es danach immer. Bis dahin schicke ich dir die Hausaufgabe hier, damit du schon anfangen kannst.“"
    },
    {
      type: "callout",
      tone: "tip",
      de: "Ist dieselbe Fehlermeldung bei zwei Teilnehmenden aufgetaucht, ist es kein Einzelfall: intern an die Technik geben, damit es für alle gelöst wird.",
      vi: "Cùng một lỗi xuất hiện ở hai học viên thì không còn là trường hợp riêng: báo cho đội kỹ thuật để sửa cho tất cả."
    }
  ]
};

export default page;
