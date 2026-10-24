import type he from "@/messages/he.json";

export const locales = ["he", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "he";

// The shape of the texts, taken from he.json (type only: no text is bundled from here)
export type Messages = typeof he;

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

export const directionOf = (locale: Locale) => (locale === "he" ? "rtl" : "ltr");

// Hebrew lives at the root ("/privacy"), English under "/en" ("/en/privacy").
export function localizePath(locale: Locale, path: string) {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

// The visitor's language choice is remembered in this cookie (read by src/proxy.ts)
export const LOCALE_COOKIE = "locale";

// Fills "{name}"-style placeholders: format("שלב {n}", { n: 2 }) → "שלב 2"
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
