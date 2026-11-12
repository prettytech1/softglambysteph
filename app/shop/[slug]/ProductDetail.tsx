"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { formatNaira, whatsappLink } from "@/lib/site";
import { ShadeSwatches } from "@/components/ShadeSwatches";
import { QuantityStepper } from "@/components/QuantityStepper";

export function ProductDetail({ product }: { product: Product }) {
  const params = useSearchParams();
  const router = useRouter();
  const { add } = useCart();
  const initial = product.shades.find((s) => s.id === params.get("shade"))?.id ?? product.shades[0].id;
  const [shadeId, setShadeId] = useState(initial);
  const [qty, setQty] = useState(1);
  const shade = product.shades.find((s) => s.id === shadeId)!;

  const images = useMemo(() => {
    const rest = product.shades.filter((s) => s.id !== shadeId).map((s) => s.image);
    return Array.from(new Set([shade.image, ...product.gallery, ...rest]));
  }, [product, shadeId, shade.image]);
  const [active, setActive] = useState(0);
  const main = images[Math.min(active, images.length - 1)];

  function pick(id: string) {
    setShadeId(id); setActive(0);
    const next = new URLSearchParams(params.toString()); next.set("shade", id);
    router.replace(`?${next}`, { scroll: false });
  }
  const line = { slug: product.slug, name: product.name, shadeId: shade.id, shadeName: shade.name, image: shade.image, price: product.price };

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-7">
        <div className="flex flex-col-reverse gap-3 md:flex-row">
          <ul className="flex gap-3 overflow-x-auto md:w-20 md:flex-col" aria-label="Product photos">
            {images.map((src, i) => (
              <li key={src} className="shrink-0">
                <button type="button" onClick={() => setActive(i)} aria-label={`Show photo ${i + 1}`} aria-current={i === active}
                  className={`relative block h-24 w-16 overflow-hidden rounded-lg bg-white md:h-28 md:w-20 ${i === active ? "ring-2 ring-cocoa" : "ring-1 ring-line hover:ring-cocoa/40"}`}>
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
          <div className={`relative flex-1 overflow-hidden rounded-[22px] bg-white ${main.includes("bundle") ? "aspect-[1376/768] md:aspect-[4/5]" : "aspect-[2/3]"}`}>
            <Image key={main} src={main} alt={`${product.name} — ${shade.name}`} fill priority sizes="(min-width:1024px) 52vw, 92vw"
              className={`fade-in ${main.includes("bundle") ? "object-contain" : /gloss-pink|gloss-nude/.test(main) ? "object-contain p-[6%]" : "object-cover"}`} />
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 lg:pt-4">
        <h1 className="text-[2.3rem] md:text-[3rem]">{product.name}</h1>
        <p className="mt-2 font-script text-[1.9rem] leading-none text-rose-deep">{product.packagingLine}</p>
        <p className="price mt-6 font-display text-[1.9rem]">{formatNaira(product.price)}</p>

        {product.shades.length > 1 && (
          <div className="mt-8">
            <p className="mb-3">Shade: <span className="text-cocoa-soft">{shade.name}</span>{!shade.nameConfirmed && <span className="sr-only"> (descriptive name)</span>}</p>
            <ShadeSwatches shades={product.shades} selected={shadeId} onSelect={pick} />
          </div>
        )}

        <p className={`mt-6 text-sm ${shade.inStock ? "text-[#1f7a4d]" : "text-[#b3261e]"}`}>{shade.inStock ? "In stock" : "Sold out — message us to be notified"}</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <QuantityStepper value={qty} onChange={setQty} />
          <button className="btn btn-primary flex-1 sm:flex-none sm:min-w-44" disabled={!shade.inStock} onClick={() => add(line, qty)}>Add to bag</button>
        </div>
        <button className="btn btn-ghost mt-3 w-full" disabled={!shade.inStock} onClick={() => { add(line, qty, { openDrawer: false }); router.push("/checkout"); }}>Buy now</button>
        <a href={whatsappLink(`Hi Steph, I'd like ${qty} × ${product.name} (${shade.name}).`)} target="_blank" rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 text-sm underline underline-offset-4"><MessageCircle size={16} />Ask about this shade on WhatsApp</a>

        <div className="mt-10 space-y-8 border-t border-line pt-8">
          <p className="flex gap-3 text-sm text-cocoa-soft"><Truck size={18} className="mt-0.5 shrink-0 text-rose" />Delivery within Lagos and nationwide; the fee is confirmed on WhatsApp. Pickup from the Ologolo studio is free.</p>
        </div>
      </div>
    </div>
  );
}
