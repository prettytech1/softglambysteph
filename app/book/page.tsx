import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "./BookingForm";

export const metadata: Metadata = {
  title: "Book a makeup session",
  description: "Request a makeup appointment with Softglambysteph — studio in Ologolo, Lekki or home service across Lagos. Bookings are confirmed on WhatsApp.",
};

export default function BookPage() {
  return (
    <div className="container-x pt-10 md:pt-14">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-shell" aria-busy="true" />}>
        <BookingForm />
      </Suspense>
    </div>
  );
}
