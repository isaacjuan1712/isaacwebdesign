"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useMotionAllowed } from "@/lib/useMediaQuery";

// The footer content trails behind the page as it scrolls up, so it seems to be
// uncovered from underneath the contact section rather than scrolled in.
export default function FooterReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const moving = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-60%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.div style={moving ? { y, opacity } : undefined}>{children}</motion.div>
    </div>
  );
}
