import type { PageContent } from "@/lib/types";

// Each case is a real situation from Messenger (Oct 2026), anonymised: one customer message, one reply. Keep the chat ids stable – they are stored in chat_responses.sim_id.
const page: PageContent = {
  slug: "interview-faelle",
  title_de: "Messenger-Fälle aus dem Alltag",
  title_vi: "Tình huống Messenger thực tế",
  kind: "reference",
  section: "interview",
  verified_until: null,
  updated_at: "2026-10-28",
  body: [
    {
      type: "paragraph",
      de: "Diese acht Fälle sind so oder sehr ähnlich wirklich passiert. Antworte, wie du es im Job tun würdest – auf Vietnamesisch. Du kennst unsere Preise noch nicht: Schreib dann [GIÁ], so wie du es mit der Preisliste tun würdest. Wir achten auf Ton, Ehrlichkeit und den nächsten Schritt.",
      vi: "Tám tình huống này đã thật sự xảy ra (hoặc rất giống). Hãy trả lời như khi bạn đang làm việc – bằng tiếng Việt. Bạn chưa biết bảng giá: hãy ghi [GIÁ] ở chỗ bạn sẽ báo giá. Chúng tôi đánh giá giọng điệu, sự trung thực và bước tiếp theo."
    },
    {
      type: "chat",
      id: "fall-uhrzeit",
      customer: "Thu",
      intro_de: "Thu lebt in Deutschland und arbeitet. Sie möchte A1 online wiederholen, 2–3 Mal pro Woche gegen 15 oder 20 Uhr deutscher Zeit. Du hast ihr unsere Zeiten genannt: 7:00–8:30 (3×/Woche), 13:00–14:30 (4×/Woche) und 21:00–22:30 (3×/Woche). Sie schreibt zurück:",
      intro_vi: "Thu đang sống và làm việc ở Đức. Chị muốn học lại A1 online, 2–3 buổi/tuần khoảng 15h hoặc 20h giờ Đức. Bạn đã báo các khung giờ: 7:00–8:30 (3 buổi/tuần), 13:00–14:30 (4 buổi/tuần) và 21:00–22:30 (3 buổi/tuần). Chị nhắn lại:",
      message: {
        text: "14h chị mới về đến nhà, 21h thì muộn quá\n\nHọc 1/1 ở chỗ khác cũng chỉ 12tr. Bên mình học phí cao thế",
        translation_de: "„Um 14 Uhr komme ich erst nach Hause, 21 Uhr ist zu spät. Woanders kostet 1:1 auch nur 12 Mio. Ihr seid ganz schön teuer.“"
      }
    },
    {
      type: "chat",
      id: "fall-verwandte",
      customer: "Cô Hạnh",
      intro_de: "Eine ältere Dame schreibt für ihre Nichte. Die Nichte selbst ist nicht im Chat.",
      intro_vi: "Một cô lớn tuổi nhắn hỏi giúp cho cháu. Bản thân cháu không có trong cuộc trò chuyện.",
      message: {
        text: "Cháu ơi cô muốn hỏi khoá học cho cháu của cô\n\nCháu đang học lớp 9, muốn học tiếng Đức để năm 2027 đi học nghề, ở Hà Nội. Cháu đi học trên trường cả ngày, tối mới rảnh\n\nCháu tư vấn cho cô xem cháu nên học theo hướng nào",
        translation_de: "„Hallo, ich möchte für meine Nichte nach einem Kurs fragen. Sie ist in der 9. Klasse und möchte Deutsch lernen, um 2027 eine Ausbildung zu machen. Wir sind in Hanoi. Sie ist den ganzen Tag in der Schule, frei ist sie nur abends. Sag mir bitte, welchen Weg sie gehen sollte.“"
      }
    },
    {
      type: "chat",
      id: "fall-ehemalige",
      customer: "Thảo",
      intro_de: "Thảo hat A1 und A2 bei uns gelernt und will jetzt B1 buchen. Sie hat gefragt, ob es etwas für Ehemalige gibt, und du hast ihr gesagt: 500.000 VND Rabatt. Bei ihrer A2-Buchung hat ihr das niemand gesagt. Sie schreibt:",
      intro_vi: "Thảo đã học A1 và A2 tại trung tâm và giờ muốn đăng ký B1. Chị hỏi học viên cũ có ưu đãi gì không, và bạn đã báo: giảm 500.000 VND. Lúc đăng ký A2 không ai báo cho chị. Chị nhắn:",
      message: {
        text: "Thế à, vậy mà khoá trước chị đăng ký không ai giảm cho chị\n\nNếu đã là quyền lợi cho học viên cũ thì không nên để hỏi mới nói em ạ",
        translation_de: "„Ach so – und beim letzten Kurs hat mir niemand etwas abgezogen. Wenn es ein Vorteil für Ehemalige ist, sollte man nicht erst fragen müssen.“"
      }
    },
    {
      type: "chat",
      id: "fall-vertrauen",
      customer: "Sammy",
      intro_de: "Sammy lebt in der Schweiz und will online lernen. Du hast die Regel erklärt: Wer zum ersten Mal online bucht, zahlt den Kurs und testet zwei Termine – passt es nicht, gibt es 100 % zurück. Sammy schreibt:",
      intro_vi: "Sammy sống ở Thụy Sĩ và muốn học online. Bạn đã giải thích quy định: học viên lần đầu học online đóng học phí và học thử 2 buổi – nếu không phù hợp được hoàn 100%. Sammy nhắn:",
      message: {
        text: "Mình hiểu cách làm của trung tâm, nhưng mình đã bị 1 trường hợp hoàn tiền rắc rối rồi. Mình chỉ đóng học phí 2 ngày học thử thôi, nếu ổn thì mình đóng trọn khoá. Mong bạn thông cảm\n\nVới lại mình rất chú trọng phát âm của giáo viên. Giáo viên là người Việt hay người Đức?",
        translation_de: "„Ich verstehe eure Regeln, aber ich hatte schon mal Ärger mit einer Rückerstattung. Ich bezahle nur die zwei Testtage, wenn es passt, zahle ich den ganzen Kurs. Bitte hab Verständnis. Außerdem ist mir die Aussprache der Lehrkraft sehr wichtig. Ist sie Vietnamesin oder Deutsche?“"
      }
    },
    {
      type: "chat",
      id: "fall-ausbildung",
      customer: "Huy",
      intro_de: "Huy möchte eine Ausbildung als Koch. Voraussetzung: B1 in allen vier Fertigkeiten. Paket: 199 Mio. VND in drei Raten (50 / 50 / 99 Mio.); wer nach dem ersten Interview aufhört, bekommt 40 der 50 Mio. zurück.",
      intro_vi: "Huy muốn du học nghề đầu bếp. Điều kiện: B1 đủ 4 kỹ năng. Trọn gói 199 triệu chia 3 đợt (50 / 50 / 99 triệu); nếu dừng sau lần phỏng vấn đầu tiên được hoàn 40 trong 50 triệu.",
      message: {
        text: "Em chào chị, em có B1 3 kỹ năng rồi, kỹ năng Nghe em mới thi hôm qua đang chờ điểm ạ\n\nBên mình có đơn đầu bếp ở Baden-Württemberg không ạ? Chi phí trọn gói bao nhiêu ạ?\n\nNếu em không đậu phỏng vấn thì 50 triệu đợt 1 có được hoàn lại không ạ?",
        translation_de: "„Hallo, ich habe B1 in drei Fertigkeiten, Hören habe ich gestern geschrieben – das Ergebnis kommt noch. Habt ihr eine Kochstelle in Baden-Württemberg? Was kostet das Paket? Wenn ich das Interview nicht bestehe, bekomme ich die 50 Mio. der ersten Rate zurück?“"
      }
    },
    {
      type: "chat",
      id: "fall-app-button",
      customer: "Bảo",
      intro_de: "Bảo kam über die App-Anzeige und hat nur den Button gedrückt. Die App ist für Kursteilnehmende kostenlos und wird nicht einzeln verkauft.",
      intro_vi: "Bảo đến từ quảng cáo app và chỉ bấm nút câu hỏi mẫu. App miễn phí cho học viên của trung tâm và không bán riêng.",
      message: {
        text: "App này giá bao nhiêu?\n\nEm mới học tiếng Đức thôi, ở Sài Gòn",
        translation_de: "„Was kostet diese App? Ich fange gerade erst mit Deutsch an, ich bin in Saigon.“"
      }
    },
    {
      type: "chat",
      id: "fall-bestandskunde",
      customer: "Long",
      intro_de: "Long hat sich für den A1-Kurs am 5.10. angemeldet und schreibt jetzt auf die Facebook-Seite.",
      intro_vi: "Long đã đăng ký lớp A1 ngày 5/10 và giờ nhắn lên trang Facebook.",
      message: {
        text: "Chị ơi, em đang xin vào lớp ngày 5/10 rồi ạ\n\nBên Zalo em nhắn mãi không thấy ai trả lời ạ\n\nMai học rồi mà em chưa có link vào lớp",
        translation_de: "„Hallo, ich habe mich schon für den Kurs am 5.10. angemeldet. Auf Zalo schreibe ich die ganze Zeit, aber niemand antwortet. Morgen geht es los und ich habe noch keinen Link zum Kurs.“"
      }
    },
    {
      type: "chat",
      id: "fall-preis",
      customer: "Vy",
      intro_de: "Vy ist Studentin in Bình Dương. Es gibt einen A1-Abendkurs online nach vietnamesischer Zeit, Beginn in zwei Wochen; Ratenzahlung in zwei Hälften ist möglich. Du hast ihr den Preis genannt. Sie schreibt:",
      intro_vi: "Vy là sinh viên ở Bình Dương. Trung tâm có lớp A1 online tối giờ Việt Nam, khai giảng sau 2 tuần; có thể chia học phí thành 2 đợt. Bạn đã báo học phí. Vy nhắn:",
      message: {
        text: "Dạ em thấy chi phí hơi cao so với khả năng tài chính của em ạ\n\nHọc xong A1 thì em có giao tiếp được không ạ? Em muốn sau này du học",
        translation_de: "„Das ist ziemlich viel für mein Budget. Kann ich mich nach A1 schon unterhalten? Ich möchte später in Deutschland studieren.“"
      }
    }
  ]
};

export default page;
