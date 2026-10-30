import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "verkaufstrichter",
  title_de: "Verkaufstrichter: vom Erstkontakt bis zur Zahlung",
  title_vi: "Phễu bán hàng: từ liên hệ đầu tiên đến khi đóng tiền",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-28",
  body: [
    {
      type: "paragraph",
      de: "Jedes Unternehmen hat einen Verkaufstrichter. Bei uns hat er sieben Stufen, von Marketing über Beratung bis zum Unterricht. Auf jeder Stufe springen Interessenten ab. Diese Seite zeigt, was Sales auf den Stufen 2 bis 5 tut, warum wir dort Kunden verlieren und was dagegen hilft.",
      vi: "Doanh nghiệp nào cũng có một phễu bán hàng. Phễu của mình có bảy bước, từ marketing, tư vấn đến giảng dạy. Ở mỗi bước đều có khách rời đi. Trang này cho biết đội Sales làm gì ở bước 2 đến 5, vì sao mình mất khách ở đó và cách cải thiện."
    },
    {
      type: "heading",
      de: "Die sieben Stufen",
      vi: "Bảy bước của phễu"
    },
    {
      type: "funnel",
      stages: [
        { de: "Bekanntheit", vi: "Biết đến", sub: "Awareness", tone: "brand" },
        { de: "Erstkontakt", vi: "Liên hệ đầu tiên", sub: "First contact", tone: "dark" },
        { de: "Bedarf klären", vi: "Tìm hiểu nhu cầu", sub: "Explore needs (qualifying)", tone: "dark" },
        { de: "Passende Kurse vorstellen", vi: "Giới thiệu lớp phù hợp", sub: "Present matching classes", tone: "dark" },
        { de: "Angebot & Abschluss", vi: "Báo giá & chốt", sub: "Quote & decision", tone: "dark" },
        { de: "Kursstart", vi: "Bắt đầu học ngay", sub: "Onboarding", tone: "light" },
        { de: "Kundenbindung", vi: "Giữ chân", sub: "Retention", tone: "light" }
      ],
      legend: [
        { tone: "brand", de: "Marketing", vi: "Marketing" },
        { tone: "dark", de: "Sales", vi: "Sales" },
        { tone: "light", de: "Customer Success mit den Lehrkräften", vi: "Chăm sóc học viên cùng giáo viên" }
      ]
    },
    {
      type: "heading",
      de: "1 · Bekanntheit",
      vi: "1 · Biết đến"
    },
    {
      type: "paragraph",
      de: "Hier gibt es noch keine Nachricht. Die Person sieht uns nur auf unseren Social-Media-Kanälen: Videos und Beiträge auf Facebook, TikTok und YouTube. Sales ist an dieser Stufe noch nicht beteiligt. Die Leitung und Marketing verbessern laufend Inhalte und Anzeigen, damit mehr Menschen uns überhaupt erst sehen.",
      vi: "Ở bước này chưa có tin nhắn. Người xem chỉ thấy mình trên các kênh mạng xã hội: video và bài đăng trên Facebook, TikTok và YouTube. Sales chưa tham gia. Quản lý và Marketing liên tục cải thiện nội dung và quảng cáo để nhiều người thấy mình hơn."
    },
    {
      type: "channels",
      note_de: "So sieht diese Stufe aus: jemand schaut einen Reel oder das Profil an. Es gibt noch keine Nachricht an Sales.",
      note_vi: "Bước này trông như thế này: người xem đang xem một Reel hoặc trang cá nhân. Chưa có tin nhắn cho Sales.",
      reel: {
        page: "NaNu NaNa",
        caption_de: "Ausbildung in Deutschland – in 60 Sekunden",
        caption_vi: "Du học nghề Đức trong 60 giây",
        audio_de: "Originalton · NaNu NaNa",
        audio_vi: "Âm thanh gốc · NaNu NaNa",
        likes: "12,4K",
        comments: "86",
        shares: "210"
      },
      profile: {
        name: "NaNu NaNa",
        handle: "nanunana",
        following: "18",
        followers: "86,4K",
        likes: "1,2M",
        bio_de: "Deutsch lernen · Hà Nội & Sài Gòn · Online",
        bio_vi: "Học tiếng Đức · Hà Nội & Sài Gòn · Online",
        videos: [
          { views: "128K", label_de: "Ausbildung", label_vi: "Du học nghề", tone: "teal" },
          { views: "86K", label_de: "A1 online", label_vi: "A1 online", tone: "indigo" },
          { views: "54K", label_de: "Preis", label_vi: "Học phí", tone: "amber" },
          { views: "41K", label_de: "Hà Nội", label_vi: "Hà Nội", tone: "rose" },
          { views: "33K", label_de: "Sài Gòn", label_vi: "Sài Gòn", tone: "sky" },
          { views: "22K", label_de: "Bis B1", label_vi: "Lên B1", tone: "slate" }
        ]
      }
    },
    {
      type: "callout",
      tone: "warning",
      de: "Mögliche Ursache für Verluste: Wir posten nicht oft genug, oder die Inhalte sind noch nicht gut genug – dann schreibt niemand im nächsten Schritt.",
      vi: "Lý do có thể mất khách: đăng bài chưa đủ thường xuyên, hoặc chất lượng nội dung chưa tốt – thì ở bước sau không ai nhắn tin."
    },
    {
      type: "heading",
      de: "2 · Erstkontakt: sofort antworten",
      vi: "2 · Liên hệ đầu tiên: trả lời ngay lập tức"
    },
    {
      type: "paragraph",
      de: "Es ist ein großer Schritt für Kunden, uns überhaupt zu schreiben. Deshalb ist das Wichtigste: sofort antworten, bevor sie das Interesse verlieren oder eine andere Schule fragen.",
      vi: "Rất khó để khách liên hệ với mình. Vì vậy, điều quan trọng nhất là trả lời ngay, trước khi khách mất hứng thú hoặc hỏi trường khác."
    },
    {
      type: "conversation",
      customer: "Minh Anh",
      note_de: "Antwort nach einer Minute, persönlich und konkret: Die Frage ist beantwortet, bevor Minh Anh eine andere Schule fragt.",
      note_vi: "Trả lời sau một phút, thân thiện và cụ thể: câu hỏi được trả lời trước khi Minh Anh hỏi trường khác.",
      messages: [
        {
          from: "customer",
          stamp_de: "20:14",
          stamp_vi: "20:14",
          text: "Bên mình có lớp tiếng Đức online không ạ?",
          translation_de: "„Habt ihr Online-Deutschkurse?“"
        },
        {
          from: "me",
          stamp_de: "20:15",
          stamp_vi: "20:15",
          text: "Chào Minh Anh ạ! Bên mình là NaNu NaNa 😊 Có nha bạn, bên mình có lớp online và lớp tại Hà Nội, TP.HCM.",
          translation_de: "„Hallo Minh Anh! Hier ist NaNu NaNa 😊 Ja, wir haben Online-Kurse und Kurse in Hà Nội und HCM.“"
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Mögliche Ursache für Verluste: Wir antworten zu langsam, oder die erste Antwort ist zu allgemein.",
      vi: "Lý do có thể mất khách: trả lời chậm, hoặc câu trả lời đầu tiên quá chung chung."
    },
    {
      type: "callout",
      tone: "tip",
      de: "Keine Antwort innerhalb von 24 Stunden? Schreib noch einmal nach.",
      vi: "Khách chưa trả lời trong 24 giờ? Nhắn lại lần nữa."
    },
    {
      type: "heading",
      de: "3 · Bedarf klären: nur zwei Fragen",
      vi: "3 · Tìm hiểu nhu cầu: chỉ hỏi 2 điều"
    },
    {
      type: "list",
      ordered: true,
      items: [
        {
          de: "Wo wohnst du?",
          vi: "Bạn sống ở đâu?"
        },
        {
          de: "Welches Niveau hast du?",
          vi: "Bạn đang ở trình độ nào?"
        }
      ]
    },
    {
      type: "paragraph",
      de: "Stell nicht zu viele Fragen und keine offenen Fragen. Jede Frage ist eine Hausaufgabe für den Kunden – und vielleicht antwortet er nie.",
      vi: "Tránh hỏi quá nhiều hoặc hỏi câu mở. Mỗi câu hỏi là một bài tập về nhà cho khách – và có thể họ sẽ không bao giờ trả lời."
    },
    {
      type: "conversation",
      customer: "Minh Anh",
      note_de: "Nur Wohnort und Niveau. Als Minh Anh nicht antwortet, schreiben wir am nächsten Tag einmal freundlich nach.",
      note_vi: "Chỉ hỏi nơi ở và trình độ. Khi Minh Anh chưa trả lời, hôm sau mình nhắn lại một lần thật nhẹ nhàng.",
      messages: [
        {
          from: "me",
          stamp_de: "20:15",
          stamp_vi: "20:15",
          text: "Để mình gửi lớp phù hợp, bạn cho mình hỏi 2 điều nha:\n1. Bạn đang sống ở đâu?\n2. Bạn học tiếng Đức đến trình độ nào rồi?",
          translation_de: "„Damit ich dir passende Kurse schicken kann, zwei kurze Fragen: 1. Wo wohnst du? 2. Bis zu welchem Niveau hast du schon Deutsch gelernt?“"
        },
        {
          from: "me",
          stamp_de: "Am nächsten Tag · 19:30",
          stamp_vi: "Hôm sau · 19:30",
          text: "Minh Anh ơi, bạn cho mình biết nơi ở và trình độ để mình gửi lịch lớp phù hợp nha 😊",
          translation_de: "„Minh Anh, sag mir kurz Wohnort und Niveau, dann schicke ich dir die passenden Kurse 😊“"
        },
        {
          from: "customer",
          stamp_de: "19:42",
          stamp_vi: "19:42",
          text: "Dạ mình ở Hà Nội, mới học xong A1 ạ",
          translation_de: "„Ich wohne in Hà Nội und habe gerade A1 abgeschlossen.“"
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Mögliche Ursache für Verluste: zu viele oder offene Fragen, oder wir fragen, bevor wir die Frage des Kunden beantwortet haben.",
      vi: "Lý do có thể mất khách: hỏi quá nhiều, hỏi câu mở, hoặc hỏi trước khi trả lời câu hỏi của khách."
    },
    {
      type: "heading",
      de: "4 · Passende Kurse vorstellen",
      vi: "4 · Giới thiệu lớp phù hợp"
    },
    {
      type: "paragraph",
      de: "Mit dem, was wir beim Bedarf-Klären erfahren haben, schicken wir nur die Kurse, die zu Wohnort und Niveau passen.",
      vi: "Dựa trên thông tin từ bước tìm hiểu nhu cầu, mình chỉ gửi những lớp phù hợp với nơi ở và trình độ của khách."
    },
    {
      type: "conversation",
      customer: "Minh Anh",
      note_de: "Nur Kurse, die zu Wohnort und Niveau passen – zwei Optionen, die beide ein „Ja“ sein können.",
      note_vi: "Chỉ gửi lớp phù hợp với nơi ở và trình độ – hai lựa chọn, cả hai đều có thể là „có“.",
      messages: [
        {
          from: "me",
          stamp_de: "19:43",
          stamp_vi: "19:43",
          text: "Cảm ơn bạn! Học xong A1 thì bạn học tiếp A2 nha. Ở Hà Nội đang có 2 lớp A2 phù hợp:\n• Lớp tối 2-4-6, 18:30–20:30, khai giảng 10/11\n• Lớp cuối tuần T7–CN, 9:00–11:30, khai giảng 15/11",
          translation_de: "„Danke! Nach A1 geht es mit A2 weiter. In Hà Nội gibt es zwei passende A2-Kurse: Abendkurs Mo-Mi-Fr, 18:30–20:30, Start 10.11. · Wochenendkurs Sa–So, 9:00–11:30, Start 15.11.“"
        },
        {
          from: "customer",
          text: "Lớp tối 2-4-6 hợp với mình á. Học phí bao nhiêu vậy ad?",
          translation_de: "„Der Abendkurs Mo-Mi-Fr passt mir. Wie viel kostet er?“"
        }
      ]
    },
    {
      type: "callout",
      tone: "info",
      de: "Kein passender Kurs? Dann wissen wir trotzdem: Die Person hat Interesse – es gibt nur noch keinen Kurs für sie. Das ist kein verlorener Kunde, sondern ein Zeichen, dass wir mehr Lehrkräfte und Kurse brauchen.",
      vi: "Không có lớp phù hợp? Mình vẫn biết khách có nhu cầu – chỉ là chưa có lớp. Đây không phải khách mất đi, mà là dấu hiệu mình cần thêm giáo viên và thêm lớp."
    },
    {
      type: "heading",
      de: "5 · Angebot & Abschluss – der wichtigste Schritt",
      vi: "5 · Báo giá & chốt – bước quan trọng nhất"
    },
    {
      type: "paragraph",
      de: "Schick den Preis und die Leistungen, die der Kunde bekommt. Fünf Regeln:",
      vi: "Gửi giá và những quyền lợi khách nhận được. Năm nguyên tắc:"
    },
    {
      type: "steps",
      items: [
        {
          de: "Ein Niveau, zur gewünschten Uhrzeit",
          vi: "Một trình độ, đúng giờ khách hỏi",
          body_de: "Jede zusätzliche Option ist ein Grund, „noch mal darüber nachzudenken“. Wenn du eine Wahl gibst, dann zwei Optionen, die beide ein „Ja“ sind: Abendkurs oder Wochenendkurs.",
          body_vi: "Mỗi lựa chọn thêm là một lý do để „suy nghĩ thêm“. Nếu cho chọn: 2 lựa chọn đều là „có“ – lớp tối hoặc cuối tuần."
        },
        {
          de: "Erst die Leistungen, dann der Preis",
          vi: "Quyền lợi trước, giá sau",
          body_de: "Hier später die vorgefertigten Bilder zu Leistungen und Vorteilen einsetzen.",
          body_vi: "Sau này gắn ảnh có sẵn về dịch vụ và quyền lợi vào chỗ này."
        },
        {
          de: "Direkt in der Angebotsnachricht zum Abschluss fragen",
          vi: "Hỏi chốt ngay trong tin nhắn báo giá",
          body_de: "Nicht auf die Antwort warten, sondern konkret fragen, ob wir den Platz reservieren sollen.",
          body_vi: "Không chờ khách tự quyết, hỏi cụ thể có giữ chỗ cho khách không.",
          template: {
            label_de: "Vorlage · Abschlussfrage",
            label_vi: "Mẫu · Hỏi chốt",
            text: "Chị giữ chỗ cho em lớp tối 2-4-6 khai giảng [ngày] nha?",
            translation_de: "„Soll ich dir einen Platz im Abendkurs Mo-Mi-Fr ab [Datum] reservieren?“"
          }
        },
        {
          de: "Beim Ja gleich sagen, wie reserviert und bezahlt wird",
          vi: "Khi khách đồng ý, nói ngay cách giữ chỗ và thanh toán",
          body_de: "Sag klar, was passiert, wenn der Kunde zusagt: wie der Platz reserviert wird und wie er bezahlt – damit er nicht nachfragen muss. Alles passiert im Chat.",
          body_vi: "Nói rõ chuyện gì xảy ra khi khách đồng ý: giữ chỗ thế nào, thanh toán ra sao – để khách không phải hỏi. Mọi thứ ở trong chat."
        },
        {
          de: "Das Angebot nicht kalt werden lassen",
          vi: "Đừng để báo giá nguội",
          body_de: "Bis zum nächsten Tag keine Antwort? Schreib noch einmal mit etwas Neuem (aktuelle freie Plätze oder eine passende Leistung) und frag erneut nach dem Abschluss.",
          body_vi: "Đến hôm sau chưa trả lời? Nhắn lại với điều gì mới (cập nhật chỗ trống hoặc một quyền lợi phù hợp) và hỏi chốt lại."
        }
      ]
    },
    {
      type: "conversation",
      customer: "Minh Anh",
      note_de: "Leistungen vor dem Preis, die Abschlussfrage direkt im Angebot, Reservierung und Zahlung gleich miterklärt – und am nächsten Tag ein Nachfassen mit etwas Neuem (freie Plätze).",
      note_vi: "Quyền lợi trước giá, hỏi chốt ngay trong tin báo giá, nói luôn cách giữ chỗ và thanh toán – và hôm sau nhắn lại với điều mới (số chỗ còn trống).",
      messages: [
        {
          from: "me",
          stamp_de: "19:44",
          stamp_vi: "19:44",
          text: "Lớp A2 tối 2-4-6 học cùng một giáo viên từ A2 lên B1, có app NaNu Go học miễn phí đi kèm. Học phí: [HỌC PHÍ] cho 42 buổi.",
          translation_de: "„Im A2-Abendkurs Mo-Mi-Fr lernst du mit derselben Lehrkraft von A2 bis B1, inklusive kostenloser App NaNu Go. Preis: [PREIS] für 42 Einheiten.“"
        },
        {
          from: "me",
          text: "Mình giữ chỗ cho bạn lớp tối 2-4-6 khai giảng 10/11 nha? Bạn chỉ cần chuyển khoản theo thông tin dưới đây, mình giữ chỗ ngay và gửi xác nhận trong chat này:\n[THÔNG TIN CHUYỂN KHOẢN]",
          translation_de: "„Soll ich dir einen Platz im Abendkurs Mo-Mi-Fr ab 10.11. reservieren? Du überweist einfach an die Daten unten, ich reserviere sofort und bestätige hier im Chat.“"
        },
        {
          from: "me",
          stamp_de: "Am nächsten Tag · 18:00",
          stamp_vi: "Hôm sau · 18:00",
          text: "Minh Anh ơi, lớp tối 2-4-6 chỉ còn 3 chỗ thôi nè. Mình giữ 1 chỗ cho bạn nha?",
          translation_de: "„Minh Anh, im Abendkurs Mo-Mi-Fr sind nur noch 3 Plätze frei. Soll ich dir einen reservieren?“"
        },
        {
          from: "customer",
          stamp_de: "18:20",
          stamp_vi: "18:20",
          text: "Dạ ok ad, mình chuyển khoản liền nha",
          translation_de: "„Okay, ich überweise gleich.“"
        },
        {
          from: "me",
          text: "Cảm ơn Minh Anh! Mình đã giữ chỗ cho bạn rồi. Chút nữa bạn sẽ nhận email để bắt đầu học nha 🎉",
          translation_de: "„Danke, Minh Anh! Dein Platz ist reserviert. Gleich bekommst du eine E-Mail, damit du sofort loslegen kannst 🎉“"
        }
      ]
    },
    {
      type: "callout",
      tone: "warning",
      de: "Mögliche Ursache für Verluste: Meistens ist dem Kunden der Preis zu hoch. Zeig den Wert klarer.",
      vi: "Lý do có thể mất khách: phần lớn là do khách thấy giá quá cao. Hãy trình bày giá trị rõ ràng hơn."
    },
    {
      type: "callout",
      tone: "info",
      de: "Sonderangebote nur, wenn sie offiziell gelten – keine eigenen Rabatte im Chat oder am Telefon.",
      vi: "Chỉ đưa ưu đãi đặc biệt khi đó là ưu đãi chính thức – không tự giảm giá qua chat hay điện thoại."
    },
    {
      type: "heading",
      de: "Danach: Übergabe an Customer Success",
      vi: "Sau đó: bàn giao cho Chăm sóc học viên"
    },
    {
      type: "paragraph",
      de: "Nach Anmeldung und Zahlung übernimmt Customer Success die Stufen 6 und 7: Onboarding und Kundenbindung.",
      vi: "Sau khi khách đăng ký và thanh toán, đội Chăm sóc học viên phụ trách bước 6 và 7: bắt đầu học và giữ chân học viên."
    }
  ]
};

export default page;
