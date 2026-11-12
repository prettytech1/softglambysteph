import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Info } from "lucide-react";
import { serviceGroups, services } from "@/data/services";
import { formatNaira } from "@/lib/site";

export const metadata: Metadata = {
  title: "Makeup services & prices",
  description: "Studio sessions from ₦20,000, home service from ₦40,000 and bridal packages from ₦45,000 — introduction, court, traditional and white wedding makeup in Lekki, Lagos.",
};

export default function ServicesPage() {
  return (
    <div className="container-x pt-10 md:pt-14">
      <header className="mb-14 grid gap-6 md:grid-cols-12">
        <h1 className="text-[2.6rem] md:col-span-6 md:text-[3.6rem]">Services and prices</h1>
        <p className="text-cocoa-soft md:col-span-5 md:col-start-8 md:pt-4">Current prices for studio sessions in Ologolo, home service across Lagos, and bridal packages. Choose a service to request your date on WhatsApp.</p>
      </header>

      <div className="space-y-20 md:space-y-28">
        {serviceGroups.map((g, gi) => {
          const list = services.filter((s) => s.group === g.id);
          return (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="grid scroll-mt-28 items-start gap-10 md:grid-cols-12">
              <div className={`md:col-span-5 ${gi % 2 ? "md:order-2 md:col-start-8" : ""}`}>
                <div className="arch relative aspect-[3/4] bg-blush">
                  <Image src={g.image} alt={g.imageAlt} fill sizes="(min-width:768px) 38vw, 92vw" className="object-cover object-top" />
                </div>
              </div>
              <div className={`md:col-span-6 ${gi % 2 ? "md:order-1" : "md:col-start-7"} md:pt-10`}>
                <h2 id={`${g.id}-h`} className="text-[2.2rem] md:text-[2.8rem]">{g.title}</h2>
                <p className="mt-3 max-w-md text-cocoa-soft">{g.summary}</p>
                <ul className="mt-8 divide-y divide-line border-y border-line">
                  {list.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-5">
                      <div className="min-w-0">
                        <h3 className="font-sans text-[1.1rem] font-normal tracking-normal">{s.name}</h3>
                        <p className="price mt-0.5 font-display text-[1.45rem]">{formatNaira(s.price)}</p>
                      </div>
                      <Link href={`/book?service=${s.id}`} className="btn btn-ghost !min-h-11 text-sm">Book this service</Link>
                    </li>
                  ))}
                </ul>
                {g.note && (
                  <p className="mt-5 flex gap-3 rounded-2xl bg-shell p-4 text-sm"><Info size={18} className="mt-0.5 shrink-0 text-rose-deep" /><span><strong className="font-medium">Logistics fee applies.</strong> {g.note}</span></p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-24 rounded-[28px] bg-cocoa px-6 py-12 text-center text-porcelain md:px-12 md:py-16">
        <h2 className="text-[2rem] md:text-[2.6rem]">Not sure which one fits?</h2>
        <p className="mx-auto mt-3 max-w-lg text-porcelain/75">Tell Steph the occasion, the time you need to be ready and where, and she'll suggest the right session.</p>
        <Link href="/book" className="btn mt-8 bg-porcelain text-cocoa hover:bg-blush">Book a makeup session</Link>
      </section>
    </div>
  );
}
