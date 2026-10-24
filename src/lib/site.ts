// Edit these values; every section of the site reads from here.
export const site = {
  name: "יצחק",
  role: "מפתח אתרים לעסקים מקומיים",
  phoneDisplay: "053-428-1220",
  phoneHref: "tel:+972534281220",
  whatsappNumber: "972534281220",
  whatsappMessage: "היי יצחק, ראיתי את האתר שלך ואשמח לשמוע על בניית אתר לעסק שלי",
  email: "isaacjuan1712@gmail.com",
  description:
    "יצחק, מפתח בן 17 שבונה אתרים מהירים ומותאמים לנייד לעסקים מקומיים, עם כפתור וואטסאפ וטופס פניות.",
};

// The public address of the site, for canonical links, the sitemap and share previews.
// Set NEXT_PUBLIC_SITE_URL once you have a domain. On Vercel the production URL is
// filled in automatically until then.
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");

// Dates shown on the legal pages. Update them whenever you change those pages.
export const legalDates = {
  privacyUpdated: "24 באוקטובר 2026",
  accessibilityChecked: "24 באוקטובר 2026",
};

export const whatsappLink = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`;

// "/#..." so the links also work from the legal pages, not only on the home page
export const navLinks = [
  { href: "/#about", label: "עליי" },
  { href: "/#process", label: "איך זה עובד" },
  { href: "/#included", label: "מה מקבלים" },
  { href: "/#contact", label: "צור קשר" },
];

export const legalLinks = [
  { href: "/accessibility", label: "הצהרת נגישות" },
  { href: "/privacy", label: "מדיניות פרטיות" },
];
