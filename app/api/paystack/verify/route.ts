import { NextResponse } from "next/server";
import { markOrderPaid } from "@/lib/payments/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const reference = new URL(req.url).searchParams.get("reference");
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!reference) return NextResponse.json({ verified: false, message: "Missing reference." }, { status: 400 });
  if (!secret) return NextResponse.json({ verified: false, message: "Payment verification isn't configured." }, { status: 503 });

  const r = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });
  const body = await r.json().catch(() => null);
  const verified = r.ok && body?.status === true && body?.data?.status === "success";

  if (verified) await markOrderPaid(reference, body.data.amount / 100);
  return NextResponse.json({ verified, message: verified ? undefined : body?.data?.gateway_response ?? "Payment not confirmed." });
}

