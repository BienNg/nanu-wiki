import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "probestunden-und-rueckerstattung",
  title_de: "Probestunden & Geld-zurück-Zusage",
  title_vi: "Học thử & cam kết hoàn tiền",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Viele Interessierte hatten schon Pech mit anderen Schulen: Der Kurs wurde nicht fertig, das Geld kam nicht zurück. Manche wollen deshalb zuerst nur einen Teil bezahlen. Unsere Zusage ist ein Versprechen – Customer Success sorgt dafür, dass wir es einhalten.",
      vi: "Nhiều khách từng gặp chuyện không vui ở trung tâm khác: khoá học không hoàn thành, tiền cũng không được hoàn. Vì vậy có khách chỉ muốn đóng trước một phần. Cam kết của mình là một lời hứa – đội Chăm sóc học viên đảm bảo mình giữ lời."
    },
    { type: "heading", de: "Was wir zusagen", vi: "Mình cam kết gì" },
    {
      type: "list",
      items: [
        {
          de: "Zwei Probestunden: Wer zum ersten Mal einen Kurs bei uns bucht und es ist ein Online-Kurs, bekommt 100 % zurück, wenn er nach den ersten zwei Stunden in Folge nicht zufrieden ist – auch für die zwei besuchten Stunden.",
          vi: "Hai buổi học thử: học viên đăng ký lần đầu tại trung tâm và học lớp online, nếu sau hai buổi liên tiếp đầu tiên thấy không phù hợp thì được hoàn 100% học phí – kể cả hai buổi đã học."
        },
        {
          de: "Die Zusage gilt nur für beides zusammen: Online-Kurs und erster Kurs bei uns. Vor-Ort-Kurse und Folgekurse (z. B. A2 nach unserem A1) sind ausgenommen.",
          vi: "Cam kết chỉ áp dụng khi có cả hai điều kiện: lớp online và là khoá đầu tiên tại trung tâm. Lớp offline và khoá học tiếp (ví dụ A2 sau khi đã học A1 ở trung tâm) không áp dụng."
        },
        {
          de: "Kursausfall: Online braucht eine Klasse mindestens 5 Teilnehmende, vor Ort mindestens 8. Kommen sie nicht zusammen, bieten wir eine Alternative an. Wer sie nicht will, bekommt sofort 100 % zurück.",
          vi: "Lớp không mở: lớp online cần tối thiểu 5 học viên, lớp offline tối thiểu 8. Nếu không đủ, trung tâm đưa ra phương án thay thế. Ai không đồng ý thì được hoàn 100% ngay."
        },
        {
          de: "Bezahlt wird trotzdem vorher – die Zusage ersetzt nicht die Zahlung. Sonderwünsche (nur zwei Stunden zahlen) entscheidet die Leitung.",
          vi: "Vẫn đóng học phí trước – cam kết không thay cho việc thanh toán. Yêu cầu đặc biệt (chỉ đóng tiền hai buổi) do quản lý quyết định."
        }
      ]
    },
    { type: "heading", de: "Wenn jemand nach den Probestunden aufhören will", vi: "Khi học viên muốn dừng sau buổi học thử" },
    {
      type: "steps",
      items: [
        {
          de: "Danken und Grund erfragen",
          vi: "Cảm ơn và hỏi lý do",
          body_de: "Nicht überreden. Fragen, was nicht gepasst hat: Uhrzeit, Tempo, Lehrkraft, Technik?",
          body_vi: "Không thuyết phục ép. Hỏi điều gì chưa phù hợp: giờ học, tốc độ, giáo viên, kỹ thuật?"
        },
        {
          de: "Eine Lösung anbieten – einmal",
          vi: "Đưa một giải pháp – một lần thôi",
          body_de: "Lag es an App oder Material, hilft oft ein Videoanruf. Lag es an der Uhrzeit, gibt es vielleicht eine andere Klasse. Sagt die Person nein, ist das in Ordnung.",
          body_vi: "Nếu vướng app hay tài liệu, gọi video hướng dẫn thường giải quyết được. Nếu do giờ học, có thể có lớp khác. Học viên vẫn từ chối thì cũng không sao."
        },
        {
          de: "An die Leitung geben – mit Datum",
          vi: "Chuyển quản lý – kèm thời gian",
          body_de: "Name, Klasse, Betrag und Kontodaten weitergeben und der Person sagen, bis wann das Geld zurück ist.",
          body_vi: "Chuyển tên, lớp, số tiền và thông tin tài khoản cho quản lý, và báo học viên khi nào sẽ nhận lại tiền."
        },
        {
          de: "Bestätigen, wenn es überwiesen ist",
          vi: "Xác nhận khi đã chuyển",
          body_de: "Die Rückzahlung ist erst erledigt, wenn die Person sie bestätigt hat.",
          body_vi: "Chỉ coi là xong khi học viên xác nhận đã nhận tiền."
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Eine schnelle, freundliche Rückzahlung kostet uns eine Kursgebühr. Eine verschleppte kostet uns den Ruf – die Leute erzählen es weiter.",
      vi: "Hoàn tiền nhanh và vui vẻ thì mình mất một khoản học phí. Hoàn tiền chậm trễ thì mình mất uy tín – khách sẽ kể cho người khác."
    }
  ]
};

export default page;
