import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import { defaultLocale, localizePath, locales, type Locale, type Messages } from "./config";

// Canonical URL, hreflang alternates and share tags for one page in one language.
// `path` is the page's path without the language prefix, e.g. "/" or "/privacy".
export function pageMetadata(
  locale: Locale,
  t: Messages,
  path: string,
  page: { title?: string; description?: string } = {},
): Metadata {
  const languages = Object.fromEntries(locales.map((l) => [l, localizePath(l, path)]));
  const description = page.description ?? t.meta.description;
  const ogTitle = page.title ? `${page.title} | ${t.meta.siteName}` : t.meta.title;
  const image = { url: `/og-${locale}.png`, width: 1200, height: 630, alt: t.meta.ogImageAlt };
  return {
    ...(page.title && { title: page.title }),
    description,
    alternates: {
      canonical: localizePath(locale, path),
      languages: { ...languages, "x-default": localizePath(defaultLocale, path) },
    },
    openGraph: {
      type: "website",
      locale: t.meta.ogLocale,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => (l === "he" ? "he_IL" : "en_US")),
      siteName: t.meta.siteName,
      title: ogTitle,
      description,
      url: localizePath(locale, path),
      images: [image],
    },
    twitter: { card: "summary_large_image", title: ogTitle, description, images: [image] },
  };
}

export const metadataBase = new URL(siteUrl);
