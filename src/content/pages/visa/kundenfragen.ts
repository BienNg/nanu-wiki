import type { PageContent } from "@/lib/types";

// Collected from Messenger (Sept–Oct 2026). Add new questions here as they come up.
const page: PageContent = {
  slug: "kundenfragen",
  title_de: "Visa-Fragen aus dem Messenger",
  title_vi: "Câu hỏi về visa từ Messenger",
  kind: "living",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-11-03",
  body: [
    {
      type: "paragraph",
      de: "Diese Fragen kamen im Messenger an. Viele davon sind eigentlich Sprachkurs-Anfragen mit einem Visum-Ziel – erkenne das und biete den passenden Kurs an.",
      vi: "Đây là những câu hỏi khách gửi qua Messenger. Nhiều câu thật ra là hỏi khóa học tiếng với mục tiêu visa – hãy nhận ra và giới thiệu khóa phù hợp."
    },
    {
      type: "steps",
      items: [
        { de: "„Ich brauche B1, um meinen Aufenthalt zu verlängern.“", vi: "„Chị cần bằng B1 để gia hạn cư trú.“", body_de: "Lebt meist schon in Deutschland. B1-Kurs online nach deutscher Zeit anbieten, Prüfungstermin und Frist der Ausländerbehörde erfragen.", body_vi: "Thường đã sống ở Đức. Gợi ý lớp B1 online giờ Đức, hỏi ngày thi và hạn của Sở ngoại kiều." },
        { de: "„Ich brauche A1/A2 für den Familiennachzug.“", vi: "„Chị cần bằng A1/A2 để đi định cư / đoàn tụ.“", body_de: "Kurs und Prüfung anbieten. Das Visum selbst begleiten wir nicht. [ERGÄNZEN: welches Niveau wann nötig ist]", body_vi: "Gợi ý khóa học và kỳ thi. Bản thân visa thì trung tâm không làm. [ERGÄNZEN: trình độ nào cần cho trường hợp nào]" },
        { de: "„Macht ihr §18b?“", vi: "„Bên mình có đi diện 18b không?“", body_de: "Erst fragen, welches Zertifikat und welchen Abschluss die Person hat. Dann ehrlich sagen: §18b machen wir zurzeit nicht. Wer §18b selbst schafft, kann es versuchen – kommt das Visum vor dem B1, meldet sich die Person bei uns. Sonst weiter auf B1 lernen; mit Ausbildungsvertrag unterstützen wir sie 2 Jahre lang. Immer auch einen Deutschkurs anbieten. Will jemand deswegen den Vertrag kündigen: die Regel aus dem Vertrag schicken und an die Leitung geben.", body_vi: "Hỏi trước khách có bằng tiếng và bằng cấp gì. Sau đó nói thật: hiện tại trung tâm không làm diện 18b. Nếu bạn tự làm được 18b thì cứ thử – có visa trước khi có B1 thì nhắn lại trung tâm. Nếu không thì tiếp tục học B1; với hợp đồng du học nghề, trung tâm vẫn hỗ trợ trong vòng 2 năm. Luôn gợi ý thêm khoá học tiếng. Nếu vì vậy mà muốn huỷ hợp đồng: gửi quy định trong hợp đồng và báo quản lý." },
        { de: "„Helft ihr beim Finanzierungsnachweis?“", vi: "„Trung tâm có hỗ trợ chứng minh tài chính không?“", body_de: "Klären: über unsere Vermittlung oder ohne? Ausbildung oder Studium? Dann an Student Support.", body_vi: "Hỏi rõ: đi theo đơn của trung tâm hay không? Du học nghề hay đại học? Rồi chuyển cho Hỗ trợ học viên." },
        { de: "„Wie lange dauert das Visum?“", vi: "„Visa mất bao lâu?“", body_de: "Ausbildung: oft 3–5 Monate. Ehrlich sagen, dass die Botschaft entscheidet.", body_vi: "Du học nghề: thường 3–5 tháng. Nói thật là Đại sứ quán quyết định." },
        { de: "„Was passiert, wenn das Visum abgelehnt wird?“", vi: "„Nếu trượt visa thì sao?“", body_de: "[ERGÄNZEN: unsere Regel zu Rate 3, Rückerstattung, zweiter Antrag]", body_vi: "[ERGÄNZEN: quy định của trung tâm về đợt 3, hoàn tiền, nộp lại]" }
      ]
    },
    {
      type: "callout",
      tone: "tip",
      de: "Neue Frage, die hier fehlt? Trag sie mit Datum hier ein, auch wenn die Antwort noch offen ist.",
      vi: "Có câu hỏi mới chưa có ở đây? Ghi lại kèm ngày, kể cả khi chưa có câu trả lời."
    }
  ],
  quiz: {
    version: 2,
    questions: [
      {
        question_de: "Viele Visa-Fragen im Messenger sind eigentlich etwas anderes. Was?",
        question_vi: "Nhiều câu hỏi visa trên Messenger thực ra là gì?",
        options: [
          { de: "Beschwerden über die Botschaft", vi: "Phàn nàn về Đại sứ quán" },
          { de: "Sprachkurs-Anfragen mit einem Visum-Ziel – den passenden Kurs anbieten", vi: "Hỏi khóa tiếng với mục tiêu visa – giới thiệu khóa phù hợp" },
          { de: "Spam", vi: "Tin rác" },
          { de: "Bewerbungen für einen Job bei uns", vi: "Ứng tuyển làm việc ở trung tâm" }
        ],
        correct: 1
      },
      {
        question_de: "„Ich brauche B1, um meinen Aufenthalt zu verlängern.“ Was bietest du an?",
        question_vi: "„Tôi cần B1 để gia hạn cư trú.“ Bạn giới thiệu gì?",
        options: [
          { de: "Unsere Visumbegleitung für die Verlängerung", vi: "Dịch vụ hỗ trợ gia hạn visa" },
          { de: "Einen Kurs vor Ort in Hanoi", vi: "Khóa trực tiếp ở Hà Nội" },
          { de: "Nichts, wir helfen nur Leuten in Vietnam", vi: "Không gì, chỉ hỗ trợ người ở Việt Nam" },
          { de: "B1 online nach deutscher Zeit – und Prüfungstermin und Frist der Ausländerbehörde erfragen", vi: "B1 online theo giờ Đức – và hỏi lịch thi và hạn của Sở Ngoại kiều" }
        ],
        correct: 3
      },
      {
        question_de: "Jemand braucht A1/A2 für den Familiennachzug. Was machen wir?",
        question_vi: "Có người cần A1/A2 để đoàn tụ gia đình. Chúng ta làm gì?",
        options: [
          { de: "Kurs und das ganze Visumverfahren übernehmen", vi: "Nhận cả khóa học và toàn bộ hồ sơ visa" },
          { de: "Ablehnen, das ist nicht unser Thema", vi: "Từ chối, không phải việc của chúng ta" },
          { de: "Kurs und Prüfung anbieten – das Visum selbst begleiten wir nicht", vi: "Giới thiệu khóa học và thi – không hỗ trợ làm visa" },
          { de: "Die Person an die Botschaft verweisen, ohne Kurs", vi: "Chỉ bảo hỏi Đại sứ quán, không giới thiệu khóa" }
        ],
        correct: 2
      },
      {
        question_de: "„Wie lange dauert das Visum zur Ausbildung?“ Was antwortest du?",
        question_vi: "„Visa du học nghề mất bao lâu?“ Bạn trả lời gì?",
        options: [
          { de: "Genau 4 Wochen, das garantieren wir", vi: "Đúng 4 tuần, trung tâm cam kết" },
          { de: "Ungefähr ein Jahr", vi: "Khoảng một năm" },
          { de: "Oft 3–5 Monate – und ehrlich sagen, dass die Botschaft entscheidet", vi: "Thường 3–5 tháng – và nói thật là Đại sứ quán quyết định" },
          { de: "Das können wir überhaupt nicht sagen", vi: "Hoàn toàn không thể nói" }
        ],
        correct: 2
      },
      {
        question_de: "Jemand fragt nach Hilfe beim Finanzierungsnachweis. Was klärst du, bevor du übergibst?",
        question_vi: "Có người hỏi hỗ trợ chứng minh tài chính. Bạn hỏi gì trước khi chuyển tiếp?",
        options: [
          { de: "Über unsere Vermittlung oder ohne, und Ausbildung oder Studium – dann an Student Support", vi: "Qua dịch vụ của trung tâm hay không, du học nghề hay đại học – rồi chuyển Student Support" },
          { de: "Nur den Namen – dann an Sales", vi: "Chỉ hỏi tên – rồi chuyển Sales" },
          { de: "Wie viel Geld die Familie hat – dann selbst ausfüllen", vi: "Gia đình có bao nhiêu tiền – rồi tự điền" },
          { de: "Nichts, das macht die Botschaft", vi: "Không hỏi gì, Đại sứ quán lo" }
        ],
        correct: 0
      },
      {
        question_de: "„Macht ihr §18b?“ Was antwortest du?",
        question_vi: "„Bên mình có làm diện 18b không?“ Bạn trả lời gì?",
        options: [
          { de: "Ja, das ist im Ausbildungspaket enthalten", vi: "Có, đã gồm trong gói du học nghề" },
          { de: "Ehrlich: zurzeit nicht. Wer es selbst schafft, kann es versuchen – sonst weiter auf B1 lernen, und wir bieten einen Deutschkurs an", vi: "Nói thật: hiện tại không làm. Bạn tự làm được thì cứ thử – nếu không thì tiếp tục học B1, và gợi ý khoá học tiếng" },
          { de: "Nein, und dann nicht weiter antworten", vi: "Không, rồi không trả lời thêm" },
          { de: "Ja, gegen Aufpreis", vi: "Có, trả thêm phí" }
        ],
        correct: 1
      }
    ]
  }
};

export default page;
