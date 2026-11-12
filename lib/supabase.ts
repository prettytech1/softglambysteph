import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseEnabled = Boolean(url && anon);

let client: SupabaseClient | null = null;
export function supabase(): SupabaseClient | null {
  if (!supabaseEnabled) return null;
  if (!client) client = createClient(url!, anon!, { auth: { persistSession: false } });
  return client;
}

/** Best-effort insert. WhatsApp remains the primary channel, so failures never block the customer. */
export async function recordSubmission(table: "bookings" | "orders" | "enquiries" | "newsletter", row: Record<string, unknown>) {
  const sb = supabase();
  if (!sb) return { stored: false as const };
  const { error } = await sb.from(table).insert(row);
  if (error) console.warn(`[supabase] ${table} insert failed:`, error.message);
  return { stored: !error };
}
