import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "faq-studium",
  title_de: "FAQ: Studium in Deutschland",
  title_vi: "FAQ: Du học đại học Đức",
  kind: "reference",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-03",
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
    { type: "heading", de: "Hochschulen, Semester, Paket", vi: "Trường, kỳ nhập học, trọn gói", anchor: "hochschulen-und-semester" },
    {
      type: "list",
      items: [
        { de: "Wir bewerben uns kostenlos bei allen Hochschulen, die zum Fach passen – immer bei staatlichen. Deshalb nicht von „staatlich oder privat“ sprechen. Verlangt eine Hochschule besondere Studiengebühren, fragen wir zuerst die Familie.", vi: "Trung tâm nộp miễn phí vào tất cả các trường phù hợp với khối ngành – luôn là trường công. Vì vậy không cần nói nộp trường công hay tư. Trường nào yêu cầu đặc biệt về học phí thì trung tâm hỏi ý kiến gia đình trước." },
        { de: "Nicht davon sprechen, dass es nicht klappen könnte. Stattdessen: „Wer das B1 rechtzeitig im März/April einreicht, schafft den Wintertermin.“ Erst wenn die Familie fragt, was bei einer nicht bestandenen Prüfung passiert, das erklären.", vi: "Không nói đến chuyện nộp không được – sẽ làm học viên hoang mang. Thay vào đó: „Nếu nộp bằng B1 đúng hạn tháng 3–4 thì nộp kịp kỳ đông.“ Khi nào gia đình hỏi về việc thi không đỗ thì mới tư vấn tiếp." },
        { de: "Kein Sommersemester versprechen. Studienkollegs beginnen meist im Winter. Gibt es einen Sommertermin, bewerben wir uns – sonst bis zum nächsten Winter warten (läuft das Zertifikat ab, muss neu geprüft werden). Das ändert sich jedes Jahr.", vi: "Không nhấn mạnh kỳ hè. Các trường dự bị thường mở kỳ đông; nếu kỳ hè có thì trung tâm nộp, không thì đợi kỳ đông tiếp theo (bằng hết hạn thì phải thi lại). Mỗi năm các trường thay đổi khác nhau." },
        { de: "Paket Studium (Flyer, Stand Juli 2026): 129 Mio. VND – Deutsch A1–B1, Bewerbung bei Hochschulen im Wunschfach, Visum und Flug. Den Flyer schicken und wie immer erklären.", vi: "Trọn gói du học đại học (flyer, tháng 7/2026): 129 triệu VND – học tiếng A1–B1, nộp vào các trường theo khối ngành mong muốn, xin visa, vé máy bay. Gửi flyer và giải thích như bình thường." }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Bei Studienfragen nie raten. Lieber „Ich frage Student Support und melde mich heute bis [Uhrzeit]“ – und das dann einhalten.",
      vi: "Với câu hỏi về du học đại học, không bao giờ đoán. Thà nói „Mình hỏi bộ phận Hỗ trợ học viên và báo lại bạn trước [giờ] hôm nay“ – và giữ đúng hẹn."
    }
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "Was schickst du zuerst bei einer Studienanfrage?",
        question_vi: "Khi khách hỏi du học đại học, bạn gửi gì trước?",
        options: [
          { de: "Den Preis für A1", vi: "Giá khóa A1" },
          { de: "Unsere Übersicht „Voraussetzungen und Schritte“ – dann den Einzelfall klären", vi: "Bảng tổng quan „Điều kiện và các bước“ – rồi xem từng trường hợp" },
          { de: "Eine Liste von Universitäten", vi: "Danh sách trường đại học" },
          { de: "Nichts, das macht Student Support", vi: "Không gì, Student Support lo" }
        ],
        correct: 1
      },
      {
        question_de: "Welches Deutschniveau braucht man mindestens für den Weg über das Studienkolleg?",
        question_vi: "Cần tối thiểu trình độ tiếng Đức nào để vào dự bị đại học?",
        section: "antworten-aus-den-chats",
        options: [
          { de: "B1", vi: "B1" },
          { de: "A1", vi: "A1" },
          { de: "C1", vi: "C1" },
          { de: "Keins", vi: "Không cần" }
        ],
        correct: 0
      },
      {
        question_de: "Was ist der TestAS?",
        question_vi: "TestAS là gì?",
        section: "antworten-aus-den-chats",
        options: [
          { de: "Eine Deutschprüfung", vi: "Kỳ thi tiếng Đức" },
          { de: "Die Visumprüfung der Botschaft", vi: "Phỏng vấn visa của Đại sứ quán" },
          { de: "Eine Prüfung, die man bestehen muss", vi: "Kỳ thi bắt buộc phải đậu" },
          { de: "Ein Eignungstest ohne Bestehen oder Durchfallen, ca. 4 Stunden, auch auf Englisch", vi: "Bài kiểm tra năng lực, không có đậu hay trượt, khoảng 4 tiếng, có thể thi bằng tiếng Anh" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand will von Sozialwissenschaften zu Wirtschaft wechseln. Was machst du?",
        question_vi: "Khách muốn đổi từ khoa học xã hội sang kinh tế. Bạn làm gì?",
        section: "antworten-aus-den-chats",
        options: [
          { de: "Sagen, dass es geht", vi: "Nói là được" },
          { de: "An Student Support geben statt selbst zu raten", vi: "Chuyển Student Support thay vì tự đoán" },
          { de: "Sagen, dass es nicht geht", vi: "Nói là không được" },
          { de: "Im Internet nachsehen", vi: "Tra trên mạng" }
        ],
        correct: 1
      },
      {
        question_de: "Eine Familie fragt, ob wir uns bei staatlichen oder privaten Hochschulen bewerben. Was sagst du?",
        question_vi: "Gia đình hỏi trung tâm nộp trường công hay tư. Bạn nói gì?",
        section: "hochschulen-und-semester",
        options: [
          { de: "„Am besten privat, da ist es sicherer.“", vi: "„Nên nộp trường tư cho chắc.“" },
          { de: "„Das entscheidet ihr allein.“", vi: "„Gia đình tự quyết.“" },
          { de: "„Wir bewerben uns kostenlos bei allen passenden Hochschulen; nur bei besonderen Studiengebühren fragen wir euch vorher.“", vi: "„Trung tâm nộp miễn phí vào các trường phù hợp với khối ngành; trường nào yêu cầu đặc biệt về học phí thì sẽ hỏi ý kiến gia đình.“" },
          { de: "„Privat kostet extra, staatlich ist nicht möglich.“", vi: "„Trường tư tốn thêm, trường công không được.“" }
        ],
        correct: 2
      },
      {
        question_de: "Jemand möchte unbedingt im Sommer anfangen. Was antwortest du?",
        question_vi: "Khách muốn nhất định nhập học kỳ hè. Bạn trả lời gì?",
        section: "hochschulen-und-semester",
        options: [
          { de: "Studienkollegs beginnen meist im Winter. Gibt es einen Sommertermin, bewerben wir uns – versprechen können wir ihn nicht.", vi: "Trường dự bị thường mở kỳ đông. Nếu kỳ hè có thì trung tâm nộp – nhưng không hứa trước được." },
          { de: "„Kein Problem, der Sommer ist sicher.“", vi: "„Không sao, kỳ hè chắc chắn có.“" },
          { de: "„Im Sommer gibt es nie Plätze.“", vi: "„Kỳ hè không bao giờ có chỗ.“" },
          { de: "„Dann besser eine Ausbildung.“", vi: "„Vậy đi du học nghề đi.“" }
        ],
        correct: 0

      }
    ]
  }
};

export default page;
