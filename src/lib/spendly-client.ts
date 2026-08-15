import { createClient } from "@supabase/supabase-js";

/**
 * Legacy helper maintained for backward compatibility.
 * All active transaction operations now use Flask REST API and SQLite.
 */
export function getServerSupabase() {
  const url = process.env["SUPABASE_URL"] || "https://placeholder.supabase.co";
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] || "placeholder-key";
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
