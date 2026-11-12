import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Steph",
  description: "Steph started Softglambysteph after 3 years perfecting her craft, then created GlowbySteph lip gloss and liners.",
};

export default function AboutPage() {
  return (
    <>
      <section className="container-x grid items-center gap-12 pt-10 md:grid-cols-12 md:pt-16">
        <div className="md:col-span-6">
          <h1 className="max-w-[30rem] text-[1.6rem] leading-[1.2] tracking-[0.06em] md:text-[2.1rem]">YOUR BEAUTY, ELEVATED. YOUR GLOW, UNFORGETTABLE.</h1>
          <p className="mt-7 max-w-[34rem] text-lg text-cocoa-soft">
            Experience the art of soft glam with Softglambysteph. From flawless makeup transformations to lip essentials that complete your look,
            we bring beauty, confidence and elegance together.
          </p>
          <p className="mt-5 font-display text-[1.4rem] italic leading-snug">Every look tells a story. Make yours unforgettable.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">Book your glam</Link>
            <Link href="/shop" className="btn btn-ghost">Shop the collection</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-6">
          <div className="relative aspect-[3/4] overflow-hidden rounded-[18px] bg-blush">
            <Image src="/images/portfolio/traditional-gele.webp" alt="Traditional bride in burgundy gele" fill priority sizes="(min-width:768px) 24vw, 46vw" className="object-cover object-top" />
          </div>
          <div className="relative mt-10 aspect-[3/4] overflow-hidden rounded-[18px] bg-blush">
            <Image src="/images/portfolio/rose-bridal.webp" alt="Bride with rose-toned smoky eye and glossy pink lip" fill sizes="(min-width:768px) 24vw, 46vw" className="object-cover object-top" />
          </div>
        </div>
      </section>

      <section className="container-x mt-24 grid items-center gap-12 md:grid-cols-12" aria-labelledby="story-h">
        <div className="md:col-span-5">
          <div className="arch relative mx-auto aspect-[3/4] max-w-[440px] bg-blush">
            <Image src="/images/brand/steph.webp" alt="Steph, makeup artist and founder of Softglambysteph and GlowbySteph" fill sizes="(min-width:768px) 36vw, 92vw" className="object-cover object-top" />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h2 id="story-h" className="text-[2.2rem] md:text-[3rem]">Steph&apos;s story</h2>
          <div className="mt-6 max-w-[36rem] space-y-4 text-[1.08rem] leading-relaxed text-cocoa-soft">
            <p>My journey into beauty started with a passion for makeup and helping women feel confident and beautiful. What began as a love for creating beautiful looks gradually grew into something bigger.</p>
            <p>After 3 years of practising, learning, and perfecting my craft, I discovered another passion: creating lip products that make every woman feel beautiful and confident.</p>
            <p className="text-cocoa">That was the moment I knew I wanted my own lip brand.</p>
            <p>Today, this dream is becoming a reality, with lip products created to help you express your beauty, one perfect lip at a time.</p>
            <p className="font-display text-[1.35rem] italic text-cocoa">Welcome to my world of beauty.</p>
          </div>
          <p className="mt-6 flex items-baseline gap-3 text-rose-deep"><span className="text-sm tracking-[0.18em] text-cocoa-soft">CEO</span><span className="font-script text-[2.4rem] leading-none">Stephanie</span></p>
        </div>
      </section>

      <section className="mt-24 bg-shell py-20 md:py-28" aria-labelledby="phil-h">
        <div className="container-x">
          <h2 id="phil-h" className="max-w-xl text-[2.2rem] md:text-[2.8rem]">What soft glam means here</h2>
          <dl className="mt-12 grid gap-10 md:grid-cols-3">
            {[
              ["Skin first", "Foundation matched in daylight, built in thin layers, set where it needs to be and left to glow everywhere else."],
              ["Made for your occasion", "An introduction, a court wedding and a white wedding are different days. The look changes with the lighting, the outfit and how long you'll wear it."],
              ["Lips that finish it", "The final touch is usually a liner and gloss. That's why GlowbySteph exists: the shades from Steph's kit, for your handbag."],
            ].map(([t, d]) => (
              <div key={t}><dt className="font-display text-[1.6rem]">{t}</dt><dd className="mt-3 text-cocoa-soft">{d}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section className="container-x mt-24 grid items-center gap-12 md:grid-cols-12" aria-labelledby="gbs-h">
        <div className="relative aspect-[1376/768] overflow-hidden rounded-[22px] md:col-span-7">
          <Image src="/images/products/collection-bundle.webp" alt="GlowbySteph glosses, liners and gift bag" fill sizes="(min-width:768px) 55vw, 92vw" className="object-cover" />
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <h2 id="gbs-h" className="text-[2.2rem]">GlowbySteph</h2>
          <p className="mt-4 text-cocoa-soft">Soft shine, real glow. Lip glosses in four shades and pigmented lip liners, in blush-pink and black-and-rose-gold packaging.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className="btn btn-primary">Shop lip collection</Link>
            <Link href="/book" className="btn btn-ghost">Book a session</Link>
          </div>
        </div>
      </section>
    </>
  );
}
