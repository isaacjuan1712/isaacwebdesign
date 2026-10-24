"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/client";
import { SparkIcon } from "./icons";

// Pixels per second: medium, calm but clearly moving. The CSS duration is computed from
// the width of one copy of the text, so Hebrew and English move at exactly the same speed.
const SPEED = 55;

// A tilted ticker band between the hero and the rest of the page. It is a plain CSS
// animation (.ticker in globals.css), so it runs off the main thread. The list is rendered
// twice and the track slides by exactly one copy (50%), so the loop never jumps.
// It freezes with "Stop animations" like every other loop (html[data-motion="paused"]).
export default function Marquee() {
  const trackRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLUListElement>(null);
  const { t } = useI18n();

  // Keep the duration matched to one copy's width (it changes with fonts and text size)
  useEffect(() => {
    const copy = copyRef.current;
    const track = trackRef.current;
    if (!copy || !track) return;
    const update = () => track.style.setProperty("--ticker-duration", `${(copy.offsetWidth / SPEED).toFixed(2)}s`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(copy);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative z-10 py-8">
      {/* The band is 110% wide (5% past each screen edge) so its tilted ends never show */}
      <div className="-mx-[5%] flex -rotate-2 border-y border-ink bg-flare text-ink shadow-[0_18px_40px_-12px_rgb(0_0_0/0.6)]">
        <div aria-hidden="true" className="min-w-0 flex-1 overflow-hidden py-3">
          <div ref={trackRef} className="ticker flex w-max">
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
          </div>
        </div>
      </div>
    </div>
  );
}
