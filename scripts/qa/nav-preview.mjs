import puppeteer from "puppeteer-core";
const b = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox"] });
const p = await b.newPage(); await p.setViewport({ width: 1280, height: 900 });
p.on("pageerror", (e) => console.log("ERR", e.message));
await p.goto("http://localhost:4330/sub/index.html", { waitUntil: "load" }); await new Promise(r=>setTimeout(r,800));
const clickText = (t) => p.evaluate((t) => { const a=[...document.querySelectorAll("a,button")].find(e=>e.textContent.trim()===t); a?.click(); return !!a; }, t);
for (const t of ["Shop","Services","Portfolio","About","Contact"]) { await clickText(t); await new Promise(r=>setTimeout(r,500)); console.log(t, "→", await p.evaluate(()=>document.querySelector("h1")?.textContent)); }
await clickText("Shop"); await new Promise(r=>setTimeout(r,500));
await clickText("Lip liners 2"); await new Promise(r=>setTimeout(r,300));
console.log("filtered tiles:", await p.evaluate(()=>document.querySelectorAll("article").length));
await clickText("Add to bag"); await new Promise(r=>setTimeout(r,400));
console.log("bag:", await p.evaluate(()=>document.querySelector('[aria-label="Your bag"] ul')?.innerText.replace(/\n+/g," | ")));
await clickText("Checkout"); await new Promise(r=>setTimeout(r,500));
console.log("now:", await p.evaluate(()=>document.querySelector("h1")?.textContent), await p.evaluate(()=>location.hash));
await b.close();
