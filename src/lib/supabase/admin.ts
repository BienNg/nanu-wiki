import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Service-role client. Bypasses RLS – use ONLY in trusted server code
 *  (cron jobs), never with user input deciding what to read or write. */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
