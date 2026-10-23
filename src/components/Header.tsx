"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { navLinks, site, whatsappLink } from "@/lib/site";
import Magnetic from "./Magnetic";
import { getLenis } from "./Providers";

const ease = [0.23, 1, 0.32, 1] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  // Reading progress: a thin orange line along the bottom of the header
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, restDelta: 0.001 });

  // While the mobile menu is open: lock page scroll and close on Escape.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      getLenis()?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink/95">
      <div className="relative z-10 mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="font-display text-3xl leading-none font-bold" onClick={() => setOpen(false)}>
          {site.name}
          <span className="text-flare">.</span>
        </a>

        <nav aria-label="ניווט ראשי" className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="group relative py-2 text-dust transition-colors hover:text-bone">
              {link.label}
              <span className="absolute inset-x-0 bottom-0 h-px origin-right scale-x-0 bg-flare transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
          <Magnetic>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-flare px-5 py-2.5 font-semibold text-ink transition-[scale,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.97]"
            >
              בואו נדבר
            </a>
          </Magnetic>
        </nav>

        {/* Hamburger: the two bars rotate into an X */}
        <button
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
            className="fixed inset-0 z-0 flex flex-col justify-between bg-ink px-6 pt-24 pb-10 md:hidden"
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
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.35, ease }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-2 font-display text-6xl font-bold active:text-flare"
                  >
                    <span className="font-sans text-sm font-semibold text-flare">0{i + 1}</span>
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full bg-flare py-4 text-center text-lg font-semibold text-ink active:scale-95"
            >
              שלחו לי וואטסאפ
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
