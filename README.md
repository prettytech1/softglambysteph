# Softglambysteph — makeup studio & GlowbySteph store

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lucide · optional Supabase · Paystack-ready.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (Vercel / Node)
npm run export       # static preview in ./out (API routes parked, images unoptimised)
```

Deploy: push to GitHub → import on Vercel → add the env vars from `.env.example` (all optional).

## How the site works

| Flow | What happens |
|---|---|
| Booking (`/book`) | Validated form → WhatsApp opens with the request pre-written (ref `SGB-…`) → on-page confirmation. Stored in Supabase `bookings` if configured. `?service=<id>` preselects a service; every "Book this service" button uses it. |
| Shop → bag → checkout | Cart lives in context + localStorage. Checkout collects details and delivery method, then **Send order on WhatsApp** (ref `SGO-…`, status *Pending*). Nothing is ever marked paid without a verified gateway response. |
| Card payment | Hidden until `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set. Paystack Inline → `/api/paystack/verify` (secret key, server) → order flips to `paid` only if Paystack confirms *and* the amount matches. `/api/paystack/webhook` (HMAC-SHA512 checked) is the backstop. Set the webhook URL in the Paystack dashboard to `https://<domain>/api/paystack/webhook`. |
| Contact form | Opens WhatsApp with the message; stored in `enquiries` if Supabase is on. |
| Newsletter | Only renders a sign-up form when Supabase is connected; otherwise points to Instagram (no fake "subscribed"). |

## Updating products

- **Without a database:** edit `data/catalog.ts`. Add a shade = add an object to `shades` and drop a photo in `public/images/products/`. Prices are in Naira.
- **With Supabase:** run `supabase/schema.sql` (tables, RLS, seed that mirrors the local catalogue), set the two public env vars. Products are then read from `products` + `product_shades`; edit them in the Supabase table editor. If Supabase is unreachable the site falls back to the local catalogue.

Services and prices: `data/services.ts`. Portfolio: `data/portfolio.ts`. Contact details: `lib/site.ts`.

## Content still needed from the client

Search the codebase for `Placeholder` / `placeholder: true` — each renders as a dashed box on the site so nothing ships by accident.

1. **Official shade names.** Current names (Clear, Pink, Nude, Burgundy; liner Black, Berry) describe the photos and are flagged `nameConfirmed: false`.
2. **Product descriptions** were removed from product pages at the client's request. The `description`, `benefits` and `details` fields are still in the data model if they're wanted later.
3. **Combo bundle contents** — what's in the ₦27,000 bag and which shades.
4. **Client reviews** (`data/testimonials.ts`).
6. **Policies:** deposit, cancellation, delivery fees, returns window.
7. **Stock levels** — every shade defaults to in stock.
8. **Lipsticks** — mentioned in the brief but no photos or prices were supplied, so there's no lipstick category yet. Adding one is a new `categories` entry + products.

## Asset notes

- **Logo:** the supplied logo was a TikTok screenshot with app UI over the wordmark. The emblem (crown/eye/brushes) was cut out cleanly; the wordmark is re-set in Pinyon Script with a rose-gold gradient. Swap in the original vector/PNG logo when available (`components/Wordmark.tsx`).
- Portfolio photos that were screen recordings were cropped to remove status bars, mute icons and carousel badges. No photo is stretched or retouched; all are WebP at ≤1400px.
- Fonts (Bodoni Moda, Jost, Pinyon Script) are self-hosted via Fontsource — no Google Fonts request.

## Design system

- **Colour:** porcelain `#fcf8f6` base, shell `#f7ece8`, blush `#f1dcd8`, rose-gold `#b5787b` (from the wordmark), rose-deep `#8b4c53` (accessible accent), cocoa `#3a2420` text, champagne `#c6a16a` sparingly.
- **Type:** Bodoni Moda for headings (beauty-editorial), Jost for body (echoes the logo's geometric caps), Pinyon Script only for the wordmark and brand lines.
- **Shape:** arched frames for portraits (the vanity-mirror motif from the studio photos), pill buttons, 14–22px radii on product/portfolio tiles. One orchestrated motion moment (hero), everything else responds to user action.

## QA scripts

`scripts/qa/shoot.mjs` (full-page screenshots) and `scripts/qa/flow-test.mjs` (bag → checkout → WhatsApp, booking) run against a served `out/` with `puppeteer-core` + local Chrome.
