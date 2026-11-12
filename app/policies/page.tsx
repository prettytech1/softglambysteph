import type { Metadata } from "next";
import { Placeholder } from "@/components/Placeholder";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Policies", description: "Delivery, returns, booking and privacy policies for Softglambysteph." };

const sections = [
  { id: "delivery", title: "Delivery", body: <>
    <p>Orders are confirmed on WhatsApp. Pickup from the studio in {site.location.short} is free. Delivery within Lagos and to other states is quoted when we have your address.</p>
    <Placeholder>Add dispatch times, courier partners and typical delivery fees by area.</Placeholder></> },
  { id: "returns", title: "Returns", body: <>
    <p>For hygiene reasons, opened lip products can&apos;t be returned. If an item arrives damaged or wrong, message us on WhatsApp with a photo.</p>
    <Placeholder>Confirm the return window and how refunds or replacements are handled.</Placeholder></> },
  { id: "bookings", title: "Booking policy", body: <>
    <p>A booking is held once Steph confirms the date on WhatsApp. Home service prices are service charges only; a logistics fee is added depending on location.</p>
    <Placeholder>Add deposit amount, cancellation and rescheduling terms, lateness policy, and early-call (before 6am) fees if any.</Placeholder></> },
  { id: "privacy", title: "Privacy", body: <>
    <p>We use the details you give us (name, phone, email, address) only to arrange your booking or order. Card payments, when enabled, are processed by Paystack; we never see or store card details.</p>
    <p>Your bag is saved in your own browser so it&apos;s there when you come back. To have your details deleted, message us on WhatsApp.</p></> },
];

export default function PoliciesPage() {
  return (
    <div className="container-x pt-10 md:pt-14">
      <h1 className="text-[2.6rem] md:text-[3.6rem]">Policies</h1>
      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <nav aria-label="Policies" className="lg:col-span-3"><ul className="space-y-2 lg:sticky lg:top-28">{sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="link-underline">{s.title}</a></li>)}</ul></nav>
        <div className="space-y-14 lg:col-span-8">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="text-[2rem]">{s.title}</h2>
              <div className="mt-4 max-w-[65ch] space-y-4 text-cocoa-soft">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
