import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata = { title: "Freischaltung ausstehend" };

export default async function PendingPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.profile.role !== "pending") redirect("/");

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
            Du bist als <strong>{session.profile.email}</strong> angemeldet. Eine Admin weist dir gleich deine Rolle zu – danach
            siehst du deine Inhalte.
          </span>
          <span className="vi">Quản trị viên sẽ sớm gán vai trò cho bạn – sau đó bạn sẽ thấy nội dung của mình.</span>
        </p>
        <form action="/auth/signout" method="post" className="mt-6">
          <button type="submit" className="h-10 rounded-lg bg-chip px-4 text-sm font-medium text-ink hover:bg-line">
            Abmelden · Đăng xuất
          </button>
        </form>
      </div>
    </main>
  );
}
