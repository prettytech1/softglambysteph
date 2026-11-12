"use client";
/**
 * Paystack Inline integration.
 *
 * Flow: open Paystack popup → customer pays → Paystack returns a reference →
 * we call /api/paystack/verify (server, secret key) → only a verified "success" marks the order paid.
 * The webhook at /api/paystack/webhook is the backstop if the customer closes the tab early.
 *
 * Enabled only when NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY is set. Without it the UI never shows a card button.
 */
export const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ?? "";
export const paystackEnabled = paystackPublicKey.length > 0;

declare global {
  interface Window { PaystackPop?: { setup(opts: Record<string, unknown>): { openIframe(): void } } }
}

function loadScript(): Promise<void> {
  if (window.PaystackPop) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Couldn't load Paystack. Check your connection and try again."));
    document.head.appendChild(s);
  });
}

export interface PaystackResult { status: "verified" | "failed" | "cancelled"; reference?: string; message?: string; }

export async function payWithPaystack(opts: { email: string; amountNaira: number; reference: string; metadata?: Record<string, unknown> }): Promise<PaystackResult> {
  if (!paystackEnabled) return { status: "failed", message: "Card payment isn't connected." };
  await loadScript();
  return new Promise((resolve) => {
    const handler = window.PaystackPop!.setup({
      key: paystackPublicKey,
      email: opts.email,
      amount: Math.round(opts.amountNaira * 100), // kobo
      currency: "NGN",
      ref: opts.reference,
      metadata: opts.metadata,
      callback: (res: { reference: string }) => {
        fetch(`/api/paystack/verify?reference=${encodeURIComponent(res.reference)}`)
          .then((r) => r.json())
          .then((d) => resolve(d.verified ? { status: "verified", reference: res.reference } : { status: "failed", reference: res.reference, message: d.message }))
          .catch(() => resolve({ status: "failed", reference: res.reference, message: "We couldn't confirm the payment yet. Send us the reference on WhatsApp." }));
      },
      onClose: () => resolve({ status: "cancelled" }),
    });
    handler.openIframe();
  });
}
