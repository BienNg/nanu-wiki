import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "probestunde-buchen",
  title_de: "Probestunde buchen",
  title_vi: "Đặt lịch học thử",
  kind: "process",
  section: "handbook",
  verified_until: "2026-12-06",
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Die Probestunde nimmt die größte Angst: Geld bezahlen und dann feststecken. Viele Kunden haben genau das bei einer anderen Schule erlebt.",
      vi: "Học thử giải tỏa nỗi lo lớn nhất của khách: đóng tiền rồi bị kẹt. Nhiều khách đã từng gặp đúng chuyện này ở trung tâm khác."
    },
    { type: "heading", de: "Die Regel", vi: "Quy định" },
    {
      type: "list",
      items: [
        { de: "Gilt für alle, die zum ersten Mal einen Online-Kurs bei uns buchen.", vi: "Áp dụng cho học viên lần đầu đăng ký lớp online tại trung tâm." },
        { de: "Die Person zahlt den Kurs und testet die ersten zwei Termine hintereinander.", vi: "Học viên đóng học phí và học thử 2 buổi đầu liên tiếp." },
        { de: "Passt es nicht: 100 % zurück – auch die zwei Termine sind kostenlos.", vi: "Nếu không phù hợp: hoàn 100% – kể cả 2 buổi đã học cũng miễn phí." },
        { de: "Der Frühbucherpreis gilt trotzdem.", vi: "Vẫn được hưởng ưu đãi đăng ký sớm." }
      ]
    },
    { type: "heading", de: "Schritt für Schritt", vi: "Từng bước" },
    {
      type: "steps",
      items: [
        { de: "Passenden Kurs mit Datum und Uhrzeit vorschlagen", vi: "Gợi ý lớp phù hợp kèm ngày giờ" },
        { de: "Regel erklären", vi: "Giải thích quy định", body_de: "Mit den Daten der zwei Testtermine („Montag und Mittwoch nächste Woche“).", body_vi: "Kèm ngày của 2 buổi học thử („thứ 2 và thứ 4 tuần sau“)." },
        { de: "Zahlung und Daten", vi: "Thanh toán và thông tin", body_de: "Kontovorlage schicken, Beleg + E-Mail + Zalo erfragen, Daten bestätigen.", body_vi: "Gửi mẫu tài khoản, xin biên lai + email + Zalo, xác nhận lại thông tin." },
        { de: "Material und Klassengruppe", vi: "Tài liệu và nhóm lớp", body_de: "Unterlagen per E-Mail, Person in die Zalo-Gruppe aufnehmen, Zoom-Link teilen.", body_vi: "Gửi tài liệu qua email, thêm vào nhóm Zalo của lớp, gửi link Zoom." },
        { de: "Nach Termin 2 nachfragen", vi: "Hỏi thăm sau buổi 2", body_de: "„Wie waren die ersten zwei Stunden?“ – und Feedback im CRM eintragen.", body_vi: "„Hai buổi đầu em thấy thế nào?“ – và ghi nhận xét vào CRM." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Möchte jemand nur die zwei Termine bezahlen statt des ganzen Kurses: Verständnis zeigen und die Rückerstattungsregel erklären. Bleibt die Person dabei, an die Leitung geben – nicht selbst zusagen.",
      vi: "Khách chỉ muốn đóng tiền 2 buổi học thử thay vì cả khóa: thể hiện sự thấu hiểu và giải thích quy định hoàn tiền. Nếu khách vẫn muốn vậy, chuyển cho quản lý – không tự đồng ý."
    }
  ]
};

export default page;
