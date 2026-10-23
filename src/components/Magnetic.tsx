"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useMotionAllowed } from "@/lib/useMediaQuery";

// Wrap a button or link: it leans toward the mouse while hovered and springs back on leave.
// Mouse only; on touch or reduced motion it renders as a plain wrapper.
export default function Magnetic({
  children,
  strength = 0.35,
  className = "inline-flex",
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const moving = useMotionAllowed();
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.5 });

  function onPointerMove(e: React.PointerEvent) {
    if (!moving || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div ref={ref} className={className} style={{ x, y }} onPointerMove={onPointerMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}
