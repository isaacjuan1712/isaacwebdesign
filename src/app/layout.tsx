import type { Metadata, Viewport } from "next";
import { Assistant, Karantina } from "next/font/google";
import Providers from "@/components/Providers";
import { site, siteUrl } from "@/lib/site";
import "./globals.css";

// Karantina: tall condensed Hebrew poster face for headlines. Only the bold weight is used.
const karantina = Karantina({
  variable: "--font-karantina",
  weight: "700",
  subsets: ["hebrew", "latin"],
});

// Assistant: clean, readable Hebrew sans for body text.
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
});

const title = "יצחק | בניית אתרים לעסקים";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Each page sets its own title; this template adds the site name after it
  title: { default: title, template: "%s | יצחק, בניית אתרים" },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "יצחק, בניית אתרים",
    title,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description: site.description },
};

export const viewport: Viewport = {
  themeColor: "#0f0d0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${karantina.variable} ${assistant.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        {/* First focusable element on every page: jumps keyboard users past the header */}
        <a
          href="#main"
          className="fixed start-4 top-3 z-[120] -translate-y-24 rounded-full bg-bone px-5 py-3 font-semibold text-ink transition-transform duration-150 focus-visible:translate-y-0"
        >
          דלג לתוכן
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
