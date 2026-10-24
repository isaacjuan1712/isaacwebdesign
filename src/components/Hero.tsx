"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { whatsappLink } from "@/lib/site";
import { useMotionAllowed } from "@/lib/useMediaQuery";
import { WhatsAppIcon } from "./icons";
import Magnetic from "./Magnetic";

const lines = [
  { text: "אני בונה אתרים" },
  { text: "שעושים לעסק" },
  { text: "רעש.", accent: true },
];

// When each line's roller lifts off, and how long the whole headline takes to print
const STAGGER = 0.14;
const PRINTED = 0.1 + (lines.length - 1) * STAGGER + 0.75;

// Signature moment, borrowed from a print shop: each line starts as a solid slab of ink,
// then the slab lifts off right to left and leaves the words printed underneath.
// It runs in CSS (.ink-roller in globals.css), so it starts on first paint without
// waiting for JavaScript, and the text itself is there from the very first frame.
function InkLine({
  text,
  accent,
  index,
  progress,
}: {
  text: string;
  accent?: boolean;
  index: number;
  progress: MotionValue<number>;
}) {
  const moving = useMotionAllowed();
  // On scroll-out the lines drift apart in alternating directions, like loose type
  const x = useTransform(progress, [0, 1], ["0%", index % 2 ? "-14%" : "14%"]);

  return (
    <motion.span className="block" style={moving ? { x } : undefined}>
      <span className="relative inline-block overflow-hidden pb-[0.06em] align-bottom">
        <span className={accent ? "text-flare" : undefined}>{text}</span>
        <span
          aria-hidden="true"
          className={`ink-roller absolute inset-0 ${accent ? "bg-bone" : "bg-flare"}`}
          style={{ animationDelay: `${0.1 + index * STAGGER}s` }}
        />
      </span>
    </motion.span>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const moving = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Never below 0.4, so the headline stays above 3:1 while it is still on screen
  const fade = useTransform(scrollYProgress, [0.15, 0.85], [1, 0.4]);
  const stampTurn = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const stampLift = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  // Everything below the headline waits until the last line is printed
  const reduce = useReducedMotion();
  const afterInk = reduce ? 0.1 : PRINTED - 0.3;

  return (
    <section id="top" ref={ref} className="relative">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-24">
        {/* The small text around the headline rises in with CSS (.rise-in), so it shows on
            first paint instead of waiting for JavaScript; that keeps the page's LCP fast */}
        <p className="rise-in mb-6 flex items-center gap-3 text-sm font-semibold text-dust">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-whatsapp" />
            <span className="relative size-2.5 rounded-full bg-whatsapp" />
          </span>
          בן 17 · בונה אתרים לעסקים מקומיים
        </p>

        <motion.h1
          className="font-display text-[clamp(4.75rem,19vw,12.5rem)] leading-[0.86] font-bold"
          style={moving ? { opacity: fade } : undefined}
        >
          {lines.map((line, i) => (
            <InkLine key={line.text} text={line.text} accent={line.accent} index={i} progress={scrollYProgress} />
          ))}
        </motion.h1>

        <motion.div
          className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: afterInk } } }}
        >
          <div>
            <p className="rise-in max-w-md text-lg leading-relaxed text-dust sm:text-xl" style={{ animationDelay: `${PRINTED - 0.45}s` }}>
              אתרים מהירים ומותאמים לנייד לעסקים בשכונה: עם כפתור וואטסאפ, טופס פניות, ועיצוב
              שלא נראה כמו כל אתר אחר.
            </p>

            <div className="rise-in mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: `${PRINTED - 0.35}s` }}>
              <Magnetic className="flex">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-flare px-7 py-4 text-lg font-semibold text-ink transition-[scale,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.97]"
                >
                  <WhatsAppIcon className="size-5 transition-transform duration-300 group-hover:-rotate-12" />
                  דברו איתי בוואטסאפ
                  <span className="sr-only"> (נפתח בחלון חדש)</span>
                </a>
              </Magnetic>
              <Magnetic className="flex">
                <a
                  href="#process"
                  className="inline-flex w-full items-center justify-center rounded-full border border-edge px-7 py-4 text-lg font-semibold transition-[scale,border-color] duration-150 ease-out hover:border-bone active:scale-[0.97]"
                >
                  איך זה עובד
                </a>
              </Magnetic>
            </div>
          </div>

          {/* The rotating stamp: spins on its own, and turns faster as you scroll past */}
          <motion.a
            href="#contact"
            variants={{
              hidden: { opacity: 0, scale: 0.7, rotate: -40 },
              show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", duration: 0.8, bounce: 0.25 } },
            }}
            className="group relative mx-auto size-36 sm:size-44 md:mx-0"
          >
            {/* The ring text is decorative (aria-hidden); this is the link's name */}
            <span className="sr-only">פנוי לפרויקטים חדשים, מעבר לטופס יצירת קשר</span>
            <motion.span className="block size-full" style={moving ? { rotate: stampTurn, y: stampLift } : undefined}>
              <svg viewBox="0 0 200 200" aria-hidden="true" className="size-full animate-spin-slow">
                <defs>
                  <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
                </defs>
                <text className="fill-bone font-sans text-[17px] font-bold tracking-[0.12em]">
                  <textPath href="#stamp-circle">פנוי לפרויקטים חדשים • פנוי לפרויקטים חדשים •</textPath>
                </text>
              </svg>
            </motion.span>
            <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-flare text-ink transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95 sm:size-20">
              <svg viewBox="0 0 24 24" className="size-7 rotate-[135deg]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
