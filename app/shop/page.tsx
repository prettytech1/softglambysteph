import type { Metadata } from "next";
import { Suspense } from "react";
import { getProducts, categories } from "@/lib/catalog";
import { ShopClient } from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop GlowbySteph lip gloss, lip liners & bundles",
  description: "GlowbySteph lip gloss ₦10,000, pigmented lip liner ₦4,000, 2-set combos ₦14,000 and gift-bagged bundles ₦27,000. Order online or on WhatsApp.",
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div className="container-x pb-10 pt-10 md:pt-14">
      <header className="mb-10 max-w-2xl">
        <h1 className="text-[2.6rem] md:text-[3.6rem]">Shop</h1>
        <p className="mt-3 text-cocoa-soft">GlowbySteph lip gloss, pigmented liners and combo bundles. Delivery across Lagos and pickup from the Ologolo studio.</p>
      </header>
      <Suspense fallback={<ShopSkeleton />}>
        <ShopClient products={products} categories={categories} />
      </Suspense>
    </div>
  );
}

function ShopSkeleton() {
  return (
    <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}><div className="aspect-[2/3] animate-pulse rounded-[18px] bg-shell" /><div className="mt-4 h-4 w-2/3 rounded bg-shell" /></div>
      ))}
    </div>
  );
}
