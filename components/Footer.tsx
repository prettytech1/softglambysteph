import Link from "next/link";
import { InstagramGlyph } from "@/components/icons";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { NewsletterForm } from "./NewsletterForm";
import { site, whatsappLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-10 bg-cocoa text-porcelain">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="[&_.wordmark]:bg-[linear-gradient(100deg,#e9bdb7,#f6dcd6,#d9a39c)] [&_span.text-cocoa-soft]:text-porcelain/60">
            <Wordmark size="md" withEmblem={false} />
          </div>
          <p className="mt-6 max-w-sm text-porcelain/75">Makeup studio and GlowbySteph lip collection, from Ologolo, Lekki.</p>
          <div className="mt-8 max-w-sm">
            <p className="mb-3 font-display text-xl">New shades, first</p>
            <NewsletterForm tone="dark" />
          </div>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-4">
          <ul className="space-y-2.5 text-porcelain/80">
            <li><Link className="link-underline" href="/shop">Shop</Link></li>
            <li><Link className="link-underline" href="/services">Services & prices</Link></li>
            <li><Link className="link-underline" href="/book">Book a session</Link></li>
            <li><Link className="link-underline" href="/portfolio">Portfolio</Link></li>
            <li><Link className="link-underline" href="/about">About</Link></li>
            <li><Link className="link-underline" href="/contact">Contact</Link></li>
          </ul>
          <ul className="space-y-2.5 text-porcelain/80">
            <li><Link className="link-underline" href="/policies#delivery">Delivery</Link></li>
            <li><Link className="link-underline" href="/policies#returns">Returns</Link></li>
            <li><Link className="link-underline" href="/policies#bookings">Booking policy</Link></li>
            <li><Link className="link-underline" href="/policies#privacy">Privacy</Link></li>
          </ul>
        </nav>
        <address className="space-y-3 not-italic text-porcelain/80 md:col-span-3">
          <p className="flex gap-3"><MapPin size={18} className="mt-1 shrink-0 text-blush" />{site.location.short}</p>
          <a className="flex gap-3 hover:text-white" href={`tel:${site.phone.tel}`}><Phone size={18} className="mt-1 shrink-0 text-blush" />{site.phone.display}</a>
          <a className="flex gap-3 hover:text-white" href={whatsappLink("Hi Steph, I have a question.")} target="_blank" rel="noreferrer"><MessageCircle size={18} className="mt-1 shrink-0 text-blush" />WhatsApp {site.whatsapp.display}</a>
          <a className="flex gap-3 hover:text-white" href={site.instagram.url} target="_blank" rel="noreferrer"><InstagramGlyph size={18} className="mt-1 shrink-0 text-blush" />{site.instagram.handle}</a>
        </address>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-sm text-porcelain/55 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.business}</p>
          <p>Prices in Nigerian Naira (₦)</p>
        </div>
      </div>
    </footer>
  );
}
