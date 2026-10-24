import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Content-Security-Policy: allow only what the site really uses.
// - Scripts/styles: our own files. 'unsafe-inline' is needed because the page is
//   statically generated (no per-request nonce) and Next.js/motion use inline
//   bootstrap scripts and style attributes. 'unsafe-eval' only in development.
// - Fonts are self-hosted by next/font, so no Google Fonts origin is needed.
// - connect-src: the contact form posts to Web3Forms.
// - No iframes, no plugins, and nobody may frame this site.
const csp = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'self' https://api.web3forms.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Explicit, even though it's the default: never ship source maps to browsers
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  // Background photos are served as AVIF (or WebP), resized per screen width.
  // Next 16 requires the allowed quality values to be listed.
  images: { formats: ["image/avif", "image/webp"], qualities: [55, 75] },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
