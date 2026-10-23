"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMediaQuery, useMotionAllowed } from "@/lib/useMediaQuery";

// A ring that trails the mouse on desktop and swells over anything clickable.
// mix-blend-difference makes it invert whatever it passes over (orange, bone, ink).
export default function CursorFollower() {
  const moving = useMotionAllowed();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const enabled = moving && finePointer;
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  // The spring is what makes it feel alive instead of glued to the pointer
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const target = e.target as Element | null;
      setActive(!!target?.closest("a, button, label, input, textarea, [data-cursor]"));
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[110] mix-blend-difference"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bone"
        animate={{ scale: active ? 1.7 : 1, opacity: visible ? 1 : 0 }}
        transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
      />
      <motion.div
        className="absolute top-0 left-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-bone"
        animate={{ scale: active ? 0 : 1, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </motion.div>
  );
}
