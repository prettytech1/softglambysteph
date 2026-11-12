import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { getProduct, getProducts, categories } from "@/lib/catalog";
import { ProductDetail } from "./ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.name} — ${p.packagingLine} ₦${p.price.toLocaleString("en-NG")}. Shades: ${p.shades.map((s) => s.name).join(", ")}.`,
    openGraph: { images: [{ url: p.shades[0].image }] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const others = (await getProducts()).filter((p) => p.slug !== slug);
  const cat = categories.find((c) => c.id === product.category)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    brand: { "@type": "Brand", name: site.productLine },
    image: product.shades.map((s) => `${site.url}${s.image}`),
    offers: { "@type": "Offer", priceCurrency: "NGN", price: product.price, availability: "https://schema.org/InStock" },
  };

  return (
    <div className="container-x pt-6 md:pt-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-cocoa-soft">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/shop" className="link-underline">Shop</Link> /</li>
          <li><Link href={`/shop?category=${cat.id}`} className="link-underline">{cat.plural}</Link> /</li>
          <li aria-current="page" className="text-cocoa">{product.name}</li>
        </ol>
      </nav>
      <Suspense fallback={<div className="aspect-[2/3] max-w-md animate-pulse rounded-[18px] bg-shell" />}>
        <ProductDetail product={product} />
      </Suspense>
      {others.length > 0 && (
        <section className="mt-24" aria-labelledby="pair-h">
          <h2 id="pair-h" className="mb-8 text-[2rem] md:text-[2.6rem]">Pair it with</h2>
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
