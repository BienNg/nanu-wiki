import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "material-verschicken",
  title_de: "Material an neue Studierende schicken",
  title_vi: "Gửi tài liệu cho học viên mới",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Sobald die Zahlung da ist, bekommt die Person ihr Material – auch wenn der Kurs erst in ein paar Wochen startet. So kann sie vorher reinschauen und fühlt sich gleich dazugehörig.",
      vi: "Ngay khi nhận được học phí, học viên nhận tài liệu – kể cả khi vài tuần nữa mới khai giảng. Nhờ vậy học viên xem trước được và cảm thấy mình đã là một phần của lớp."
    },
    {
      type: "steps",
      items: [
        { de: "Beleg, E-Mail und Zalo-Nummer anfordern", vi: "Xin biên lai, email và số Zalo", body_de: "Steht schon in der Zahlungsnachricht. Fehlt etwas, freundlich nachfragen.", body_vi: "Đã có trong tin nhắn thông tin chuyển khoản. Thiếu gì thì hỏi lại nhẹ nhàng." },
        { de: "PDF-Paket per E-Mail schicken", vi: "Gửi bộ PDF qua email", body_de: "Danach im Chat Bescheid geben und bitten, den Eingang zu bestätigen.", body_vi: "Sau đó báo trong chat và nhờ học viên xác nhận đã nhận." },
        { de: "In die Zalo-Klassengruppe aufnehmen", vi: "Thêm vào nhóm lớp Zalo", body_de: "Dort kommen Zoom-Link, Classroom-Link, Hausaufgaben und alle Neuigkeiten.", body_vi: "Ở đó có link Zoom, link Classroom, bài tập về nhà và mọi thông báo." },
        { de: "Postadresse für das Handbuch erfragen", vi: "Hỏi địa chỉ để gửi sách Handbuch", body_de: "[ERGÄNZEN: wer verschickt, wie lange dauert es, auch nach Deutschland?]", body_vi: "[ERGÄNZEN: ai gửi, mất bao lâu, có gửi sang Đức không?]" },
        { de: "App-Zugang freischalten", vi: "Mở quyền vào app", body_de: "Mit der E-Mail, die die Person uns gegeben hat. [ERGÄNZEN: wer schaltet frei?]", body_vi: "Bằng email học viên đã gửi trung tâm. [ERGÄNZEN: ai mở quyền?]" }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Material ist unterwegs",
      label_vi: "Mẫu · Đã gửi tài liệu",
      text: "Dạ trung tâm vừa gửi tài liệu khoá học qua email cho bạn rồi ạ, bạn kiểm tra mail giúp trung tâm nha. Bạn cũng theo dõi nhóm lớp trên Zalo nhé, trung tâm sẽ cập nhật thông tin lớp và đường link vào lớp học trong nhóm ạ.",
      translation_de: "„Wir haben dir das Kursmaterial gerade per E-Mail geschickt, schau bitte nach. Folge auch der Zalo-Gruppe der Klasse – dort kommen alle Infos und der Link zum Unterricht.“"
    },
    {
      type: "callout",
      tone: "tip",
      de: "Datei zu groß für Messenger? Im Messenger einen Link schicken oder die Datei über Zalo – Zalo erlaubt große Dateien.",
      vi: "File quá lớn không gửi qua Messenger được? Gửi link trên Messenger hoặc gửi file qua Zalo – Zalo cho gửi file lớn."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Material geht nur an zahlende Studierende. Links zu unseren Dateien nie öffentlich posten.",
      vi: "Tài liệu chỉ gửi cho học viên đã đóng học phí. Không bao giờ đăng công khai link tài liệu của trung tâm."
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Wann bekommt eine neue Studentin ihr Material?",
        question_vi: "Khi nào học viên mới nhận tài liệu?",
        options: [
          { de: "Sobald die Zahlung da ist – auch wenn der Kurs erst in ein paar Wochen startet", vi: "Ngay khi đã thanh toán – kể cả khi vài tuần nữa mới khai giảng" },
          { de: "Am ersten Kurstag", vi: "Vào buổi học đầu tiên" },
          { de: "Nach der ersten Woche, wenn sie geblieben ist", vi: "Sau tuần đầu, nếu bạn ấy vẫn học" },
          { de: "Wenn sie danach fragt", vi: "Khi bạn ấy hỏi" }
        ],
        correct: 0
      },
      {
        question_de: "Wie schickst du das PDF-Paket?",
        question_vi: "Bạn gửi gói PDF bằng cách nào?",
        options: [
          { de: "Per E-Mail, danach im Chat Bescheid geben und um Bestätigung bitten", vi: "Qua email, sau đó báo trong chat và nhờ xác nhận đã nhận" },
          { de: "Als öffentlicher Link auf Facebook", vi: "Đăng link công khai trên Facebook" },
          { de: "Gar nicht, die Lehrkraft verteilt es im Unterricht", vi: "Không gửi, giáo viên phát trong lớp" },
          { de: "Nur per Post", vi: "Chỉ gửi qua bưu điện" }
        ],
        correct: 0
      },
      {
        question_de: "Was bekommt die Person über die Zalo-Klassengruppe?",
        question_vi: "Học viên nhận được gì qua nhóm Zalo của lớp?",
        options: [
          { de: "Nur die Rechnung", vi: "Chỉ hóa đơn" },
          { de: "Nichts, die Gruppe ist nur zum Plaudern", vi: "Không gì, nhóm chỉ để trò chuyện" },
          { de: "Nur die Prüfungstermine", vi: "Chỉ lịch thi" },
          { de: "Zoom-Link, Classroom-Link, Hausaufgaben und alle Neuigkeiten", vi: "Link Zoom, link Classroom, bài tập về nhà và mọi thông báo" }
        ],
        correct: 3
      },
      {
        question_de: "Die Datei ist zu groß für Messenger. Was machst du?",
        question_vi: "File quá nặng để gửi qua Messenger. Bạn làm gì?",
        options: [
          { de: "Einen Link in Messenger schicken oder die Datei über Zalo senden", vi: "Gửi link qua Messenger hoặc gửi file qua Zalo" },
          { de: "Die Datei in viele kleine Teile schneiden", vi: "Cắt file thành nhiều phần nhỏ" },
          { de: "Den Link öffentlich auf der Facebook-Seite posten", vi: "Đăng link công khai trên trang Facebook" },
          { de: "Nicht schicken, die Person soll warten", vi: "Không gửi, bảo học viên chờ" }
        ],
        correct: 0
      }
    ]
  }
};

export default page;
