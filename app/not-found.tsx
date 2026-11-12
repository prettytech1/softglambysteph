import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="wordmark text-5xl">oops</p>
      <h1 className="mt-4 text-[2.4rem]">This page doesn&apos;t exist</h1>
      <p className="mt-3 text-cocoa-soft">It may have moved. Try the shop or book a session.</p>
      <div className="mt-8 flex justify-center gap-3"><Link href="/shop" className="btn btn-primary">Go to shop</Link><Link href="/book" className="btn btn-ghost">Book a session</Link></div>
    </div>
  );
}
