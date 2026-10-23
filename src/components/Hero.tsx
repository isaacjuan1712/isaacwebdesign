"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { whatsappLink } from "@/lib/site";
import { useMotionAllowed } from "@/lib/useMediaQuery";
import { WhatsAppIcon } from "./icons";
import Magnetic from "./Magnetic";

const ease = [0.23, 1, 0.32, 1] as const;

const lines = [
  { text: "אני בונה אתרים" },
  { text: "שעושים לעסק" },
  { text: "רעש.", accent: true },
];

// How long one "pass of the ink roller" takes, and the gap before the next line starts
const PASS = 0.8;
const STAGGER = 0.22;

// Signature moment, borrowed from a print shop: an ink roller sweeps across each line
// and leaves the words printed behind it. The roller is a block that slides right to
// left through a clipped line (transform only); the text switches on while it's covered.
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
  // Reduced motion: no roller to wait for, so the words simply fade in together
  const reduce = useReducedMotion();
  const delay = reduce ? 0 : 0.15 + index * STAGGER;
  // On scroll-out the lines drift apart in alternating directions, like loose type
  const x = useTransform(progress, [0, 1], ["0%", index % 2 ? "-14%" : "14%"]);

  return (
    <motion.span className="block" style={moving ? { x } : undefined}>
      <span className="relative inline-block overflow-hidden pb-[0.06em] align-bottom">
        <motion.span
          className={`inline-block ${accent ? "text-flare" : ""}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0.4 } : { duration: 0.01, delay: delay + PASS * 0.45 }}
        >
          {text}
        </motion.span>
        <motion.span
          aria-hidden="true"
          className={`absolute inset-0 motion-reduce:hidden ${accent ? "bg-bone" : "bg-flare"}`}
          initial={{ transform: "translateX(101%)" }}
          animate={{ transform: ["translateX(101%)", "translateX(0%)", "translateX(0%)", "translateX(-101%)"] }}
          transition={{ duration: PASS, delay, times: [0, 0.42, 0.52, 1], ease: "easeInOut" }}
        />
      </span>
    </motion.span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const moving = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fade = useTransform(scrollYProgress, [0.15, 0.85], [1, 0.1]);
  const stampTurn = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const stampLift = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  // Everything below the headline waits until the roller has printed the last line
  const reduce = useReducedMotion();
  const afterInk = reduce ? 0.1 : 0.15 + (lines.length - 1) * STAGGER + PASS * 0.6;

  return (
    <section id="top" ref={ref} className="relative">
      <div className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-24">
        <motion.p
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-6 flex items-center gap-3 text-sm font-semibold text-dust"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-whatsapp" />
            <span className="relative size-2.5 rounded-full bg-whatsapp" />
          </span>
          בן 17 · בונה אתרים לעסקים מקומיים
        </motion.p>

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
            <motion.p variants={fadeUp} className="max-w-md text-lg leading-relaxed text-dust sm:text-xl">
              אתרים מהירים ומותאמים לנייד לעסקים בשכונה: עם כפתור וואטסאפ, טופס פניות, ועיצוב
              שלא נראה כמו כל אתר אחר.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Magnetic className="flex">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-flare px-7 py-4 text-lg font-semibold text-ink transition-[scale,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.97]"
                >
                  <WhatsAppIcon className="size-5 transition-transform duration-300 group-hover:-rotate-12" />
                  דברו איתי בוואטסאפ
                </a>
              </Magnetic>
              <Magnetic className="flex">
                <a
                  href="#process"
                  className="inline-flex w-full items-center justify-center rounded-full border border-line px-7 py-4 text-lg font-semibold transition-[scale,border-color] duration-150 ease-out hover:border-bone active:scale-[0.97]"
                >
                  איך זה עובד
                </a>
              </Magnetic>
            </motion.div>
          </div>

          {/* The rotating stamp: spins on its own, and turns faster as you scroll past */}
          <motion.a
            href="#contact"
            variants={{
              hidden: { opacity: 0, scale: 0.7, rotate: -40 },
              show: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring", duration: 0.8, bounce: 0.25 } },
            }}
            aria-label="פנוי לפרויקטים חדשים, מעבר לטופס יצירת קשר"
            className="group relative mx-auto size-36 sm:size-44 md:mx-0"
          >
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
