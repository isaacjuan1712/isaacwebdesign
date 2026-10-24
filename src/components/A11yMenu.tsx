"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { resetPrefs, setPrefs, TEXT_SIZES, type Prefs } from "@/lib/a11y";
import { getLenis, useMotionPause, usePrefs } from "./Providers";

// The international accessibility symbol (a figure with arms outstretched)
function AccessibilityIcon({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <circle cx="12" cy="4.2" r="2.1" />
      <path d="M19.6 7.4c-2.3.6-4.9 1-7.6 1s-5.3-.4-7.6-1l-.5 2c1.8.5 3.8.8 5.8 1v3.3L8.2 21.3l2 .6L12 15.6l1.8 6.3 2-.6-1.5-7.6v-3.3c2-.2 4-.5 5.8-1Z" />
    </svg>
  );
}

// One on/off option: a full-width button with aria-pressed and a small switch drawing
function Toggle({ label, pressed, onClick }: { label: string; pressed: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className="flex min-h-12 w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 text-start font-semibold text-bone transition-colors hover:bg-ink"
    >
      {label}
      <span
        aria-hidden="true"
        className={`relative h-6 w-10 shrink-0 rounded-full border transition-colors duration-200 ${pressed ? "border-flare bg-flare" : "border-edge bg-ink"}`}
      >
        <span
          className={`absolute top-0.5 size-[1.125rem] rounded-full transition-[inset-inline-start,background-color] duration-200 ${pressed ? "start-[1.125rem] bg-ink" : "start-0.5 bg-bone"}`}
        />
      </span>
    </button>
  );
}

// Supplementary accessibility tools, built in (no third-party overlay). Sits in the bottom
// corner opposite the WhatsApp button. The panel is a modal dialog: focus moves inside,
// Tab is trapped, Esc or the close button closes it and focus returns to the trigger.
export default function A11yMenu() {
  const { t, path } = useI18n();
  const m = t.a11yMenu;
  const prefs = usePrefs();
  const { paused, toggle: toggleMotion } = useMotionPause();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const sizeLabelId = useId();

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    getLenis()?.stop();
    const frame = requestAnimationFrame(() => panel?.querySelector<HTMLElement>("button")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(frame);
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const flip = (key: keyof Pick<Prefs, "contrast" | "links" | "readable">) => setPrefs({ [key]: !prefs[key] });

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={m.open}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="a11y-menu"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
        className="fixed start-5 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full border-2 border-ink bg-bone text-ink shadow-lg shadow-black/40 transition-transform duration-150 ease-out hover:scale-105 active:scale-95"
      >
        <AccessibilityIcon />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Clicking anywhere outside the panel closes it */}
            <div aria-hidden="true" className="fixed inset-0 z-[55]" onClick={close} />
            <motion.div
              ref={panelRef}
              id="a11y-menu"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              data-lenis-prevent
              style={{ bottom: "calc(max(1.25rem, env(safe-area-inset-bottom)) + 3.75rem)" }}
              className="fixed start-5 z-[60] max-h-[calc(100dvh-7rem)] w-[min(21rem,calc(100vw-2.5rem))] origin-bottom overflow-y-auto overscroll-contain rounded-2xl border border-edge bg-ink-2 p-3 text-bone shadow-[0_24px_60px_-12px_rgb(0_0_0/0.8)]"
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.12 } }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="flex items-center justify-between gap-3 border-b border-line ps-2 pb-2">
                <h2 id={titleId} className="flex items-center gap-2 text-lg font-bold">
                  <AccessibilityIcon className="size-5" />
                  {m.title}
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label={m.close}
                  className="flex size-11 cursor-pointer items-center justify-center rounded-full text-bone transition-colors hover:bg-ink"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true" className="size-5">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </div>

              <div className="px-2 pt-3 pb-1">
                <p id={sizeLabelId} className="text-sm font-semibold text-dust">
                  {m.textSize}
                </p>
                <div role="group" aria-labelledby={sizeLabelId} className="mt-2 grid grid-cols-3 gap-1.5">
                  {TEXT_SIZES.map((size, i) => {
                    const on = prefs.textSize === i;
                    return (
                      <button
                        key={size}
                        type="button"
                        aria-pressed={on}
                        onClick={() => setPrefs({ textSize: i as Prefs["textSize"] })}
                        className={`min-h-11 cursor-pointer rounded-lg border font-semibold transition-colors ${on ? "border-flare bg-flare text-ink" : "border-edge text-bone hover:bg-ink"}`}
                      >
                        <span dir="ltr">{size}%</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-2 space-y-0.5">
                <Toggle label={m.contrast} pressed={prefs.contrast} onClick={() => flip("contrast")} />
                <Toggle label={m.links} pressed={prefs.links} onClick={() => flip("links")} />
                <Toggle label={m.readable} pressed={prefs.readable} onClick={() => flip("readable")} />
                {/* Same state as the pause button in the header */}
                <Toggle label={m.motion} pressed={paused} onClick={toggleMotion} />
              </div>

              <div className="mt-2 grid gap-2 border-t border-line px-2 pt-3">
                <button
                  type="button"
                  onClick={resetPrefs}
                  className="min-h-11 cursor-pointer rounded-lg border border-edge font-semibold text-bone transition-colors hover:bg-ink"
                >
                  {m.reset}
                </button>
                <Link
                  href={path("/accessibility")}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-center rounded-lg font-semibold text-bone underline underline-offset-4 hover:text-flare"
                >
                  {m.statement}
                </Link>
                <p className="pb-1 text-center text-xs leading-relaxed text-dust">{m.note}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
