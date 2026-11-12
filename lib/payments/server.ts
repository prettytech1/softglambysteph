import "server-only";
import { createClient } from "@supabase/supabase-js";

export async function markOrderPaid(reference: string, amountNaira: number) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  const sb = createClient(url, key, { auth: { persistSession: false } });
  // Only flip to paid when the amount Paystack confirms matches what we recorded.
  await sb.from("orders").update({ payment_status: "paid", paid_amount: amountNaira, paid_at: new Date().toISOString() })
    .eq("reference", reference).eq("total", amountNaira);
}
