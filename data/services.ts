export type ServiceGroupId = "studio" | "home" | "bridal";

export interface Service { id: string; name: string; price: number; group: ServiceGroupId; }
export interface ServiceGroup { id: ServiceGroupId; title: string; summary: string; note?: string; image: string; imageAlt: string; }

export const serviceGroups: ServiceGroup[] = [
  {
    id: "studio",
    title: "Studio sessions",
    summary: "Come to the studio in Ologolo, Lekki. Everyday glam to camera-ready looks.",
    image: "/images/portfolio/studio-purple-gele.webp",
    imageAlt: "Client in a purple gele with a soft lilac eye and nude lip",
  },
  {
    id: "home",
    title: "Home service",
    summary: "Steph comes to you — for birthdays, parties, shoots and naming ceremonies.",
    note: "Home service prices are service charges only. A logistics fee is added depending on your location.",
    image: "/images/portfolio/birthday-curls.webp",
    imageAlt: "Birthday glam with pearl veil and blonde curls",
  },
  {
    id: "bridal",
    title: "Bridal",
    summary: "From the introduction to the white wedding — your face for every chapter.",
    image: "/images/portfolio/traditional-gele.webp",
    imageAlt: "Traditional wedding bride in burgundy gele with gold eyes",
  },
];

export const services: Service[] = [
  { id: "studio-casual-glam", name: "Casual glam", price: 20000, group: "studio" },
  { id: "studio-party-guest", name: "Party guest", price: 25000, group: "studio" },
  { id: "studio-shoots", name: "Shoots", price: 35000, group: "studio" },
  { id: "home-birthday-glam", name: "Birthday glam", price: 40000, group: "home" },
  { id: "home-party-guest", name: "Party guest", price: 40000, group: "home" },
  { id: "home-brand-shoot-naming", name: "Brand shoot / child naming", price: 45000, group: "home" },
  { id: "bridal-introduction", name: "Introduction", price: 45000, group: "bridal" },
  { id: "bridal-court-wedding", name: "Court wedding", price: 50000, group: "bridal" },
  { id: "bridal-traditional-wedding", name: "Traditional wedding", price: 70000, group: "bridal" },
  { id: "bridal-white-wedding", name: "White wedding", price: 90000, group: "bridal" },
];

export function serviceLabel(s: Service) {
  const g = serviceGroups.find((x) => x.id === s.group)!;
  return `${s.name} (${g.title})`;
}
