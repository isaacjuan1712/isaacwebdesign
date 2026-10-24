"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { navLinks, site, whatsappLink } from "@/lib/site";
import Magnetic from "./Magnetic";
import { getLenis, useMotionPause } from "./Providers";

const ease = [0.23, 1, 0.32, 1] as const;

// Everything a keyboard user can reach, limited to what is actually on screen
const focusable = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter((el) => el.getClientRects().length > 0);

// Stops every looping animation on the site (ticker, stamp, demo loops). WCAG 2.2.2.
function PauseButton() {
  const { paused, toggle } = useMotionPause();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={paused}
      aria-label={paused ? "הפעלת האנימציות באתר" : "עצירת האנימציות באתר"}
      title={paused ? "הפעלת אנימציות" : "עצירת אנימציות"}
      className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-edge text-bone transition-[background-color,color,scale] duration-150 ease-out hover:bg-bone hover:text-ink active:scale-[0.94]"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
        {paused ? <path d="M8 5.5v13l10-6.5z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
      </svg>
    </button>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  // Reading progress: a thin orange line along the bottom of the header
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  // While the mobile menu is open: lock page scroll, move focus into the menu,
  // keep Tab inside the header, and close on Escape (focus returns to the menu button).
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const frame = requestAnimationFrame(() => header?.querySelector<HTMLElement>("#mobile-menu a")?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !header) return;
      const items = focusable(header);
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
      document.body.style.overflow = "";
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-line bg-ink/95">
      <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${site.name}, לעמוד הבית`}
          className="flex min-h-11 items-center font-display text-3xl leading-none font-bold"
          onClick={() => setOpen(false)}
        >
          {site.name}
          <span className="text-flare">.</span>
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <nav aria-label="ניווט ראשי" className="hidden items-center gap-7 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative flex min-h-11 min-w-11 items-center justify-center text-dust transition-colors hover:text-bone"
              >
                {link.label}
                <span className="absolute inset-x-0 bottom-2 h-px origin-right scale-x-0 bg-flare transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
            <Magnetic>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center rounded-full bg-flare px-5 font-semibold text-ink transition-[scale,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.97]"
              >
                בואו נדבר
                <span className="sr-only"> (וואטסאפ, נפתח בחלון חדש)</span>
              </a>
            </Magnetic>
          </nav>

          <PauseButton />

          {/* Hamburger: the two bars rotate into an X */}
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "סגירת תפריט" : "פתיחת תפריט"}
            className="flex size-11 cursor-pointer flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <motion.span
              className="block h-0.5 w-7 bg-bone"
              animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease }}
            />
            <motion.span
              className="block h-0.5 w-7 bg-bone"
              animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25, ease }}
            />
          </button>
        </div>
      </div>

      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px z-10 h-0.5 origin-right bg-flare"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="תפריט נייד"
            className="fixed inset-0 z-0 flex flex-col justify-between overflow-y-auto bg-ink px-6 pt-24 pb-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.2 }}
          >
            <motion.ul
              className="space-y-1"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.35, ease }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 font-display text-6xl font-bold active:text-flare"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 block rounded-full bg-flare py-4 text-center text-lg font-semibold text-ink active:scale-95"
            >
              שלחו לי וואטסאפ
              <span className="sr-only"> (נפתח בחלון חדש)</span>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
