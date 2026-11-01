import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "standorte-und-team",
  title_de: "Standorte & Team",
  title_vi: "Cơ sở & đội ngũ",
  kind: "reference",
  section: "general",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "list",
      items: [
        {
          de: "Hồ Chí Minh",
          vi: "Hồ Chí Minh"
        },
        {
          de: "Hà Nội",
          vi: "Hà Nội"
        },
        {
          de: "Stuttgart",
          vi: "Stuttgart"
        }
      ]
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Wo hat NaNu NaNa Standorte?",
        question_vi: "NaNu NaNa có văn phòng ở đâu?",
        options: [
          { de: "Hà Nội, Đà Nẵng und Berlin", vi: "Hà Nội, Đà Nẵng và Berlin" },
          { de: "Hồ Chí Minh, Hà Nội und Stuttgart", vi: "Hồ Chí Minh, Hà Nội và Stuttgart" },
          { de: "Nur in Hồ Chí Minh", vi: "Chỉ ở Hồ Chí Minh" },
          { de: "Hồ Chí Minh, Hà Nội und München", vi: "Hồ Chí Minh, Hà Nội và München" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
