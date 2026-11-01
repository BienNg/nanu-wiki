import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "anmeldung-und-zahlung",
  title_de: "Vormerken, Zahlung & Rechnung",
  title_vi: "Ghi danh trước, đóng học phí & hoá đơn",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Rund um die Zahlung kommen jeden Tag dieselben Fragen: Kann ich mich schon anmelden und später zahlen? Kann ich in Euro zahlen? Was braucht ihr von mir? Hier stehen die Antworten. Was danach passiert, steht in „[Nach der Zahlung](student-support/nach-der-zahlung)“.",
      vi: "Quanh việc đóng học phí, ngày nào cũng có những câu hỏi giống nhau: em đăng ký trước rồi đóng sau được không? Em đóng bằng Euro được không? Trung tâm cần thông tin gì? Câu trả lời ở đây. Bước tiếp theo xem trang „[Sau khi khách chuyển khoản](student-support/nach-der-zahlung)“."
    },
    { type: "heading", de: "Vormerken ohne Zahlung", vi: "Ghi danh trước, chưa cần đóng tiền" },
    {
      type: "list",
      items: [
        {
          de: "Hat der Kurs noch nicht begonnen, kann sich die Person schon anmelden, ohne gleich zu zahlen. Name, Telefon und E-Mail notieren.",
          vi: "Nếu khoá học chưa bắt đầu, học viên có thể đăng ký trước mà chưa cần đóng tiền ngay. Ghi lại họ tên, SĐT và email."
        },
        {
          de: "Wir merken die Person etwa 1–2 Wochen vor. Das ist kein fester Platz: Zahlt jemand anderes vorher, bekommt diese Person den Platz.",
          vi: "Trung tâm giữ đăng ký khoảng 1–2 tuần. Đây không phải giữ chỗ chắc chắn: ai hoàn tất học phí trước sẽ được ưu tiên xếp chỗ."
        },
        {
          de: "Ist die Klasse voll, bevor die Person zahlt: offen sagen und die nächste passende Klasse anbieten.",
          vi: "Nếu lớp đủ chỗ trước khi học viên đóng tiền: nói rõ và đề xuất lớp phù hợp tiếp theo."
        },
        {
          de: "Wir nehmen keine Anzahlung. Wer den Kombipreis halten will, aber nicht alles auf einmal zahlen kann: 50 % der ersten Stufe jetzt, den Rest vor Ende dieser Stufe.",
          vi: "Trung tâm không nhận cọc. Học viên muốn giữ giá combo nhưng chưa đóng đủ một lần: đóng trước 50% trình độ đầu, phần còn lại đóng trước khi trình độ đó kết thúc."
        }
      ]
    },
    {
      type: "callout",
      tone: "info",
      de: "Kurz gesagt: Vormerken geht ohne Geld – einen festen Platz hat nur, wer bezahlt hat.",
      vi: "Tóm lại: có thể ghi danh trước mà chưa cần đóng tiền – nhưng chỉ học viên đã hoàn tất học phí mới được xác nhận chỗ chính thức."
    },
    {
      type: "template",
      label_de: "Vorlage · Vormerkung (auch als Schnellantwort in Zalo)",
      label_vi: "Mẫu · Ghi danh trước (có trong tin nhắn nhanh Zalo)",
      text: "Dạ khoá học chưa bắt đầu nên trung tâm có thể hỗ trợ [tên] ghi danh trước khoảng 1–2 tuần trước ngày khai giảng nha.\nTrong thời gian này, nếu có học viên khác hoàn tất học phí và lớp gần đủ chỗ thì trung tâm sẽ ưu tiên sắp xếp cho các bạn đã hoàn tất học phí trước. Vì vậy em cố gắng hoàn tất học phí sớm để giữ đúng lịch học mình đã chọn nhé.\nNếu lớp đủ chỗ trước khi em hoàn tất học phí, trung tâm sẽ trao đổi và hỗ trợ em sắp xếp lớp phù hợp tiếp theo nên em yên tâm nha 💛\n[Tên] gửi giúp trung tâm thông tin đăng ký (họ tên – số điện thoại – email) nhé. Dự kiến khi nào em có thể sắp xếp học phí để trung tâm ghi danh khoá học cho em ạ?",
      translation_de: "„Da der Kurs noch nicht begonnen hat, können wir dich etwa 1–2 Wochen vor Kursbeginn vormerken. Zahlt in dieser Zeit jemand anderes und die Klasse wird voll, bekommen zuerst die Plätze, die bezahlt haben – zahl also möglichst bald, um deine Uhrzeit zu sichern. Ist die Klasse vorher voll, finden wir mit dir die nächste passende Klasse. Schick uns bitte Name, Telefon und E-Mail. Wann kannst du die Gebühr ungefähr zahlen?“"
    },
    { type: "heading", de: "Was wir nach der Zahlung brauchen", vi: "Thông tin cần xin sau khi đóng học phí" },
    {
      type: "list",
      ordered: true,
      items: [
        { de: "Vollständiger Name", vi: "Họ tên đầy đủ" },
        { de: "E-Mail und Telefonnummer", vi: "Email và số điện thoại" },
        { de: "Adresse", vi: "Địa chỉ" },
        {
          de: "Nummer des Personalausweises (CCCD) – nur die Nummer, kein Foto. Manche haben Angst um ihre Daten; für die Rechnung reicht die Nummer.",
          vi: "Số CCCD – chỉ cần số, không cần chụp căn cước. Một số bạn sợ lộ thông tin cá nhân; để xuất hoá đơn chỉ cần số."
        }
      ]
    },
    {
      type: "list",
      items: [
        {
          de: "Fragt jemand nach dem Firmenkonto: Es steht in den Schnellantworten im Messenger. Nach der Zahlung auf das Firmenkonto der Buchhaltung Bescheid geben, damit die Rechnung ausgestellt wird.",
          vi: "Học viên hỏi số tài khoản công ty: có trong tin nhắn nhanh trên Messenger. Học viên đóng vào tài khoản công ty xong thì nhắc kế toán để xuất hoá đơn."
        },
        {
          de: "Im Messenger-Postfach das Label auf „Kurs“ setzen, sobald die Person bezahlt hat.",
          vi: "Học viên đóng tiền xong thì đổi nhãn trong hộp thư Messenger thành „Kurs“."
        },
        {
          de: "Zahlungen am Wochenende in Slack melden (Name, E-Mail, Telefon, Klasse, Betrag, Beleg). Das Geld wird am nächsten Arbeitstag geprüft – der Person das so sagen, damit sie nicht wartet und nachfragt.",
          vi: "Học viên đóng tiền cuối tuần thì báo lên Slack (tên, email, SĐT, lớp, số tiền, biên lai). Ngày làm việc tiếp theo trung tâm kiểm tra tiền – báo rõ cho học viên để học viên không phải chờ rồi hỏi lại."
        }
      ]
    },
    { type: "heading", de: "Zahlung aus Deutschland in Euro", vi: "Học viên ở Đức đóng bằng Euro" },
    {
      type: "list",
      items: [
        {
          de: "Wer in Deutschland zahlen will, kann das. Wir rechnen 1:1 um – Euro zu kosten nicht mehr als Dong.",
          vi: "Học viên muốn chuyển tiền bên Đức thì vẫn nhận, đổi ngang – đóng Euro không đắt hơn đóng tiền Việt."
        },
        {
          de: "Den Kurs fürs Umrechnen am selben Tag bei der Leitung erfragen. Nicht den Preis aus der Preisdatei nehmen – der gilt für das Umrechnen nicht.",
          vi: "Tỷ giá đổi thì hỏi quản lý ngay trong ngày rồi báo khách. Không lấy giá trong file để báo – giá trong file không áp dụng khi đổi ngang."
        },
        {
          de: "Wo das Geld herkommt, ist egal. Wichtig ist nur, dass die Person nicht verloren geht, weil das Bezahlen kompliziert wirkt.",
          vi: "Khách chuyển tiền từ đâu cũng được. Quan trọng là đừng để mất khách chỉ vì thấy việc đóng tiền phức tạp."
        },
        {
          de: "Wer Unterlagen für die Ausländerbehörde braucht, bekommt sie von uns.",
          vi: "Ai cần giấy tờ cho sở ngoại kiều thì trung tâm cấp được."
        }
      ]
    },
    { type: "heading", de: "Weitere Bitten, die oft kommen", vi: "Các yêu cầu khác hay gặp" },
    {
      type: "list",
      items: [
        {
          de: "Teilnahmebestätigung (für Arbeitgeber, Ausländerbehörde oder die Familie): Name, Geburtsdatum, Kurs und Zeitraum notieren und in Slack weitergeben. Der Person sagen, bis wann sie kommt.",
          vi: "Giấy xác nhận tham gia khoá học (cho nơi làm việc, sở ngoại kiều hay gia đình): ghi họ tên, ngày sinh, khoá học và thời gian rồi chuyển lên Slack. Báo học viên khi nào nhận được."
        },
        {
          de: "Pfand für die Aufzugskarte (Büro Saigon): Wer die Karte zurückgibt, bekommt das Pfand zurück. Kontodaten in Slack melden und nachhalten, bis die Person den Eingang bestätigt – es gab Fälle, die über einen Monat hingen.",
          vi: "Tiền cọc thẻ thang máy (văn phòng Sài Gòn): trả thẻ thì được hoàn cọc. Báo số tài khoản lên Slack và theo dõi đến khi học viên xác nhận đã nhận tiền – đã có trường hợp chờ hơn một tháng."
        }
      ]
    }
  ],
  quiz: {
    version: 1,
    questions: [
      {
        question_de: "Jemand lässt sich vormerken, zahlt aber noch nicht. Hat die Person einen festen Platz?",
        question_vi: "Có người ghi danh trước nhưng chưa đóng tiền. Người đó đã có chỗ chắc chắn chưa?",
        section: "vormerken-ohne-zahlung",
        options: [
          { de: "Ja, für bis zu 12 Monate", vi: "Có, giữ đến 12 tháng" },
          { de: "Ja, wenn sie eine Anzahlung macht", vi: "Có, nếu đặt cọc" },
          { de: "Nein – zahlt jemand anderes vorher, bekommt der den Platz", vi: "Chưa – nếu người khác đóng trước thì người đó được chỗ" },
          { de: "Ja, Vormerken ist dasselbe wie Zahlen", vi: "Có, ghi danh trước cũng như đã đóng tiền" }
        ],
        correct: 2
      },
      {
        question_de: "Jemand will den Kombipreis, kann aber nicht alles auf einmal zahlen. Was geht?",
        question_vi: "Có người muốn giá combo nhưng không trả hết một lần được. Có cách nào?",
        section: "vormerken-ohne-zahlung",
        options: [
          { de: "Eine Anzahlung von 1.000.000 VND", vi: "Đặt cọc 1.000.000 VND" },
          { de: "Monatlich in 12 Raten", vi: "Trả góp 12 tháng" },
          { de: "50 % der ersten Stufe jetzt, den Rest vor Ende dieser Stufe", vi: "Đóng 50 % trình độ đầu bây giờ, phần còn lại trước khi hết trình độ đó" },
          { de: "Gar nichts, der Kombipreis gilt nur bei voller Zahlung sofort", vi: "Không có cách nào, combo chỉ áp dụng khi trả đủ ngay" }
        ],
        correct: 2
      },
      {
        question_de: "Was brauchen wir vom Personalausweis (CCCD) für die Rechnung?",
        question_vi: "Chúng ta cần gì từ CCCD để xuất hóa đơn?",
        section: "was-wir-nach-der-zahlung-brauchen",
        options: [
          { de: "Ein Foto von Vorder- und Rückseite", vi: "Ảnh hai mặt" },
          { de: "Gar nichts", vi: "Không cần gì" },
          { de: "Das Original per Post", vi: "Bản gốc gửi bưu điện" },
          { de: "Nur die Nummer, kein Foto", vi: "Chỉ số CCCD, không cần ảnh" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand zahlt am Samstag. Was machst du?",
        question_vi: "Có người đóng tiền vào thứ Bảy. Bạn làm gì?",
        section: "was-wir-nach-der-zahlung-brauchen",
        options: [
          { de: "Nichts bis Montag", vi: "Không làm gì đến thứ Hai" },
          { de: "Sofort die Rechnung selbst ausstellen", vi: "Tự xuất hóa đơn ngay" },
          { de: "Die Person bitten, am Montag noch einmal zu zahlen", vi: "Nhờ khách đóng lại vào thứ Hai" },
          { de: "In Slack melden und der Person sagen, dass das Geld am nächsten Arbeitstag geprüft wird", vi: "Báo trên Slack và nói với khách là tiền sẽ được kiểm tra vào ngày làm việc tiếp theo" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand in Deutschland will in Euro zahlen. Welchen Umrechnungskurs nimmst du?",
        question_vi: "Khách ở Đức muốn trả bằng Euro. Bạn dùng tỷ giá nào?",
        section: "zahlung-aus-deutschland-in-euro",
        options: [
          { de: "Den Preis aus der Preisdatei", vi: "Giá trong file bảng giá" },
          { de: "Einen festen Kurs von 1 € = 20.000 VND", vi: "Tỷ giá cố định 1 € = 20.000 VND" },
          { de: "Den Kurs, den der Kunde vorschlägt", vi: "Tỷ giá khách đề xuất" },
          { de: "Den Kurs vom selben Tag, den du bei der Leitung erfragst", vi: "Tỷ giá trong ngày, hỏi quản lý" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand braucht eine Teilnahmebestätigung. Was notierst du?",
        question_vi: "Có người cần giấy xác nhận học. Bạn ghi lại gì?",
        section: "weitere-bitten-die-oft-kommen",
        options: [
          { de: "Nur den Namen", vi: "Chỉ tên" },
          { de: "Nichts, das machen wir nicht", vi: "Không làm việc này" },
          { de: "Passfoto und Adresse", vi: "Ảnh thẻ và địa chỉ" },
          { de: "Name, Geburtsdatum, Kurs und Zeitraum – in Slack weitergeben und sagen, bis wann sie kommt", vi: "Tên, ngày sinh, khóa học và thời gian – chuyển trên Slack và báo khi nào có" }
        ],
        correct: 3
      }
    ]
  }
};

export default page;
