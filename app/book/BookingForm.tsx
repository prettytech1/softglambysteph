"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarCheck2 } from "lucide-react";
import { serviceGroups, services, serviceLabel } from "@/data/services";
import { formatNaira, makeRef, site, whatsappLink } from "@/lib/site";
import { isEmail, isNgPhone, type Errors } from "@/lib/validate";
import { recordSubmission } from "@/lib/supabase";
import { WhatsAppGlyph } from "@/components/WhatsAppFab";

type F = "name" | "phone" | "email" | "service" | "date" | "time" | "venue" | "address" | "notes";

function todayISO() {
  const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
function prettyDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function prettyTime(t: string) {
  const [h, m] = t.split(":").map(Number); const d = new Date(); d.setHours(h, m);
  return d.toLocaleTimeString("en-NG", { hour: "numeric", minute: "2-digit", hour12: true });
}

export function BookingForm() {
  const params = useSearchParams();
  const preset = services.find((s) => s.id === params.get("service"))?.id ?? "";
  const [form, setForm] = useState<Record<F, string>>({ name: "", phone: "", email: "", service: preset, date: "", time: "", venue: "", address: "", notes: "" });
  const [errors, setErrors] = useState<Errors<F>>({});
  const [done, setDone] = useState<{ ref: string; message: string } | null>(null);

  const service = services.find((s) => s.id === form.service);
  // Studio sessions happen at the studio, home services at the client's address; bridal can be either.
  const venue = service?.group === "studio" ? "studio" : service?.group === "home" ? "home" : form.venue;
  const set = (k: F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const min = useMemo(todayISO, []);

  function validate() {
    const e: Errors<F> = {};
    if (form.name.trim().length < 2) e.name = "Enter your full name.";
    if (!isNgPhone(form.phone)) e.phone = "Enter a Nigerian phone number, e.g. 0803 000 0000.";
    if (form.email && !isEmail(form.email)) e.email = "Enter a valid email or leave it blank.";
    if (!service) e.service = "Choose a service.";
    if (!form.date) e.date = "Choose a date."; else if (form.date < min) e.date = "Choose today or a later date.";
    if (!form.time) e.time = "Choose a time you need to be ready by.";
    if (!venue) e.venue = "Choose where the makeup will happen.";
    if (venue === "home" && form.address.trim().length < 6) e.address = "Enter the address Steph should come to.";
    setErrors(e);
    if (Object.keys(e).length) document.getElementById(`bk-${Object.keys(e)[0]}`)?.focus();
    return Object.keys(e).length === 0;
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || !service) return;
    const ref = makeRef("SGB");
    const message = [
      `Hi Steph, I'd like to book a makeup session. Ref ${ref}`,
      "",
      `Service: ${serviceLabel(service)} — ${formatNaira(service.price)}`,
      `Date: ${prettyDate(form.date)}`,
      `Time: ${prettyTime(form.time)}`,
      `Location: ${venue === "studio" ? `Studio, ${site.location.short}` : form.address}`,
      venue === "home" ? "(I understand a logistics fee applies for home service.)" : "",
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : "",
      form.notes ? `Notes: ${form.notes}` : "",
    ].join("\n").replace(/\n{3,}/g, "\n\n").trim();

    window.open(whatsappLink(message), "_blank", "noopener");
    void recordSubmission("bookings", {
      reference: ref, customer_name: form.name, phone: form.phone, email: form.email || null,
      service_id: service.id, service_name: serviceLabel(service), price: service.price,
      preferred_date: form.date, preferred_time: form.time, venue, address: venue === "home" ? form.address : null, notes: form.notes || null,
    });
    setDone({ ref, message });
    window.scrollTo({ top: 0 });
  }

  if (done && service) {
    return (
      <div className="mx-auto max-w-2xl py-10 md:py-16">
        <CalendarCheck2 size={40} strokeWidth={1.3} className="text-rose-deep" />
        <h1 className="mt-5 text-[2.4rem] md:text-[3.2rem]">Booking request sent</h1>
        <p className="mt-4 text-lg text-cocoa-soft">Your request is in WhatsApp. Your date is held once Steph confirms availability and any deposit in the chat.</p>
        <dl className="mt-8 space-y-2 rounded-[22px] bg-shell p-6">
          {[
            ["Reference", done.ref],
            ["Service", serviceLabel(service)],
            ["Price", formatNaira(service.price) + (venue === "home" ? " + logistics" : "")],
            ["When", `${prettyDate(form.date)}, ${prettyTime(form.time)}`],
            ["Where", venue === "studio" ? `Studio, ${site.location.short}` : form.address],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6"><dt className="text-cocoa-soft">{k}</dt><dd className="text-right">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={whatsappLink(done.message)} target="_blank" rel="noreferrer" className="btn btn-whatsapp"><WhatsAppGlyph className="h-5 w-5" />Open WhatsApp again</a>
          <Link href="/shop" className="btn btn-ghost">Shop GlowbySteph while you wait</Link>
        </div>
        <p className="mt-6 text-sm text-cocoa-soft">WhatsApp didn&apos;t open? Message {site.whatsapp.display} or call {site.phone.display} with your reference.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h1 className="text-[2.6rem] md:text-[3.6rem]">Book a session</h1>
        <p className="mt-4 text-cocoa-soft">Fill this in and it opens WhatsApp with your request written out. Steph replies to confirm the date.</p>
        <div className="arch relative mt-10 hidden aspect-[3/4] max-w-[340px] bg-blush lg:block">
          <Image src="/images/portfolio/pink-glam.webp" alt="Pink glam with a glossy nude lip by Softglambysteph" fill sizes="340px" className="object-cover object-top" />
        </div>
      </div>

      <form onSubmit={submit} noValidate className="space-y-10 lg:col-span-7 lg:col-start-6">
        <fieldset className="space-y-5">
          <legend className="mb-5 font-display text-2xl">The look</legend>
          <Field id="bk-service" label="Makeup service" error={errors.service}>
            <select id="bk-service" className="input" value={form.service} onChange={set("service")} aria-invalid={!!errors.service} aria-describedby="bk-service-err">
              <option value="" disabled>Choose a service</option>
              {serviceGroups.map((g) => (
                <optgroup key={g.id} label={g.title}>
                  {services.filter((s) => s.group === g.id).map((s) => <option key={s.id} value={s.id}>{s.name} — {formatNaira(s.price)}</option>)}
                </optgroup>
              ))}
            </select>
          </Field>
          {service?.group === "home" && <p className="rounded-xl bg-shell px-4 py-3 text-sm">Home service prices are service charges only. A logistics fee is added depending on your location.</p>}
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="bk-date" label="Preferred date" error={errors.date}><input id="bk-date" type="date" min={min} className="input" value={form.date} onChange={set("date")} aria-invalid={!!errors.date} aria-describedby="bk-date-err" /></Field>
            <Field id="bk-time" label="Ready-by time" error={errors.time}><input id="bk-time" type="time" step={900} className="input" value={form.time} onChange={set("time")} aria-invalid={!!errors.time} aria-describedby="bk-time-err" /></Field>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-5 font-display text-2xl">Makeup location</legend>
          {service && service.group !== "bridal" ? (
            <p className="text-cocoa-soft">{service.group === "studio" ? `This session is at the studio in ${site.location.short}.` : "Steph comes to you for this service."}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-describedby={errors.venue ? "bk-venue-err" : undefined}>
              {[{ id: "studio", label: "At the studio", hint: site.location.short }, { id: "home", label: "At my location", hint: "Logistics fee applies" }].map((o) => (
                <label key={o.id} className={`cursor-pointer rounded-2xl border p-4 ${form.venue === o.id ? "border-cocoa bg-white" : "border-line hover:border-cocoa/40"}`}>
                  <input id={o.id === "studio" ? "bk-venue" : undefined} type="radio" name="venue" value={o.id} checked={form.venue === o.id} onChange={set("venue")} className="sr-only" />
                  <span className="block">{o.label}</span><span className="mt-1 block text-sm text-cocoa-soft">{o.hint}</span>
                </label>
              ))}
              {errors.venue && <p id="bk-venue-err" className="field-error sm:col-span-2" role="alert">{errors.venue}</p>}
            </div>
          )}
          {venue === "home" && (
            <div className="mt-5"><Field id="bk-address" label="Address (area, street, landmark)" error={errors.address}><textarea id="bk-address" rows={2} className="input" value={form.address} onChange={set("address")} aria-invalid={!!errors.address} aria-describedby="bk-address-err" /></Field></div>
          )}
        </fieldset>

        <fieldset className="space-y-5">
          <legend className="mb-5 font-display text-2xl">Your details</legend>
          <Field id="bk-name" label="Full name" error={errors.name}><input id="bk-name" className="input" autoComplete="name" value={form.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby="bk-name-err" /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="bk-phone" label="Phone number" error={errors.phone}><input id="bk-phone" type="tel" inputMode="tel" autoComplete="tel" className="input" value={form.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby="bk-phone-err" /></Field>
            <Field id="bk-email" label="Email (optional)" error={errors.email}><input id="bk-email" type="email" autoComplete="email" className="input" value={form.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby="bk-email-err" /></Field>
          </div>
          <Field id="bk-notes" label="Anything Steph should know?"><textarea id="bk-notes" rows={4} className="input" placeholder="Outfit colours, number of people, inspiration photos you'll send, skin concerns…" value={form.notes} onChange={set("notes")} /></Field>
        </fieldset>

        <div className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-cocoa-soft">{service ? <>Total from <span className="price text-cocoa">{formatNaira(service.price)}</span>{venue === "home" ? " + logistics" : ""}</> : "Choose a service to see the price."}</p>
          <button type="submit" className="btn btn-whatsapp"><WhatsAppGlyph className="h-5 w-5" />Send booking on WhatsApp</button>
        </div>
      </form>
    </div>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-cocoa-soft">{label}</label>
      {children}
      {error && <p id={`${id}-err`} className="field-error" role="alert">{error}</p>}
    </div>
  );
}
