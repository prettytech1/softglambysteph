export type CategoryId = "lip-gloss" | "lip-liner" | "bundle";

export interface Shade {
  id: string;
  /** Display name. Descriptive names are placeholders until the client confirms official shade names. */
  name: string;
  nameConfirmed: boolean;
  hex: string;
  image: string;
  inStock: boolean;
}

export interface Product {
  slug: string;
  name: string;
  category: CategoryId;
  price: number; // Naira
  /** Copy printed on the packaging — the only product claims used until the client supplies more. */
  packagingLine: string;
  /** null = not supplied yet → rendered as an editable placeholder */
  description: string | null;
  benefits: string[] | null;
  details: { label: string; value: string | null }[];
  shades: Shade[];
  gallery: string[];
  featured?: boolean;
}

export interface Category { id: CategoryId; label: string; plural: string; }
