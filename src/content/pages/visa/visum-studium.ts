import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "visum-studium",
  title_de: "Visum zum Studium",
  title_vi: "Visa du học đại học",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-28",
  body: [
    {
      type: "callout",
      tone: "info",
      de: "Entwurf: Sperrkonto-Betrag folgt. Unterlagen, Antrag, Gebühren und Bearbeitungszeit stammen vom Merkblatt der Deutschen Botschaft Hanoi (Stand Oktober 2026). Vor jeder Beratung kurz auf der Botschaftsseite prüfen, ob sich etwas geändert hat.",
      vi: "Bản nháp: số tiền tài khoản phong tỏa sẽ được bổ sung. Hồ sơ, cách nộp, lệ phí và thời gian xét duyệt lấy từ trang thông tin của Đại sứ quán Đức tại Hà Nội (tháng 10/2026). Trước mỗi buổi tư vấn nên kiểm tra lại trang Đại sứ quán xem có thay đổi gì không."
    },
    {
      type: "link",
      url: "https://vietnam.diplo.de/vn-de/service/-/2306542",
      de: "Deutsche Botschaft Hanoi: Visum für ein Studium",
      vi: "Đại sứ quán Đức tại Hà Nội: Visa du học"
    },
    { type: "heading", de: "Der Weg zum Visum", vi: "Các bước đến visa" },
    {
      type: "steps",
      items: [
        { de: "Deutsch bis mindestens B1", vi: "Học tiếng Đức tối thiểu B1" },
        { de: "APS-Prüfung der Unterlagen", vi: "Thẩm tra hồ sơ APS", body_de: "Kommt zuerst. Für einen Start im September beginnen wir Anfang des Jahres.", body_vi: "Làm đầu tiên. Muốn nhập học tháng 9 thì bắt đầu từ đầu năm." },
        { de: "TestAS (falls nötig)", vi: "TestAS (nếu cần)", body_de: "Eignungstest, kein Bestehen oder Durchfallen, ca. 4 Stunden, auch auf Englisch.", body_vi: "Bài đánh giá năng lực, không có đậu hay trượt, khoảng 4 tiếng, có thể thi bằng tiếng Anh." },
        { de: "Zulassung Studienkolleg oder Hochschule", vi: "Nhận thư mời dự bị hoặc đại học", body_de: "Ob die Zulassung schon da ist, entscheidet, welches Visum beantragt wird (siehe „Mit Zulassung oder ohne Zulassung“).", body_vi: "Đã có thư mời nhập học hay chưa sẽ quyết định xin loại visa nào (xem phần „Có thư mời hay chưa có thư mời“)." },
        { de: "Finanzierungsnachweis (Sperrkonto)", vi: "Chứng minh tài chính (tài khoản phong tỏa)", body_de: "[ERGÄNZEN: aktueller Betrag pro Jahr, Anbieter, wie wir helfen]", body_vi: "[ERGÄNZEN: số tiền hiện hành mỗi năm, nhà cung cấp, cách trung tâm hỗ trợ]" },
        { de: "Krankenversicherung", vi: "Bảo hiểm y tế", body_de: "Muss ab dem gewünschten Einreisedatum gelten, auch wenn man schon vor Semesterbeginn einreist.", body_vi: "Phải có hiệu lực từ ngày muốn nhập cảnh, kể cả khi sang Đức trước ngày bắt đầu học kỳ." },
        { de: "Visumantrag über das Auslandsportal", vi: "Nộp visa qua Auslandsportal", body_de: "Unterlagen hochladen, VFS-Servicegebühr bezahlen, nach der Vorprüfung Termin bei VFS buchen (Originale abgeben, Fingerabdrücke und Foto). Details unten.", body_vi: "Tải hồ sơ lên, đóng phí dịch vụ VFS, sau khi được kiểm tra sơ bộ thì đặt lịch hẹn ở VFS (nộp bản gốc, lấy vân tay và ảnh). Chi tiết bên dưới." },
        { de: "Nach der Einreise: Anmeldung und Aufenthaltstitel", vi: "Sau khi nhập cảnh: đăng ký cư trú và thẻ cư trú", body_de: "Spätestens zwei Wochen nach dem Einzug beim Einwohnermelde- oder Bürgeramt anmelden. Danach bei der Ausländerbehörde am Wohnort den Aufenthaltstitel beantragen.", body_vi: "Chậm nhất 2 tuần sau khi dọn vào nhà phải đăng ký cư trú (Anmeldung) ở Bürgeramt. Sau đó xin thẻ cư trú (Aufenthaltstitel) ở Sở Ngoại kiều (Ausländerbehörde) nơi ở." }
      ]
    },
    { type: "heading", de: "Mit Zulassung oder ohne Zulassung", vi: "Có thư mời hay chưa có thư mời" },
    {
      type: "paragraph",
      de: "Die Botschaft unterscheidet zwei Fälle. Beide werden gleich beantragt (Auslandsportal und VFS), nur einzelne Unterlagen sind verschieden.",
      vi: "Đại sứ quán chia làm hai trường hợp. Cả hai đều nộp giống nhau (Auslandsportal và VFS), chỉ khác một vài giấy tờ."
    },
    { type: "heading", de: "Fall 1: Mit Zulassung (Visum zum Studium)", vi: "Trường hợp 1: Đã có thư mời (visa du học)" },
    {
      type: "paragraph",
      de: "Die Hochschule oder das Studienkolleg hat schon einen Zulassungsbescheid geschickt.",
      vi: "Trường đại học hoặc trường dự bị đã gửi thư mời nhập học (Zulassungsbescheid)."
    },
    {
      type: "list",
      items: [{ de: "Zusätzlich nötig: Zulassungsbescheid der Hochschule oder des Studienkollegs", vi: "Cần thêm: thư mời nhập học của trường đại học hoặc dự bị" }]
    },
    { type: "heading", de: "Fall 2: Ohne Zulassung (Studienbewerber-Visum)", vi: "Trường hợp 2: Chưa có thư mời (visa xin học)" },
    {
      type: "paragraph",
      de: "Es gibt noch keine Zulassung, weil zuerst die Aufnahmeprüfung eines Studienkollegs bestanden werden muss. Dann gilt man als Studienbewerber und darf mit dem Studienbewerber-Visum bis zu neun Monate in Deutschland bleiben, um einen Studienplatz zu finden.",
      vi: "Chưa có thư mời vì phải thi đậu kỳ thi đầu vào dự bị đại học (Studienkolleg) trước. Khi đó được xem là người xin học (Studienbewerber) và với visa xin học có thể ở Đức tối đa 9 tháng để tìm chỗ học."
    },
    {
      type: "list",
      items: [
        { de: "Zusätzlich nötig: Einladung zur Aufnahmeprüfung des Studienkollegs", vi: "Cần thêm: thư mời dự thi đầu vào của trường dự bị" },
        { de: "Zusätzlich nötig: TestAS", vi: "Cần thêm: TestAS" }
      ]
    },
    { type: "heading", de: "Unterlagen für beide Fälle", vi: "Hồ sơ chung cho cả hai trường hợp" },
    {
      type: "paragraph",
      de: "Das Auslandsportal zeigt an, welche Unterlagen zusätzlich im Original mitgebracht werden müssen.",
      vi: "Auslandsportal sẽ báo những giấy tờ nào phải mang bản gốc đến."
    },
    {
      type: "list",
      items: [
        { de: "Gültiger Reisepass", vi: "Hộ chiếu còn hạn" },
        { de: "Hochschulzugangsberechtigung (Schulabschluss, ggf. Studiennachweise)", vi: "Bằng cấp đủ điều kiện vào đại học (bằng tốt nghiệp THPT, nếu có thì giấy tờ đại học)" },
        { de: "APS-Zertifikat", vi: "Chứng chỉ APS" },
        { de: "Nachweis der Sprachkenntnisse", vi: "Chứng chỉ ngoại ngữ" },
        { de: "Lebenslauf", vi: "Sơ yếu lý lịch (CV)" },
        { de: "Motivationsschreiben", vi: "Thư động lực" },
        { de: "Finanzierungsnachweis, in der Regel Sperrkonto", vi: "Chứng minh tài chính, thường là tài khoản phong tỏa" },
        { de: "Nachweis der Krankenversicherung", vi: "Giấy tờ bảo hiểm y tế" }
      ]
    },
    { type: "heading", de: "Antrag über Auslandsportal und VFS", vi: "Nộp hồ sơ qua Auslandsportal và VFS" },
    {
      type: "steps",
      items: [
        { de: "Unterlagen im Auslandsportal hochladen", vi: "Tải hồ sơ lên Auslandsportal", body_de: "Im VIDEX-Antragsformular gleich das gewünschte Einreisedatum angeben (höchstens eine Woche vor Semesterbeginn). Nach Erhalt des Visums lässt sich die Gültigkeit nicht mehr ändern.", body_vi: "Trong đơn VIDEX điền luôn ngày muốn nhập cảnh (sớm nhất 1 tuần trước khi học kỳ bắt đầu). Sau khi nhận visa thì không đổi được thời hạn nữa." },
        { de: "VFS-Servicegebühr bezahlen", vi: "Đóng phí dịch vụ VFS", body_de: "Nach dem vollständigen Hochladen leitet das Portal zur VFS-Seite weiter. Die Zahlungsbestätigung wird ebenfalls hochgeladen.", body_vi: "Tải đủ hồ sơ xong, cổng sẽ chuyển sang trang VFS để đóng phí. Biên lai đóng phí cũng phải tải lên." },
        { de: "Vorprüfung abwarten", vi: "Chờ kiểm tra sơ bộ", body_de: "Das Portal meldet zurück, ob die Unterlagen vollständig sind.", body_vi: "Cổng sẽ báo hồ sơ đã đầy đủ hay chưa." },
        { de: "Termin bei VFS", vi: "Lịch hẹn ở VFS", body_de: "Nach erfolgreicher Vorprüfung leitet das Portal zur Terminbuchung weiter. Beim Termin: Originale abgeben, Fingerabdrücke und Foto. Über VFS lässt sich der Antrag danach online verfolgen (Tracking).", body_vi: "Kiểm tra sơ bộ đạt thì cổng chuyển sang trang đặt lịch. Đến hẹn: nộp bản gốc, lấy vân tay và chụp ảnh. Sau đó theo dõi hồ sơ online qua VFS (tracking)." }
      ]
    },
    { type: "heading", de: "Gebühren und Bearbeitungszeit", vi: "Lệ phí và thời gian xét duyệt" },
    {
      type: "list",
      items: [
        { de: "Visumgebühr: 75 Euro (unter 18 Jahren 37,50 Euro), bezahlt in Dong. Dazu kommt die VFS-Servicegebühr.", vi: "Lệ phí visa: 75 Euro (dưới 18 tuổi 37,50 Euro), đóng bằng tiền Việt. Cộng thêm phí dịch vụ VFS." },
        { de: "Bearbeitungszeit meist ca. zwölf Wochen, kurz vor Semesterbeginn oft deutlich länger. Deshalb früh beantragen.", vi: "Thời gian xét duyệt thường khoảng 12 tuần, sát ngày nhập học thường lâu hơn nhiều. Vì vậy nên nộp sớm." },
        { de: "In den ersten drei Monaten keine Nachfragen zum Stand an die Visastelle schicken: Sie werden nicht beantwortet.", vi: "Trong 3 tháng đầu không gửi hỏi tình trạng hồ sơ cho phòng visa: họ sẽ không trả lời." }
      ]
    },
    { type: "heading", de: "Häufige Fragen der Familien", vi: "Câu hỏi phụ huynh hay hỏi" },
    {
      type: "list",
      items: [
        { de: "„Kann die Familie den Finanzierungsnachweis übernehmen und die Lebenskosten teilweise?“ – Ja, das ist der übliche Weg. [ERGÄNZEN: Details]", vi: "„Gia đình lo chứng minh tài chính và một phần sinh hoạt phí được không?“ – Được, đây là cách thông thường. [ERGÄNZEN: chi tiết]" },
        { de: "„Was, wenn das erste Studienjahr in Vietnam nicht ganz glatt war?“ – Entscheidend ist die Bestätigung der Uni, dass das Jahr abgeschlossen ist.", vi: "„Năm nhất ở Việt Nam trượt môn thì sao?“ – Quan trọng là trường xác nhận đã hoàn thành năm nhất." },
        { de: "„Wie lange dauert das Visum?“ – Meist ca. zwölf Wochen ab Antrag, manchmal länger. Wer im September beginnt, sollte spätestens im Frühsommer beantragen.", vi: "„Visa mất bao lâu?“ – Thường khoảng 12 tuần từ lúc nộp, có khi lâu hơn. Nhập học tháng 9 thì nên nộp chậm nhất vào đầu hè." },
        { de: "„Kann mein Kind früher einreisen, um sich einzugewöhnen?“ – Ja, das Visum kann meist bis zu eine Woche vor Semesterbeginn gelten. Das Datum muss schon im Antrag stehen.", vi: "„Con có sang sớm để làm quen được không?“ – Được, visa thường có hiệu lực sớm nhất 1 tuần trước khi học kỳ bắt đầu. Ngày này phải ghi ngay trong đơn." }
      ]
    }
  ]
};

export default page;
