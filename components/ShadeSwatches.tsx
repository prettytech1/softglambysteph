"use client";
import type { Shade } from "@/lib/types";

export function ShadeSwatches({
  shades, selected, onSelect, size = "md", label,
}: { shades: Shade[]; selected?: string; onSelect?: (id: string) => void; size?: "sm" | "md"; label?: string }) {
  const dim = size === "sm" ? (onSelect ? "h-6 w-6" : "h-4 w-4") : "h-9 w-9";
  if (!onSelect) {
    return (
      <ul className="flex items-center gap-1.5" aria-label={label ?? "Available shades"}>
        {shades.map((s) => (
          <li key={s.id} title={s.name} className={`${dim} rounded-full ring-1 ring-black/10`} style={{ background: swatchBg(s.hex) }}>
            <span className="sr-only">{s.name}</span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <div role="radiogroup" aria-label={label ?? "Choose a shade"} className="flex flex-wrap gap-3">
      {shades.map((s) => {
        const active = s.id === selected;
        return (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${s.name}${s.inStock ? "" : " (sold out)"}`}
            onClick={() => onSelect(s.id)}
            className={`relative ${dim} rounded-full transition-[box-shadow] ${active ? "ring-2 ring-cocoa ring-offset-2 ring-offset-porcelain" : "ring-1 ring-black/15 hover:ring-cocoa/50"}`}
            style={{ background: swatchBg(s.hex) }}
          >
            {!s.inStock && <span className="absolute inset-0 m-auto h-px w-[130%] -translate-x-[12%] rotate-45 bg-cocoa/70" aria-hidden />}
          </button>
        );
      })}
    </div>
  );
}

/** A soft highlight so swatches read as glossy product, not flat dots. */
function swatchBg(hex: string) {
  return `radial-gradient(circle at 32% 28%, rgba(255,255,255,.55) 0, rgba(255,255,255,0) 38%), ${hex}`;
}
