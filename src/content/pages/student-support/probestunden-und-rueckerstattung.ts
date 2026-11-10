import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "probestunden-und-rueckerstattung",
  title_de: "Probestunden & Geld-zurück-Zusage",
  title_vi: "Học thử & cam kết hoàn tiền",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-04",
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
          de: "Kursausfall: Eine Online-Klasse startet erst ab 5 Schülern, eine Klasse vor Ort erst ab 8. Das sind dieselben Mindestzahlen wie in „[FAQ Sprachkurse](sales/faq-sprachkurse)“. Kommen sie nicht zusammen, bieten wir eine Alternative an. Wer sie nicht will, bekommt sofort 100 % zurück.",
          vi: "Lớp không mở: lớp online chỉ mở từ 5 học viên, lớp tại trung tâm từ 8. Đây là số tối thiểu giống trang „[FAQ khoá tiếng](sales/faq-sprachkurse)“. Không đủ người thì trung tâm đưa phương án khác. Ai không đồng ý thì được hoàn 100% ngay."
        },
        {
          de: "Der Schüler zahlt den ganzen Kurs, bevor der Kurs startet. Die Geld-zurück-Zusage heißt nicht, dass er erst nach den zwei Stunden zahlen darf. Will jemand nur die zwei Probestunden bezahlen, entscheidet die Leitung. Das darfst du nicht allein zusagen.",
          vi: "Học viên đóng cả khoá trước khi lớp bắt đầu. Cam kết hoàn tiền không có nghĩa là được đóng sau hai buổi. Ai chỉ muốn đóng tiền hai buổi học thử thì quản lý quyết định. Bạn không được tự đồng ý."
        }
      ]
    },
    { type: "heading", de: "Wenn jemand nach den Probestunden aufhören will", vi: "Khi học viên muốn dừng sau buổi học thử" },
    {
      type: "steps",
      items: [
        {
          de: "Danken und eine Frage stellen",
          vi: "Cảm ơn và hỏi một câu",
          body_de: "Bedank dich. Frag nur: „Was hat nicht gepasst?“ Hör zu. Sag nicht „bleib doch“.",
          body_vi: "Cảm ơn học viên. Chỉ hỏi: „Điều gì chưa phù hợp?“ Rồi nghe. Đừng nói „ở lại đi“."
        },
        {
          de: "Genau eine Alternative anbieten",
          vi: "Đưa đúng một phương án khác",
          body_de: "Danach bietest du einmal eine passende Alternative an: eine andere Uhrzeit, eine andere Klasse oder Hilfe bei der Technik. Sagt die Person nein, ist das in Ordnung. Dann geht es weiter mit der Rückzahlung.",
          body_vi: "Sau đó đưa một lần đúng một phương án hợp: giờ khác, lớp khác hoặc giúp phần kỹ thuật. Học viên vẫn từ chối thì cũng được. Lúc đó làm tiếp việc hoàn tiền."
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
    version: 2,
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
          { de: "Danken, nur fragen „Was hat nicht gepasst?“ und zuhören – nicht „bleib doch“ sagen", vi: "Cảm ơn, chỉ hỏi „Điều gì chưa phù hợp?“ rồi nghe – không nói „ở lại đi“" },
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
