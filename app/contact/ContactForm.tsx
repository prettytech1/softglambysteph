"use client";
import { useState } from "react";
import { whatsappLink } from "@/lib/site";
import { isEmail, type Errors } from "@/lib/validate";
import { recordSubmission } from "@/lib/supabase";
import { WhatsAppGlyph } from "@/components/WhatsAppFab";

type F = "name" | "contact" | "topic" | "message";

export function ContactForm() {
  const [f, setF] = useState<Record<F, string>>({ name: "", contact: "", topic: "Makeup booking", message: "" });
  const [errors, setErrors] = useState<Errors<F>>({});
  const [sent, setSent] = useState(false);
  const set = (k: F) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const er: Errors<F> = {};
    if (f.name.trim().length < 2) er.name = "Enter your name.";
    if (!(isEmail(f.contact) || f.contact.replace(/\D/g, "").length >= 10)) er.contact = "Enter a phone number or email so Steph can reply.";
    if (f.message.trim().length < 5) er.message = "Write a short message.";
    setErrors(er);
    if (Object.keys(er).length) { document.getElementById(`ct-${Object.keys(er)[0]}`)?.focus(); return; }
    window.open(whatsappLink(`Hi Steph, it's ${f.name} (${f.contact}).\nTopic: ${f.topic}\n\n${f.message}`), "_blank", "noopener");
    void recordSubmission("enquiries", { name: f.name, contact: f.contact, topic: f.topic, message: f.message });
    setSent(true);
  }

  if (sent) return (
    <div className="mt-8" role="status">
      <p className="font-display text-2xl">Message opened in WhatsApp</p>
      <p className="mt-2 text-cocoa-soft">Tap send in WhatsApp to deliver it.</p>
      <button className="btn btn-ghost mt-6" onClick={() => { setSent(false); setF({ name: "", contact: "", topic: "Makeup booking", message: "" }); }}>Write another message</button>
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="mt-8 space-y-5">
      {([["name", "Your name", "text"], ["contact", "Phone or email", "text"]] as const).map(([k, label, type]) => (
        <div key={k}>
          <label htmlFor={`ct-${k}`} className="mb-1.5 block text-sm text-cocoa-soft">{label}</label>
          <input id={`ct-${k}`} type={type} className="input" value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={`ct-${k}-err`} />
          {errors[k] && <p id={`ct-${k}-err`} className="field-error" role="alert">{errors[k]}</p>}
        </div>
      ))}
      <div>
        <label htmlFor="ct-topic" className="mb-1.5 block text-sm text-cocoa-soft">Topic</label>
        <select id="ct-topic" className="input" value={f.topic} onChange={set("topic")}>
          {["Makeup booking", "Bridal enquiry", "Product order", "Wholesale or collaboration", "Something else"].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="ct-message" className="mb-1.5 block text-sm text-cocoa-soft">Message</label>
        <textarea id="ct-message" rows={5} className="input" value={f.message} onChange={set("message")} aria-invalid={!!errors.message} aria-describedby="ct-message-err" />
        {errors.message && <p id="ct-message-err" className="field-error" role="alert">{errors.message}</p>}
      </div>
      <button className="btn btn-whatsapp w-full sm:w-auto"><WhatsAppGlyph className="h-5 w-5" />Send on WhatsApp</button>
    </form>
  );
}
