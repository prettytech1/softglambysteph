// Visual QA: node scripts/shoot.mjs <baseUrl> <outDir> path:name:width ...
import puppeteer from "puppeteer-core";
const [base, out, ...targets] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: "/usr/bin/google-chrome", args: ["--no-sandbox", "--hide-scrollbars"] });
for (const t of targets) {
  const [path, name, width] = t.split(":");
  const page = await browser.newPage();
  const w = Number(width || 1440);
  await page.setViewport({ width: w, height: w < 600 ? 844 : 900, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.log("PAGEERROR", path, e.message));
  page.on("console", (m) => m.type() === "error" && console.log("CONSOLE", path, m.text()));
  await page.goto(base + path, { waitUntil: "load", timeout: 30000 });
  await page.evaluate(() => document.querySelectorAll("img[loading=lazy]").forEach((i) => (i.loading = "eager")));
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.evaluate(() => Promise.race([new Promise((r) => setTimeout(r, 6000)), Promise.all([...document.images].map((i) => i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))]));
  await new Promise((r) => setTimeout(r, 1300));
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true });
  await page.close();
}
await browser.close();
