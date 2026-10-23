// Edit these values; every section of the site reads from here.
export const site = {
  name: "יצחק",
  role: "מפתח אתרים לעסקים מקומיים",
  phoneDisplay: "053-428-1220",
  phoneHref: "tel:+972534281220",
  whatsappNumber: "972534281220",
  whatsappMessage: "היי יצחק, ראיתי את האתר שלך ואשמח לשמוע על בניית אתר לעסק שלי",
  email: "isaacjuan1712@gmail.com",
};

export const whatsappLink = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`;

export const navLinks = [
  { href: "#about", label: "עליי" },
  { href: "#process", label: "איך זה עובד" },
  { href: "#included", label: "מה מקבלים" },
  { href: "#contact", label: "צור קשר" },
];
