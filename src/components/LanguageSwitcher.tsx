"use client";

import { useI18n } from "@/i18n/client";
import { LOCALE_COOKIE, localizePath, locales, type Locale } from "@/i18n/config";

// Remembers the choice for a year, so "/" opens in the visitor's language next time.
// Wrapped in try/catch: cookies can be blocked, and the switch must still work.
function remember(locale: Locale) {
  try {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  } catch {}
}

// One compact link to the same page in the other language: "EN" on the Hebrew site,
// "עב" on the English site. The link (text and aria-label) is marked with the target
// language's lang, so screen readers pronounce it correctly.
export default function LanguageSwitcher({ path, className = "" }: { path: string; className?: string }) {
  const { locale, t } = useI18n();
  const other = locales.find((l) => l !== locale)!;

  return (
    <a
      href={localizePath(other, path)}
      hrefLang={other}
      lang={other}
      aria-label={t.language.switchTo}
      onClick={() => remember(other)}
      className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-edge px-3 text-sm font-semibold text-bone transition-colors hover:border-flare hover:text-flare ${className}`}
    >
      {t.language[other]}
    </a>
  );
}
