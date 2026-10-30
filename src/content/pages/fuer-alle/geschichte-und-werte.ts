import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "geschichte-und-werte",
  title_de: "Unsere Geschichte & Werte",
  title_vi: "Câu chuyện & giá trị của chúng ta",
  kind: "decision",
  section: "general",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Qualität und Freundlichkeit – darauf bauen wir NaNu NaNa.",
      vi: "Chất lượng và sự tử tế – nền tảng của NaNu NaNa."
    },
    {
      type: "heading",
      de: "Was uns wichtig ist",
      vi: "Điều chúng ta coi trọng"
    },
    {
      type: "list",
      items: [
        {
          de: "Ehrlich beraten – auch wenn die Antwort „Nein“ ist",
          vi: "Tư vấn trung thực – kể cả khi câu trả lời là „không“"
        },
        {
          de: "Radikale Preistransparenz",
          vi: "Minh bạch học phí tuyệt đối"
        },
        {
          de: "Begleitung bis zur Ankunft in Deutschland",
          vi: "Đồng hành đến khi đặt chân tới Đức"
        }
      ]
    },
    {
      type: "video",
      url: "",
      caption_de: "Willkommensvideo der Gründer (YouTube-Link einfügen)",
      caption_vi: "Video chào mừng từ nhà sáng lập (thêm link YouTube)"
    }
  ]
};

export default page;
