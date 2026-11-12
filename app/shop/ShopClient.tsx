"use client";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import type { Category, CategoryId, Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

type Sort = "featured" | "price-asc" | "price-desc";

export function ShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const cat = (params.get("category") as CategoryId | null) ?? "all";
  const [q, setQ] = useState(params.get("q") ?? "");
  const [sort, setSort] = useState<Sort>("featured");

  function setCategory(c: string) {
    const next = new URLSearchParams(params.toString());
    if (c === "all") next.delete("category"); else next.set("category", c);
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  }

  // One tile per shade, so every real product photo is browsable and searchable by shade.
  const tiles = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = products
      .filter((p) => cat === "all" || p.category === cat)
      .flatMap((p) => p.shades.map((s) => ({ p, s })))
      .filter(({ p, s }) => {
        if (!term) return true;
        const catLabel = categories.find((c) => c.id === p.category)?.label ?? "";
        return `${p.name} ${s.name} ${catLabel} ${p.packagingLine}`.toLowerCase().includes(term);
      });
    if (sort === "price-asc") list.sort((a, b) => a.p.price - b.p.price);
    if (sort === "price-desc") list.sort((a, b) => b.p.price - a.p.price);
    return list;
  }, [products, categories, cat, q, sort]);

  const counts = Object.fromEntries(categories.map((c) => [c.id, products.filter((p) => p.category === c.id).reduce((n, p) => n + p.shades.length, 0)]));

  return (
    <>
      <div className="mb-10 flex flex-col gap-5 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Product category" className="-mx-1 flex gap-1 overflow-x-auto px-1">
          {[{ id: "all", plural: "All" }, ...categories].map((c) => {
            const active = cat === c.id;
            const n = c.id === "all" ? products.reduce((x, p) => x + p.shades.length, 0) : counts[c.id];
            return (
              <button key={c.id} role="tab" aria-selected={active} onClick={() => setCategory(c.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-[0.95rem] transition-colors ${active ? "bg-cocoa text-porcelain" : "hover:bg-shell"}`}>
                {c.plural} <span className={active ? "text-porcelain/60" : "text-cocoa-soft"}>{n}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <label className="relative flex-1 lg:w-72">
            <span className="sr-only">Search products</span>
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cocoa-soft" />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search shade or product" className="input !rounded-full !pl-11" />
          </label>
          <label>
            <span className="sr-only">Sort</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="input !w-auto !rounded-full !pr-9">
              <option value="featured">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{tiles.length} products shown</p>

      {tiles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl">Nothing matches &ldquo;{q}&rdquo;</p>
          <p className="mt-2 text-cocoa-soft">Try a shade like pink or nude, or clear the search.</p>
          <button onClick={() => { setQ(""); setCategory("all"); }} className="btn btn-ghost mt-6"><X size={16} />Clear search</button>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map(({ p, s }, i) => <ProductCard key={`${p.slug}-${s.id}`} product={p} initialShade={s.id} priority={i < 3} />)}
        </div>
      )}
    </>
  );
}
