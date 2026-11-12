import Image from "next/image";
import Link from "next/link";

export function Wordmark({ size = "md", withEmblem = true }: { size?: "sm" | "md" | "lg"; withEmblem?: boolean }) {
  const text = { sm: "text-[1.95rem]", md: "text-[2rem] md:text-[2.3rem]", lg: "text-[3rem] md:text-[3.6rem]" }[size];
  const emblem = { sm: 34, md: 42, lg: 72 }[size];
  return (
    <Link href="/" className="group inline-flex items-center gap-2.5" aria-label="Softglambysteph home">
      {withEmblem && (
        <Image src="/images/brand/emblem-sm.png" alt="" width={emblem} height={Math.round(emblem * 1.19)} priority className="shrink-0" />
      )}
      <span className="flex flex-col">
        <span className={`wordmark ${text}`}>softglambysteph</span>
        {size !== "sm" && (
          <span className="mt-0.5 text-[0.56rem] tracking-[0.32em] text-cocoa-soft pl-1">YOUR SOFT GLAM SIGNATURE</span>
        )}
      </span>
    </Link>
  );
}
