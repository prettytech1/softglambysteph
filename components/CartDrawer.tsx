"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/site";
import { QuantityStepper } from "./QuantityStepper";

export function CartDrawer() {
  const { open, setOpen, lines, subtotal, setQty, remove } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, setOpen]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your bag">
      <button className="absolute inset-0 bg-cocoa/35 fade-in" onClick={() => setOpen(false)} aria-label="Close bag" tabIndex={-1} />
      <aside className="drawer-in absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-porcelain shadow-[-20px_0_60px_-30px_rgba(58,36,32,.5)]">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-2xl">Your bag</h2>
          <button ref={closeRef} onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-shell" aria-label="Close bag"><X size={20} /></button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <ShoppingBag size={36} strokeWidth={1.2} className="text-rose" />
            <p className="text-cocoa-soft">Your bag is empty. Start with a gloss, or pick a 2-set combo.</p>
            <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-primary">Shop the lip collection</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-4 py-5">
                  <div className="relative h-24 w-[72px] shrink-0 overflow-hidden rounded-lg bg-white">
                    <Image src={l.image} alt="" fill sizes="72px" className="object-cover" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="leading-snug">{l.name}</p>
                    <p className="text-sm text-cocoa-soft">{l.shadeName}</p>
                    <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                      <QuantityStepper compact value={l.qty} onChange={(n) => setQty(l.key, n)} label={`Quantity for ${l.name} ${l.shadeName}`} />
                      <span className="price">{formatNaira(l.price * l.qty)}</span>
                    </div>
                    <button onClick={() => remove(l.key)} className="mt-2 self-start text-xs text-cocoa-soft underline underline-offset-2 hover:text-rose-deep">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-4 border-t border-line bg-shell/60 px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span>Subtotal</span>
                <span className="price font-display text-2xl">{formatNaira(subtotal)}</span>
              </div>
              <p className="text-xs text-cocoa-soft">Delivery is confirmed on WhatsApp once we know your address.</p>
              <Link href="/checkout" onClick={() => setOpen(false)} className="btn btn-primary w-full">Checkout</Link>
              <Link href="/cart" onClick={() => setOpen(false)} className="block text-center text-sm underline underline-offset-4">View full bag</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
