import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "website-posts-und-werbung",
  title_de: "Website, Posts & Werbung",
  title_vi: "Website, bài đăng & quảng cáo",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Seit dem 26.09.2026 gibt es eine neue Website. Die Klassen dort kommen direkt aus Notion – was in Notion falsch steht, sieht jeder Kunde. Und jede neue Klasse braucht Posts und Anzeigen, damit sie voll wird.",
      vi: "Từ 26/09/2026 trung tâm có website mới. Lịch các lớp trên website lấy trực tiếp từ Notion – Notion ghi sai thì khách nào cũng thấy. Và mỗi lớp mới cần bài đăng và quảng cáo để tuyển đủ học viên."
    },
    { type: "heading", de: "Notion: Klassen pflegen", vi: "Notion: cập nhật các lớp" },
    {
      type: "list",
      items: [
        { de: "Aktive Klassen regelmäßig prüfen. Abgesagte Klassen ins Archiv verschieben – sonst stehen sie weiter auf der Website.", vi: "Luôn kiểm tra các lớp đang hoạt động. Lớp nào bị huỷ thì chuyển vào Archive, nếu không lớp đó vẫn hiện trên website." },
        { de: "Das Canva-Bild der Klasse hinzufügen.", vi: "Thêm hình Canva của lớp." },
        { de: "Start- und Endzeit vollständig eintragen.", vi: "Điền đầy đủ giờ bắt đầu và giờ kết thúc." },
        { de: "Klassennamen immer im gleichen Format schreiben.", vi: "Luôn dùng cùng một định dạng khi đặt tên lớp." },
        { de: "Ort immer angeben: Saigon, Hanoi, Online Deutschland oder Online Vietnam.", vi: "Luôn ghi rõ địa điểm: Saigon, Hanoi, Online Đức hoặc Online Vietnam." }
      ]
    },
    { type: "heading", de: "Website-Formular", vi: "Form đăng ký trên website" },
    {
      type: "list",
      items: [
        { de: "Alle Formulare der Website landen im Slack-Kanal #website-form, nicht mehr per E-Mail. Den Kanal jeden Tag prüfen.", vi: "Tất cả form đăng ký trên website được gửi vào kênh Slack #website-form thay vì email. Kiểm tra kênh này mỗi ngày." },
        { de: "Nach dem Kontakt mit der Person ✅ an die Nachricht setzen.", vi: "Thả ✅ sau khi đã liên hệ với khách hàng." },
        { de: "Die App NaNu Go ist auch auf der Website erklärt. Probiere sie selbst aus, damit du sicher beraten kannst – sie ist noch im Aufbau (siehe „FAQ App“).", vi: "App NaNu Go cũng được giới thiệu trên website. Hãy tự dùng thử để tư vấn tự tin – app vẫn đang hoàn thiện (xem „FAQ App“)." }
      ]
    },
    { type: "heading", de: "Posts und Storys", vi: "Bài đăng và story" },
    {
      type: "list",
      items: [
        { de: "Posts spätestens um 18:30 Uhr veröffentlichen. Ein Post um 22 Uhr wird kaum noch gelesen.", vi: "Bài đăng phải lên muộn nhất 18:30. Đăng lúc 22 giờ thì gần như không ai đọc." },
        { de: "Nach dem Posten prüfen: Ist der Post richtig erschienen, nicht doppelt, mit Bild?", vi: "Đăng xong phải kiểm tra lại: bài đã lên đúng chưa, có bị đăng 2 lần không, có hình không?" },
        { de: "Klassen-Posts für Saigon und Hanoi: Klassenname und Ort aufs Bild, danach auch in Zalo posten – mit Kontaktinfos des Zentrums und „Wer sich anmelden möchte …“.", vi: "Bài tuyển sinh lớp ở SG, HN: để tên lớp và địa điểm trên ảnh, sau đó đăng cả Zalo – kèm thông tin trung tâm và „Nếu các bạn muốn đăng ký học thì …“." },
        { de: "Visum-Erfolge und Geschichten von Teilnehmenden posten wir in das Album „Visa“. Persönlich und ehrlich schreiben.", vi: "Bài chúc mừng visa và hành trình học viên đăng vào album „Visa“. Viết chân thật, có nét riêng của từng bạn." },
        { de: "Kommentare unter Posts immer beantworten. Kommentare auf Deutsch als Text in Slack kopieren, damit eine Antwort geschrieben werden kann.", vi: "Bình luận dưới bài đăng bắt buộc phải trả lời. Bình luận bằng tiếng Đức thì copy nguyên văn vào Slack để có người viết câu trả lời." }
      ]
    },
    { type: "heading", de: "Werbung und Rekrutierung", vi: "Quảng cáo và tuyển sinh" },
    {
      type: "list",
      items: [
        { de: "Anzeige gewünscht: den Link zum Post in Slack an Marketing schicken, mit Klasse und Ort („Lớp A1 – HN“). Soll eine Anzeige gestoppt werden, ebenfalls Bescheid geben.", vi: "Cần chạy quảng cáo: gửi link bài đăng lên Slack cho Marketing, kèm lớp và địa điểm („Lớp A1 – HN“). Muốn dừng quảng cáo bài nào cũng báo lại." },
        { de: "Vor dem Bewerben einer Klasse im Slack-Kanal nach „khoan tuyển“ (Pause) suchen. Im September und Oktober wurde z. B. die Rekrutierung für K06 und K05 gestoppt.", vi: "Trước khi tuyển sinh một lớp, xem trên Slack có thông báo „khoan tuyển“ không. Tháng 9 và 10, ví dụ, lớp K06 và K05 đã tạm dừng tuyển." },
        { de: "Ist eine Klasse dringend zu füllen, steht das im Kanal – dann aktiv bewerben und frühere Kontakte anschreiben.", vi: "Lớp nào cần tuyển gấp sẽ được báo trên kênh – khi đó chủ động đăng bài và nhắn lại các khách đã hỏi trước đây." }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Gute Werbung zeigt den Unterricht: Ein kurzer Ausschnitt aus einem Sprechkurs zeigt Interessierten, wie wir unterrichten – besser als jede Beschreibung.",
      vi: "Quảng cáo tốt là cho thấy lớp học: một video ngắn từ lớp luyện nói giúp khách thấy phương pháp dạy của trung tâm – tốt hơn mọi lời mô tả."
    }
  ]
};

export default page;
