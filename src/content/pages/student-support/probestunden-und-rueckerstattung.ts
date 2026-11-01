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
          de: "Kursausfall: Online braucht eine Klasse mindestens 5 Schüler, vor Ort mindestens 8. Kommen sie nicht zusammen, bieten wir eine Alternative an. Wer sie nicht will, bekommt sofort 100 % zurück.",
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
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Für wen gilt die Geld-zurück-Zusage nach zwei Probestunden?",
        question_vi: "Cam kết hoàn tiền sau hai buổi học thử áp dụng cho ai?",
        section: "was-wir-zusagen",
        options: [
          { de: "Für alle Kurse, auch vor Ort", vi: "Mọi khóa, kể cả trực tiếp" },
          { de: "Für Folgekurse wie A2 nach unserem A1", vi: "Khóa tiếp theo như A2 sau A1 của trung tâm" },
          { de: "Nur für Kurse vor Ort", vi: "Chỉ khóa trực tiếp" },
          { de: "Für den ersten Kurs bei uns, wenn er online ist", vi: "Khóa đầu tiên tại trung tâm, nếu học online" }
        ],
        correct: 3
      },
      {
        question_de: "Wie viel bekommt jemand zurück, der nach den zwei Probestunden nicht zufrieden ist?",
        question_vi: "Học viên không hài lòng sau hai buổi học thử được hoàn bao nhiêu?",
        section: "was-wir-zusagen",
        options: [
          { de: "50 %", vi: "50 %" },
          { de: "Alles außer den zwei Stunden", vi: "Toàn bộ trừ hai buổi" },
          { de: "Nichts, er bekommt einen Gutschein", vi: "Không, chỉ nhận phiếu học" },
          { de: "100 % – auch für die zwei besuchten Stunden", vi: "100 % – kể cả hai buổi đã học" }
        ],
        correct: 3
      },
      {
        question_de: "Wie viele Schüler braucht eine Online-Klasse mindestens?",
        question_vi: "Lớp online cần tối thiểu bao nhiêu học viên?",
        section: "was-wir-zusagen",
        options: [
          { de: "8", vi: "8" },
          { de: "3", vi: "3" },
          { de: "5", vi: "5" },
          { de: "10", vi: "10" }
        ],
        correct: 2
      },
      {
        question_de: "Jemand will nach den Probestunden aufhören. Was machst du zuerst?",
        question_vi: "Có người muốn dừng sau buổi học thử. Bạn làm gì trước?",
        section: "wenn-jemand-nach-den-probestunden-aufhoren-will",
        options: [
          { de: "So lange überreden, bis die Person bleibt", vi: "Thuyết phục đến khi khách ở lại" },
          { de: "Danken und fragen, was nicht gepasst hat – nicht überreden", vi: "Cảm ơn và hỏi điều gì chưa phù hợp – không thuyết phục ép" },
          { de: "Sofort ohne Frage überweisen", vi: "Chuyển tiền ngay không hỏi gì" },
          { de: "Sagen, dass die Zusage nicht gilt", vi: "Nói cam kết không áp dụng" }
        ],
        correct: 1
      },
      {
        question_de: "Wann ist eine Rückzahlung erledigt?",
        question_vi: "Khi nào việc hoàn tiền được coi là xong?",
        section: "wenn-jemand-nach-den-probestunden-aufhoren-will",
        options: [
          { de: "Wenn die Person bestätigt hat, dass das Geld da ist", vi: "Khi khách xác nhận đã nhận tiền" },
          { de: "Wenn ich es der Leitung gemeldet habe", vi: "Khi đã báo quản lý" },
          { de: "Wenn die Leitung überwiesen hat", vi: "Khi quản lý đã chuyển khoản" },
          { de: "Nach einer Woche", vi: "Sau một tuần" }
        ],
        correct: 0
      }
    ]
  }
};

export default page;
