import { categories, products as localProducts } from "@/data/catalog";
import type { Product } from "@/lib/types";
import { supabase } from "@/lib/supabase";

/**
 * Products come from Supabase when it's configured (see supabase/schema.sql), otherwise from data/catalog.ts.
 * Runs at build/request time on the server.
 */
export async function getProducts(): Promise<Product[]> {
  const sb = supabase();
  if (!sb) return localProducts;
  const { data, error } = await sb
    .from("products")
    .select("slug,name,category,price,packaging_line,description,benefits,details,gallery,featured,sort_order,shades:product_shades(id:shade_key,name,name_confirmed,hex,image,in_stock,sort_order)")
    .eq("published", true)
    .order("sort_order");
  if (error || !data?.length) {
    if (error) console.warn("[catalog] Supabase read failed, using local catalogue:", error.message);
    return localProducts;
  }
  return data.map((p: any) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    packagingLine: p.packaging_line ?? "",
    description: p.description,
    benefits: p.benefits,
    details: p.details ?? [],
    gallery: p.gallery ?? [],
    featured: p.featured,
    shades: [...(p.shades ?? [])]
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((s: any) => ({ id: s.id, name: s.name, nameConfirmed: s.name_confirmed, hex: s.hex, image: s.image, inStock: s.in_stock })),
  }));
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export { categories };
