"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { looks, type PortfolioTag } from "@/data/portfolio";

const tags: ("All" | PortfolioTag)[] = ["All", ...Array.from(new Set(looks.map((l) => l.tag)))];

export function PortfolioGrid() {
  const [tag, setTag] = useState<(typeof tags)[number]>("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = tag === "All" ? looks : looks.filter((l) => l.tag === tag);

  useEffect(() => {
    if (open === null) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i! + 1) % shown.length);
      if (e.key === "ArrowLeft") setOpen((i) => (i! - 1 + shown.length) % shown.length);
    };
    window.addEventListener("keydown", on); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", on); document.body.style.overflow = ""; };
  }, [open, shown.length]);

  return (
    <>
      <div role="tablist" aria-label="Filter looks" className="mb-8 flex flex-wrap gap-1 border-y border-line py-4">
        {tags.map((t) => (
          <button key={t} role="tab" aria-selected={tag === t} onClick={() => setTag(t)}
            className={`rounded-full px-4 py-2 ${tag === t ? "bg-cocoa text-porcelain" : "hover:bg-shell"}`}>{t}</button>
        ))}
      </div>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-5">
        {shown.map((l, i) => (
          <li key={l.src} className="mb-3 break-inside-avoid md:mb-5">
            <button type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-[14px] bg-blush" aria-label={`View larger: ${l.alt}`}>
              <Image src={l.src} alt={l.alt} width={l.w} height={l.h} sizes="(min-width:768px) 31vw, 48vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.02]" />
              <span className="absolute bottom-3 left-3 rounded-full bg-porcelain/90 px-3 py-1 text-xs">{l.tag}</span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div className="fade-in fixed inset-0 z-50 flex items-center justify-center bg-cocoa/95 p-4" role="dialog" aria-modal="true" aria-label={shown[open].alt}>
          <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setOpen(null)} aria-label="Close" autoFocus><X /></button>
          <button className="absolute left-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setOpen((open - 1 + shown.length) % shown.length)} aria-label="Previous photo"><ChevronLeft /></button>
          <figure className="relative h-[85vh] w-full max-w-3xl">
            <Image src={shown[open].src} alt={shown[open].alt} fill sizes="90vw" className="object-contain" />
          </figure>
          <button className="absolute right-3 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setOpen((open + 1) % shown.length)} aria-label="Next photo"><ChevronRight /></button>
        </div>
      )}
    </>
  );
}
