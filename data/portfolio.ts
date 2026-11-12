export type PortfolioTag = "Bridal" | "Traditional" | "Birthday" | "Party" | "Editorial";

export interface Look { src: string; alt: string; tag: PortfolioTag; w: number; h: number; }

export const looks: Look[] = [
  { src: "/images/portfolio/bridal-white.webp", alt: "Bride with sleek finger-wave bun, rosy lid and glossy nude lip", tag: "Bridal", w: 1179, h: 2173 },
  { src: "/images/portfolio/traditional-gele.webp", alt: "Traditional bride in burgundy gele with champagne-gold eyes", tag: "Traditional", w: 1179, h: 2083 },
  { src: "/images/portfolio/pink-glam.webp", alt: "Pink cut-crease glam with a glossy nude lip and sleek straight hair", tag: "Party", w: 1179, h: 1590 },
  { src: "/images/portfolio/hijab-glam.webp", alt: "Sharp winged liner and warm brown lip on deep skin, black hijab", tag: "Editorial", w: 1150, h: 1538 },
  { src: "/images/portfolio/birthday-parasol.webp", alt: "Birthday glam with pearl veil, blonde curls and lace parasol", tag: "Birthday", w: 1179, h: 1561 },
  { src: "/images/portfolio/party-rhinestone.webp", alt: "Bronze smoky eye and glossed lip for a party look", tag: "Party", w: 1179, h: 1235 },
  { src: "/images/portfolio/birthday-curls.webp", alt: "Birthday glam full look with pearl-studded veil", tag: "Birthday", w: 1179, h: 1567 },
  { src: "/images/portfolio/rose-bridal.webp", alt: "Bride with rose-toned smoky eye, flushed cheeks and glossy pink lip", tag: "Bridal", w: 736, h: 1231 },
  { src: "/images/portfolio/studio-purple-gele.webp", alt: "Purple gele with soft lilac eye and nude lip", tag: "Traditional", w: 1179, h: 1474 },
  { src: "/images/portfolio/soft-glam-hoodie.webp", alt: "Soft brown glam with fluffy lashes and a glossy nude lip", tag: "Editorial", w: 1200, h: 1600 },
];

export const look = (file: string) => looks.find((l) => l.src.endsWith(file))!;
