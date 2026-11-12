// Functional smoke test of cart → checkout and booking (WhatsApp hand-off captured, not sent).
import puppeteer from "puppeteer-core";
const base = process.argv[2] ?? "http://localhost:4321";
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.setViewport({ width: 1280, height: 900 });
await p.evaluateOnNewDocument(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
p.on("pageerror", (e) => console.log("PAGEERROR", e.message));
const click = async (text) => { const ok = await p.evaluate((t) => { const el = [...document.querySelectorAll("button,a")].find((e) => e.textContent.trim() === t); if (el) el.click(); return !!el; }, text); if (!ok) throw new Error("No button " + text); };

await p.goto(base + "/shop/glowbysteph-lip-gloss/?shade=burgundy", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 600));
console.log("PDP shade:", await p.evaluate(() => [...document.querySelectorAll("p")].find((x) => x.textContent.startsWith("Shade:"))?.textContent));
await p.click('button[aria-label="Increase quantity"]');
await click("Add to bag");
await new Promise((r) => setTimeout(r, 400));
console.log("Drawer:", await p.evaluate(() => document.querySelector('[aria-label="Your bag"] ul')?.innerText.replace(/\n+/g, " | ")));
await p.goto(base + "/checkout/", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 600));
await click("Send order on WhatsApp");
console.log("Errors shown:", await p.evaluate(() => [...document.querySelectorAll(".field-error")].map((e) => e.textContent)));
await p.type("#co-name", "Ada Test"); await p.type("#co-phone", "08031234567"); await p.type("#co-address", "12 Admiralty Way, Lekki");
await click("Send order on WhatsApp");
await new Promise((r) => setTimeout(r, 400));
console.log("Confirmation:", await p.evaluate(() => document.querySelector("h1")?.textContent));
console.log("WA URL:", decodeURIComponent((await p.evaluate(() => window.__opened[0])) ?? "none"));

await p.goto(base + "/book/?service=home-birthday-glam", { waitUntil: "load" });
await new Promise((r) => setTimeout(r, 600));
console.log("Preselected:", await p.$eval("#bk-service", (e) => e.value));
await p.type("#bk-name", "Ada Test"); await p.type("#bk-phone", "+234 803 123 4567");
await p.$eval("#bk-date", (e) => { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set; s.call(e, "2026-12-20"); e.dispatchEvent(new Event("input", { bubbles: true })); });
await p.$eval("#bk-time", (e) => { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set; s.call(e, "10:30"); e.dispatchEvent(new Event("input", { bubbles: true })); });
await p.type("#bk-address", "Chevron Drive, Lekki");
await click("Send booking on WhatsApp");
await new Promise((r) => setTimeout(r, 400));
console.log("Booking:", await p.evaluate(() => document.querySelector("h1")?.textContent));
console.log("WA URL:", decodeURIComponent((await p.evaluate(() => window.__opened.at(-1))) ?? "none"));
await b.close();
