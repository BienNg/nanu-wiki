import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "lehrkraefte-begleiten",
  title_de: "Lehrkräfte begleiten & Unterricht prüfen",
  title_vi: "Theo dõi giáo viên & chất lượng lớp học",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Ob jemand weiterlernt, entscheidet sich im Unterricht. Customer Success sieht, was die Teilnehmenden sagen, und was die Lehrkräfte eintragen – und bringt beides zusammen, bevor aus einer kleinen Unzufriedenheit eine Kündigung wird.",
      vi: "Học viên có học tiếp hay không được quyết định trong lớp học. Đội Chăm sóc học viên nắm được học viên nói gì và giáo viên ghi nhận gì – và kết nối hai bên trước khi một chút không hài lòng trở thành bỏ học."
    },
    { type: "heading", de: "Feedback der Lehrkräfte", vi: "Nhận xét hằng ngày của giáo viên" },
    {
      type: "list",
      items: [
        {
          de: "Nach jeder Stunde trägt die Lehrkraft Anwesenheit, Fortschritt und eine kurze Bemerkung zu den Teilnehmenden in die Excel-Liste der Klasse ein. Nach der ersten und zweiten Stunde kommt eine Gesamtbemerkung dazu.",
          vi: "Sau mỗi buổi, giáo viên điền điểm danh, tiến độ và nhận xét ngắn cho học viên vào file Excel của lớp. Sau buổi 1 và 2 có thêm dòng nhận xét chung."
        },
        {
          de: "Fehlt etwas: im Backoffice im Tagesbericht eintragen – Klasse, fehlende Tage, Betrag, Screenshot. Alle 48 Stunden prüfen. Fehlende Tage werden am Monatsende abgezogen.",
          vi: "Thiếu nhận xét: ghi vào báo cáo cuối ngày trên Backoffice – lớp, ngày thiếu, số tiền, ảnh chụp màn hình. Cứ 48 tiếng kiểm tra một lần. Ngày thiếu sẽ bị trừ phí vào cuối tháng."
        },
        {
          de: "Lob gehört auch dazu: Wird eine Lehrkraft von Teilnehmenden gelobt, notieren und weitergeben. Ohne Notizen weiß am Monatsende niemand, wer gut war.",
          vi: "Lời khen cũng cần ghi lại: giáo viên được học viên khen thì note và chuyển lại. Không ghi lại thì cuối tháng không ai biết ai dạy tốt."
        },
        {
          de: "Nach dem Mini-Test in der Mitte der Stufe bekommen die Teilnehmenden eine Rückmeldung zu ihrem Stand – aus den Bemerkungen der Lehrkraft und dem Testergebnis.",
          vi: "Sau bài Mini Test giữa khoá, học viên nhận nhận xét về tình hình học – dựa trên nhận xét của giáo viên và điểm bài test."
        }
      ]
    },
    { type: "heading", de: "Wenn eine Lehrkraft ausfällt", vi: "Khi giáo viên xin nghỉ" },
    {
      type: "steps",
      items: [
        {
          de: "Die Lehrkraft meldet sich zuerst beim Zentrum",
          vi: "Giáo viên báo trung tâm trước",
          body_de: "Nie direkt der Klasse ankündigen. Erst wenn klar ist, ob es Ersatz gibt, erfährt die Klasse davon.",
          body_vi: "Không báo thẳng cho lớp. Chỉ khi đã rõ có giáo viên dạy thay hay không thì mới báo lớp."
        },
        {
          de: "Ersatz suchen",
          vi: "Tìm giáo viên dạy thay",
          body_de: "Ist es dringend (die Stunde ist morgen), nicht bis Montag warten: sofort über Zalo Bescheid geben und in Slack festhalten.",
          body_vi: "Nếu gấp (buổi học ngày mai), đừng đợi đến thứ Hai: nhắn Zalo ngay và ghi lại trên Slack."
        },
        {
          de: "Der Klasse erklären",
          vi: "Giải thích với lớp",
          body_de: "Wechselt die Lehrkraft, sagen wir warum: „In der ersten Stunde unterrichtet … , weil …“. Ohne Erklärung denken die Teilnehmenden, wir hätten etwas versprochen und nicht gehalten.",
          body_vi: "Đổi giáo viên thì nói rõ lý do: „Buổi 1 thầy/cô … dạy, vì …“. Không giải thích, học viên sẽ nghĩ trung tâm hứa một đằng làm một nẻo."
        },
        {
          de: "Kein Ersatz: Stunde verschieben",
          vi: "Không có người thay: dời buổi",
          body_de: "Der Klasse den Nachholtermin gleich mitnennen.",
          body_vi: "Báo lớp luôn ngày học bù."
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Feiertage: Fällt ein Feiertag an (in Vietnam z. B. 2.9., in Deutschland 3.10.), allen Lehrkräften und Klassen frühzeitig Bescheid geben. Frei hat nur, wer an genau diesem Tag Unterricht hätte – Klassen nach deutscher Abendzeit können trotzdem stattfinden. Im September fiel eine Klasse aus, die gar nicht hätte frei haben sollen.",
      vi: "Ngày lễ: khi có ngày lễ (ở Việt Nam ví dụ 2/9, ở Đức 3/10) thì báo sớm cho tất cả giáo viên và các lớp. Chỉ lớp nào có buổi học đúng vào ngày đó mới nghỉ – các lớp tối giờ Đức vẫn có thể học bình thường. Tháng 9 đã có một lớp nghỉ nhầm."
    },
    { type: "heading", de: "Typische Beschwerden über den Unterricht", vi: "Các phản ánh thường gặp về lớp học" },
    {
      type: "list",
      items: [
        {
          de: "„Die Lehrkraft ist zu schnell“: Erst die Person fragen, wo sie hängt und ob sie in der Stunde nachgefragt hat. Dann der Lehrkraft Bescheid geben, auf diese Person zu achten.",
          vi: "„Giáo viên dạy nhanh“: hỏi học viên đang vướng phần nào, đã hỏi lại giáo viên trong giờ chưa. Sau đó nhắn giáo viên chú ý hơn đến bạn này."
        },
        {
          de: "„Die Klasse ist zu groß, ich komme selten dran“ oder „Andere sind noch nicht so weit“: Als Feedback notieren und mit der Lehrkraft besprechen – nicht nur weiterleiten.",
          vi: "„Lớp đông, giáo viên gọi không hết“ hay „có bạn trình độ chưa tới“: ghi nhận phản hồi và trao đổi với giáo viên – không chỉ chuyển tiếp."
        },
        {
          de: "„Ich passe nicht zu dieser Lehrkraft“ oder Zweifel an ihrer Qualifikation: Ernst nehmen, Grund erfragen, an die Leitung geben. Alle Lehrkräfte haben in Deutschland studiert; die Zeugnisse liegen im Drive. Sie werden nicht einfach an Teilnehmende verschickt – vorher die Leitung fragen.",
          vi: "„Em không hợp giáo viên này“ hay nghi ngờ bằng cấp giáo viên: xem trọng, hỏi lý do, báo quản lý. Tất cả giáo viên đều học tại Đức; bằng đã scan lưu trên Drive. Không tự gửi bằng cho học viên – hỏi quản lý trước."
        },
        {
          de: "Probleme mit Lehrplan oder Programm („Der Unterricht wirkt wie reine Prüfungsvorbereitung“) und Bitten außerhalb der Regeln: in der Gruppe melden, dort wird entschieden.",
          vi: "Vấn đề về giáo án, chương trình („lớp học giống ôn đề thi“) và các yêu cầu ngoài quy định: báo vào nhóm để được đưa hướng giải quyết."
        }
      ]
    },
    { type: "heading", de: "Unterricht besuchen (Hospitation)", vi: "Dự giờ lớp online" },
    {
      type: "list",
      items: [
        {
          de: "Ohne Ankündigung reingehen, Kamera und Mikro aus, mit einem neutralen Namen. Nicht stören – wird man angesprochen, bleibt man still oder verlässt die Stunde leise.",
          vi: "Vào lớp không báo trước, tắt cam và mic, đặt tên khác. Không làm gián đoạn – nếu giáo viên hỏi thì im lặng hoặc lặng lẽ rời lớp."
        },
        {
          de: "Bewerten: Ton, Bild, Licht, Folien, wie verständlich erklärt wird, wie die Lehrkraft mit der Klasse arbeitet.",
          vi: "Đánh giá: âm thanh, hình ảnh, ánh sáng, slide trình chiếu, cách truyền đạt, cách giáo viên tương tác với lớp."
        },
        {
          de: "Pro Klasse kurz in Slack berichten – dann kann die Leitung vergleichen.",
          vi: "Báo cáo ngắn từng lớp trên Slack – để quản lý so sánh được."
        }
      ]
    }
  ]
};

export default page;
