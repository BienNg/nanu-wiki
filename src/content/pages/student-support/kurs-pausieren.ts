import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "kurs-pausieren",
  title_de: "Kurs pausieren (Bảo lưu)",
  title_vi: "Bảo lưu khoá học",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Arbeit, Familie, Schule: Viele müssen mitten im Kurs aufhören und fragen, ob sie das Geld zurückbekommen oder später weitermachen können. Pausieren ist fast immer die bessere Lösung – für die Person und für uns.",
      vi: "Công việc, gia đình, học văn hoá: nhiều học viên phải dừng giữa khoá và hỏi có được hoàn tiền hay học tiếp sau không. Bảo lưu hầu như luôn là giải pháp tốt hơn – cho học viên và cho trung tâm."
    },
    { type: "heading", de: "Die Regeln", vi: "Quy định" },
    {
      type: "list",
      items: [
        {
          de: "Bezahlt, aber noch nicht angefangen: Der Kurs kann bis zu 12 Monate ab der Bestätigung pausiert werden.",
          vi: "Đã đóng học phí nhưng chưa bắt đầu học: được bảo lưu tối đa 12 tháng kể từ ngày xác nhận bảo lưu."
        },
        {
          de: "Mitten in A1 aufgehört: Der Rest des Kurses kann 6 bis 12 Monate pausiert werden – je nach Fall und nach Bestätigung durch das Zentrum.",
          vi: "Đã bắt đầu học và muốn tạm dừng giữa khoá A1: được xem xét bảo lưu phần còn lại từ 6 đến 12 tháng, tuỳ tình hình thực tế và xác nhận của trung tâm."
        },
        {
          de: "Pausieren oder Aufhören bringt kein Geld zurück. Es gelten die Rückerstattungsregeln aus der Kursmail. Die Geld-zurück-Zusage nach zwei Probestunden ist ein eigener Fall (siehe „Probestunden & Geld-zurück-Zusage“).",
          vi: "Bảo lưu hay ngừng học thì không được hoàn học phí, theo điều khoản hoàn học phí trong email khoá học. Cam kết hoàn tiền sau hai buổi học thử là trường hợp riêng (xem trang „Học thử & cam kết hoàn tiền“)."
        },
        {
          de: "Die Person meldet die Pause an, und das Zentrum bestätigt sie, bevor sie aufhört. Wer einfach nicht mehr kommt, hat nichts pausiert.",
          vi: "Học viên phải báo và được trung tâm xác nhận bảo lưu trước khi tạm dừng. Tự ý nghỉ thì không tính là bảo lưu."
        },
        {
          de: "Während der Pause meldet sich die Person selbst, um eine neue Klasse zu wählen. Wir erinnern trotzdem vor Ablauf.",
          vi: "Trong thời gian bảo lưu, học viên chủ động liên hệ trung tâm để xếp lớp. Trung tâm vẫn nhắc trước khi hết hạn."
        }
      ]
    },
    {
      type: "callout",
      tone: "info",
      de: "Stand Oktober 2026: Diese Regeln sollen auch in die Kursmail. Bis dahin vor jeder Zusage kurz bei der Leitung bestätigen lassen.",
      vi: "Tháng 10/2026: quy định này sẽ được đưa vào email khoá học. Trong lúc chờ, trước khi xác nhận với học viên thì hỏi lại quản lý."
    },
    { type: "heading", de: "So gehst du vor", vi: "Cách xử lý" },
    {
      type: "steps",
      items: [
        {
          de: "Grund erfragen",
          vi: "Hỏi lý do",
          body_de: "Passt nur die Uhrzeit nicht oder die Lehrkraft? Dann ist eine andere Klasse oft besser als eine Pause.",
          body_vi: "Có phải chỉ không hợp giờ học hay giáo viên? Khi đó chuyển lớp khác thường tốt hơn bảo lưu."
        },
        {
          de: "Stand der Klasse prüfen",
          vi: "Kiểm tra lớp đang học đến đâu",
          body_de: "Klasse, Stufe, wie viele Stunden schon vorbei sind, was bezahlt ist (ganzer Kurs, halber Kurs, Kombi).",
          body_vi: "Lớp, trình độ, đã học được bao nhiêu buổi, đã đóng những gì (cả khoá, nửa khoá, combo)."
        },
        {
          de: "Pause an einer Stufengrenze vorschlagen",
          vi: "Đề xuất bảo lưu ở mốc chuyển trình độ",
          body_de: "Am einfachsten ist der Wiedereinstieg am Anfang einer Stufe: Ist A1.1 gerade fertig, pausiert die Person A1.2. Wer lange gefehlt hat, wiederholt besser die letzte Stufe.",
          body_vi: "Dễ nhất là học lại từ đầu một trình độ: vừa xong A1.1 thì bảo lưu A1.2. Ai nghỉ lâu thì nên học lại trình độ vừa rồi cho vững."
        },
        {
          de: "Bei Sonderfällen an die Leitung",
          vi: "Trường hợp ngoài quy định thì báo quản lý",
          body_de: "Pause nach 5–6 Stunden, Gebühr auf eine andere Person übertragen, Rest der Kombi zurück: in Slack mit allen Daten melden. Der Person sagen: „Die Regel ist …, ich frage aber für dich nach.“ Nichts zusagen, was die Leitung nicht bestätigt hat.",
          body_vi: "Bảo lưu sau khi đã học 5–6 buổi, chuyển học phí cho người khác, xin hoàn phần còn lại của combo: báo lên Slack kèm đầy đủ thông tin. Nói với học viên: „Quy định là …, nhưng em sẽ hỏi quản lý để hỗ trợ mình.“ Không hứa điều quản lý chưa xác nhận."
        },
        {
          de: "Schriftlich bestätigen",
          vi: "Xác nhận bằng văn bản",
          body_de: "Pause bis wann, ab welcher Stelle es weitergeht und was schon bezahlt ist. In der Teilnehmendenliste notieren.",
          body_vi: "Bảo lưu đến khi nào, học tiếp từ phần nào và đã đóng những gì. Ghi vào danh sách học viên."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Pause bestätigen",
      label_vi: "Mẫu · Xác nhận bảo lưu",
      text: "Dạ trung tâm xác nhận bảo lưu khoá học cho [tên] nha:\n- Khoá/lớp: … (đã học đến …)\n- Phần được bảo lưu: …\n- Thời hạn bảo lưu: đến ngày …\nTrong thời gian này, khi nào [chị/anh/bạn] sắp xếp được thì nhắn trung tâm để xếp lớp phù hợp nhé. Trước khi hết hạn trung tâm cũng sẽ nhắn nhắc [chị/anh/bạn] ạ. Học phí không hoàn lại khi bảo lưu theo quy định trong email khoá học ạ.",
      translation_de: "„Wir bestätigen die Pause für [Name]: Kurs/Klasse … (gelernt bis …), pausiert wird …, gültig bis … Wenn du so weit bist, schreib uns und wir suchen eine passende Klasse. Vor Ablauf erinnern wir dich. Laut Kursmail wird die Gebühr bei einer Pause nicht erstattet.“"
    },
    {
      type: "callout",
      tone: "warning",
      de: "Lehrkräfte sagen der Klasse keine Pause oder Urlaub an, bevor das Zentrum zugestimmt hat. Im August hat eine Lehrkraft der Klasse ihren Urlaub angekündigt – danach wollte die halbe Klasse auch eine Pause.",
      vi: "Giáo viên không được báo lớp nghỉ hay nghỉ phép trước khi trung tâm đồng ý. Tháng 8 có giáo viên báo lớp mình sẽ nghỉ – sau đó gần nửa lớp cũng muốn nghỉ theo."
    }
  ]
};

export default page;
