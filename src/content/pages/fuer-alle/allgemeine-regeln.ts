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
  ]
};

export default page;
