import type { Metadata } from "next";
import { InstagramGlyph } from "@/components/icons";
import { MapPin, Phone } from "lucide-react";
import { ContactForm } from "./ContactForm";
import { site, whatsappLink } from "@/lib/site";
import { WhatsAppGlyph } from "@/components/WhatsAppFab";

export const metadata: Metadata = {
  title: "Contact",
  description: `Call ${site.phone.display}, WhatsApp ${site.whatsapp.display} or visit the studio in Ologolo, Lekki, Lagos.`,
};

export default function ContactPage() {
  return (
    <div className="container-x pt-10 md:pt-14">
      <h1 className="text-[2.6rem] md:text-[3.6rem]">Contact</h1>
      <div className="mt-12 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-lg text-cocoa-soft">WhatsApp is the fastest way to reach Steph for bookings, product orders and questions.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink("Hi Steph, I have a question.")} target="_blank" rel="noreferrer" className="btn btn-whatsapp"><WhatsAppGlyph className="h-5 w-5" />Chat on WhatsApp</a>
            <a href={`tel:${site.phone.tel}`} className="btn btn-ghost"><Phone size={18} />Call {site.phone.display}</a>
          </div>
          <dl className="mt-12 divide-y divide-line border-y border-line">
            {[
              { icon: <Phone size={18} />, k: "Phone", v: <a className="link-underline" href={`tel:${site.phone.tel}`}>{site.phone.display}</a> },
              { icon: <WhatsAppGlyph className="h-[18px] w-[18px]" />, k: "WhatsApp", v: <a className="link-underline" href={whatsappLink("Hi Steph")} target="_blank" rel="noreferrer">{site.whatsapp.display}</a> },
              { icon: <MapPin size={18} />, k: "Studio", v: site.location.short },
              { icon: <InstagramGlyph size={18} />, k: "Instagram", v: <a className="link-underline" href={site.instagram.url} target="_blank" rel="noreferrer">{site.instagram.handle}</a> },
            ].map((r) => (
              <div key={r.k} className="flex items-center gap-4 py-4">
                <span className="text-rose-deep">{r.icon}</span>
                <dt className="w-28 text-cocoa-soft">{r.k}</dt>
                <dd>{r.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-cocoa-soft">Studio visits are by appointment. The exact address is shared when your booking is confirmed.</p>
        </div>
        <div className="rounded-[26px] bg-shell p-6 md:p-10 lg:col-span-6 lg:col-start-7">
          <h2 className="font-display text-[1.9rem]">Send a message</h2>
          <p className="mt-2 text-sm text-cocoa-soft">Your message opens in WhatsApp, ready to send.</p>
          <ContactForm />
        </div>
      </div>
      <div className="mt-16 overflow-hidden rounded-[22px] border border-line">
        <iframe title="Map of Ologolo, Lekki, Lagos" src="https://www.google.com/maps?q=Ologolo,+Lekki,+Lagos&output=embed" className="h-[340px] w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </div>
  );
}
