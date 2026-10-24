"use client";

import { useRef } from "react";
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
import { useMotionPause } from "./Providers";

// Percent of the track per second when the page is still
const BASE_SPEED = 3.2;

// A tilted ticker band between the hero and the rest of the page. It drifts on its own,
// speeds up with your scroll, and reverses when you scroll back up.
// The list is rendered twice so the loop is seamless: the track wraps every 50%.
export default function Marquee() {
  const ref = useRef<HTMLDivElement>(null);
  const moving = useMotionAllowed();
  const inView = useInView(ref);
  const { paused } = useMotionPause();
  const { t, sign } = useI18n();

  const offset = useMotionValue(0);
  const direction = useRef(1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });
  // The track is anchored at the reading-start edge, so it moves toward the end side:
  // right in Hebrew (RTL), left in English (LTR)
  const x = useTransform(offset, (v) => `${sign * (((v % 50) + 50) % 50)}%`);

  useAnimationFrame((_, delta) => {
    if (!moving || !inView || paused) return;
    const b = boost.get();
    if (b < -0.05) direction.current = -1;
    else if (b > 0.05) direction.current = 1;
    const step = direction.current * BASE_SPEED * (1 + Math.abs(b)) * (delta / 1000);
    offset.set(offset.get() + step);
  });

  return (
    <div ref={ref} aria-hidden="true" className="relative z-10 py-8">
      <div className="-mx-[5%] -rotate-2 overflow-hidden border-y border-ink bg-flare py-3 text-ink shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]">
        <motion.div className="flex w-max" style={{ x }}>
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0">
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
    </div>
  );
}
