"use client";
import { Minus, Plus } from "lucide-react";

export function QuantityStepper({ value, onChange, min = 1, max = 20, compact = false, label = "Quantity" }:
  { value: number; onChange: (n: number) => void; min?: number; max?: number; compact?: boolean; label?: string }) {
  const h = compact ? "h-9" : "h-12";
  return (
    <div className={`inline-flex items-center rounded-full border border-line bg-white ${h}`} role="group" aria-label={label}>
      <button type="button" className={`grid ${compact ? "w-9" : "w-12"} h-full place-items-center rounded-l-full hover:bg-shell disabled:opacity-30`}
        onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Decrease quantity">
        <Minus size={15} />
      </button>
      <output className="w-8 text-center tabular-nums" aria-live="polite">{value}</output>
      <button type="button" className={`grid ${compact ? "w-9" : "w-12"} h-full place-items-center rounded-r-full hover:bg-shell disabled:opacity-30`}
        onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Increase quantity">
        <Plus size={15} />
      </button>
    </div>
  );
}
