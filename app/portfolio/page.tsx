import type { Metadata } from "next";
import { PortfolioGrid } from "./PortfolioGrid";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Bridal, traditional wedding, birthday and party makeup by Softglambysteph in Lekki, Lagos.",
};

export default function PortfolioPage() {
  return (
    <div className="container-x pt-10 md:pt-14">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-[2.6rem] md:text-[3.6rem]">Portfolio</h1>
          <p className="mt-3 text-cocoa-soft">Brides, birthday girls and party guests. Tap a photo to see it full size.</p>
        </div>
        <Link href="/book" className="btn btn-primary">Book a session</Link>
      </header>
      <PortfolioGrid />
    </div>
  );
}
