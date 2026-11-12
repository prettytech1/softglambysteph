"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";
import { useCart, type CartLine } from "@/lib/cart";
import { formatNaira, makeRef, site, whatsappLink } from "@/lib/site";
import { isEmail, isNgPhone, type Errors } from "@/lib/validate";
import { recordSubmission } from "@/lib/supabase";
import { payWithPaystack, paystackEnabled } from "@/lib/payments/paystack";
import { WhatsAppGlyph } from "@/components/WhatsAppFab";

type F = "name" | "phone" | "email" | "fulfilment" | "address" | "notes";
const fulfilmentOptions = [
  { id: "pickup", label: "Pickup from the studio", hint: site.location.short },
  { id: "lagos", label: "Delivery within Lagos", hint: "Fee confirmed on WhatsApp" },
  { id: "nationwide", label: "Delivery outside Lagos", hint: "Fee confirmed on WhatsApp" },
] as const;

interface Placed { ref: string; lines: CartLine[]; subtotal: number; message: string; paid: boolean; }

export default function CheckoutPage() {
  const { lines, subtotal, clear, ready } = useCart();
  const [form, setForm] = useState<Record<F, string>>({ name: "", phone: "", email: "", fulfilment: "lagos", address: "", notes: "" });
  const [errors, setErrors] = useState<Errors<F>>({});
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [payState, setPayState] = useState<{ busy: boolean; error?: string }>({ busy: false });

  const set = (k: F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate(requireEmail: boolean) {
    const e: Errors<F> = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name.";
    if (!isNgPhone(form.phone)) e.phone = "Enter a Nigerian phone number, e.g. 0803 000 0000.";
    if ((requireEmail || form.email) && !isEmail(form.email)) e.email = requireEmail ? "Card payment needs an email for your receipt." : "Enter a valid email or leave it blank.";
    if (form.fulfilment !== "pickup" && form.address.trim().length < 6) e.address = "Enter the delivery address.";
    setErrors(e);
    if (Object.keys(e).length) document.getElementById(`co-${Object.keys(e)[0]}`)?.focus();
    return Object.keys(e).length === 0;
  }

  function buildMessage(ref: string, paidNote: string) {
    const f = fulfilmentOptions.find((o) => o.id === form.fulfilment)!;
    return [
      `Hi Steph, I'd like to place an order. Ref ${ref}`,
      "",
      ...lines.map((l) => `• ${l.qty} × ${l.name} (${l.shadeName}) — ${formatNaira(l.qty * l.price)}`),
      `Subtotal: ${formatNaira(subtotal)}`,
      paidNote,
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `${f.label}${form.fulfilment !== "pickup" ? `: ${form.address}` : ""}`,
      form.notes ? `Notes: ${form.notes}` : null,
    ].filter((x): x is string => x !== null).join("\n").replace(/\n{3,}/g, "\n\n");
  }

  function record(ref: string, payment: string) {
    void recordSubmission("orders", {
      reference: ref, customer_name: form.name, phone: form.phone, email: form.email || null,
      fulfilment: form.fulfilment, address: form.address || null, notes: form.notes || null,
      items: lines.map(({ slug, shadeId, name, shadeName, qty, price }) => ({ slug, shadeId, name, shadeName, qty, price })),
      total: subtotal, payment_status: payment, channel: payment === "pending" ? "whatsapp" : "paystack",
    });
  }

  function orderOnWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(false)) return;
    const ref = makeRef("SGO");
    const message = buildMessage(ref, "Payment: to be arranged on WhatsApp");
    window.open(whatsappLink(message), "_blank", "noopener"); // opened synchronously so it isn't popup-blocked
    record(ref, "pending");
    setPlaced({ ref, lines, subtotal, message, paid: false });
    clear();
    window.scrollTo({ top: 0 });
  }

  async function payByCard() {
    if (!validate(true)) return;
    const ref = makeRef("SGO");
    record(ref, "awaiting_payment");
    setPayState({ busy: true });
    const res = await payWithPaystack({ email: form.email, amountNaira: subtotal, reference: ref, metadata: { name: form.name, phone: form.phone } });
    if (res.status === "verified") {
      const message = buildMessage(ref, `Paid online via Paystack (${formatNaira(subtotal)}). Delivery fee to confirm.`);
      setPlaced({ ref, lines, subtotal, message, paid: true });
      clear();
      setPayState({ busy: false });
      window.scrollTo({ top: 0 });
    } else {
      setPayState({ busy: false, error: res.status === "cancelled" ? "Payment window closed. Nothing was charged." : res.message ?? "Payment didn't go through." });
    }
  }

  if (placed) return <Confirmation placed={placed} />;

  if (ready && lines.length === 0) {
    return (
      <div className="container-x py-20">
        <h1 className="text-[2.6rem]">Checkout</h1>
        <p className="mt-4 text-cocoa-soft">Your bag is empty, so there's nothing to check out yet.</p>
        <Link href="/shop" className="btn btn-primary mt-6">Shop the lip collection</Link>
      </div>
    );
  }

  return (
    <div className="container-x pt-10 md:pt-14">
      <h1 className="mb-10 text-[2.6rem] md:text-[3.6rem]">Checkout</h1>
      <div className="grid gap-12 lg:grid-cols-12">
        <form onSubmit={orderOnWhatsApp} noValidate className="space-y-10 lg:col-span-7">
          <fieldset className="space-y-5">
            <legend className="mb-5 font-display text-2xl">Your details</legend>
            <Field id="co-name" label="Full name" error={errors.name}><input id="co-name" className="input" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby="co-name-err" /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="co-phone" label="Phone (WhatsApp preferred)" error={errors.phone}><input id="co-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby="co-phone-err" /></Field>
              <Field id="co-email" label={paystackEnabled ? "Email (needed for card payment)" : "Email (optional)"} error={errors.email}><input id="co-email" className="input" type="email" autoComplete="email" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby="co-email-err" /></Field>
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-5 font-display text-2xl">Delivery</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {fulfilmentOptions.map((o) => (
                <label key={o.id} className={`cursor-pointer rounded-2xl border p-4 transition-colors ${form.fulfilment === o.id ? "border-cocoa bg-white" : "border-line hover:border-cocoa/40"}`}>
                  <input type="radio" name="fulfilment" value={o.id} checked={form.fulfilment === o.id} onChange={() => setForm((f) => ({ ...f, fulfilment: o.id }))} className="sr-only" />
                  <span className="block">{o.label}</span>
                  <span className="mt-1 block text-sm text-cocoa-soft">{o.hint}</span>
                </label>
              ))}
            </div>
            {form.fulfilment !== "pickup" && (
              <div className="mt-5">
                <Field id="co-address" label="Delivery address" error={errors.address}><textarea id="co-address" rows={3} className="input" autoComplete="street-address" value={form.address} onChange={set("address")} aria-invalid={!!errors.address} aria-describedby="co-address-err" /></Field>
              </div>
            )}
            <div className="mt-5"><Field id="co-notes" label="Order notes (optional)"><textarea id="co-notes" rows={2} className="input" value={form.notes} onChange={set("notes")} /></Field></div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 font-display text-2xl">Payment</legend>
            {paystackEnabled ? (
              <p className="mb-5 text-cocoa-soft">Pay by card or bank transfer through Paystack, or send the order on WhatsApp and pay after we confirm delivery.</p>
            ) : (
              <p className="mb-5 text-cocoa-soft">Online payment isn&apos;t live yet. Send your order on WhatsApp and Steph will confirm availability, the delivery fee and payment details. Nothing is charged here.</p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" className="btn btn-whatsapp flex-1"><WhatsAppGlyph className="h-5 w-5" />Send order on WhatsApp</button>
              {paystackEnabled && (
                <button type="button" onClick={payByCard} disabled={payState.busy} className="btn btn-primary flex-1">
                  <CreditCard size={18} />{payState.busy ? "Waiting for Paystack…" : `Pay ${formatNaira(subtotal)}`}
                </button>
              )}
            </div>
            {payState.error && <p className="field-error mt-3" role="alert">{payState.error}</p>}
            {paystackEnabled && <p className="mt-3 flex items-center gap-2 text-xs text-cocoa-soft"><Lock size={13} />Card details are handled by Paystack, never stored on this site.</p>}
          </fieldset>
        </form>

        <aside className="h-fit rounded-[22px] bg-shell p-7 lg:sticky lg:top-28 lg:col-span-5" aria-label="Order summary">
          <h2 className="mb-5 font-display text-2xl">Order summary</h2>
          {!ready ? <div className="h-24 animate-pulse rounded-xl bg-blush/60" /> : (
            <ul className="divide-y divide-line">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 py-3">
                  <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md bg-white">
                    <Image src={l.image} alt="" fill sizes="48px" className="object-cover" />
                    <span className="absolute -right-0 -top-0 grid h-5 min-w-5 place-items-center rounded-bl-md bg-cocoa px-1 text-[0.7rem] text-porcelain">{l.qty}</span>
                  </div>
                  <div className="flex-1 text-sm"><p>{l.name}</p><p className="text-cocoa-soft">{l.shadeName}</p></div>
                  <span className="price text-sm">{formatNaira(l.qty * l.price)}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span className="price">{formatNaira(subtotal)}</span></div>
            <div className="flex justify-between text-cocoa-soft"><span>Delivery</span><span>{form.fulfilment === "pickup" ? "Free pickup" : "Confirmed on WhatsApp"}</span></div>
          </div>
          <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
            <span>Total today</span><span className="price font-display text-2xl">{formatNaira(subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={id} className="mb-1.5 block text-sm text-cocoa-soft">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}

function Confirmation({ placed }: { placed: Placed }) {
  return (
    <div className="container-x max-w-2xl py-16 md:py-24">
      <CheckCircle2 size={40} strokeWidth={1.3} className="text-rose-deep" />
      <h1 className="mt-5 text-[2.4rem] md:text-[3.2rem]">{placed.paid ? "Payment received" : "Order sent to WhatsApp"}</h1>
      <p className="mt-4 text-lg text-cocoa-soft">
        {placed.paid
          ? "Paystack confirmed your payment. Steph will message you to arrange delivery."
          : "Your order isn't paid yet. Finish the chat on WhatsApp and Steph will confirm availability, delivery and how to pay."}
      </p>
      <dl className="mt-8 rounded-[22px] bg-shell p-6">
        <div className="flex justify-between"><dt className="text-cocoa-soft">Order reference</dt><dd className="font-medium tracking-wide">{placed.ref}</dd></div>
        <div className="mt-2 flex justify-between"><dt className="text-cocoa-soft">Items</dt><dd>{placed.lines.reduce((n, l) => n + l.qty, 0)}</dd></div>
        <div className="mt-2 flex justify-between"><dt className="text-cocoa-soft">Subtotal</dt><dd className="price">{formatNaira(placed.subtotal)}</dd></div>
        <div className="mt-2 flex justify-between"><dt className="text-cocoa-soft">Payment</dt><dd>{placed.paid ? "Paid" : "Pending"}</dd></div>
      </dl>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={whatsappLink(placed.message)} target="_blank" rel="noreferrer" className="btn btn-whatsapp"><WhatsAppGlyph className="h-5 w-5" />{placed.paid ? "Message Steph on WhatsApp" : "Open WhatsApp again"}</a>
        <Link href="/shop" className="btn btn-ghost">Keep shopping</Link>
      </div>
      {!placed.paid && <p className="mt-6 text-sm text-cocoa-soft">WhatsApp didn&apos;t open? Message {site.whatsapp.display} with your reference.</p>}
    </div>
  );
}
