"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-x py-24 text-center">
      <h1 className="text-[2.2rem]">Something didn&apos;t load</h1>
      <p className="mt-3 text-cocoa-soft">Refresh the page, or message us on WhatsApp if it keeps happening.</p>
      <button onClick={reset} className="btn btn-primary mt-8">Try again</button>
    </div>
  );
}
