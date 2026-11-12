"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/site";
import { QuantityStepper } from "@/components/QuantityStepper";

export default function CartPage() {
  const { lines, subtotal, setQty, remove, ready } = useCart();
  return (
    <div className="container-x pt-10 md:pt-14">
      <h1 className="mb-10 text-[2.6rem] md:text-[3.6rem]">Your bag</h1>
      {!ready ? (
        <div className="h-40 animate-pulse rounded-2xl bg-shell" aria-busy="true" />
      ) : lines.length === 0 ? (
        <div className="py-16">
          <p className="text-cocoa-soft">Your bag is empty.</p>
          <Link href="/shop" className="btn btn-primary mt-6">Shop the lip collection</Link>
        </div>
      ) : (
        <div className="grid gap-12 lg:grid-cols-12">
          <ul className="divide-y divide-line border-y border-line lg:col-span-8">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-5 py-6">
                <Link href={`/shop/${l.slug}?shade=${l.shadeId}`} className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
                  <Image src={l.image} alt={`${l.name} in ${l.shadeName}`} fill sizes="96px" className="object-cover" />
                </Link>
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link href={`/shop/${l.slug}?shade=${l.shadeId}`} className="link-underline">{l.name}</Link>
                    <p className="text-sm text-cocoa-soft">{l.shadeName} — {formatNaira(l.price)} each</p>
                    <button onClick={() => remove(l.key)} className="mt-2 text-sm text-cocoa-soft underline underline-offset-2 hover:text-rose-deep">Remove</button>
                  </div>
                  <div className="flex items-center gap-6">
                    <QuantityStepper value={l.qty} onChange={(n) => setQty(l.key, n)} label={`Quantity for ${l.name} ${l.shadeName}`} />
                    <span className="price w-24 text-right">{formatNaira(l.price * l.qty)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-[22px] bg-shell p-7 lg:col-span-4">
            <div className="flex justify-between"><span>Subtotal</span><span className="price">{formatNaira(subtotal)}</span></div>
            <div className="mt-2 flex justify-between text-sm text-cocoa-soft"><span>Delivery</span><span>Confirmed on WhatsApp</span></div>
            <Link href="/checkout" className="btn btn-primary mt-7 w-full">Checkout</Link>
            <Link href="/shop" className="mt-4 block text-center text-sm underline underline-offset-4">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
