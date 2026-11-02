import type { PageContent } from "@/lib/types";

const page: PageContent = {
  slug: "google-drive-offline",
  title_de: "Google Drive auf dem PC: unsere Ordner offline",
  title_vi: "Google Drive trên máy tính: dùng thư mục chung khi không có mạng",
  kind: "process",
  section: "general",
  verified_until: null,
  updated_at: "2026-11-02",
  body: [
    {
      type: "paragraph",
      de: "Mit der App „Google Drive für Desktop“ liegen unsere drei wichtigsten Ordner direkt auf deinem PC. Du öffnest Dateien wie normale Dateien – auch ohne Internet, z. B. wenn das WLAN im Unterricht ausfällt. Einmal einrichten dauert etwa 15 Minuten.",
      vi: "Với ứng dụng „Google Drive for desktop“, ba thư mục quan trọng nhất của trung tâm nằm ngay trên máy tính của bạn. Bạn mở file như file bình thường – kể cả khi không có mạng, ví dụ khi wifi trong lớp bị mất. Cài đặt một lần mất khoảng 15 phút."
    },
    { type: "heading", de: "Diese drei Ordner", vi: "Ba thư mục này", anchor: "ordner" },
    { type: "link", url: "https://drive.google.com/drive/folders/10pKNo1jVTBluQsI74kpWT61glDx9e045", de: "[01] Import", vi: "[01] Import" },
    { type: "link", url: "https://drive.google.com/drive/folders/10rTzJAP27tfhqbnftqfWzUHQg0umR6DO", de: "[03] Unterricht/ Lesson", vi: "[03] Unterricht/ Lesson" },
    { type: "link", url: "https://drive.google.com/drive/folders/1V2LZI6M_qz8RHTfJjEN1uufotxMGvJr6", de: "[10] Thông tin cho khách hàng", vi: "[10] Thông tin cho khách hàng" },
    {
      type: "callout",
      tone: "info",
      de: "Öffnet sich ein Link nicht („Zugriff anfordern“)? Dann hat dein Google-Konto noch keinen Zugriff. Frag in Slack bei der Leitung nach und nenne die E-Mail-Adresse, mit der du angemeldet bist.",
      vi: "Link không mở được (hiện „Yêu cầu quyền truy cập“)? Tức là tài khoản Google của bạn chưa được chia sẻ. Hỏi quản lý trên Slack và gửi kèm email bạn đang đăng nhập."
    },
    { type: "heading", de: "So richtest du es ein", vi: "Cách cài đặt", anchor: "einrichten" },
    {
      type: "steps",
      items: [
        {
          de: "Ordner zu „Meine Ablage“ hinzufügen",
          vi: "Thêm thư mục vào „Drive của tôi“",
          body_de: "Öffne jeden der drei [Ordner-Links oben](#ordner) im Browser. Klick oben auf den Ordnernamen → „Organisieren“ → „Verknüpfung hinzufügen“ → „Meine Ablage“ → „Hinzufügen“. Wichtig: Ordner, die nur mit dir geteilt sind, erscheinen sonst nicht auf dem PC.",
          body_vi: "Mở từng [link thư mục ở trên](#ordner) bằng trình duyệt. Bấm vào tên thư mục ở trên cùng → „Sắp xếp“ → „Thêm lối tắt“ → „Drive của tôi“ → „Thêm“. Quan trọng: thư mục chỉ được chia sẻ với bạn sẽ không hiện trên máy tính nếu bỏ qua bước này."
        },
        {
          de: "Google Drive für Desktop installieren",
          vi: "Cài Google Drive for desktop",
          body_de: "Lade die App unter [google.com/drive/download](https://www.google.com/drive/download/) herunter („Drive für Desktop herunterladen“) und installiere sie. Es gibt sie für Windows und Mac.",
          body_vi: "Tải ứng dụng tại [google.com/drive/download](https://www.google.com/drive/download/) („Tải Drive for desktop xuống“) rồi cài đặt. Có bản cho Windows và Mac."
        },
        {
          de: "Mit dem richtigen Konto anmelden",
          vi: "Đăng nhập đúng tài khoản",
          body_de: "Melde dich mit dem Google-Konto an, mit dem du die Ordner im Browser öffnen kannst. Ein anderes (privates) Konto sieht die Ordner nicht.",
          body_vi: "Đăng nhập bằng tài khoản Google mà bạn dùng để mở được các thư mục trên trình duyệt. Tài khoản khác (cá nhân) sẽ không thấy các thư mục này."
        },
        {
          de: "„Dateien streamen“ lassen",
          vi: "Giữ chế độ „Truyền trực tuyến tệp“",
          body_de: "In den Einstellungen der App (Zahnrad → Einstellungen → Google Drive) ist „Dateien streamen“ voreingestellt. Lass das so – dann landen nur die Ordner auf dem PC, die du offline brauchst, nicht deine ganze Ablage.",
          body_vi: "Trong phần cài đặt của ứng dụng (bánh răng → Cài đặt → Google Drive), „Truyền trực tuyến tệp“ (Stream files) là mặc định. Cứ để vậy – máy chỉ lưu những thư mục bạn cần dùng offline, không tải cả Drive về."
        },
        {
          de: "Die drei Ordner offline verfügbar machen",
          vi: "Bật dùng offline cho ba thư mục",
          body_de: "Öffne den Explorer (Windows) bzw. Finder (Mac) → „Google Drive“ → „Meine Ablage“. Rechtsklick auf jeden der drei Ordner → „Offlinezugriff“ → „Offline verfügbar“. Unter Windows 11 steht es eventuell erst unter „Weitere Optionen anzeigen“.",
          body_vi: "Mở File Explorer (Windows) hoặc Finder (Mac) → „Google Drive“ → „Drive của tôi“. Chuột phải vào từng thư mục → „Truy cập ngoại tuyến“ → „Có sẵn khi không có mạng“. Trên Windows 11 có thể phải bấm „Hiển thị thêm tùy chọn“ trước."
        },
        {
          de: "Warten, bis alles geladen ist",
          vi: "Chờ tải xong",
          body_de: "Die App lädt jetzt alle Dateien herunter. Fertig ist es, wenn an den Ordnern ein grüner Haken steht. Lass den PC dafür am Internet – beim Unterrichtsordner mit Videos kann das dauern.",
          body_vi: "Ứng dụng sẽ tải toàn bộ file về. Xong khi thư mục có dấu tích xanh. Để máy kết nối mạng trong lúc này – thư mục bài giảng có video nên có thể mất khá lâu."
        },
        {
          de: "Testen",
          vi: "Kiểm tra",
          body_de: "WLAN ausschalten und eine Datei aus jedem Ordner öffnen. Klappt es, bist du fertig. Neue oder geänderte Dateien kommen von selbst dazu, sobald du wieder online bist.",
          body_vi: "Tắt wifi rồi mở thử một file trong mỗi thư mục. Mở được là xong. File mới hoặc file được sửa sẽ tự cập nhật khi bạn có mạng lại."
        }
      ]
    },
    { type: "heading", de: "Gut zu wissen", vi: "Cần biết thêm", anchor: "gut-zu-wissen" },
    {
      type: "callout",
      tone: "warning",
      de: "Was du im Drive-Ordner auf dem PC löschst oder verschiebst, ist auch für alle anderen weg. Ablegen ja, aufräumen nein. Brauchst du eine Datei zum Bearbeiten, kopier sie zuerst auf den Desktop.",
      vi: "File bạn xoá hoặc di chuyển trong thư mục Drive trên máy cũng sẽ mất với tất cả mọi người. Được thêm file, không tự dọn dẹp. Cần sửa file thì copy ra Desktop trước."
    },
    {
      type: "list",
      items: [
        {
          de: "PDFs, Bilder, Videos und Audios öffnen sich offline direkt. Google Docs, Sheets und Slides öffnen sich dagegen im Browser: Dafür in Chrome die Erweiterung [„Google Docs Offline“](https://chromewebstore.google.com/detail/google-docs-offline/ghbmnnjooekpmoecnnnilnnbdlolhkhi) installieren und auf [drive.google.com](https://drive.google.com/drive/settings) unter Einstellungen → „Offline“ einschalten.",
          vi: "PDF, ảnh, video và audio mở được ngay khi offline. Còn Google Docs, Sheets và Slides sẽ mở bằng trình duyệt: cần cài tiện ích [„Google Docs Offline“](https://chromewebstore.google.com/detail/google-docs-offline/ghbmnnjooekpmoecnnnilnnbdlolhkhi) trên Chrome và bật „Ngoại tuyến“ trong Cài đặt trên [drive.google.com](https://drive.google.com/drive/settings)."
        },
        {
          de: "Die Ordner brauchen Speicherplatz auf dem PC. Wenn die Festplatte voll ist, lädt die App nicht alles herunter – dann zuerst Platz schaffen.",
          vi: "Các thư mục chiếm dung lượng trên máy. Ổ cứng đầy thì ứng dụng không tải hết được – cần dọn bớt chỗ trước."
        },
        {
          de: "Die App muss laufen (Drive-Symbol in der Taskleiste bzw. Menüleiste). Sie startet normalerweise automatisch mit dem PC.",
          vi: "Ứng dụng phải đang chạy (biểu tượng Drive ở thanh tác vụ / thanh menu). Thường nó tự khởi động cùng máy."
        }
      ]
    }
  ]
};

export default page;
