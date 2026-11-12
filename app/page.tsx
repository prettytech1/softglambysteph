import Image from "next/image";
import Link from "next/link";
import { InstagramGlyph } from "@/components/icons";
import { Home, MapPin } from "lucide-react";
import { getProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { serviceGroups, services } from "@/data/services";
import { look, looks } from "@/data/portfolio";
import { Testimonials } from "@/components/Testimonials";
import { formatNaira, site } from "@/lib/site";

export default async function HomePage() {
  const products = (await getProducts()).filter((p) => p.featured);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-10 pb-16 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-6 lg:pb-24">
          <div className="lg:col-span-7 lg:pr-10">
            <h1 className="hero-rise text-[2.6rem] leading-[1.02] sm:text-[3.5rem] lg:text-[4.3rem] xl:text-[4.9rem]">
              Your beauty.<br />Your confidence.<br />
              <span className="block pt-1 font-script text-[1.02em] leading-[1.1] pl-[0.08em] text-rose-deep">Your soft glam signature.</span>
            </h1>
            <p className="hero-rise mt-7 max-w-[34rem] text-lg text-cocoa-soft [animation-delay:.15s]">
              At Softglambysteph, we make beauty effortless with professional makeup artistry and lip essentials designed to elevate your look and confidence.
            </p>
            <div className="hero-rise mt-9 flex flex-wrap gap-3 [animation-delay:.25s]">
              <Link href="/shop" className="btn btn-primary">Shop lip collection</Link>
              <Link href="/book" className="btn btn-ghost">Book a makeup session</Link>
            </div>
            <ul className="hero-rise mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-cocoa-soft [animation-delay:.35s]">
              <li className="flex items-center gap-2"><MapPin size={16} className="text-rose" />Studio in {site.location.short}</li>
              <li className="flex items-center gap-2"><Home size={16} className="text-rose" />Home service across Lagos</li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[520px] lg:col-span-5 lg:max-w-none">
            <div className="hero-reveal arch relative ml-auto aspect-[4/5.4] w-[86%] bg-blush lg:w-[90%]">
              <Image src="/images/portfolio/bridal-white.webp" alt="Bride with a sleek bun, rosy lid and glossy nude lip, made up by Softglambysteph"
                fill priority sizes="(min-width:1024px) 40vw, 86vw" className="object-cover object-[50%_22%]" />
            </div>
            <Link href="/shop/glowbysteph-lip-gloss?shade=nude"
              className="hero-rise absolute bottom-[-6%] left-0 w-[38%] max-w-[210px] rounded-2xl border-[6px] border-porcelain bg-white shadow-[0_24px_50px_-28px_rgba(58,36,32,.6)] [animation-delay:.6s]"
              aria-label="GlowbySteph Lip Gloss in Nude">
              <span className="relative block aspect-[2/3] overflow-hidden rounded-xl">
                <Image src="/images/products/gloss-nude.webp" alt="" fill priority sizes="210px" className="object-contain p-[8%]" />
              </span>
              <span className="block px-3 py-2.5 text-[0.8rem] leading-tight">GlowbySteph Gloss<br /><span className="text-cocoa-soft">{formatNaira(10000)}</span></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container-x py-16 md:py-24" aria-labelledby="featured-h">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="featured-h" className="text-[2.2rem] md:text-[3rem]">The GlowbySteph lip edit</h2>
            <p className="mt-3 max-w-xl text-cocoa-soft">Gloss, liner, or both in a gift bag. Pick a shade on the card to see it.</p>
          </div>
          <Link href="/shop" className="link-underline pb-1">See the full shop</Link>
        </div>
        <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => <ProductCard key={p.slug} product={p} initialShade={p.slug === "glowbysteph-lip-gloss" ? "pink" : undefined} priority={i === 0} />)}
        </div>
      </section>

      {/* About */}
      <section className="bg-shell py-20 md:py-28" aria-labelledby="about-h">
        <div className="container-x grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="arch relative mx-auto aspect-[3/4] max-w-[420px] bg-blush">
              <Image src="/images/portfolio/hijab-glam.webp" alt="Sharp winged liner and a warm brown lip on deep skin" fill
                sizes="(min-width:768px) 35vw, 90vw" className="object-cover object-top" />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 id="about-h" className="text-[2.2rem] md:text-[3rem]">Soft glam is skin that still looks like you</h2>
            <div className="mt-6 max-w-[36rem] space-y-4 text-[1.05rem] text-cocoa-soft">
              <p>Steph builds every face around the person wearing it: skin first, then eyes and lips placed to hold up in daylight, flash and a long day of hugging aunties.</p>
              <p>The same eye went into GlowbySteph. The glosses and liners are the shades she reaches for in her own kit, made so you can carry the look home.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/about" className="btn btn-ghost">Meet Steph</Link>
              <Link href="/portfolio" className="btn text-cocoa underline underline-offset-4 !px-2">View the portfolio</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-x py-20 md:py-28" aria-labelledby="services-h">
        <div className="mb-12 max-w-2xl">
          <h2 id="services-h" className="text-[2.2rem] md:text-[3rem]">Book your glam</h2>
          <p className="mt-3 text-cocoa-soft">Studio sessions in Lekki, home service anywhere in Lagos, and bridal packages for every ceremony.</p>
        </div>
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {serviceGroups.map((g) => {
            const list = services.filter((s) => s.group === g.id);
            const from = Math.min(...list.map((s) => s.price));
            return (
              <article key={g.id} className="flex h-full flex-col">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-blush">
                  <Image src={g.image} alt={g.imageAlt} fill sizes="(min-width:768px) 30vw, 92vw" className="object-cover object-top" />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="text-[1.7rem]">{g.title}</h3>
                  <p className="text-sm text-cocoa-soft">from <span className="price text-cocoa">{formatNaira(from)}</span></p>
                </div>
                <p className="mt-2 text-cocoa-soft">{g.summary}</p>
                <ul className="mt-4 divide-y divide-line border-y border-line text-[0.95rem]">
                  {list.map((s) => (
                    <li key={s.id} className="flex items-center justify-between py-2.5">
                      <Link href={`/book?service=${s.id}`} className="link-underline">{s.name}</Link>
                      <span className="price">{formatNaira(s.price)}</span>
                    </li>
                  ))}
                </ul>
                {g.note && <p className="mt-3 text-xs text-cocoa-soft">{g.note}</p>}
                <div className="h-6" />
                <Link href={`/book?service=${list[0].id}`} className="btn btn-primary mt-auto self-start">Book {g.title.toLowerCase()}</Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* Lip collection band */}
      <section className="bg-cocoa text-porcelain" aria-labelledby="lips-h">
        <div className="container-x grid items-center gap-10 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-5">
            <div className="arch relative mx-auto aspect-[3/4] max-w-[460px]">
              <Image src="/images/products/gloss-hands.webp" alt="Model with a soft glam look surrounded by GlowbySteph lip glosses" fill
                sizes="(min-width:768px) 38vw, 92vw" className="object-cover object-top" />
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 id="lips-h" className="text-[2.2rem] md:text-[3rem]">Our lip collection</h2>
            <p className="mt-4 text-porcelain/75">Soft shine, real glow. Glosses in four shades, pigmented liners to shape them, and combos that pair the two.</p>
            <ul className="mt-8 divide-y divide-white/15 border-y border-white/15">
              {[
                { label: "Lip gloss", price: 10000, href: "/shop?category=lip-gloss" },
                { label: "Lip liner", price: 4000, href: "/shop?category=lip-liner" },
                { label: "2-set combo", price: 14000, href: "/shop/glowbysteph-2-set-combo" },
                { label: "Combo bundle", price: 27000, href: "/shop/glowbysteph-combo-bundle" },
              ].map((c) => (
                <li key={c.label}>
                  <Link href={c.href} className="flex items-baseline justify-between py-4 transition-colors hover:text-blush">
                    <span className="font-display text-2xl">{c.label}</span>
                    <span className="price text-porcelain/80">{formatNaira(c.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/shop" className="btn mt-8 bg-porcelain text-cocoa hover:bg-blush">Shop lip collection</Link>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="container-x py-20 md:py-28" aria-labelledby="portfolio-h">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 id="portfolio-h" className="text-[2.2rem] md:text-[3rem]">Recent faces</h2>
          <Link href="/portfolio" className="link-underline pb-1">Full portfolio</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:auto-rows-[300px] md:gap-5">
          {[
            { look: look("pink-glam.webp"), cls: "col-span-2 aspect-[4/5] md:col-span-5 md:row-span-2 md:aspect-auto" },
            { look: look("party-rhinestone.webp"), cls: "aspect-[4/5] md:col-span-4 md:aspect-auto" },
            { look: look("birthday-parasol.webp"), cls: "aspect-[4/5] md:col-span-3 md:aspect-auto" },
            { look: look("rose-bridal.webp"), cls: "aspect-[4/5] md:col-span-4 md:aspect-auto" },
          ].map(({ look: l, cls }) => (
            <figure key={l.src} className={`relative overflow-hidden rounded-[14px] bg-blush ${cls}`}>
              <Image src={l.src} alt={l.alt} fill sizes="(min-width:768px) 40vw, 50vw" className="object-cover object-top" />
              <figcaption className="absolute bottom-3 left-3 rounded-full bg-porcelain/90 px-3 py-1 text-xs">{l.tag}</figcaption>
            </figure>
          ))}
          <Link href="/portfolio" className="group flex aspect-[4/5] flex-col justify-between rounded-[14px] bg-blush p-6 md:col-span-3 md:aspect-auto">
            <span className="font-display text-[1.6rem] leading-tight md:text-[1.9rem]">Brides, birthdays and party glam</span>
            <span className="link-underline self-start">See all {looks.length} looks</span>
          </Link>
        </div>
      </section>

      <Testimonials />

      {/* Instagram */}
      <section className="container-x py-20 md:py-24" aria-labelledby="ig-h">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="ig-h" className="text-[2.2rem] md:text-[3rem]">On Instagram</h2>
            <p className="mt-2 text-cocoa-soft">New faces and shade drops, most days.</p>
          </div>
          <a href={site.instagram.url} target="_blank" rel="noreferrer" className="btn btn-ghost"><InstagramGlyph size={18} />Follow {site.instagram.handle}</a>
        </div>
        <ul className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
          {[look("traditional-gele.webp"), "/images/products/gloss-burgundy.webp", look("soft-glam-hoodie.webp"), "/images/products/liner-black-barrel-2.webp", look("studio-purple-gele.webp"), "/images/products/gloss-clear.webp"].map((item, i) => {
            const src = typeof item === "string" ? item : item.src;
            const alt = typeof item === "string" ? "GlowbySteph product shot" : item.alt;
            return (
              <li key={i}>
                <a href={site.instagram.url} target="_blank" rel="noreferrer" className="group relative block aspect-square overflow-hidden rounded-[10px] bg-blush" aria-label={`${alt} — open Instagram`}>
                  <Image src={src} alt="" fill sizes="(min-width:768px) 16vw, 33vw" className="object-cover object-top transition-opacity group-hover:opacity-85" />
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
