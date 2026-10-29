// Contact details used across the site. Texts (name, role, WhatsApp message) live in
// src/messages/he.json and src/messages/en.json.
export const site = {
  phoneDisplay: "053-428-1220",
  phoneHref: "tel:+972534281220",
  phoneInternational: "+972534281220",
  whatsappNumber: "972534281220",
  email: "isaacjuan1712@gmail.com",
};

// The public address of the site, without a trailing slash. The single source for
// canonical links, hreflang, sitemap.xml, robots.txt, Open Graph URLs and images, and
// structured data. If you buy a domain, change it here and redeploy.
export const siteUrl = "https://isaacwebdesign.vercel.app";

// Opens WhatsApp with a ready-made message in the visitor's language
export const whatsappLink = (message: string) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

// Section anchors on the home page, in page order. Labels come from the "nav" texts.
export const sections = ["about", "process", "included", "faq", "contact"] as const;

export const legalPages = ["accessibility", "privacy"] as const;

// Shown in the logo's reserved box until /logo.svg arrives (next/image drops it on load):
// a soft rounded block in the divider color, the same footprint as the stamp.
export const logoPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 34 44'%3E%3Crect x='2' y='2' width='30' height='40' rx='6' fill='%232e2924'/%3E%3C/svg%3E";
