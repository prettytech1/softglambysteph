"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Menu, ShoppingBag, X } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { nav, site } from "@/lib/site";
import { useCart } from "@/lib/cart";

export function Header() {
  const { count, setOpen, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => { document.body.style.overflow = menu ? "hidden" : ""; }, [menu]);

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled ? "bg-porcelain/92 backdrop-blur border-b border-line" : "bg-porcelain border-b border-transparent"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 btn btn-primary">Skip to content</a>
      <div className="container-x flex h-[72px] items-center justify-between gap-6 md:h-[84px]">
        <Wordmark size="sm" />
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={path.startsWith(n.href) ? "page" : undefined}
                  className={`link-underline py-1 ${path.startsWith(n.href) ? "text-rose-deep" : ""}`}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/book" className="btn btn-primary hidden !min-h-11 sm:inline-flex">Book a session</Link>
          <button type="button" onClick={() => setOpen(true)} className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-shell"
            aria-label={`Open bag${ready && count ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}>
            <ShoppingBag size={21} strokeWidth={1.6} />
            {ready && count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-rose-deep px-1 text-[0.68rem] text-white tabular-nums">{count}</span>
            )}
          </button>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-shell lg:hidden" onClick={() => setMenu(true)} aria-label="Open menu" aria-expanded={menu}>
            <Menu size={22} strokeWidth={1.6} />
          </button>
        </div>
      </div>

      {menu && createPortal(
        <div className="fixed inset-0 z-[70] overflow-y-auto bg-porcelain fade-in lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="container-x flex h-[72px] items-center justify-between">
            <Wordmark size="sm" />
            <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-shell" onClick={() => setMenu(false)} aria-label="Close menu"><X size={22} /></button>
          </div>
          <nav aria-label="Mobile" className="container-x mt-6">
            <ul>
              {[{ href: "/", label: "Home" }, ...nav, { href: "/book", label: "Book a session" }].map((n) => (
                <li key={n.href}><Link href={n.href} onClick={() => setMenu(false)} aria-current={path === n.href ? "page" : undefined} className={`block border-b border-line py-3.5 font-display text-[2rem] leading-tight ${path === n.href ? "text-rose-deep" : "text-cocoa"}`}>{n.label}</Link></li>
              ))}
            </ul>
            <div className="mt-10 space-y-1.5 pb-10 text-cocoa-soft">
              <p>{site.location.short}</p>
              <a className="block" href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
              <a className="block" href={site.instagram.url} target="_blank" rel="noreferrer">{site.instagram.handle}</a>
            </div>
          </nav>
        </div>,
        document.body,
      )}
    </header>
  );
}
