import type { Metadata, Viewport } from "next";
import { Anton, Assistant, Karantina } from "next/font/google";
import Providers from "@/components/Providers";
import { I18nProvider, type ClientMessages } from "@/i18n/client";
import { directionOf, locales } from "@/i18n/config";
import { pageMetadata, metadataBase } from "@/i18n/metadata";
import { getDictionary } from "@/i18n/server";
import { prePaintScript } from "@/lib/a11y";
import "../globals.css";

// Karantina: tall condensed Hebrew poster face for headlines. Only the bold weight is used.
const karantina = Karantina({
  variable: "--font-karantina",
  weight: "700",
  subsets: ["hebrew", "latin"],
});

// Anton: the English headline face, with the same heavy, condensed poster feel as Karantina.
// globals.css swaps it in for --font-display on English pages.
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

// Assistant: clean, readable sans for body text, in both Hebrew and English.
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
});

// Both languages are generated at build time: /, /en, /privacy, /en/privacy, ...
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getDictionary();
  return {
    metadataBase,
    // Each page sets its own title; this template adds the site name after it
    title: { default: t.meta.title, template: t.meta.titleTemplate },
    ...pageMetadata(locale, t, "/"),
  };
}

export const viewport: Viewport = {
  themeColor: "#0f0d0b",
};

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const { locale, t } = await getDictionary();
  // The legal pages' long texts stay on the server; the browser only gets UI strings
  const clientMessages: ClientMessages = { ...t };
  delete (clientMessages as Partial<typeof t>).privacy;
  delete (clientMessages as Partial<typeof t>).accessibility;

  return (
    <html
      lang={locale}
      dir={directionOf(locale)}
      className={`${karantina.variable} ${anton.variable} ${assistant.variable} antialiased`}
      // The pre-paint script below adds data-* attributes before React hydrates
      suppressHydrationWarning
    >
      <head>
        {/* Applies saved accessibility preferences (text size, contrast, paused motion...)
            before the first paint, so the page never flashes in the default style */}
        <script dangerouslySetInnerHTML={{ __html: prePaintScript }} />
      </head>
      <body className="min-h-dvh font-sans">
        {/* First focusable element on every page: jumps keyboard users past the header */}
        <a
          href="#main"
          className="fixed start-4 top-3 z-[120] -translate-y-24 rounded-full bg-bone px-5 py-3 font-semibold text-ink transition-transform duration-150 focus-visible:translate-y-0"
        >
          {t.a11y.skipLink}
        </a>
        <I18nProvider locale={locale} messages={clientMessages}>
          <Providers>{children}</Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
