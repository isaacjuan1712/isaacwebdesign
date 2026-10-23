import type { Metadata, Viewport } from "next";
import { Assistant, Karantina } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

// Karantina: tall condensed Hebrew poster face for headlines.
const karantina = Karantina({
  variable: "--font-karantina",
  weight: ["400", "700"],
  subsets: ["hebrew", "latin"],
});

// Assistant: clean, readable Hebrew sans for body text.
const assistant = Assistant({
  variable: "--font-assistant",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "יצחק | בניית אתרים לעסקים",
  description:
    "יצחק, מפתח בן 17 שבונה אתרים מהירים ומודרניים לעסקים מקומיים, עם וואטסאפ וטופס פניות.",
};

export const viewport: Viewport = {
  themeColor: "#0f0d0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${karantina.variable} ${assistant.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
