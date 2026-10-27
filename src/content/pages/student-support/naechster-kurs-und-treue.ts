import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "naechster-kurs-und-treue",
  title_de: "Nächster Kurs, Treuerabatt & Bewertungen",
  title_vi: "Khoá tiếp theo, ưu đãi học viên cũ & đánh giá",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Die beste Anmeldung ist die zweite: Die Person kennt uns schon. Im Oktober haben Teilnehmende selbst nach dem nächsten Kurs gefragt – wir sollten ihnen zuvorkommen.",
      vi: "Lần đăng ký tốt nhất là lần thứ hai: học viên đã biết mình rồi. Tháng 10, chính học viên phải tự hỏi về khoá tiếp theo – lẽ ra mình nên chủ động trước."
    },
    { type: "heading", de: "Den nächsten Kurs planen", vi: "Lên kế hoạch khoá tiếp theo" },
    {
      type: "list",
      items: [
        {
          de: "Fristen notieren: Viele brauchen ein Zertifikat bis zu einem festen Datum, etwa für die Verlängerung des Aufenthalts, und wollen wissen, ob die nächste Stufe direkt anschließt. Solche Fristen in die Teilnehmendenliste schreiben und den Weg bis zum Ziel mit Daten planen.",
          vi: "Ghi lại hạn chót: nhiều học viên cần chứng chỉ trước một ngày cố định, ví dụ để gia hạn cư trú, và muốn biết học xong có lên lớp tiếp ngay không. Ghi các mốc này vào danh sách học viên và lên lộ trình có ngày cụ thể."
        },
        {
          de: "Vor Ende jeder Stufe die Folgeklasse öffnen und der Klasse ankündigen – mit Starttermin, Uhrzeit und Preis.",
          vi: "Trước khi kết thúc mỗi trình độ, mở lớp tiếp theo và thông báo cho lớp – kèm ngày khai giảng, giờ học và học phí."
        },
        {
          de: "Klassenwechsel (z. B. Umzug von Vietnam nach Deutschland): nur an einer Stufengrenze wechseln – A1.1 → A1.2 oder A1 → A2 –, weil jede Klasse ein eigenes Tempo hat.",
          vi: "Đổi lớp (ví dụ chuyển từ Việt Nam sang Đức): chỉ đổi khi chuyển trình độ – A1.1 → A1.2 hoặc A1 → A2 – vì mỗi lớp có tiến độ riêng."
        }
      ]
    },
    { type: "heading", de: "Treuerabatt: von selbst anbieten", vi: "Ưu đãi học viên cũ: chủ động nói trước" },
    {
      type: "paragraph",
      de: "Bestandskunden fragen oft selbst nach einem Rabatt – und ärgern sich zu Recht, wenn sie erfahren, dass es ihn schon beim letzten Kurs gegeben hätte. Ein Vorteil, den man erst auf Nachfrage bekommt, fühlt sich nicht wie Wertschätzung an.",
      vi: "Học viên cũ thường phải tự hỏi có ưu đãi không – và không vui khi biết khoá trước lẽ ra đã được giảm. Quyền lợi mà phải hỏi mới có thì không còn là sự trân trọng."
    },
    {
      type: "callout",
      tone: "warning",
      de: "Jedes Angebot an Bestandskunden beginnt mit dem Treuerabatt. Aktuelle Höhe bei der Leitung erfragen (im Oktober: 500.000 VND zusätzlich) – und nie verschweigen.",
      vi: "Mọi báo giá cho học viên cũ đều bắt đầu bằng ưu đãi học viên cũ. Hỏi quản lý mức hiện tại (tháng 10: giảm thêm 500.000 VND) – và không bao giờ giấu."
    },
    {
      type: "template",
      label_de: "Vorlage · Folgekurs anbieten",
      label_vi: "Mẫu · Mời học khoá tiếp theo",
      text: "Hallo [tên]! Lớp mình sắp học xong [A1] rồi 🎉 Trung tâm mở lớp [A2] tiếp nối, khai giảng [ngày], học [giờ] – vẫn cùng nhịp với lớp mình.\nVì [bạn] là học viên của NaNu, học phí được giảm thêm [số tiền] ạ: [học phí] → [học phí sau ưu đãi].\n[Bạn] muốn trung tâm giữ chỗ cho mình không ạ?",
      translation_de: "„Hallo [Name]! Unsere Klasse ist bald mit [A1] fertig 🎉 Die Anschlussklasse [A2] startet am [Datum], um [Uhrzeit] – im gleichen Rhythmus. Weil du schon bei NaNu lernst, bekommst du [Betrag] Rabatt: [Preis] → [Preis nach Rabatt]. Sollen wir dir einen Platz reservieren?“"
    },
    { type: "heading", de: "Bewertungen & Empfehlungen", vi: "Đánh giá & giới thiệu" },
    {
      type: "list",
      items: [
        {
          de: "Den richtigen Moment wählen: nach einem gelösten Problem, einem guten Test oder am Ende einer Stufe – nicht mitten in einer Woche voller Login-Probleme.",
          vi: "Chọn đúng lúc: sau khi vừa giải quyết xong vướng mắc, sau một bài kiểm tra tốt hoặc khi kết thúc một trình độ – không phải giữa tuần học viên đang vật lộn với đăng nhập."
        },
        {
          de: "Auf den Empfehlungsrabatt hinweisen. Manche Teilnehmende haben selbst eine Community, etwa auf Social Media, und empfehlen uns gern weiter, wenn sie zufrieden sind.",
          vi: "Nhắc về ưu đãi khi giới thiệu bạn bè. Có học viên có cộng đồng riêng, ví dụ trên mạng xã hội, và sẵn lòng giới thiệu khi hài lòng."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Bitte um Bewertung",
      label_vi: "Mẫu · Xin đánh giá",
      text: "Dạ [chị/anh/bạn] ơi, [chị/anh/bạn] dành chút thời gian cho trung tâm xin đánh giá 5 sao trên Fanpage Facebook và Google, chia sẻ một chút về trải nghiệm học tại NaNu, giáo viên và chương trình học giúp trung tâm nhé 🥰\nFanpage Facebook: https://www.facebook.com/nanunanaduhocduc/reviews\nGoogle Sài Gòn: https://g.page/r/CaXvJRnABxzxEAI/review\nCảm ơn [chị/anh/bạn] nhiều vì đã đồng hành cùng NaNu ạ! ❤️",
      translation_de: "„Hättest du kurz Zeit für eine 5-Sterne-Bewertung auf Facebook und Google – ein paar Sätze zu deinen Erfahrungen bei NaNu, den Lehrkräften und dem Kurs? Danke, dass du mit NaNu lernst! ❤️“"
    }
  ]
};

export default page;
