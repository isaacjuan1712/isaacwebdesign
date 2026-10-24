"use client";

import { motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";
import Magnetic from "./Magnetic";
import { useMotionPause } from "./Providers";

// Floating button that stays on screen while scrolling.
// `end-5` = the "end" side: bottom-left in Hebrew (RTL), bottom-right in English (LTR).
// The bottom offset respects the iPhone home-indicator safe area.
// It pops in once the hero headline has finished printing, so it doesn't compete with it.
export default function WhatsAppButton() {
  const { paused: reduce } = useMotionPause();
  const { t } = useI18n();
  return (
    <motion.div
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      className="fixed end-5 z-40"
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
          className="group relative flex size-15 items-center justify-center rounded-full bg-whatsapp-deep text-white shadow-lg shadow-black/40 transition-transform duration-150 ease-out active:scale-[0.94]"
        >
          <span aria-hidden="true" className="absolute inset-0 animate-ping-soft rounded-full bg-whatsapp-deep" />
          <WhatsAppIcon className="relative size-8 transition-transform duration-300 group-hover:-rotate-12" />
        </a>
      </Magnetic>
    </motion.div>
  );
}
