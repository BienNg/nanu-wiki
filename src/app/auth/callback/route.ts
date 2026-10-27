import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") ? nextParam : "/";

  // Supabase/Google can send an error back instead of a code.
  let reason = searchParams.get("error_description") ?? searchParams.get("error");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    reason = error.message;
  } else if (!reason) {
    reason = "Kein Code von Supabase erhalten (no code in callback)";
  }

  console.error("[auth/callback] sign-in failed:", reason, "| url:", request.url);
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(reason.slice(0, 300))}`);
}
