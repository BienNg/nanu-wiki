import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "allgemeine-regeln",
  title_de: "Allgemeine Regeln",
  title_vi: "Quy định chung",
  kind: "reference",
  section: "general",
  verified_until: null,
  updated_at: "2026-10-30",
  body: [
    {
      type: "paragraph",
      de: "Arbeitszeiten, Urlaub und Kommunikation.",
      vi: "Giờ làm, nghỉ phép và giao tiếp."
    },
    {
      type: "heading",
      de: "Arbeitszeiten",
      vi: "Giờ làm việc"
    },
    {
      type: "list",
      items: [
        {
          de: "Vollzeit: von 9 bis 18 Uhr, mit einer Stunde Mittagspause von 12 bis 13 Uhr.",
          vi: "Toàn thời gian: từ 9 giờ đến 18 giờ, nghỉ trưa một tiếng từ 12 đến 13 giờ."
        },
        {
          de: "Teilzeit: ab 17 Uhr (Abendschicht).",
          vi: "Bán thời gian: từ 17 giờ (ca tối)."
        }
      ]
    },
    {
      type: "heading",
      de: "Urlaub",
      vi: "Nghỉ phép"
    },
    {
      type: "steps",
      items: [
        {
          de: "Urlaub rechtzeitig über Slack beantragen",
          vi: "Xin nghỉ phép sớm qua Slack",
          body_de: "Der Urlaub gilt erst, wenn er genehmigt wurde.",
          body_vi: "Chỉ được nghỉ khi đơn đã được duyệt."
        },
        {
          de: "Urlaub im Kalender eintragen",
          vi: "Ghi lịch nghỉ vào Calendar",
          body_de: "So sehen alle, an welchen Tagen du nicht da bist.",
          body_vi: "Để mọi người biết bạn vắng mặt những ngày nào."
        },
        {
          de: "Termine an den Urlaubstagen selbst verschieben",
          vi: "Tự dời các cuộc hẹn trong những ngày nghỉ",
          body_de: "Wer Urlaub nimmt, verschiebt alle Termine an diesen Tagen aktiv und schlägt selbst einen neuen Termin vor.",
          body_vi: "Người nghỉ phép phải tự chủ động dời tất cả cuộc hẹn trong những ngày đó và đề xuất thời gian mới."
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Es dürfen nie zwei Mitarbeiter zur gleichen Zeit im Urlaub sein. Prüfe vor dem Antrag den Kalender.",
      vi: "Không bao giờ được có hai nhân viên nghỉ phép cùng lúc. Hãy kiểm tra lịch trước khi xin nghỉ."
    },
    {
      type: "heading",
      de: "Kommunikation",
      vi: "Giao tiếp"
    },
    {
      type: "list",
      items: [
        {
          de: "Slack: unser Standardkanal für alles im Team.",
          vi: "Slack: kênh mặc định cho mọi trao đổi trong team."
        },
        {
          de: "Zalo: nur für schnelle Sachen, die sofort erledigt werden müssen.",
          vi: "Zalo: chỉ dùng cho việc gấp cần xử lý ngay."
        }
      ]
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Wann arbeitet man in Vollzeit?",
        question_vi: "Nhân viên toàn thời gian làm việc khi nào?",
        section: "arbeitszeiten",
        options: [
          { de: "Von 8 bis 17 Uhr, Mittagspause von 12 bis 13 Uhr", vi: "Từ 8 đến 17 giờ, nghỉ trưa từ 12 đến 13 giờ" },
          { de: "Ab 17 Uhr in der Abendschicht", vi: "Từ 17 giờ, ca tối" },
          { de: "Von 9 bis 18 Uhr, Mittagspause von 12 bis 13 Uhr", vi: "Từ 9 đến 18 giờ, nghỉ trưa từ 12 đến 13 giờ" },
          { de: "Wann man möchte, solange 8 Stunden zusammenkommen", vi: "Lúc nào cũng được, miễn đủ 8 tiếng" }
        ],
        correct: 2
      },
      {
        question_de: "Ab wann gilt dein Urlaub?",
        question_vi: "Kỳ nghỉ của bạn có hiệu lực từ khi nào?",
        section: "urlaub",
        options: [
          { de: "Sobald du ihn im Kalender eingetragen hast", vi: "Ngay khi bạn ghi vào lịch" },
          { de: "Sobald du es im Team-Chat auf Zalo gesagt hast", vi: "Ngay khi bạn báo trong nhóm Zalo" },
          { de: "Erst wenn er über Slack beantragt und genehmigt wurde", vi: "Chỉ khi đã xin qua Slack và được duyệt" },
          { de: "Eine Woche nach dem Antrag, auch ohne Antwort", vi: "Một tuần sau khi xin, kể cả khi chưa có trả lời" }
        ],
        correct: 2
      },
      {
        question_de: "Du hast an deinen Urlaubstagen Termine. Was machst du?",
        question_vi: "Bạn có lịch hẹn vào những ngày nghỉ. Bạn làm gì?",
        section: "urlaub",
        options: [
          { de: "Ich lasse sie ausfallen, der Kunde meldet sich schon", vi: "Bỏ qua, khách sẽ tự liên hệ lại" },
          { de: "Ich bitte eine Kollegin, alle Termine zu übernehmen", vi: "Nhờ đồng nghiệp nhận hết lịch hẹn" },
          { de: "Nichts, das macht die Leitung", vi: "Không làm gì, quản lý sẽ lo" },
          { de: "Ich verschiebe sie selbst und schlage einen neuen Termin vor", vi: "Tự dời lịch và tự đề xuất giờ mới" }
        ],
        correct: 3
      },
      {
        question_de: "Was prüfst du im Kalender, bevor du Urlaub beantragst?",
        question_vi: "Bạn kiểm tra gì trên lịch trước khi xin nghỉ?",
        section: "urlaub",
        options: [
          { de: "Dass an den Tagen keine Feiertage sind", vi: "Những ngày đó không phải ngày lễ" },
          { de: "Dass höchstens zwei Kolleginnen gleichzeitig weg sind", vi: "Tối đa hai đồng nghiệp nghỉ cùng lúc" },
          { de: "Nichts, der Kalender ist nur zur Info", vi: "Không cần, lịch chỉ để tham khảo" },
          { de: "Dass zu der Zeit niemand anderes im Urlaub ist", vi: "Không có ai khác nghỉ vào thời gian đó" }
        ],
        correct: 3
      },
      {
        question_de: "Wofür nutzen wir Zalo im Team?",
        question_vi: "Trong nhóm, chúng ta dùng Zalo để làm gì?",
        section: "kommunikation",
        options: [
          { de: "Für alles, Zalo ist unser Standardkanal", vi: "Cho mọi việc, Zalo là kênh chính" },
          { de: "Für Urlaubsanträge", vi: "Để xin nghỉ phép" },
          { de: "Nur für schnelle Sachen, die sofort erledigt werden müssen", vi: "Chỉ cho việc gấp, cần làm ngay" },
          { de: "Gar nicht, Zalo ist nur für Kunden", vi: "Không dùng, Zalo chỉ dành cho khách" }
        ],
        correct: 2
      }
    ]
  }
};

export default page;
