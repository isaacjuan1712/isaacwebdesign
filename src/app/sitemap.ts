import type { MetadataRoute } from "next";
import { defaultLocale, localizePath, locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site";

const pages = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/accessibility", changeFrequency: "yearly", priority: 0.3 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
] as const;

const absolute = (path: string) => `${siteUrl}${path === "/" ? "" : path}` || siteUrl;

// Every page in both languages, each entry listing its other-language version (hreflang)
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, changeFrequency, priority }) =>
    locales.map((locale) => ({
      url: absolute(localizePath(locale, path)),
      changeFrequency,
      priority: locale === defaultLocale ? priority : priority * 0.9,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, absolute(localizePath(l, path))])),
      },
    })),
  );
}
