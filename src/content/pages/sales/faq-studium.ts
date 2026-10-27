import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "faq-studium",
  title_de: "FAQ: Studium in Deutschland",
  title_vi: "FAQ: Du học đại học Đức",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-27",
  body: [
    {
      type: "paragraph",
      de: "Seltener als Ausbildung, aber oft mit genauen Detailfragen – meist von Eltern oder Schülerinnen der Klassen 11–12. Schick zuerst unsere Übersicht „Voraussetzungen und Schritte“ und kläre dann den Einzelfall.",
      vi: "Ít hơn du học nghề nhưng thường hỏi rất chi tiết – phần lớn là phụ huynh hoặc học sinh lớp 11–12. Gửi trước bản tổng quan „Điều kiện và các bước“ rồi mới tư vấn từng trường hợp."
    },
    { type: "heading", de: "Was wir erfragen", vi: "Những gì cần hỏi" },
    {
      type: "list",
      items: [
        { de: "Hat die Person schon Deutsch gelernt – bis zu welchem Niveau?", vi: "Đã học tiếng Đức chưa – đến trình độ nào?" },
        { de: "Wo lebt sie, welche Klasse bzw. welches Studienjahr?", vi: "Đang sống ở đâu, học lớp mấy hoặc năm mấy đại học?" },
        { de: "Welches Fach? Und kann die Familie den Finanzierungsnachweis tragen?", vi: "Muốn học ngành gì? Gia đình có lo được chứng minh tài chính không?" }
      ]
    },
    { type: "heading", de: "Antworten aus den Chats", vi: "Câu trả lời từ các cuộc trò chuyện" },
    {
      type: "list",
      items: [
        { de: "Deutsch: mindestens B1 für den Weg über das Studienkolleg.", vi: "Tiếng Đức: tối thiểu B1 để đi theo hướng dự bị đại học (Studienkolleg)." },
        { de: "Schulnoten: Summe der vier Prüfungsfächer über 26, kein Fach unter 4 (Stand unserer Übersicht – mit Student Support abgleichen).", vi: "Điểm thi THPT: tổng 4 môn trên 26, không môn nào dưới 4 (theo bản tổng quan của trung tâm – kiểm tra lại với Hỗ trợ học viên)." },
        { de: "Wer in Vietnam schon studiert: Ein abgeschlossenes erstes Studienjahr zählt (DAAD). Ein nicht bestandenes Modul schadet nicht, solange die Uni das erste Jahr als abgeschlossen bestätigt.", vi: "Đang học đại học ở Việt Nam: cần hoàn thành năm nhất (theo DAAD). Trượt 1 tín chỉ không sao, miễn là trường xác nhận đã hoàn thành năm nhất." },
        { de: "Für einen Start im September beginnt die Bewerbung Anfang des Jahres, weil zuerst die APS-Prüfung der Unterlagen nötig ist.", vi: "Muốn nhập học tháng 9 thì bắt đầu làm hồ sơ từ đầu năm, vì cần thẩm tra APS trước." },
        { de: "TestAS: kein Bestehen oder Durchfallen, sondern ein Eignungstest. Dauert ca. 4 Stunden und kann auf Englisch abgelegt werden.", vi: "TestAS: không có đậu hay trượt, mà là bài đánh giá năng lực. Thi khoảng 4 tiếng và có thể thi bằng tiếng Anh." },
        { de: "Fachwechsel (z. B. von Sozialwissenschaften zu Wirtschaft): Einzelfall – an Student Support geben statt selbst zu raten.", vi: "Đổi ngành (ví dụ từ xã hội sang kinh tế): tùy trường hợp – chuyển cho Hỗ trợ học viên, không tự đoán." },
        { de: "„Macht ihr alles von A bis Z?“ – Ja: Deutschkurs von Anfang an plus Bewerbung.", vi: "„Trung tâm hỗ trợ từ A-Z không?“ – Có: dạy tiếng Đức từ đầu và làm hồ sơ." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Bei Studienfragen nie raten. Lieber „Ich frage Student Support und melde mich heute bis [Uhrzeit]“ – und das dann einhalten.",
      vi: "Với câu hỏi về du học đại học, không bao giờ đoán. Thà nói „Mình hỏi bộ phận Hỗ trợ học viên và báo lại bạn trước [giờ] hôm nay“ – và giữ đúng hẹn."
    }
  ]
};

export default page;
