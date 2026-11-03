import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "kommentare-beantworten",
  title_de: "Kommentare auf TikTok, YouTube & Facebook beantworten",
  title_vi: "Trả lời bình luận trên TikTok, YouTube & Facebook",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-03",
  body: [
    {
      type: "paragraph",
      de: "Unter unseren Videos auf TikTok, YouTube und Facebook kommen jeden Tag viele Kommentare. Wir wollen zeigen: Bei NaNu NaNa bekommt JEDER Kommentar eine Antwort. Das sieht nicht nur die Person, die gefragt hat, sondern alle, die das Video später anschauen.",
      vi: "Mỗi ngày có rất nhiều bình luận dưới video của trung tâm trên TikTok, YouTube và Facebook. Chúng ta muốn cho mọi người thấy: ở NaNu NaNa, MỌI bình luận đều được trả lời. Không chỉ người hỏi thấy, mà tất cả những ai xem video sau này cũng thấy."
    },
    { type: "heading", de: "Grundregel", vi: "Nguyên tắc chung", anchor: "grundregel" },
    {
      type: "list",
      items: [
        {
          de: "Jeder Kommentar bekommt eine Antwort – auch kurze, lustige oder einfache.",
          vi: "Bình luận nào cũng được trả lời – kể cả bình luận ngắn, vui hay đơn giản."
        },
        {
          de: "Kurz und persönlich antworten, so wie du selbst schreiben würdest.",
          vi: "Trả lời ngắn gọn và tự nhiên, như chính bạn đang nhắn."
        },
        {
          de: "Wenn du unsicher bist, frag in der Zalo-Gruppe „Bình luận/ nhận xét“ nach, bevor du antwortest.",
          vi: "Không chắc thì hỏi lại trong nhóm Zalo „Bình luận/ nhận xét“ trước khi trả lời."
        }
      ]
    },
    { type: "heading", de: "Fragen zu Deutsch", vi: "Câu hỏi về tiếng Đức", anchor: "fragen-zu-deutsch" },
    {
      type: "paragraph",
      de: "Viele fragen, wie man etwas auf Deutsch sagt. Zum Beispiel: „Từ anh yêu em tiếng Đức như nào cô giáo ơi“ („Wie sagt man ‚Ich liebe dich‘ auf Deutsch, Lehrerin?“).",
      vi: "Nhiều người hỏi một câu tiếng Đức nói thế nào. Ví dụ: „Từ anh yêu em tiếng Đức như nào cô giáo ơi“."
    },
    {
      type: "steps",
      items: [
        {
          de: "Mit ChatGPT übersetzen",
          vi: "Dịch bằng ChatGPT",
          body_de: "Lass dir das Wort oder den Satz von ChatGPT übersetzen.",
          body_vi: "Nhờ ChatGPT dịch từ hoặc câu đó."
        },
        {
          de: "Nur die Übersetzung nehmen",
          vi: "Chỉ lấy phần dịch",
          body_de: "Kopier nicht die ganze Antwort von ChatGPT. Nimm nur das deutsche Wort oder den Satz.",
          body_vi: "Không copy nguyên câu trả lời của ChatGPT. Chỉ lấy từ hoặc câu tiếng Đức."
        },
        {
          de: "Selbst einen kurzen, persönlichen Text schreiben",
          vi: "Tự viết một câu ngắn, tự nhiên",
          body_de: "Schreib die Antwort mit deinen eigenen Worten: kurz, freundlich, gern mit einem Emoji.",
          body_vi: "Viết câu trả lời bằng lời của bạn: ngắn, thân thiện, thêm emoji cũng được."
        },
        {
          de: "Unsicher? Nachfragen",
          vi: "Không chắc? Hỏi lại",
          body_de: "Wenn du nicht sicher bist, ob die Übersetzung stimmt, frag in der Zalo-Gruppe „Bình luận/ nhận xét“ nach.",
          body_vi: "Nếu không chắc bản dịch có đúng không, hỏi lại trong nhóm Zalo „Bình luận/ nhận xét“."
        }
      ]
    },
    {
      type: "template",
      label_de: "Beispiel · Antwort auf eine Deutsch-Frage",
      label_vi: "Ví dụ · Trả lời câu hỏi về tiếng Đức",
      text: "„Anh yêu em“ tiếng Đức là „Ich liebe dich“ nha [anh/chị/bạn] 😊",
      translation_de: "„‚Anh yêu em‘ heißt auf Deutsch ‚Ich liebe dich‘ 😊“"
    },
    {
      type: "callout",
      tone: "warning",
      de: "Nie die Nachricht von ChatGPT einfach kopieren. Sie ist zu lang, klingt nach Maschine und passt nicht zu uns. Die Leute sollen merken, dass ein Mensch antwortet.",
      vi: "Đừng bao giờ copy nguyên tin nhắn của ChatGPT. Tin đó quá dài, nghe như máy và không giống phong cách của trung tâm. Người xem cần thấy là có người thật đang trả lời."
    },
    { type: "heading", de: "Fragen zu unseren Kursen", vi: "Câu hỏi về khoá học", anchor: "fragen-zu-kursen" },
    {
      type: "paragraph",
      de: "Manche fragen nach einem bestimmten Kurs, zum Beispiel: „Unterrichten Sie auch online?“ Diese Person ist vielleicht ein neuer Kunde – deshalb machst du zwei Dinge, und zwar sofort:",
      vi: "Có người hỏi về một khoá học cụ thể, ví dụ: „Trung tâm có dạy online không?“ Người này có thể là khách hàng mới – vì vậy bạn làm hai việc, và làm ngay:"
    },
    {
      type: "steps",
      items: [
        {
          de: "Sofort im Kommentar antworten",
          vi: "Trả lời ngay dưới bình luận",
          body_de: "Kurz mit „Ja“ antworten und sagen, dass du eine Nachricht schickst.",
          body_vi: "Trả lời ngắn „Có“ và nói là bạn sẽ nhắn tin riêng.",
          template: {
            label_de: "Vorlage · Antwort im Kommentar",
            label_vi: "Mẫu · Trả lời dưới bình luận",
            text: "Dạ có ạ, trung tâm có lớp online. Em nhắn tin riêng cho [anh/chị/bạn] nha!",
            translation_de: "„Ja, wir haben Online-Kurse. Ich schreibe dir gleich eine persönliche Nachricht!“"
          }
        },
        {
          de: "Direkt eine Nachricht an die Person schreiben",
          vi: "Nhắn tin riêng cho người đó",
          body_de: "Schreib der Person direkt. Auf Facebook geht das mit „Gửi tin nhắn“ unter dem Kommentar. Für das Gespräch danach gilt die Seite „[Erstkontakt über Messenger beantworten](sales/erstkontakt-messenger)“.",
          body_vi: "Nhắn tin riêng cho người đó. Trên Facebook: bấm „Gửi tin nhắn“ ngay dưới bình luận. Cách nói chuyện tiếp theo xem trang „[Trả lời tin nhắn đầu tiên qua Messenger](sales/erstkontakt-messenger)“."
        }
      ]
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Welche Kommentare beantworten wir?",
        question_vi: "Chúng ta trả lời những bình luận nào?",
        section: "grundregel",
        options: [
          { de: "Nur Fragen zu Kursen", vi: "Chỉ câu hỏi về khoá học" },
          { de: "Jeden Kommentar", vi: "Mọi bình luận" },
          { de: "Nur Kommentare auf Facebook", vi: "Chỉ bình luận trên Facebook" },
          { de: "Nur lange Kommentare", vi: "Chỉ bình luận dài" }
        ],
        correct: 1
      },
      {
        question_de: "Jemand fragt: „Wie sagt man ‚Anh yêu em‘ auf Deutsch?“ Wie antwortest du?",
        question_vi: "Có người hỏi: „Anh yêu em tiếng Đức nói thế nào?“ Bạn trả lời ra sao?",
        section: "fragen-zu-deutsch",
        options: [
          { de: "Die ganze Antwort von ChatGPT kopieren", vi: "Copy nguyên câu trả lời của ChatGPT" },
          { de: "Gar nicht, das ist keine Kursfrage", vi: "Không trả lời, vì không phải câu hỏi về khoá học" },
          { de: "Mit ChatGPT übersetzen, nur die Übersetzung nehmen und selbst kurz und persönlich antworten", vi: "Dịch bằng ChatGPT, chỉ lấy phần dịch rồi tự trả lời ngắn và tự nhiên" },
          { de: "Die Person bitten, einen Kurs zu buchen", vi: "Bảo người đó đăng ký khoá học" }
        ],
        correct: 2
      },
      {
        question_de: "Warum kopieren wir die Nachricht von ChatGPT nicht einfach?",
        question_vi: "Vì sao không copy nguyên tin nhắn của ChatGPT?",
        section: "fragen-zu-deutsch",
        options: [
          { de: "Sie ist zu lang und klingt nach Maschine – die Leute sollen merken, dass ein Mensch antwortet", vi: "Tin đó quá dài và nghe như máy – người xem cần thấy là người thật trả lời" },
          { de: "ChatGPT ist verboten", vi: "ChatGPT bị cấm" },
          { de: "Kopieren dauert zu lange", vi: "Copy mất thời gian" },
          { de: "ChatGPT kann kein Deutsch", vi: "ChatGPT không biết tiếng Đức" }
        ],
        correct: 0
      },
      {
        question_de: "Du bist nicht sicher, ob deine Übersetzung stimmt. Was machst du?",
        question_vi: "Bạn không chắc bản dịch có đúng không. Bạn làm gì?",
        section: "fragen-zu-deutsch",
        options: [
          { de: "Trotzdem antworten", vi: "Cứ trả lời" },
          { de: "Den Kommentar löschen", vi: "Xoá bình luận" },
          { de: "Nicht antworten", vi: "Không trả lời" },
          { de: "In der Zalo-Gruppe „Bình luận/ nhận xét“ nachfragen", vi: "Hỏi lại trong nhóm Zalo „Bình luận/ nhận xét“" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand kommentiert: „Unterrichten Sie auch online?“ Was machst du?",
        question_vi: "Có người bình luận: „Trung tâm có dạy online không?“ Bạn làm gì?",
        section: "fragen-zu-kursen",
        options: [
          { de: "Nur ein Like geben", vi: "Chỉ thả like" },
          { de: "Sofort im Kommentar mit Ja antworten und der Person direkt eine Nachricht schreiben", vi: "Trả lời ngay „Có“ dưới bình luận và nhắn tin riêng cho người đó" },
          { de: "Morgen antworten", vi: "Mai trả lời" },
          { de: "Nur im Kommentar die ganze Preisliste schicken", vi: "Gửi cả bảng giá dưới bình luận" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
