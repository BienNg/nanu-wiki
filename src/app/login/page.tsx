import { LoginButton } from "./LoginButton";

export const metadata = { title: "Anmelden" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-peach px-4">
      <div className="w-full max-w-[420px] rounded-[14px] border-[1.5px] border-ink bg-white p-8 shadow-[0_10px_30px_rgba(60,40,20,.08)]">
        <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
          N
        </span>
        <h1 className="title-display mt-5 text-[28px] leading-tight">
          Willkommen im NaNu Wiki
          <span className="vi">Chào mừng bạn đến với NaNu Wiki</span>
        </h1>
        <p className="mt-3 text-[15px] text-body">
          <span className="de">Melde dich mit deinem Google-Konto an. Neue Konten werden von einer Admin freigeschaltet.</span>
          <span className="vi">Đăng nhập bằng tài khoản Google. Tài khoản mới sẽ được quản trị viên duyệt.</span>
        </p>
        {error && (
          <p role="alert" className="mt-4 rounded-lg bg-bad-soft px-3 py-2 text-[13px] text-bad">
            Anmeldung fehlgeschlagen · Đăng nhập thất bại
            {error !== "auth" && <span className="mt-1 block font-mono text-xs opacity-80">{error}</span>}
          </p>
        )}
        <LoginButton next={next ?? "/"} />
      </div>
    </main>
  );
}
