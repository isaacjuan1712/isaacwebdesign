"use client";

import { motion } from "motion/react";
import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

const ease = [0.22, 1, 0.36, 1] as const;

// Each line is split into words; every word slides up from behind a mask.
const lines = [
  { words: ["אני", "בונה", "אתרים"] },
  { words: ["שעושים", "לעסק"] },
  { words: ["רעש."], accent: true },
];

const word = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.55, ease } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <motion.div
        className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 md:pt-20 md:pb-24"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
      >
        <motion.p variants={fadeUp} className="mb-6 flex items-center gap-3 text-sm font-semibold text-dust">
          <span className="relative flex size-2.5">
            <span className="absolute inset-0 animate-ping-soft rounded-full bg-whatsapp" />
            <span className="relative size-2.5 rounded-full bg-whatsapp" />
          </span>
          בן 17 · בונה אתרים לעסקים מקומיים
        </motion.p>

        <h1 className="font-display text-[clamp(4.75rem,19vw,12.5rem)] leading-[0.86] font-bold">
          {lines.map((line, i) => (
            <span key={i} className={`block ${line.accent ? "text-flare" : ""}`}>
              {line.words.map((w) => (
                // overflow-hidden is the mask; pb keeps the letters' tails from being clipped
                <span key={w} className="me-[0.18em] inline-block overflow-hidden pb-[0.06em] align-bottom">
                  <motion.span variants={word} className="inline-block">
                    {w}
                  </motion.span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <motion.p variants={fadeUp} className="max-w-md text-lg leading-relaxed text-dust sm:text-xl">
              אתרים מהירים ומותאמים לנייד לעסקים בשכונה: עם כפתור וואטסאפ, טופס פניות, ועיצוב
              שלא נראה כמו כל אתר אחר.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full bg-flare px-7 py-4 text-lg font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5 active:scale-95"
              >
                <WhatsAppIcon className="size-5 transition-transform duration-300 group-hover:-rotate-12" />
                דברו איתי בוואטסאפ
              </a>
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full border border-line px-7 py-4 text-lg font-semibold transition-colors duration-200 hover:border-bone active:scale-95"
              >
                לעבודות שלי
              </a>
            </motion.div>
          </div>

          {/* Signature effect: a rotating "stamp", pure transform animation */}
          <motion.a
            href="#contact"
            variants={{
              hidden: { opacity: 0, scale: 0.6, rotate: -40 },
              show: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.7, ease } },
            }}
            aria-label="פנוי לפרויקטים חדשים, מעבר לטופס יצירת קשר"
            className="group relative mx-auto size-36 sm:size-44 md:mx-0"
          >
            <svg viewBox="0 0 200 200" aria-hidden="true" className="size-full animate-spin-slow">
              <defs>
                <path id="stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
              </defs>
              <text className="fill-bone font-sans text-[17px] font-bold tracking-[0.12em]">
                <textPath href="#stamp-circle">פנוי לפרויקטים חדשים • פנוי לפרויקטים חדשים •</textPath>
              </text>
            </svg>
            <span className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-flare text-ink transition-transform duration-300 group-hover:scale-110 sm:size-20">
              <svg viewBox="0 0 24 24" className="size-7 rotate-[135deg]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
            </span>
          </motion.a>
        </div>
      </motion.div>
    </section>
  );
}
