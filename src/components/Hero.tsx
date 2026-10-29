"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useI18n } from "@/i18n/client";
import { whatsappLink } from "@/lib/site";
import { useMotionAllowed } from "@/lib/useMediaQuery";
import { WhatsAppIcon } from "./icons";
import Magnetic from "./Magnetic";
import Depth from "./Depth";

// The headline has three lines (hero.lines in the texts); the last one is the orange accent.
// When each line's roller lifts off, and how long the whole headline takes to print:
const LINE_COUNT = 3;
const STAGGER = 0.14;
const PRINTED = 0.1 + (LINE_COUNT - 1) * STAGGER + 0.75;

// Signature moment, borrowed from a print shop: each line starts as a solid slab of ink,
// then the slab lifts off in the reading direction and leaves the words printed underneath.
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
  const { t } = useI18n();
  const whatsapp = whatsappLink(t.site.whatsappMessage);
  const moving = useMotionAllowed();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Never below 0.9: over the hero's orange glow and grid, the orange accent word needs
  // 0.85 to keep 3:1 (measured; see AUDIT.md), the cream lines far less
  const fade = useTransform(scrollYProgress, [0.15, 0.85], [1, 0.9]);

  // Everything below the headline waits until the last line is printed
  const reduce = !moving;
  const afterInk = reduce ? 0.1 : PRINTED - 0.3;

  return (
    <section id="top" ref={ref} className="relative isolate">
      {/* Depth: grid lines fading toward the bottom, a big warm glow behind the headline */}
      <Depth grid glows={[{ top: "32%", left: "50%", strength: 0.18 }]} />
      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-16 text-center sm:px-6 md:pt-24 md:pb-24">
        <motion.h1
          className="font-display text-[clamp(3.25rem,19vw,12.5rem)] leading-[0.86] font-bold"
          style={moving ? { opacity: fade } : undefined}
        >
          {t.hero.lines.map((line, i) => (
            <InkLine key={line} text={line} accent={i === t.hero.lines.length - 1} index={i} progress={scrollYProgress} />
          ))}
        </motion.h1>

        <motion.div
          className="mt-10 flex flex-col items-center gap-10"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: afterInk } } }}
        >
          {/* The text around the headline rises in with CSS (.rise-in), so it shows on first
              paint instead of waiting for JavaScript; that keeps the page's LCP fast */}
          <div className="flex w-full flex-col items-center">
            <p className="rise-in mx-auto max-w-xl text-lg leading-relaxed text-dust sm:text-xl" style={{ animationDelay: `${PRINTED - 0.45}s` }}>
              {t.hero.lead}
            </p>

            <div className="rise-in mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row" style={{ animationDelay: `${PRINTED - 0.35}s` }}>
              <Magnetic className="flex">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-flare px-7 py-4 text-lg font-semibold text-ink transition-[scale,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.97]"
                >
                  <WhatsAppIcon className="size-5 transition-transform duration-300 group-hover:-rotate-12" />
                  {t.hero.ctaWhatsapp}
                  <span className="sr-only"> {t.a11y.newWindow}</span>
                </a>
              </Magnetic>
              <Magnetic className="flex">
                <a
                  href="#process"
                  className="inline-flex w-full items-center justify-center rounded-full border border-edge px-7 py-4 text-lg font-semibold transition-[scale,border-color] duration-150 ease-out hover:border-bone active:scale-[0.97]"
                >
                  {t.hero.ctaProcess}
                </a>
              </Magnetic>
            </div>
          </div>

          {/* A plain orange arrow to the contact form, at the end side on wide screens only:
              on smaller screens the two buttons above already say the same thing */}
          <motion.a
            href="#contact"
            variants={{
              hidden: { opacity: 0, scale: 0.7 },
              show: { opacity: 1, scale: 1, transition: { type: "spring", duration: 0.8, bounce: 0.25 } },
            }}
            className="group absolute end-6 bottom-20 hidden size-20 items-center justify-center rounded-full bg-flare text-ink lg:flex"
          >
            <span className="sr-only">{t.hero.stampLabel}</span>
            <svg viewBox="0 0 24 24" className="size-7 rotate-[135deg] transition-transform duration-300 ease-out group-hover:scale-110 group-active:scale-95 ltr:rotate-[225deg]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
