import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "pruefungen-begleiten",
  title_de: "Prüfungen & Tests begleiten",
  title_vi: "Đồng hành khi đi thi",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Prüfungen sind der Grund, warum die meisten bei uns lernen – für Visum, Aufenthalt oder Studium. Vor dem Termin kommen viele kleine, aber dringende Fragen. Wer sie schnell beantwortet, nimmt Druck raus.",
      vi: "Thi chứng chỉ là lý do phần lớn học viên học ở mình – để làm visa, gia hạn cư trú hay nhập học. Trước ngày thi có rất nhiều câu hỏi nhỏ nhưng gấp. Trả lời nhanh giúp học viên bớt áp lực."
    },
    { type: "heading", de: "Vor dem Prüfungstag", vi: "Trước ngày thi" },
    {
      type: "list",
      items: [
        { de: "Eine Woche vorher: Datum, Ort, Ankunftszeit, Dauer und was mitzubringen ist – direkt an die Person, nicht nur in die Gruppe.", vi: "Trước một tuần: ngày, địa điểm, giờ có mặt, thời lượng thi và cần mang gì – gửi trực tiếp cho học viên, không chỉ trong nhóm." },
        { de: "Vorbereitungsmaterial noch einmal schicken und fragen, ob die Person es angeschaut hat.", vi: "Gửi lại tài liệu ôn tập và hỏi học viên đã xem chưa." },
        { de: "Ziel der Person kennen: Welche Prüfung (Goethe oder telc), welche Frist (z. B. Visumverlängerung im August)?", vi: "Nắm mục tiêu của học viên: thi Goethe hay telc, hạn chót là khi nào (ví dụ gia hạn visa tháng 8)?" }
      ]
    },
    { type: "heading", de: "Die häufigsten Fragen", vi: "Các câu hỏi thường gặp" },
    {
      type: "list",
      items: [
        {
          de: "TestAS: kein „bestanden/durchgefallen“ – es ist ein Eignungstest. Dauer etwa 4 Stunden, Sprache wählbar (z. B. Englisch). Ankunftszeit aus der Einladung nennen.",
          vi: "TestAS: không có đỗ hay trượt – đây là bài đánh giá năng lực. Thi khoảng 4 tiếng, được chọn ngôn ngữ (ví dụ tiếng Anh). Nhắc giờ có mặt theo thư mời."
        },
        {
          de: "„Was, wenn ich durchfalle?“ – Bei Goethe und telc kann man neu antreten; bei Goethe auch einzelne Module. Ergebnisse notieren und gemeinsam planen, was noch fehlt.",
          vi: "„Nếu trượt thì sao?“ – Goethe và telc đều thi lại được; Goethe còn thi lại được từng kỹ năng. Ghi lại điểm và cùng học viên lên kế hoạch cho phần còn thiếu."
        },
        {
          de: "Goethe oder telc: Unsere Prüfungsgruppen üben im Goethe-Format. Wer telc schreibt, bekommt einen 1-zu-1-Kurs (2–3 Termine pro Woche, mit App, PDF-Material, Übungstests und Korrektur von Schreibaufgaben außerhalb der Stunden).",
          vi: "Goethe hay telc: các lớp luyện thi nhóm của mình ôn theo form Goethe. Ai thi telc thì học kèm 1-1 (2–3 buổi/tuần, kèm app, tài liệu PDF, bộ đề và chữa bài viết ngoài giờ)."
        },
        {
          de: "„Garantiert ihr, dass ich bestehe?“ – Nein, ehrlich bleiben. Wer alle Stunden besucht und die Hausaufgaben macht, besteht sehr oft; den Rest entscheidet das eigene Lernen.",
          vi: "„Trung tâm có bao đỗ không?“ – Không, hãy trung thực. Ai đi học đủ buổi và làm bài tập đầy đủ thì tỉ lệ đỗ rất cao; phần còn lại phụ thuộc vào việc tự học."
        },
        {
          de: "„Reicht online für die mündliche Prüfung?“ – Ja. Online oder vor Ort ändert das Ergebnis nicht; jede Lektion hat Sprechübungen.",
          vi: "„Học online có ổn cho phần thi nói không?“ – Có. Học online hay trực tiếp không ảnh hưởng đến kết quả; bài nào cũng có phần luyện nói."
        }
      ]
    },
    {
      type: "template",
      label_de: "Vorlage · Erinnerung eine Woche vorher",
      label_vi: "Mẫu · Nhắc trước một tuần",
      text: "Hallo [tên]! Còn một tuần nữa là đến ngày thi [tên kỳ thi] rồi 💪\n🗓 [thứ, ngày] – có mặt lúc [giờ] tại [địa điểm]\n⏱ Thi khoảng [thời lượng]\n🪪 Mang theo: [giấy tờ]\nTrung tâm gửi lại [bạn] tài liệu ôn ở đây nha: [link]. [Bạn] xem qua chưa? Có gì chưa rõ cứ hỏi trung tâm nhé!",
      translation_de: "„Hallo [Name]! Noch eine Woche bis zur Prüfung [Name] 💪 [Tag, Datum] – da sein um [Uhrzeit] in [Ort], Dauer etwa [Dauer], mitbringen: [Dokumente]. Hier noch einmal das Vorbereitungsmaterial: [Link]. Hast du es schon angeschaut? Bei Fragen einfach melden!“"
    },
    {
      type: "callout",
      tone: "warning",
      de: "„Das haben wir dir doch schon geschickt“ hilft niemandem, wenn die Person es nicht gelesen hat. Kurz vor der Prüfung lieber einmal zu viel erinnern.",
      vi: "„Trung tâm gửi bạn rồi mà“ không giúp được gì nếu học viên chưa đọc. Gần ngày thi, nhắc thừa còn hơn thiếu."
    }
  ]
};

export default page;
