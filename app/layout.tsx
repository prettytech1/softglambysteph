import type { Metadata, Viewport } from "next";
import "@fontsource/bodoni-moda/latin-400.css";
import "@fontsource/bodoni-moda/latin-500.css";
import "@fontsource/bodoni-moda/latin-400-italic.css";
import "@fontsource/jost/latin-300.css";
import "@fontsource/jost/latin-400.css";
import "@fontsource/jost/latin-500.css";
import "@fontsource/pinyon-script/latin-400.css";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Softglambysteph — Makeup Studio & GlowbySteph Lip Collection, Lekki", template: "%s | Softglambysteph" },
  description: "Bridal, traditional and event makeup in Ologolo, Lekki, Lagos — studio and home service. Shop GlowbySteph lip glosses, lip liners and combo bundles.",
  keywords: ["makeup artist Lekki", "bridal makeup Lagos", "home service makeup Lagos", "lip gloss Nigeria", "GlowbySteph", "Softglambysteph"],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: site.name,
    images: [{ url: "/images/portfolio/bridal-white.webp", width: 1179, height: 2173, alt: "Bridal glam by Softglambysteph" }],
  },
  icons: { icon: "/icon.png", apple: "/icon.png" },
};

export const viewport: Viewport = { themeColor: "#fcf8f6", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: site.business,
  slogan: site.tagline,
  telephone: site.phone.tel,
  address: { "@type": "PostalAddress", streetAddress: "Ologolo", addressLocality: "Lekki", addressRegion: "Lagos", addressCountry: "NG" },
  sameAs: [site.instagram.url],
  priceRange: "₦20,000–₦90,000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
        </CartProvider>
      </body>
    </html>
  );
}
