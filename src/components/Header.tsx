"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/config";
import { sections, whatsappLink } from "@/lib/site";
import LanguageSwitcher from "./LanguageSwitcher";
import Magnetic from "./Magnetic";
import { getLenis } from "./Providers";

const ease = [0.23, 1, 0.32, 1] as const;

// Everything a keyboard user can reach, limited to what is actually on screen
const focusable = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter((el) => el.getClientRects().length > 0);

// `path` is the current page without the language prefix ("/" or "/privacy"),
// so the language switcher can link to the same page in the other language.
export default function Header({ path = "/" }: { path?: string }) {
  const [open, setOpen] = useState(false);
  const { t, dir, path: localized } = useI18n();
  const home = localized("/");
  const navLinks = sections.map((id) => ({ href: `${home}#${id}`, label: t.nav[id] }));
  const whatsapp = whatsappLink(t.site.whatsappMessage);
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

  const logo = (
    <Link
      href={home}
      dir={dir}
      aria-label={format(t.site.homeLabel, { name: t.site.name })}
      className="col-start-3 row-start-1 flex min-h-[44px] items-center gap-3 justify-self-end font-display text-[clamp(1.5rem,7vw,1.875rem)] leading-none font-bold"
      onClick={() => setOpen(false)}
    >
      {/* The iJ stamp (brand/logo-full.svg); the link's aria-label names it */}
      <Image src="/logo.svg" alt="" width={34} height={44} />
      {t.site.name}
    </Link>
  );

  const nav = (
    <nav dir={dir} aria-label={t.nav.mainLabel} className="col-start-2 row-start-1 hidden items-center gap-6 lg:flex">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="group relative flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap text-dust transition-colors hover:text-bone"
        >
          {link.label}
          <span className="absolute inset-x-0 bottom-2 h-px origin-right scale-x-0 bg-flare ltr:origin-left transition-transform duration-300 group-hover:scale-x-100" />
        </a>
      ))}
    </nav>
  );

  const hamburger = (
    // The two bars rotate into an X
    <button
      key="menu"
      ref={menuButtonRef}
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      aria-controls="mobile-menu"
      aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
      className="flex size-[44px] cursor-pointer flex-col items-center justify-center gap-1.5 lg:hidden"
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
  );
  const cta = (
    <Magnetic key="cta" className="hidden xl:inline-flex">
      <a
        dir={dir}
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center rounded-full bg-flare px-5 font-semibold whitespace-nowrap text-ink transition-[scale,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.97]"
      >
        {t.nav.cta}
        <span className="sr-only"> {t.nav.ctaHint}</span>
      </a>
    </Magnetic>
  );
  // Left to right on screen: menu (phones) · language · "Let's talk" (wide screens).
  // In Hebrew the DOM order is reversed and flex-row-reverse puts them back in place.
  const controlItems = [hamburger, <LanguageSwitcher key="lang" path={path} />, cta];
  const controls = (
    <div
      className={`col-start-1 row-start-1 flex items-center gap-1 justify-self-start sm:gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
    >
      {dir === "rtl" ? [...controlItems].reverse() : controlItems}
    </div>
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-line bg-ink/95">
      {/* Three fixed columns, identical in both languages: controls on the left, the nav
          exactly centered, the logo on the right. The row is forced to LTR so nothing
          mirrors when the language changes; only the DOM order follows the language, so
          Tab moves right-to-left in Hebrew and left-to-right in English. */}
      <div dir="ltr" className="relative z-10 mx-auto grid min-h-16 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:gap-4 sm:px-6">
        {(dir === "rtl" ? [logo, nav, controls] : [controls, nav, logo]).map((part, i) => (
          <Fragment key={i}>{part}</Fragment>
        ))}
      </div>

      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px z-10 h-0.5 origin-right bg-flare ltr:origin-left"
        style={{ scaleX: progress }}
      />

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label={t.nav.mobileLabel}
            className="fixed inset-0 z-0 flex flex-col justify-between overflow-y-auto bg-ink px-6 pt-24 pb-10 lg:hidden"
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

            <div className="mt-10 space-y-4">
              <LanguageSwitcher path={path} className="text-base" />
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-full bg-flare py-4 text-center text-lg font-semibold text-ink active:scale-95"
              >
                {t.nav.mobileCta}
                <span className="sr-only"> {t.a11y.newWindow}</span>
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
