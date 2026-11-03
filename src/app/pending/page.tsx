import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Freischaltung ausstehend" };

export default async function PendingPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role !== "pending") redirect("/");
  const email = session.profile.email;

  // What happens next, so a new hire isn't left guessing while they wait.
  const steps = [
    {
      de: "Eine Admin prüft dein Konto und gibt dir deine Rolle. Sag deiner Leitung Bescheid, dass du dich angemeldet hast – dann geht es schneller.",
      vi: "Quản trị viên sẽ kiểm tra tài khoản và gán vai trò cho bạn. Hãy báo cho quản lý của bạn là bạn đã đăng ký – như vậy sẽ nhanh hơn.",
    },
    {
      de: (
        <>
          Prüfe, dass dein Slack dieselbe E-Mail nutzt: <strong>{email}</strong>. Nur dann bekommt dein Buddy deine Fortschritte auf Slack.
        </>
      ),
      vi: (
        <>
          Kiểm tra Slack của bạn dùng cùng email: <strong>{email}</strong>. Chỉ khi đó người hướng dẫn mới nhận được tiến độ của bạn qua Slack.
        </>
      ),
    },
    {
      de: "Danach startest du mit deinem Lernpfad. Woche 1 beginnt mit einer kurzen Seite: „Um Hilfe bitten“.",
      vi: "Sau đó bạn bắt đầu lộ trình học. Tuần 1 mở đầu bằng một trang ngắn: „Nhờ giúp đỡ“.",
    },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center bg-peach px-4">
      <div className="w-full max-w-[460px] rounded-[14px] border-[1.5px] border-ink bg-white p-8">
        <span className="cap">Fast geschafft · Gần xong rồi</span>
        <h1 className="title-display mt-2 text-[26px] leading-tight">
          Dein Konto wartet auf Freischaltung
          <span className="vi">Tài khoản của bạn đang chờ được duyệt</span>
        </h1>
        <p className="mt-3 text-[15px]">
          <span className="de">
            Du bist als <strong>{email}</strong> angemeldet.
          </span>
          <span className="vi">Bạn đang đăng nhập bằng {email}.</span>
        </p>
        <h2 className="mt-5 text-[15px] font-semibold">
          So geht es weiter
          <span className="vi">Tiếp theo là gì</span>
        </h2>
        <ol className="mt-2 flex list-none flex-col gap-3 p-0 text-[14px]">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-chip text-[13px] font-semibold">{i + 1}</span>
              <span>
                <span className="de">{s.de}</span>
                <span className="vi">{s.vi}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/" className="inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-[#1F5DB5] hover:text-white">
            Erneut prüfen · Kiểm tra lại
          </Link>
          <form action="/auth/signout" method="post">
            <button type="submit" className="h-10 rounded-lg bg-chip px-4 text-sm font-medium text-ink hover:bg-line">
              Abmelden · Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
