"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { Phone, StepScreen } from "./StepScreens";

const ease = [0.23, 1, 0.32, 1] as const;

const steps = [
  {
    title: "מדברים בוואטסאפ",
    text: "שולחים לי הודעה ומספרים על העסק ועל מה שחשוב לכם. בלי טפסים ארוכים ובלי פגישות מיותרות.",
  },
  {
    title: "אני בונה דמו",
    text: "אני מכין גרסה ראשונה של האתר שלכם, כדי שתראו איך הוא ייראה באמת ולא רק תדמיינו.",
  },
  {
    title: "אתם מאשרים",
    text: "עוברים יחד על הדמו ומתקנים מה שצריך: צבעים, טקסטים, תמונות. ממשיכים רק כשאתם מרוצים.",
  },
  {
    title: "האתר עולה לאוויר",
    text: "מחברים כתובת, בודקים שהכול עובד בטלפון ובמחשב, והלקוחות שלכם יכולים למצוא אתכם.",
  },
];

function Step({ index, reached, title, text }: { index: number; reached: boolean; title: string; text: string }) {
  const visualRef = useRef<HTMLDivElement>(null);
  const visualInView = useInView(visualRef, { once: true, amount: 0.55 });

  return (
    <li className="relative pb-16 ps-16 last:pb-0 sm:ps-20 md:flex md:min-h-[62vh] md:flex-col md:justify-center md:pb-0">
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

      <motion.div
        initial={false}
        animate={{ opacity: reached ? 1 : 0.35 }}
        transition={{ duration: 0.3, ease }}
      >
        <h3 className="font-display text-5xl leading-none font-bold sm:text-6xl">{title}</h3>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-dust">{text}</p>
      </motion.div>

      {/* Phones get the illustration inline, under each step */}
      <div ref={visualRef} className="mt-8 md:hidden">
        <Phone className="w-52">
          <StepScreen step={index} play={visualInView} />
        </Phone>
      </div>
    </li>
  );
}

export default function Process() {
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 0.5", "end 0.5"] });
  const fill = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(v * steps.length))));
  });

  return (
    <section id="process" className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <h2 className="overflow-hidden pb-[0.06em] font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease }}
          >
            איך זה עובד
          </motion.span>
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-dust sm:text-xl">
          ארבעה צעדים, מההודעה הראשונה ועד אתר חי. אתם רואים כל שלב, ושום דבר לא עולה בלי האישור שלכם.
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
                <AnimatePresence mode="wait" initial={false}>
                  <StepScreen key={active} step={active} />
                </AnimatePresence>
              </Phone>
              <p className="mt-5 text-center text-sm font-semibold text-dust">
                שלב {active + 1} מתוך {steps.length}: {steps[active].title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
