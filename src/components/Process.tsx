"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useI18n } from "@/i18n/client";
import { format } from "@/i18n/config";
import { useMediaQuery } from "@/lib/useMediaQuery";
import LazyMount from "./LazyMount";
import SectionPhoto from "./SectionPhoto";
import { Phone, StepScreen } from "./StepScreens";
import processPhoto from "@/assets/bg/process.webp";

const ease = [0.23, 1, 0.32, 1] as const;

function Step({ index, reached, title, text }: { index: number; reached: boolean; title: string; text: string }) {
  const visualRef = useRef<HTMLDivElement>(null);
  // Only animates while it is on screen, so off-screen phones don't loop in the background
  const visualInView = useInView(visualRef, { amount: 0.4 });

  return (
    <li className="relative min-w-0 pb-16 ps-14 last:pb-0 sm:ps-20 md:flex md:min-h-[62vh] md:flex-col md:justify-center md:pb-0">
      {/* Step badge: an outline that gets "stamped" orange when the scroll line reaches it */}
      <span className="absolute start-0 top-0 flex size-11 items-center justify-center rounded-full border border-line bg-ink-2 text-lg font-bold text-dust md:top-1/2 md:-mt-[1.375rem]">
        {index + 1}
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center rounded-full bg-flare text-ink"
          initial={false}
          animate={
            reached
              ? { opacity: 1, scale: 1, rotate: 0 }
              : { opacity: 0, scale: 1.6, rotate: -25 }
          }
          transition={reached ? { type: "spring", duration: 0.45, bounce: 0.35 } : { duration: 0.15 }}
        >
          {index + 1}
        </motion.span>
      </span>

      {/* Only the large heading dims (still above 3:1); the body text always stays full strength */}
      <motion.h3
        className="font-display text-[clamp(2.25rem,11vw,3rem)] leading-none font-bold sm:text-6xl"
        initial={false}
        animate={{ opacity: reached ? 1 : 0.45 }}
        transition={{ duration: 0.3, ease }}
      >
        {title}
      </motion.h3>
      <p className="mt-3 max-w-md text-lg leading-relaxed text-dust">{text}</p>

      {/* Phones get the illustration inline, under each step */}
      <div ref={visualRef} className="mt-8 md:hidden">
        <Phone className="w-full max-w-52">
          {/* Mounted only near the screen: the phone frame keeps its size meanwhile */}
          <LazyMount>
            <StepScreen step={index} play={visualInView} />
          </LazyMount>
        </Phone>
      </div>
    </li>
  );
}

export default function Process() {
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { t } = useI18n();
  const steps = t.process.steps;
  // The pinned phone is desktop-only; phones never mount it (they use the inline ones)
  const wide = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 0.5", "end 0.5"] });
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))));
  });

  return (
    <section id="process" className="relative isolate border-t border-line bg-ink-2">
      <SectionPhoto src={processPhoto} fade="from-ink-2" />
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <h2 className="overflow-hidden pb-[0.06em] text-center font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease }}
          >
            {t.process.title}
          </motion.span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-dust sm:text-xl">
          {t.process.intro}
        </p>

        <div className="mt-16 grid gap-16 md:grid-cols-[1fr_17rem] lg:grid-cols-[1fr_19rem]">
          <ol ref={trackRef} className="relative">
            {/* The scroll line: a static rail, and an orange fill that grows with your scroll */}
            <span aria-hidden="true" className="absolute start-[1.344rem] top-2 bottom-2 w-px bg-line" />
            <motion.span
              aria-hidden="true"
              className="absolute start-[1.344rem] top-2 bottom-2 w-px origin-top bg-flare"
              style={{ scaleY: fill }}
            />
            {steps.map((step, i) => (
              <Step key={step.title} index={i} reached={active >= i} title={step.title} text={step.text} />
            ))}
          </ol>

          {/* Desktop: one phone stays pinned and changes screens as you move through the steps */}
          <div className="hidden md:block">
            <div className="sticky top-[calc(50vh-17rem)]">
              <Phone className="w-full">
                {wide && (
                  <LazyMount>
                    <AnimatePresence mode="wait" initial={false}>
                      <StepScreen key={active} step={active} />
                    </AnimatePresence>
                  </LazyMount>
                )}
              </Phone>
              <p className="mt-5 text-center text-sm font-semibold text-dust">
                {format(t.process.stepOf, { n: active + 1, total: steps.length, title: steps[active].title })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
