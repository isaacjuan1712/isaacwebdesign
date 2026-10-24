// Contact details used across the site. Texts (name, role, WhatsApp message) live in
// src/messages/he.json and src/messages/en.json.
export const site = {
  phoneDisplay: "053-428-1220",
  phoneHref: "tel:+972534281220",
  phoneInternational: "+972534281220",
  whatsappNumber: "972534281220",
  email: "isaacjuan1712@gmail.com",
};

// The public address of the site, for canonical links, the sitemap and share previews.
// Set NEXT_PUBLIC_SITE_URL once you have a domain. On Vercel the production URL is
// filled in automatically until then.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

// Opens WhatsApp with a ready-made message in the visitor's language
export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

// Section anchors on the home page, in page order. Labels come from the "nav" texts.
export const sections = ["about", "process", "included", "faq", "contact"] as const;

export const legalPages = ["accessibility", "privacy"] as const;
