"use client";
import { useState } from "react";
import { recordSubmission, supabaseEnabled } from "@/lib/supabase";
import { site } from "@/lib/site";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const dark = tone === "dark";

  if (!supabaseEnabled) {
    // No mailing list connected yet — say so rather than pretend to subscribe someone.
    return (
      <p className={dark ? "text-porcelain/70 text-sm" : "text-cocoa-soft text-sm"}>
        Shade drops land on Instagram first —{" "}
        <a className="underline underline-offset-4" href={site.instagram.url} target="_blank" rel="noreferrer">follow {site.instagram.handle}</a>.
      </p>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setState("error"); return; }
    setState("sending");
    const r = await recordSubmission("newsletter", { email });
    setState(r.stored ? "done" : "error");
  }

  if (state === "done") return <p className={dark ? "text-porcelain/80" : ""} role="status">You're on the list.</p>;
  return (
    <form onSubmit={submit} className="flex gap-2" noValidate>
      <label className="sr-only" htmlFor={`nl-${tone}`}>Email address</label>
      <input id={`nl-${tone}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address"
        aria-invalid={state === "error"} className={`input !rounded-full ${dark ? "!bg-white/10 !border-white/20 !text-porcelain placeholder:text-porcelain/50" : ""}`} />
      <button className={`btn ${dark ? "bg-porcelain text-cocoa hover:bg-blush" : "btn-primary"}`} disabled={state === "sending"}>{state === "sending" ? "…" : "Sign up"}</button>
      {state === "error" && <p className="sr-only" role="alert">Enter a valid email address.</p>}
    </form>
  );
}
