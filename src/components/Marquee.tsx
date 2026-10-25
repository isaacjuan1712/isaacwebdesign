"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/client";
import { SparkIcon } from "./icons";

// Pixels per second: medium, calm but clearly moving. The CSS duration is computed from
// the width of one half of the track, so Hebrew and English move at exactly the same speed.
const SPEED = 55;

// Sets of items per half before the band is measured. Enough to fill a 2560px screen in
// either language; after hydration the real count is measured (wide zoomed-out screens).
const DEFAULT_REPS = 6;

// A tilted ticker band between the hero and the rest of the page. It is a plain CSS
// animation (.ticker in globals.css), so it runs off the main thread. The track holds two
// identical halves and slides by exactly one half (50%), so the loop never jumps. Each
// half repeats the items until it is at least as wide as the band, so no position of the
// slide ever shows an empty stretch.
// It freezes with "Stop animations" like every other loop (html[data-motion="paused"]).
export default function Marquee() {
  const bandRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const halfRef = useRef<HTMLUListElement>(null);
  const [reps, setReps] = useState(DEFAULT_REPS);
  const { t } = useI18n();

  // Keep the number of sets and the duration matched to the band and the text
  // (they change with screen width, zoom, fonts and the text size setting)
  useEffect(() => {
    const band = bandRef.current;
    const track = trackRef.current;
    const half = halfRef.current;
    if (!band || !track || !half) return;
    const update = () => {
      const halfWidth = half.offsetWidth;
      if (!halfWidth) return;
      track.style.setProperty("--ticker-duration", `${(halfWidth / SPEED).toFixed(2)}s`);
      const setWidth = halfWidth / reps;
      // One spare set so subpixel rounding can never open a sliver at the seam
      const needed = Math.ceil(band.clientWidth / setWidth) + 1;
      if (needed > reps) setReps(needed);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(band);
    observer.observe(half);
    return () => observer.disconnect();
  }, [reps]);

  return (
    <div className="relative z-10 py-8">
      {/* Read once by screen readers; the moving copies below are hidden from them */}
      <ul className="sr-only">
        {t.marquee.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {/* The band is 110% wide (5% past each screen edge) so its tilted ends never show */}
      <div className="-mx-[5%] flex -rotate-2 border-y border-ink bg-flare text-ink shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]">
        <div ref={bandRef} aria-hidden="true" className="min-w-0 flex-1 overflow-hidden py-3">
          <div ref={trackRef} className="ticker flex w-max">
            {[0, 1].map((half) => (
              <ul key={half} ref={half === 0 ? halfRef : undefined} className="flex shrink-0">
                {Array.from({ length: reps }, (_, set) =>
                  t.marquee.map((item) => (
                    <li key={`${set}-${item}`} className="flex items-center gap-6 px-6 font-display text-4xl font-bold whitespace-nowrap sm:text-5xl">
                      {item}
                      <SparkIcon className="size-5" />
                    </li>
                  )),
                )}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
