"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useI18n } from "@/i18n/client";
import { useMotionAllowed } from "@/lib/useMediaQuery";
import { SparkIcon } from "./icons";
import PauseButton from "./PauseButton";
import { useMotionPause } from "./Providers";

// Pixels per second when the page is still: a calm, steady drift. Measured in pixels
// (not % of the text), so Hebrew and English move at exactly the same speed.
const BASE_SPEED = 28;

// A tilted ticker band between the hero and the rest of the page. It drifts on its own,
// picks up a little speed while you scroll, and turns around when you scroll back up.
// The list is rendered twice and wraps after exactly one copy's width, so the loop
// never jumps. The pause pill sits in its own space at the end of the band.
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLUListElement>(null);
  const copyWidth = useRef(0);
  const moving = useMotionAllowed();
  const inView = useInView(ref);
  const { paused } = useMotionPause();
  const { t, sign } = useI18n();

  // Keep the wrap point equal to one copy's width (it changes with fonts and text size)
  useEffect(() => {
    const el = copyRef.current;
    if (!el) return;
    const measure = () => (copyWidth.current = el.offsetWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const offset = useMotionValue(0);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 60, stiffness: 300 });
  // Scrolling adds at most +100% speed, so the drift stays calm
  const boost = useTransform(velocity, [-2000, 0, 2000], [-1, 0, 1]);
  // The track is anchored at the reading-start edge, so it moves toward the end side:
  // right in Hebrew (RTL), left in English (LTR)
  const x = useTransform(offset, (v) => {
    const w = copyWidth.current || 1;
    return `${sign * (((v % w) + w) % w)}px`;
  });

  useAnimationFrame((_, delta) => {
    if (!moving || !inView || paused) return;
    const b = boost.get();
    if (b < -0.05) direction.current = -1;
    else if (b > 0.05) direction.current = 1;
    const step = direction.current * BASE_SPEED * (1 + Math.abs(b)) * (delta / 1000);
    offset.set(offset.get() + step);
  });

  return (
    <div ref={ref} className="relative z-10 py-8">
      {/* The band is 110% wide (5% past each screen edge) so its tilted ends never show.
          me-[4.55%] = 5% of the screen, measured against the 110% band: it keeps the pause
          pill flush with the visible edge of the screen. */}
      <div className="-mx-[5%] flex -rotate-2 border-y border-ink bg-flare text-ink shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]">
        <div aria-hidden="true" className="min-w-0 flex-1 overflow-hidden py-3">
          <motion.div className="flex w-max" style={{ x }}>
            {[0, 1].map((copy) => (
              <ul key={copy} ref={copy === 0 ? copyRef : undefined} className="flex shrink-0">
                {t.marquee.map((item) => (
                  <li key={item} className="flex items-center gap-6 px-6 font-display text-4xl font-bold whitespace-nowrap sm:text-5xl">
                    {item}
                    <SparkIcon className="size-5" />
                  </li>
                ))}
              </ul>
            ))}
          </motion.div>
        </div>
        <PauseButton className="me-[4.55%]" />
      </div>
    </div>
  );
}
