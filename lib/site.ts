export const site = {
  name: "Softglambysteph",
  business: "Softglambysteph Makeup Studio",
  tagline: "Your Soft Glam Signature",
  productLine: "GlowbySteph",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://softglambysteph.com",
  phone: { display: "0905 180 9611", tel: "+2349051809611" },
  whatsapp: { display: "+234 812 380 4079", number: "2348123804079" },
  location: { short: "Ologolo, Lekki, Lagos", full: "Ologolo, Lekki, Lagos, Nigeria" },
  instagram: { handle: "@softglambysteph__", url: "https://www.instagram.com/softglambysteph__/" },
} as const;

export const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });
export function formatNaira(amount: number) {
  // Intl renders "NGN" in some runtimes; force the ₦ symbol for consistency.
  return naira.format(amount).replace("NGN", "₦").replace(/\s/g, "");
}

export function makeRef(prefix: string) {
  const d = new Date();
  const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `${prefix}-${stamp}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
