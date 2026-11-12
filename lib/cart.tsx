"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";

export interface CartLine {
  key: string; // slug:shade
  slug: string;
  name: string;
  shadeId: string;
  shadeName: string;
  image: string;
  price: number;
  qty: number;
}

type Action =
  | { type: "add"; line: Omit<CartLine, "key" | "qty">; qty: number }
  | { type: "qty"; key: string; qty: number }
  | { type: "remove"; key: string }
  | { type: "clear" }
  | { type: "hydrate"; lines: CartLine[] };

const MAX_QTY = 20;

function reducer(state: CartLine[], a: Action): CartLine[] {
  switch (a.type) {
    case "hydrate": return a.lines;
    case "add": {
      const key = `${a.line.slug}:${a.line.shadeId}`;
      const found = state.find((l) => l.key === key);
      if (found) return state.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + a.qty) } : l));
      return [...state, { ...a.line, key, qty: Math.min(MAX_QTY, a.qty) }];
    }
    case "qty":
      return a.qty <= 0 ? state.filter((l) => l.key !== a.key) : state.map((l) => (l.key === a.key ? { ...l, qty: Math.min(MAX_QTY, a.qty) } : l));
    case "remove": return state.filter((l) => l.key !== a.key);
    case "clear": return [];
  }
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number, opts?: { openDrawer?: boolean }) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const STORAGE_KEY = "sgbs-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, dispatch] = useReducer(reducer, []);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "hydrate", lines: JSON.parse(raw) });
    } catch { /* storage unavailable — cart stays in memory */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(lines)); } catch { /* ignore */ }
  }, [lines, ready]);

  const add = useCallback<CartCtx["add"]>((line, qty = 1, opts) => {
    dispatch({ type: "add", line, qty });
    if (opts?.openDrawer !== false) setOpen(true);
  }, []);

  const value = useMemo<CartCtx>(() => ({
    lines,
    ready,
    open,
    setOpen,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.qty * l.price, 0),
    add,
    setQty: (key, qty) => dispatch({ type: "qty", key, qty }),
    remove: (key) => dispatch({ type: "remove", key }),
    clear: () => dispatch({ type: "clear" }),
  }), [lines, ready, open, add]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
