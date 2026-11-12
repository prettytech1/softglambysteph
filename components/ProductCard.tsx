"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { formatNaira } from "@/lib/site";
import { ShadeSwatches } from "./ShadeSwatches";

/** One card per product; swatches switch the photo so every real shade shot gets seen. */
export function ProductCard({ product, initialShade, priority = false }: { product: Product; initialShade?: string; priority?: boolean }) {
  const { add } = useCart();
  const [shadeId, setShadeId] = useState(initialShade ?? product.shades[0].id);
  const shade = product.shades.find((s) => s.id === shadeId) ?? product.shades[0];
  const href = `/shop/${product.slug}${product.shades.length > 1 ? `?shade=${shade.id}` : ""}`;
  // White-background studio cut-outs sit inside the frame; the landscape bundle shot is cropped to the products.
  const fit = /gloss-pink|gloss-nude/.test(shade.image) ? "object-contain p-[7%]" : /bundle/.test(shade.image) ? "object-cover object-[52%_50%]" : "object-cover";

  return (
    <article className="group flex flex-col">
      <Link href={href} className="relative block aspect-[2/3] overflow-hidden rounded-[18px] bg-white" aria-label={`${product.name}, ${shade.name}`}>
        <Image src={shade.image} alt={`${product.name} in ${shade.name}`} fill priority={priority}
          sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 92vw"
          className={`${fit} transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.03]`} />
        {!shade.inStock && <span className="absolute left-3 top-3 rounded-full bg-porcelain px-3 py-1 text-xs">Sold out</span>}
      </Link>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-sans text-[1.02rem] font-normal leading-snug tracking-normal">
            <Link href={href} className="link-underline">{product.name}</Link>
          </h3>
          <p className="text-sm text-cocoa-soft">{product.shades.length > 1 ? `${shade.name}, 1 of ${product.shades.length} shades` : shade.name}</p>
        </div>
        <p className="price shrink-0">{formatNaira(product.price)}</p>
      </div>
      {product.shades.length > 1 && (
        <div className="mt-3"><ShadeSwatches shades={product.shades} selected={shade.id} onSelect={setShadeId} size="sm" label={`${product.name} shades`} /></div>
      )}
      <div className="mt-4 flex gap-2">
        <button type="button" disabled={!shade.inStock} className="btn btn-primary !min-h-11 flex-1 !px-4 text-sm"
          onClick={() => add({ slug: product.slug, name: product.name, shadeId: shade.id, shadeName: shade.name, image: shade.image, price: product.price })}>
          {shade.inStock ? "Add to bag" : "Sold out"}
        </button>
        <Link href={href} className="btn btn-ghost !min-h-11 !px-4 text-sm">View</Link>
      </div>
    </article>
  );
}
