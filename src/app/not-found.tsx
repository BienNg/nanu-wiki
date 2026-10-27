import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-peach px-4">
      <div className="max-w-[420px] text-center">
        <span className="cap">404</span>
        <h1 className="title-display mt-2 text-[28px] leading-tight">
          Seite nicht gefunden
          <span className="vi">Không tìm thấy trang</span>
        </h1>
        <p className="mt-3 text-[15px]">
          <span className="de">Vielleicht fehlt dir die Berechtigung, oder die Seite wurde verschoben.</span>
          <span className="vi">Có thể bạn chưa có quyền xem, hoặc trang đã được chuyển đi.</span>
        </p>
        <Link href="/" className="mt-6 inline-flex h-10 items-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:text-white">
          Zur Startseite · Về trang chủ
        </Link>
      </div>
    </main>
  );
}
