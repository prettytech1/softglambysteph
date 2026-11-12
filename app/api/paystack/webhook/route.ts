import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/payments/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ ok: false }, { status: 503 });
  const raw = await req.text();
  const sig = req.headers.get("x-paystack-signature") ?? "";
  const expected = createHmac("sha512", secret).update(raw).digest("hex");
  if (sig.length !== expected.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const event = JSON.parse(raw);
  if (event.event === "charge.success") await markOrderPaid(event.data.reference, event.data.amount / 100);
  return NextResponse.json({ ok: true });
}
