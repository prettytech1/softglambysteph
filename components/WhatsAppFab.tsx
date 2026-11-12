"use client";
import { usePathname } from "next/navigation";
import { whatsappLink } from "@/lib/site";

export function WhatsAppFab() {
  const path = usePathname();
  if (path.startsWith("/checkout") || path.startsWith("/book")) return null; // those pages have their own WhatsApp step
  return (
    <a href={whatsappLink("Hi Steph, I found you on your website.")} target="_blank" rel="noreferrer"
      className="fixed bottom-5 right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-[#1f7a4d] text-white shadow-[0_10px_30px_-10px_rgba(31,122,77,.7)] transition-transform hover:scale-105"
      aria-label="Chat with Softglambysteph on WhatsApp">
      <WhatsAppGlyph className="h-7 w-7" />
    </a>
  );
}

export function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden>
      <path d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.7l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.8-1.8-5.9C5 10 9.9 5.2 16 5.2S27 10 27 15.9s-4.9 10.5-11 10.5zm6-7.8c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.7-1.7-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.6.1-.2 0-.4 0-.6l-1.1-2.6c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8s1.2 3.2 1.4 3.5c.2.2 2.4 3.6 5.8 5 .8.3 1.4.5 1.9.7.8.3 1.6.2 2.2.1.7-.1 2-.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.2-.3-.3-.6-.4z" />
    </svg>
  );
}
