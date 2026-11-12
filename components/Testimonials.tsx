import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <section className="bg-blush/60 py-20 md:py-28" aria-labelledby="reviews-h">
      <div className="container-x">
        <h2 id="reviews-h" className="mb-12 max-w-2xl text-[2.2rem] md:text-[3rem]">What clients say</h2>
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.map((t, i) => (
            <li key={i} className={t.placeholder ? "rounded-2xl border border-dashed border-rose/70 p-6" : ""} data-placeholder={t.placeholder || undefined}>
              <figure className="flex h-full flex-col">
                <figcaption className="mb-4 text-sm text-rose-deep">{t.occasion}</figcaption>
                <blockquote className="flex-1">
                  <p className={`font-display text-[1.35rem] leading-snug ${t.placeholder ? "text-cocoa-soft italic" : ""}`}>&ldquo;{t.quote}&rdquo;</p>
                </blockquote>
                <p className="mt-5 text-sm text-cocoa-soft">— {t.name}</p>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
