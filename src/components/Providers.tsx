"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import CursorFollower from "./CursorFollower";

// One Lenis instance for the page, so other components (the mobile menu) can pause it.
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

// reducedMotion="user": when the OS asks for reduced motion, motion skips
// transform animations (movement) and keeps only gentle opacity fades.
export default function Providers({ children }: { children: React.ReactNode }) {
  // Inertial smooth scroll for mouse wheels. Touch keeps native scrolling (Lenis'
  // default), and reduced motion keeps the browser's plain scroll entirely.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -72 } });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {children}
      <CursorFollower />
    </MotionConfig>
  );
}
