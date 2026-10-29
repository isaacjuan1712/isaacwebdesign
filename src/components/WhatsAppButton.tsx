"use client";

import { motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import Magnetic from "./Magnetic";
import { useMotionPause } from "./Providers";

// Floating button that stays on screen while scrolling.
// `end-4` = the "end" side: bottom-left in Hebrew (RTL), bottom-right in English (LTR).
// The bottom offset respects the iPhone home-indicator safe area. 48px on phones (still
// above the 44px touch minimum) so it covers less text; 60px from the sm breakpoint up.
// Wrapped in a labelled <aside> so it sits inside a landmark like the rest of the page.
// It pops in once the hero headline has finished printing, so it doesn't compete with it.
export default function WhatsAppButton() {
  const { paused: reduce } = useMotionPause();
  const { t } = useI18n();
  return (
    <motion.aside
      aria-label="WhatsApp"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      className="fixed end-4 z-40 sm:end-5"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: reduce ? 0 : 1.6, type: "spring", duration: 0.6, bounce: 0.35 }}
    >
      <Magnetic strength={0.45}>
        <a
          href={whatsappLink(t.site.whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.whatsappFloat} ${t.a11y.newWindow}`}
          className="group relative flex size-12 items-center justify-center rounded-full bg-whatsapp-deep text-white shadow-lg shadow-black/40 transition-transform duration-150 ease-out active:scale-[0.94] sm:size-15"
        >
          <span aria-hidden="true" className="absolute inset-0 animate-ping-soft rounded-full bg-whatsapp-deep" />
          <WhatsAppIcon className="relative size-6 sm:size-8 transition-transform duration-300 group-hover:-rotate-12" />
        </a>
      </Magnetic>
    </motion.aside>
  );
}
