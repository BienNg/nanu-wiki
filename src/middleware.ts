import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/auth/callback", "/api/cron", "/api/whatsapp/webhook", "/api/messenger/webhook"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const matches = (p: string) => path === p || path.startsWith(`${p}/`);
  // These routes authenticate with signatures or a cron secret, not browser cookies.
  if (["/api/cron", "/api/whatsapp/webhook", "/api/messenger/webhook"].some(matches)) return NextResponse.next({ request });
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refreshes the session cookie if needed. Do not remove.
  const {
    data: { user }, error,
  } = await supabase.auth.getUser();

  const isPublic = PUBLIC_PATHS.some(matches);
  if (error && (error.name === "AuthRetryableFetchError" || (error.status ?? 0) >= 500) && !isPublic) {
    return new NextResponse("Authentication service temporarily unavailable. Please reload shortly. · Dịch vụ đăng nhập tạm thời không kết nối được. Vui lòng tải lại.", { status: 503, headers: { "Retry-After": "15", "Cache-Control": "no-store" } });
  }

  if (!user && !isPublic) {
    if (path.startsWith("/api/")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
