import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "verkaufstrichter",
  title_de: "Verkaufstrichter: vom Erstkontakt bis zur Zahlung",
  title_vi: "Phễu bán hàng: từ liên hệ đầu tiên đến khi đóng tiền",
  kind: "process",
  section: "handbook",
  verified_until: null,
  updated_at: "2026-10-30",
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
      type: "paragraph",
      de: "Das sind die häufigsten ersten Nachrichten zu Sprachkursen, jeweils als echte Nachricht aus unserem Messenger. Erst beantworten wir die Frage konkret, dann fragen wir nur, was für den passenden Kurs noch fehlt.",
      vi: "Đây là những tin nhắn đầu tiên thường gặp nhất về lớp tiếng, mỗi loại là một tin nhắn thật từ Messenger của mình. Trước tiên trả lời cụ thể câu hỏi, sau đó chỉ hỏi những gì còn thiếu để chọn lớp phù hợp."
    },
    {
      type: "conversation_tabs",
      tabs: [
        {
          tab_de: "Niveau",
          tab_vi: "Trình độ",
          customer: "Thu Hà",
          level: "B2",
          note_de: "Die Frage ist mit „Ja“ beantwortet. Das Niveau kennen wir schon, also fragen wir nur noch nach dem Wohnort.",
          note_vi: "Câu hỏi đã được trả lời là „có“. Mình đã biết trình độ, nên chỉ hỏi thêm nơi ở.",
          goal_de: "Erfahren, ob Thu Hà in Vietnam oder Deutschland lebt – dann schicken wir den nächsten {level}-Kurs in ihrer Zeitzone.",
          goal_vi: "Biết Thu Hà đang ở Việt Nam hay ở Đức – rồi gửi lớp {level} gần nhất theo giờ nơi khách ở.",
          messages: [
            { from: "customer", stamp_de: "20:14", stamp_vi: "20:14", text: "Có khoá {lv} ko {goi}", translation_de: "„Habt ihr einen {level}-Kurs?“" },
            {
              from: "me",
              stamp_de: "20:15",
              stamp_vi: "20:15",
              text: "{chao} Có nha {ban}, {benminh} có lớp {level} online và tại Hà Nội, TP.HCM.\n{Ban} đang sống ở Việt Nam hay ở Đức ạ? {Minh} gửi lớp {level} gần nhất hợp giờ với {ban} nha.",
              translation_de: "„Hallo! Ja, wir haben {level}-Kurse online und in Hà Nội und HCM. Lebst du in Vietnam oder in Deutschland? Dann schicke ich dir den nächsten {level}-Kurs, der zeitlich zu dir passt.“"
            }
          ]
        },
        {
          tab_de: "Online",
          tab_vi: "Online",
          customer: "Quang Huy",
          level: "A1",
          note_de: "Konkret statt nur „Ja“: wie online unterrichtet wird, wie groß die Klasse ist, wie oft. Das Niveau ist bekannt, es fehlt nur die Zeitzone.",
          note_vi: "Cụ thể thay vì chỉ „có“: học online thế nào, lớp bao nhiêu người, mấy buổi. Đã biết trình độ, chỉ còn thiếu múi giờ.",
          goal_de: "Erfahren, ob Quang Huy in Vietnam oder Deutschland lebt – dann schicken wir alle Zeitfenster dieser Zeitzone auf einmal.",
          goal_vi: "Biết Quang Huy ở Việt Nam hay ở Đức – rồi gửi tất cả khung giờ của múi giờ đó trong một tin nhắn.",
          messages: [
            { from: "customer", stamp_de: "21:02", stamp_vi: "21:02", text: "Bên {goi} có lớp online {lv} ko ạ", translation_de: "„Habt ihr einen {level}-Online-Kurs?“" },
            {
              from: "me",
              stamp_de: "21:03",
              stamp_vi: "21:03",
              text: "{chao} Có nha {ban}! Lớp {level} online học qua Zoom, 5–10 học viên một lớp, 3–4 buổi/tuần, mỗi buổi 1,5 tiếng.\n{Ban} đang ở Việt Nam hay ở Đức ạ? {Minh} gửi khung giờ theo giờ nơi {ban} ở nha.",
              translation_de: "„Hallo! Ja! Der {level}-Online-Kurs läuft über Zoom, 5–10 Personen pro Klasse, 3–4 Termine pro Woche à 1,5 Stunden. Bist du in Vietnam oder in Deutschland? Dann schicke ich dir die Uhrzeiten in deiner Zeit.“"
            }
          ]
        },
        {
          tab_de: "Preis",
          tab_vi: "Học phí",
          customer: "Ngọc Lan",
          level: "A2",
          place: "vietnam",
          goal_de: "Erfahren, ob Ngọc Lan das Niveau davor schon hat – dann schicken wir einen {level}-Kurs mit Datum und Uhrzeit.",
          goal_vi: "Biết Ngọc Lan đã học xong trình độ trước chưa – rồi gửi một lớp {level} có ngày khai giảng và giờ học.",
          messages: [
            { from: "customer", stamp_de: "12:40", stamp_vi: "12:40", text: "{Toi} xin phí học khoá {lv} ạ", translation_de: "„Ich hätte gern den Preis für den {level}-Kurs.“" },
            {
              from: "me",
              stamp_de: "12:41",
              stamp_vi: "12:41",
              text: "{chao} {Minh} gửi {ban} học phí và quyền lợi khoá {level} ngay nha.\n{Ban} đang ở Hà Nội, TP.HCM, tỉnh khác hay ở Đức ạ? Học phí như nhau, nhưng quyền lợi và lịch học mỗi nơi khác nhau.",
              translation_de: "„Hallo! Ich schicke dir gleich Preis und Leistungen für den {level}-Kurs. Bist du in Hà Nội, in HCM, in einer anderen Provinz oder in Deutschland? Der Preis ist überall gleich, aber Leistungen und Kurszeiten sind je nach Ort anders.“",
              note_de: "Erst den Ort klären: Der Preis ist überall gleich, die Vorteile nicht. Den Preis versprechen, damit die Rückfrage nicht wie Ausweichen wirkt.",
              note_vi: "Hỏi nơi ở trước: học phí như nhau, quyền lợi thì khác. Hứa gửi học phí để câu hỏi lại không giống né tránh."
            },
            { from: "customer", stamp_de: "12:43", stamp_vi: "12:43", text: "{Toi} ở {city} ạ", translation_de: "„Ich bin in {city_de}.“" },
            {
              from: "me",
              stamp_de: "12:43",
              stamp_vi: "12:43",
              text: "",
              image: {
                src: "/sales/vorteile-online.png",
                alt_de: "Vorteilsbild Online-Kurs: kleine Klasse, 100 % Rückerstattung, App NaNu Go, Zoom, Google Classroom, PDF, Zusammenfassung nach jedem Termin",
                alt_vi: "Ảnh quyền lợi lớp online: lớp nhỏ, hoàn 100% học phí, app NaNu Go, Zoom, Google Classroom, PDF, tổng kết sau mỗi buổi"
              },
              note_de: "{city_de} heißt: nur online. Also das Online-Bild – der Wert kommt vor dem Preis.",
              note_vi: "Ở {city} nghĩa là chỉ học online. Gửi ảnh online – giá trị trước, học phí sau.",
              places: {
                city: {
                  image: {
                    src: "/sales/vorteile-offline.png",
                    alt_de: "Vorteilsbild Kurs vor Ort: Klasse mit 8–15 Personen, gedrucktes Buch, Tote Bag, App NaNu Go, Google Classroom",
                    alt_vi: "Ảnh quyền lợi lớp tại trung tâm: lớp 8–15 học viên, sách in, túi tote, app NaNu Go, Google Classroom"
                  },
                  note_de: "{city_de} heißt: Kurs vor Ort möglich. Also das Offline-Bild – der Wert kommt vor dem Preis.",
                  note_vi: "Ở {city} thì học được tại lớp. Gửi ảnh offline – giá trị trước, học phí sau."
                }
              }
            },
            {
              from: "me",
              text: "Ở {city} thì {ban} học online qua Zoom nha. Khoá {level} gồm {sessions} buổi học trực tiếp với giáo viên, lớp nhỏ 5–10 học viên, app NaNu Go, Google Classroom và tài liệu PDF.\nHọc phí {fee}, đăng ký giữ chỗ sớm chỉ còn {fee_early}. Sau 2 buổi đầu không hài lòng thì {benminh} hoàn 100% học phí.",
              translation_de: "„In {city_de} lernst du online über Zoom. Der {level}-Kurs hat {sessions} Live-Termine mit einer Lehrkraft, eine kleine Klasse mit 5–10 Personen, die App NaNu Go, Google Classroom und PDF-Materialien. Er kostet {fee}, wer früh einen Platz reserviert, zahlt nur {fee_early}. Wer nach den ersten 2 Terminen nicht zufrieden ist, bekommt 100 % zurück.“",
              note_de: "Erst die Leistungen, dann der Preis – in einer Nachricht.",
              note_vi: "Quyền lợi trước, học phí sau – trong cùng một tin.",
              places: {
                city: {
                  text: "Ở {city} thì {ban} học trực tiếp tại lớp được nha. Khoá {level} gồm {sessions} buổi với giáo viên, lớp 8–15 học viên, sách in và túi tote NaNu NaNa, app NaNu Go và Google Classroom.\nHọc phí {fee}, đăng ký giữ chỗ sớm chỉ còn {fee_early}.",
                  translation_de: "„In {city_de} kannst du vor Ort lernen. Der {level}-Kurs hat {sessions} Termine mit einer Lehrkraft, eine Klasse mit 8–15 Personen, gedrucktes Buch und Tote Bag von NaNu NaNa, die App NaNu Go und Google Classroom. Er kostet {fee}, wer früh einen Platz reserviert, zahlt nur {fee_early}.“",
                  note_de: "Erst die Leistungen, dann der Preis – in einer Nachricht. Vor Ort gibt es keine Rückerstattung, also auch keine erwähnen."
                },
                germany: {
                  text: "Ở Đức thì {ban} học online qua Zoom theo giờ Đức nha. Khoá {level} gồm {sessions} buổi học trực tiếp với giáo viên, lớp nhỏ 5–10 học viên, app NaNu Go, Google Classroom và tài liệu PDF.\nHọc phí {fee_eur} ({fee}), đăng ký giữ chỗ sớm chỉ còn {fee_early}. Sau 2 buổi đầu không hài lòng thì {benminh} hoàn 100% học phí.",
                  translation_de: "„In Deutschland lernst du online über Zoom nach deutscher Zeit. Der {level}-Kurs hat {sessions} Live-Termine mit einer Lehrkraft, eine kleine Klasse mit 5–10 Personen, die App NaNu Go, Google Classroom und PDF-Materialien. Er kostet {fee_eur} ({fee}), wer früh einen Platz reserviert, zahlt nur {fee_early}. Wer nach den ersten 2 Terminen nicht zufrieden ist, bekommt 100 % zurück.“",
                  note_de: "Erst die Leistungen, dann der Preis – in einer Nachricht. In Deutschland den Preis in Euro und in VND nennen.",
                  note_vi: "Quyền lợi trước, học phí sau – trong cùng một tin. Ở Đức thì báo giá bằng euro và cả VND."
                }
              }
            },
            {
              from: "me",
              text: "{da}{ban} học xong {prev} chưa ạ? {Minh} gửi lớp {level} gần nhất hợp với {ban} nha.",
              translation_de: "„Hast du {prev} schon abgeschlossen? Dann schicke ich dir den nächsten passenden {level}-Kurs.“",
              note_de: "Die Frage als eigene, letzte Nachricht: Die Benachrichtigung zeigt dann die Frage, nicht „hat ein Foto gesendet“.",
              note_vi: "Câu hỏi là tin riêng, cuối cùng: thông báo sẽ hiện câu hỏi, không phải „đã gửi một ảnh“.",
              levels: {
                A1: {
                  text: "{da}{ban} đã học tiếng Đức bao giờ chưa ạ? {Minh} gửi lớp A1 gần nhất hợp với {ban} nha.",
                  translation_de: "„Hast du schon mal Deutsch gelernt? Dann schicke ich dir den nächsten passenden A1-Kurs.“"
                }
              }
            }
          ]
        },
        {
          tab_de: "Kursstart",
          tab_vi: "Khai giảng",
          customer: "Đức Anh",
          level: "A2",
          note_de: "Immer ein konkretes Datum und eine Uhrzeit nennen, nie nur „bald“. Danach eine geschlossene Frage zum Ort.",
          note_vi: "Luôn đưa ngày và giờ cụ thể, không bao giờ chỉ nói „sắp“. Sau đó hỏi một câu đóng về nơi học.",
          goal_de: "Erfahren, ob der genannte Kurs passt oder Đức Anh vor Ort in Hà Nội oder HCM lernen möchte.",
          goal_vi: "Biết lớp vừa gửi có hợp không, hay Đức Anh muốn học tại Hà Nội hoặc TP.HCM.",
          messages: [
            { from: "customer", stamp_de: "18:05", stamp_vi: "18:05", text: "Bên {goi} chuẩn bị có lớp nào từ {level} sắp khai giảng không ạ", translation_de: "„Startet bei euch bald ein Kurs ab {level}?“" },
            {
              from: "me",
              stamp_de: "18:06",
              stamp_vi: "18:06",
              text: "{chao} Lớp {level} online gần nhất khai giảng [NGÀY], học tối [THỨ], 18:30–20:00 giờ Việt Nam.\n{Ban} học online được không, hay muốn học tại Hà Nội / TP.HCM ạ?",
              translation_de: "„Hallo! Der nächste {level}-Online-Kurs startet am [DATUM], abends [TAGE], 18:30–20:00 vietnamesischer Zeit. Passt dir online, oder möchtest du lieber in Hà Nội oder HCM lernen?“"
            }
          ]
        },
        {
          tab_de: "Uhrzeit",
          tab_vi: "Khung giờ",
          customer: "Hải Yến",
          note_de: "Genau diese Uhrzeit gibt es nicht. Ehrlich sagen und alle nahen Zeitfenster auf einmal anbieten, nicht eins nach dem anderen.",
          note_vi: "Không có đúng khung giờ này. Nói thật và gửi tất cả khung giờ gần nhất trong một lần, không gửi từng cái một.",
          goal_de: "Erfahren, welches Zeitfenster passt und welches Niveau Hải Yến hat – dann schicken wir genau einen Kurs.",
          goal_vi: "Biết khung giờ nào hợp và Hải Yến đang ở trình độ nào – rồi gửi đúng một lớp.",
          messages: [
            { from: "customer", stamp_de: "22:31", stamp_vi: "22:31", text: "Bên {goi} có lớp học vào khung giờ 19h30 - 21h30 ko ạ", translation_de: "„Habt ihr einen Kurs von 19:30 bis 21:30?“" },
            {
              from: "me",
              stamp_de: "22:32",
              stamp_vi: "22:32",
              text: "{chao} Đúng 19:30–21:30 thì chưa có, nhưng có các khung gần nhất (giờ Việt Nam):\n• Online: 18:30–20:00 hoặc 20:30–22:00\n• Tại Hà Nội, TP.HCM: 18:00–20:30\nKhung nào hợp với {ban}, và {ban} đang học đến trình độ nào rồi ạ?",
              translation_de: "„Hallo! Genau 19:30–21:30 haben wir nicht, aber diese Zeiten liegen nah dran (vietnamesische Zeit): online 18:30–20:00 oder 20:30–22:00, vor Ort in Hà Nội und HCM 18:00–20:30. Welche passt dir, und bis zu welchem Niveau hast du schon gelernt?“"
            }
          ]
        },
        {
          tab_de: "Wohnort genannt",
          tab_vi: "Đã nói nơi ở",
          customer: "Bảo Trâm",
          level: "B1",
          place: "germany",
          note_de: "Wohnort und Niveau stehen schon in der Nachricht. Also gleich die passenden Kurse für {city_de} mit Startdatum und Bild schicken und nur noch eine Wahl lassen.",
          note_vi: "Nơi ở và trình độ đã có trong tin nhắn. Vì vậy gửi ngay các lớp phù hợp ở {city} kèm ngày khai giảng và hình, chỉ để khách chọn một.",
          goal_de: "Bảo Trâm wählt einen Kurs – dann reservieren wir den Platz und schicken die Anmeldung.",
          goal_vi: "Bảo Trâm chọn một lớp – rồi giữ chỗ và gửi thông tin đăng ký.",
          messages: [
            { from: "customer", stamp_de: "9:12", stamp_vi: "9:12", text: "{Toi} ở {city} muốn đăng ký một khóa học tiếng Đức {lv}", translation_de: "„Ich bin in {city_de} und möchte mich für einen {level}-Kurs anmelden.“" },
            {
              from: "me",
              stamp_de: "9:13",
              stamp_vi: "9:13",
              text: "{chao} Ở {city} thì {benminh} có các lớp {level} sắp khai giảng:\n{classes}\n{Minh} gửi kèm hình từng lớp nha. Lớp nào hợp với {ban} ạ?",
              translation_de: "„Hallo! Für dich in {city_de} starten bald diese {level}-Kurse: {classes}. Ich schicke dir zu jedem Kurs das Bild mit. Welcher passt dir?“",
              classes: {
                line: "• {kurs} {art}, {zeit}, khai giảng {start}",
                line_de: "{kurs} {art} um {zeit}, Start am {start}"
              }
            }
          ]
        },
        {
          tab_de: "Anfänger",
          tab_vi: "Mới bắt đầu",
          customer: "Tuấn Kiệt",
          note_de: "Das Niveau ist klar: A1. Kurz sagen, was A1 ist und wie lange es dauert, dann nur nach dem Wohnort fragen.",
          note_vi: "Trình độ đã rõ: A1. Nói ngắn A1 là gì và học bao lâu, rồi chỉ hỏi nơi ở.",
          goal_de: "Erfahren, wo Tuấn Kiệt wohnt – dann schicken wir einen A1-Kurs online oder in Hà Nội / HCM.",
          goal_vi: "Biết Tuấn Kiệt sống ở đâu – rồi gửi lớp A1 online hoặc tại Hà Nội / TP.HCM.",
          messages: [
            { from: "customer", stamp_de: "19:48", stamp_vi: "19:48", text: "Hi. {Toi} cần tư vấn học tiếng Đức cho người mới bắt đầu", translation_de: "„Hi. Ich brauche eine Beratung zu Deutschkursen für Anfänger.“" },
            {
              from: "me",
              stamp_de: "19:49",
              stamp_vi: "19:49",
              text: "{chao} Người mới bắt đầu thì học từ A1 nha {ban}: online 40 buổi, mỗi buổi 1,5 tiếng, khoảng 2,5–3 tháng. Giáo trình do NaNu NaNa tự biên soạn.\n{Ban} đang sống ở đâu ạ? {Minh} gửi lớp A1 online hoặc tại Hà Nội / TP.HCM phù hợp nha.",
              translation_de: "„Hallo! Als Anfänger startest du mit A1: online 40 Termine à 1,5 Stunden, etwa 2,5–3 Monate. Das Lehrmaterial hat NaNu NaNa selbst geschrieben. Wo wohnst du? Dann schicke ich dir einen passenden A1-Kurs online oder in Hà Nội / HCM.“"
            }
          ]
        },
        {
          tab_de: "Prüfung",
          tab_vi: "Luyện thi",
          customer: "Khánh Linh",
          level: "B1",
          note_de: "Bei Prüfungsvorbereitung entscheidet der Prüfungstermin, nicht nur der Wohnort. Deshalb fragen wir hier nach Niveau und Prüfungsmonat.",
          note_vi: "Với luyện thi, ngày thi mới là điều quyết định, không chỉ nơi ở. Vì vậy ở đây mình hỏi trình độ và tháng thi.",
          goal_de: "Erfahren, ob Khánh Linh {level} schon abgeschlossen hat und wann sie die Prüfung schreibt – dann bieten wir den {level}-Kurs oder die 1:1-Vorbereitung an.",
          goal_vi: "Biết Khánh Linh đã học xong {level} chưa và khi nào thi – rồi giới thiệu lớp {level} hoặc ôn thi 1 kèm 1.",
          messages: [
            { from: "customer", stamp_de: "16:20", stamp_vi: "16:20", text: "{Toi} muốn học đề thi lấy bằng {level} {goi} ạ", translation_de: "„Ich möchte mich auf die {level}-Prüfung vorbereiten.“" },
            {
              from: "me",
              stamp_de: "16:21",
              stamp_vi: "16:21",
              text: "{chao} {Benminh} có ôn thi {level} (telc) nha {ban}, học 1 kèm 1 với giáo viên, 2–3 buổi/tuần.\n{Ban} đã học xong {level} chưa, và dự định thi tháng mấy ạ?",
              translation_de: "„Hallo! Wir haben {level}-Prüfungsvorbereitung (telc), 1:1 mit einer Lehrkraft, 2–3 Termine pro Woche. Hast du {level} schon abgeschlossen, und in welchem Monat möchtest du die Prüfung schreiben?“"
            }
          ]
        },
        {
          tab_de: "Einzelunterricht",
          tab_vi: "Học 1 kèm 1",
          customer: "Mai Hương",
          note_de: "Ehrlich die Gruppe empfehlen: allein verliert man schneller die Motivation. 1:1 nur, wenn kein Gruppenkurs passt.",
          note_vi: "Thật lòng khuyên học nhóm: học một mình dễ mất động lực hơn. Chỉ học 1 kèm 1 khi không có lớp nhóm phù hợp.",
          goal_de: "Wohnort und Niveau erfahren – dann zeigen wir einen Gruppenkurs zu ihrer Uhrzeit und 1:1 nur als Ausweichlösung.",
          goal_vi: "Biết nơi ở và trình độ – rồi giới thiệu lớp nhóm hợp giờ, còn 1 kèm 1 chỉ là phương án dự phòng.",
          messages: [
            { from: "customer", stamp_de: "10:05", stamp_vi: "10:05", text: "{Toi} muốn học tiếng Đức 1/1", translation_de: "„Ich möchte Deutsch im Einzelunterricht lernen.“" },
            {
              from: "me",
              stamp_de: "10:06",
              stamp_vi: "10:06",
              text: "{chao} {Benminh} có học 1 kèm 1 khi lớp nhóm không hợp giờ {ban}. Nhưng thật lòng {minh} khuyên {ban} học nhóm nhỏ online (5–10 người): có bạn học cùng thì dễ giữ động lực hơn.\n{Ban} đang ở Việt Nam hay ở Đức, và đã học tiếng Đức chưa ạ?",
              translation_de: "„Hallo! Einzelunterricht bieten wir an, wenn kein Gruppenkurs zu deiner Zeit passt. Ehrlich gesagt empfehle ich dir aber eine kleine Online-Gruppe (5–10 Personen): Mit anderen zusammen bleibt man leichter motiviert. Bist du in Vietnam oder in Deutschland, und hast du schon Deutsch gelernt?“"
            }
          ]
        },
        {
          tab_de: "Spezieller Kurs",
          tab_vi: "Khóa chuyên đề",
          customer: "Gia Bảo",
          note_de: "Den Kurs gibt es nicht – ehrlich sagen und nichts versprechen. Dann zeigen, was der normale Kurs fürs Sprechen bietet. Den Wunsch im CRM notieren: Er zeigt, welche Kurse gefragt sind.",
          note_vi: "Không có khóa này – nói thật và không hứa hẹn. Sau đó cho khách thấy lớp thường giúp luyện nói thế nào. Ghi nhu cầu vào CRM: nó cho thấy khóa nào đang được hỏi.",
          goal_de: "Erfahren, welches Niveau Gia Bảo hat – dann schicken wir den passenden normalen Kurs.",
          goal_vi: "Biết Gia Bảo đang ở trình độ nào – rồi gửi lớp thường phù hợp.",
          messages: [
            { from: "customer", stamp_de: "14:37", stamp_vi: "14:37", text: "bên {goi} có khóa dạy về giao tiếp trong nhà hàng khách sạn ko ạ", translation_de: "„Habt ihr einen Kurs für Kommunikation im Restaurant und Hotel?“" },
            {
              from: "me",
              stamp_de: "14:38",
              stamp_vi: "14:38",
              text: "{chao} Hiện {benminh} chưa có khóa riêng cho nhà hàng – khách sạn. Lớp A1–B1 luyện đủ 4 kỹ năng và buổi nào cũng luyện nói, nên giao tiếp hằng ngày ở nơi làm việc {ban} sẽ dùng được.\n{Ban} đã học tiếng Đức đến trình độ nào rồi ạ?",
              translation_de: "„Hallo! Einen eigenen Kurs für Restaurant und Hotel haben wir zurzeit nicht. Die Kurse A1–B1 trainieren alle vier Fertigkeiten, und in jeder Einheit wird gesprochen – das hilft dir auch bei der Arbeit. Bis zu welchem Niveau hast du schon Deutsch gelernt?“"
            }
          ]
        },
        {
          tab_de: "Klassengröße",
          tab_vi: "Sĩ số lớp",
          customer: "Thảo Vy",
          note_de: "Die Zahl sofort nennen, dazu ein Vorteil, der dahinter steckt: feste Lehrkräfte. Dann die zwei Fragen aus Schritt 3.",
          note_vi: "Đưa con số ngay, kèm một lợi ích đi cùng: giáo viên cố định. Sau đó hỏi 2 câu ở bước 3.",
          goal_de: "Erfahren, ob Thảo Vy online oder vor Ort lernen möchte und welches Niveau sie hat.",
          goal_vi: "Biết Thảo Vy muốn học online hay tại lớp và đang ở trình độ nào.",
          messages: [
            { from: "customer", stamp_de: "20:50", stamp_vi: "20:50", text: "1 lớp khoảng bn học viên ạ", translation_de: "„Wie viele Teilnehmende sind ungefähr in einer Klasse?“" },
            {
              from: "me",
              stamp_de: "20:51",
              stamp_vi: "20:51",
              text: "{chao} Lớp online có 5–10 học viên, lớp tại Hà Nội và TP.HCM có 8–15 học viên. Mỗi lớp có 1–2 giáo viên cố định từ đầu đến cuối khoá.\n{Ban} định học online hay tại lớp, và đang ở trình độ nào ạ?",
              translation_de: "„Hallo! Online sind 5–10 Personen in einer Klasse, vor Ort in Hà Nội und HCM 8–15. Jede Klasse hat 1–2 feste Lehrkräfte vom Anfang bis zum Ende. Möchtest du online oder vor Ort lernen, und welches Niveau hast du?“"
            }
          ]
        },
        {
          tab_de: "Allgemeine Beratung",
          tab_vi: "Nhờ tư vấn",
          customer: "Hoàng Nam",
          note_de: "Wir wissen noch nicht, worum es geht. Deshalb nur eine geschlossene Frage mit zwei Antworten statt einer offenen „Wie kann ich helfen?“.",
          note_vi: "Mình chưa biết khách cần gì. Vì vậy chỉ hỏi một câu đóng có hai lựa chọn, thay vì câu mở „Mình giúp gì được cho bạn?“.",
          goal_de: "Erfahren, ob Hoàng Nam einen Sprachkurs oder Ausbildung in Deutschland sucht – dann geht es mit Wohnort und Niveau weiter.",
          goal_vi: "Biết Hoàng Nam cần lớp tiếng hay du học nghề – rồi hỏi tiếp nơi ở và trình độ.",
          messages: [
            { from: "customer", stamp_de: "23:10", stamp_vi: "23:10", text: "{goi} ơii tư vấn cho {toi} với ạ", translation_de: "„Kannst du mich bitte beraten?“" },
            {
              from: "me",
              stamp_de: "23:11",
              stamp_vi: "23:11",
              text: "{chao} {Minh} tư vấn cho {ban} ngay nha.\n{Ban} đang quan tâm học tiếng Đức hay chương trình du học nghề Đức ạ?",
              translation_de: "„Hallo! Ich berate dich gern. Interessierst du dich für einen Deutschkurs oder für die Ausbildung in Deutschland?“"
            }
          ]
        }
      ]
    },
    {
      type: "paragraph",
      de: "Fragt jemand nach dem Preis, klären wir zuerst den Wohnort. Danach schicken wir genau ein Vorteilsbild vor dem Preis. Es zeigt, was im Preis steckt, damit die Zahl nicht allein dasteht.",
      vi: "Khi khách hỏi học phí, mình hỏi nơi ở trước. Sau đó gửi đúng một ảnh quyền lợi trước khi báo giá. Ảnh cho thấy học phí đã gồm những gì, để con số không đứng một mình."
    },
    {
      type: "list",
      items: [
        {
          de: "Online-Bild: für alle außerhalb von Hà Nội und HCM, in Deutschland oder wer lieber online lernt. Nur hier steht die 100-%-Rückerstattung – sie gilt nur für Online-Kurse.",
          vi: "Ảnh online: cho khách ở ngoài Hà Nội và TP.HCM, đang ở Đức hoặc muốn học online. Chỉ ảnh này có hoàn 100% học phí – chỉ áp dụng cho lớp online."
        },
        {
          de: "Offline-Bild: für alle in Hà Nội oder HCM. Wer dort wohnt, aber online lernen möchte, bekommt das Online-Bild. Handbuch und Tasche gibt es nur in Offline-Kursen.",
          vi: "Ảnh offline: cho khách ở Hà Nội hoặc TP.HCM. Khách ở đó nhưng muốn học online thì gửi ảnh online. Sách Handbuch và túi tote chỉ dành cho lớp offline."
        },
        {
          de: "Nicht mehr schicken: das alte Bild „Bộ quà tặng“ – es verspricht auch Online-Kunden Buch und Tasche. „Tại sao chúng tôi được lựa chọn?“ und „Các khoá học tại NaNu NaNa“ passen zu Facebook-Beiträgen, nicht in den Chat.",
          vi: "Không gửi nữa: ảnh cũ „Bộ quà tặng“ – ảnh này hứa cả với khách online là có sách và túi. „Tại sao chúng tôi được lựa chọn?“ và „Các khoá học tại NaNu NaNa“ hợp với bài đăng Facebook, không hợp để gửi trong chat."
        },
        {
          de: "Die Preistabelle nur schicken, wenn jemand nach Details fragt, z. B. nach Kombi-Angeboten oder der Zahlung in Deutschland.",
          vi: "Chỉ gửi bảng học phí khi khách hỏi chi tiết, ví dụ ưu đãi học trọn nhiều khoá hoặc đóng học phí tại Đức."
        }
      ]
    },
    {
      type: "link",
      url: "/sales/vorteile-online.png",
      de: "Vorteilsbild Online",
      vi: "Ảnh quyền lợi lớp online"
    },
    {
      type: "link",
      url: "/sales/vorteile-offline.png",
      de: "Vorteilsbild Offline",
      vi: "Ảnh quyền lợi lớp offline"
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
      level: "A2",
      place: "hanoi",
      note_de: "Nur Wohnort und Niveau. Als Minh Anh nicht antwortet, schreiben wir am nächsten Tag einmal freundlich nach.",
      note_vi: "Chỉ hỏi nơi ở và trình độ. Khi Minh Anh chưa trả lời, hôm sau mình nhắn lại một lần thật nhẹ nhàng.",
      messages: [
        {
          from: "me",
          stamp_de: "20:15",
          stamp_vi: "20:15",
          text: "{da}để {minh} gửi lớp phù hợp, {ban} cho {minh} hỏi 2 điều nha:\n1. {Ban} đang sống ở đâu?\n2. {Ban} học tiếng Đức đến trình độ nào rồi?",
          translation_de: "„Damit ich dir passende Kurse schicken kann, zwei kurze Fragen: 1. Wo wohnst du? 2. Bis zu welchem Niveau hast du schon Deutsch gelernt?“"
        },
        {
          from: "me",
          stamp_de: "Am nächsten Tag · 19:30",
          stamp_vi: "Hôm sau · 19:30",
          text: "{da}{ten} ơi, {ban} cho {minh} biết nơi ở và trình độ để {minh} gửi lịch lớp phù hợp nha 😊",
          translation_de: "„Minh Anh, sag mir kurz Wohnort und Niveau, dann schicke ich dir die passenden Kurse 😊“"
        },
        {
          from: "customer",
          stamp_de: "19:42",
          stamp_vi: "19:42",
          text: "{Toi} ở {city}, mới học xong {prev} ạ",
          translation_de: "„Ich wohne in {city_de} und habe gerade {prev} abgeschlossen.“",
          levels: {
            A1: { text: "{Toi} ở {city}, chưa học tiếng Đức bao giờ ạ", translation_de: "„Ich wohne in {city_de} und habe noch nie Deutsch gelernt.“" }
          }
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
      level: "A2",
      place: "hanoi",
      note_de: "Nur Kurse, die zu Wohnort und Niveau passen – zwei Optionen, die beide ein „Ja“ sein können.",
      note_vi: "Chỉ gửi lớp phù hợp với nơi ở và trình độ – hai lựa chọn, cả hai đều có thể là „có“.",
      messages: [
        {
          from: "me",
          stamp_de: "19:43",
          stamp_vi: "19:43",
          text: "{da}{minh} cảm ơn {ban}! Học xong {prev} thì {ban} học tiếp {level} nha. Ở {city} {ban} học online, đang có 2 lớp {level} phù hợp (giờ Việt Nam):\n• Lớp tối 2-4-6, 18:30–20:00, khai giảng 10/11\n• Lớp tối 3-5-7, 20:30–22:00, khai giảng 15/11",
          translation_de: "„Danke! Nach {prev} geht es mit {level} weiter. In {city_de} lernst du online, es gibt zwei passende {level}-Kurse (vietnamesische Zeit): Abendkurs Mo-Mi-Fr, 18:30–20:00, Start 10.11. · Abendkurs Di-Do-Sa, 20:30–22:00, Start 15.11.“",
          levels: {
            A1: {
              text: "{da}{minh} cảm ơn {ban}! Mới bắt đầu thì {ban} học từ A1 nha. Ở {city} {ban} học online, đang có 2 lớp A1 phù hợp (giờ Việt Nam):\n• Lớp tối 2-4-6, 18:30–20:00, khai giảng 10/11\n• Lớp tối 3-5-7, 20:30–22:00, khai giảng 15/11",
              translation_de: "„Danke! Als Anfänger startest du mit A1. In {city_de} lernst du online, es gibt zwei passende A1-Kurse (vietnamesische Zeit): Abendkurs Mo-Mi-Fr, 18:30–20:00, Start 10.11. · Abendkurs Di-Do-Sa, 20:30–22:00, Start 15.11.“"
            }
          },
          places: {
            city: {
              text: "{da}{minh} cảm ơn {ban}! Học xong {prev} thì {ban} học tiếp {level} nha. Ở {city} đang có 2 lớp {level} phù hợp:\n• Lớp tối 2-4-6, 18:30–20:30, khai giảng 10/11\n• Lớp cuối tuần T7–CN, 9:00–11:30, khai giảng 15/11",
              translation_de: "„Danke! Nach {prev} geht es mit {level} weiter. In {city_de} gibt es zwei passende {level}-Kurse: Abendkurs Mo-Mi-Fr, 18:30–20:30, Start 10.11. · Wochenendkurs Sa–So, 9:00–11:30, Start 15.11.“"
            },
            germany: {
              text: "{da}{minh} cảm ơn {ban}! Học xong {prev} thì {ban} học tiếp {level} nha. Ở Đức {ban} học online, đang có 2 lớp {level} phù hợp (giờ Đức):\n• Lớp tối 2-4-6, 21:00–22:30, khai giảng 10/11\n• Lớp chiều 3-5-7, 14:30–16:00, khai giảng 15/11",
              translation_de: "„Danke! Nach {prev} geht es mit {level} weiter. In Deutschland lernst du online, es gibt zwei passende {level}-Kurse (deutsche Zeit): Abendkurs Mo-Mi-Fr, 21:00–22:30, Start 10.11. · Nachmittagskurs Di-Do-Sa, 14:30–16:00, Start 15.11.“"
            }
          }
        },
        {
          from: "customer",
          text: "Lớp tối 2-4-6 hợp với {toi} á. Học phí bao nhiêu vậy {goi}?",
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
      level: "A2",
      place: "hanoi",
      note_de: "Leistungen vor dem Preis, die Abschlussfrage direkt im Angebot, Reservierung und Zahlung gleich miterklärt – und am nächsten Tag ein Nachfassen mit etwas Neuem (freie Plätze).",
      note_vi: "Quyền lợi trước giá, hỏi chốt ngay trong tin báo giá, nói luôn cách giữ chỗ và thanh toán – và hôm sau nhắn lại với điều mới (số chỗ còn trống).",
      messages: [
        {
          from: "me",
          stamp_de: "19:44",
          stamp_vi: "19:44",
          text: "{da}lớp {level} tối 2-4-6 học cùng một giáo viên từ {level} lên {next}, có app NaNu Go học miễn phí đi kèm. Học phí: {fee} cho {sessions} buổi.",
          translation_de: "„Im {level}-Abendkurs Mo-Mi-Fr lernst du mit derselben Lehrkraft von {level} bis {next}, inklusive kostenloser App NaNu Go. Preis: {fee} für {sessions} Einheiten.“",
          places: {
            germany: {
              text: "{da}lớp {level} tối 2-4-6 học cùng một giáo viên từ {level} lên {next}, có app NaNu Go học miễn phí đi kèm. Học phí: {fee_eur} ({fee}) cho {sessions} buổi.",
              translation_de: "„Im {level}-Abendkurs Mo-Mi-Fr lernst du mit derselben Lehrkraft von {level} bis {next}, inklusive kostenloser App NaNu Go. Preis: {fee_eur} ({fee}) für {sessions} Einheiten.“"
            }
          }
        },
        {
          from: "me",
          text: "{da}{minh} giữ chỗ cho {ban} lớp tối 2-4-6 khai giảng 10/11 nha? {Ban} chỉ cần chuyển khoản theo thông tin dưới đây, {minh} giữ chỗ ngay và gửi xác nhận trong chat này:\n[THÔNG TIN CHUYỂN KHOẢN]",
          translation_de: "„Soll ich dir einen Platz im Abendkurs Mo-Mi-Fr ab 10.11. reservieren? Du überweist einfach an die Daten unten, ich reserviere sofort und bestätige hier im Chat.“"
        },
        {
          from: "me",
          stamp_de: "Am nächsten Tag · 18:00",
          stamp_vi: "Hôm sau · 18:00",
          text: "{da}{ten} ơi, lớp tối 2-4-6 chỉ còn 3 chỗ thôi nè. {Minh} giữ 1 chỗ cho {ban} nha?",
          translation_de: "„Minh Anh, im Abendkurs Mo-Mi-Fr sind nur noch 3 Plätze frei. Soll ich dir einen reservieren?“"
        },
        {
          from: "customer",
          stamp_de: "18:20",
          stamp_vi: "18:20",
          text: "Ok {goi}, {toi} chuyển khoản liền nha",
          translation_de: "„Okay, ich überweise gleich.“"
        },
        {
          from: "me",
          text: "{da}{minh} cảm ơn {ten}! {Minh} đã giữ chỗ cho {ban} rồi. Chút nữa {ban} sẽ nhận email để bắt đầu học nha 🎉",
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
