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

// "עב / EN": the current language is plain text (aria-current), the other one is a link
// to the same page in that language. Works with Tab + Enter like any link.
export default function LanguageSwitcher({ path, className = "" }: { path: string; className?: string }) {
  const { locale, t } = useI18n();

  return (
    <div role="group" aria-label={t.language.groupLabel} className={`flex items-center text-sm font-semibold ${className}`}>
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span aria-hidden="true" className="px-0.5 text-edge">/</span>}
          {l === locale ? (
            <span aria-current="true" lang={l} className="flex min-h-[44px] min-w-[44px] items-center justify-center text-bone">
              {t.language[l]}
            </span>
          ) : (
            <a
              href={localizePath(l, path)}
              hrefLang={l}
              lang={t.language.switchToLang}
              aria-label={t.language.switchTo}
              onClick={() => remember(l)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-dust transition-colors hover:text-flare"
            >
              {t.language[l]}
            </a>
          )}
        </span>
      ))}
    </div>
  );
}
