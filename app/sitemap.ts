import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/shop", "/services", "/book", "/portfolio", "/about", "/contact", "/policies"];
  const products = await getProducts();
  return [...pages.map((p) => ({ url: `${site.url}${p}` })), ...products.map((p) => ({ url: `${site.url}/shop/${p.slug}` }))];
}
