/** @type {import('next').NextConfig} */
const isExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  // STATIC_EXPORT=1 produces a static preview build (no API routes, unoptimised images).
  // Normal builds (e.g. on Vercel) keep image optimisation and the Paystack API routes.
  ...(isExport ? { output: "export", trailingSlash: true, assetPrefix: process.env.EXPORT_ASSET_PREFIX || undefined } : {}),
  images: {
    unoptimized: isExport,
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
};

export default nextConfig;
