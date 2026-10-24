"use client";

import { motion } from "motion/react";

const ease = [0.23, 1, 0.32, 1] as const;

// The footer content rises into place once it comes into view. It's triggered by
// visibility rather than tied to scroll position, so it also completes on short pages
// (like the 404) where there's nothing to scroll. Movement only: the text is never faded.
export default function FooterReveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ y: 40 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease }}
    >
      {children}
    </motion.div>
  );
}
