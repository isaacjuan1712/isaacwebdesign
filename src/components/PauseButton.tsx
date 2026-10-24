"use client";

import { useI18n } from "@/i18n/client";
import { useMotionPause } from "./Providers";

// Pauses and resumes all automatic motion: the ticker, the stamp, the phone animations
// and every looping effect (WCAG 2.2.2). Shares its state with the accessibility menu's
// "stop animations" option, and the choice is saved (src/lib/a11y.ts).
// A dark tab attached to the end of the orange band (5.85:1 against it), with an icon and
// a visible label. The aria-label starts with the visible word (WCAG 2.5.3).
export default function PauseButton({ className = "" }: { className?: string }) {
  const { paused, toggle } = useMotionPause();
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label={paused ? t.nav.play : t.nav.pause}
      className={`flex min-h-[44px] shrink-0 cursor-pointer items-center gap-2 self-stretch rounded-s-xl bg-ink px-4 text-sm font-semibold text-bone transition-colors duration-150 hover:bg-ink-2 focus-visible:outline-bone! focus-visible:outline-offset-[-5px]! sm:px-5 sm:text-base ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4 shrink-0">
        {paused ? <path d="M8 5.5v13l10-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
      </svg>
      <span aria-hidden="true">{paused ? t.nav.playShort : t.nav.pauseShort}</span>
    </button>
  );
}
