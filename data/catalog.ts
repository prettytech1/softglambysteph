import type { Category, Product } from "@/lib/types";

/**
 * Local product catalogue — the single source of truth when Supabase isn't configured.
 * To add a product or shade: copy an entry, drop the photo into /public/images/products, update the fields.
 * Anything set to null shows up on the site as a dashed "to be supplied" placeholder.
 *
 * Shade names marked nameConfirmed:false are descriptive (what the colour looks like in the photo),
 * not official names. Replace them with the brand's shade names before launch.
 */

export const categories: Category[] = [
  { id: "lip-gloss", label: "Lip gloss", plural: "Lip glosses" },
  { id: "lip-liner", label: "Lip liner", plural: "Lip liners" },
  { id: "bundle", label: "Bundle", plural: "Combo bundles" },
];

export const products: Product[] = [
  {
    slug: "glowbysteph-lip-gloss",
    name: "GlowbySteph Lip Gloss",
    category: "lip-gloss",
    price: 10000,
    packagingLine: "Soft shine, real glow.",
    description: null,
    benefits: null,
    details: [
      { label: "Size", value: null },
      { label: "Finish", value: null },
      { label: "Key ingredients", value: null },
    ],
    shades: [
      { id: "clear", name: "Clear", nameConfirmed: false, hex: "#efe7e4", image: "/images/products/gloss-clear.webp", inStock: true },
      { id: "pink", name: "Pink", nameConfirmed: false, hex: "#e0336e", image: "/images/products/gloss-pink.webp", inStock: true },
      { id: "nude", name: "Nude", nameConfirmed: false, hex: "#a86249", image: "/images/products/gloss-nude.webp", inStock: true },
      { id: "burgundy", name: "Burgundy", nameConfirmed: false, hex: "#5a1f22", image: "/images/products/gloss-burgundy.webp", inStock: true },
    ],
    gallery: ["/images/products/gloss-hands.webp", "/images/products/collection-bundle.webp"],
    featured: true,
  },
  {
    slug: "glowbysteph-pigmented-lip-liner",
    name: "GlowbySteph Pigmented Lip Liner",
    category: "lip-liner",
    price: 4000,
    packagingLine: "Pigmented lip liner.",
    description: null,
    benefits: null,
    details: [
      { label: "Size", value: null },
      { label: "Finish", value: null },
      { label: "Key ingredients", value: null },
    ],
    shades: [
      { id: "black", name: "Black", nameConfirmed: false, hex: "#1d1a1a", image: "/images/products/liner-pink-barrel.webp", inStock: true },
      { id: "berry", name: "Berry", nameConfirmed: false, hex: "#7e2f3d", image: "/images/products/liner-black-barrel.webp", inStock: true },
    ],
    gallery: ["/images/products/liner-black-barrel-2.webp", "/images/products/collection-bundle.webp"],
    featured: true,
  },
  {
    slug: "glowbysteph-2-set-combo",
    name: "GlowbySteph 2-Set Combo",
    category: "bundle",
    price: 14000,
    packagingLine: "One gloss, one liner.",
    description: null,
    benefits: null,
    details: [],
    shades: [
      { id: "nude-berry", name: "Nude gloss + Berry liner", nameConfirmed: false, hex: "#a86249", image: "/images/products/duo-nude-berry.webp", inStock: true },
      { id: "pink-berry", name: "Pink gloss + Berry liner", nameConfirmed: false, hex: "#e0336e", image: "/images/products/duo-pink-berry.webp", inStock: true },
      { id: "clear-black", name: "Clear gloss + Black liner", nameConfirmed: false, hex: "#efe7e4", image: "/images/products/duo-clear-black.webp", inStock: true },
      { id: "burgundy-berry", name: "Burgundy gloss + Berry liner", nameConfirmed: false, hex: "#5a1f22", image: "/images/products/duo-burgundy-berry.webp", inStock: true },
    ],
    gallery: [],
    featured: true,
  },
  {
    slug: "glowbysteph-combo-bundle",
    name: "GlowbySteph Combo Bundle",
    category: "bundle",
    price: 27000,
    packagingLine: "Gloss and liner, gift-bagged.",
    description: null,
    benefits: null,
    details: [
      { label: "What's inside", value: null },
      { label: "Shade options", value: null },
    ],
    shades: [
      { id: "bundle", name: "Gift-bagged set", nameConfirmed: false, hex: "#f1c9cc", image: "/images/products/collection-bundle.webp", inStock: true },
    ],
    gallery: [],
    featured: true,
  },
];
