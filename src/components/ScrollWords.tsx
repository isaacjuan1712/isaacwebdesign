"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useMotionAllowed } from "@/lib/useMediaQuery";

type Part = { text: string; muted?: boolean };

// The dim starting state still clears 3:1 for large text (bone 0.4, dust 0.6 on ink),
// so the sentence is readable before the scroll effect has run.
function Word({ children, range, progress, muted }: { children: string; range: [number, number]; progress: MotionValue<number>; muted?: boolean }) {
  const opacity = useTransform(progress, range, [muted ? 0.6 : 0.4, 1]);
  return (
    <motion.span className={`inline-block ${muted ? "text-dust" : ""}`} style={{ opacity }}>
      {children}
    </motion.span>
  );
}

// A heading whose words light up one by one as it scrolls through the viewport,
// so the sentence reads at the pace you scroll. With reduced motion it's plain text.
export default function ScrollWords({ parts, className }: { parts: Part[]; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const moving = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });

  const words = parts.flatMap((part) => part.text.split(" ").map((text) => ({ text, muted: part.muted })));

  return (
    <h2 ref={ref} className={className}>
      {words.map((word, i) => {
        const range: [number, number] = [i / words.length, (i + 1) / words.length];
        return (
          <span key={i}>
            {moving ? (
              <Word range={range} progress={scrollYProgress} muted={word.muted}>
                {word.text}
              </Word>
            ) : (
              <span className={word.muted ? "text-dust" : ""}>{word.text}</span>
            )}{" "}
          </span>
        );
      })}
    </h2>
  );
}
