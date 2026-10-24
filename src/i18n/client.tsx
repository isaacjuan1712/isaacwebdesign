"use client";

import { createContext, useContext } from "react";
import { directionOf, localizePath, type Locale, type Messages } from "./config";

// The legal pages render on the server only, so their long texts never ship to the browser
export type ClientMessages = Omit<Messages, "privacy" | "accessibility">;

const I18nContext = createContext<{ locale: Locale; t: ClientMessages } | null>(null);

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: ClientMessages; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, t: messages }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  const { locale, t } = value;
  const dir = directionOf(locale);
  return {
    locale,
    t,
    dir,
    // +1 in RTL, -1 in LTR: flips horizontal motion so it follows the reading direction
    sign: dir === "rtl" ? 1 : -1,
    path: (p: string) => localizePath(locale, p),
  };
}
