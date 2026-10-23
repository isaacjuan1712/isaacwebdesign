"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user": when the OS asks for reduced motion, motion skips
// transform animations (movement) and keeps only gentle opacity fades.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
