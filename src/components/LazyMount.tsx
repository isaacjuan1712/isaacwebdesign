"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { ScreenSkeleton } from "./Skeleton";

// Renders its children only once the area comes within `margin` of the screen (and once
// `ready` is true, for demos that also wait on something else, like a media query).
// Used for decorative, animation-heavy demos far below the fold, so they don't cost
// JavaScript work while the page is loading. The wrapper keeps its size from its
// parent; until the demo mounts it shows a skeleton of the same size (this is also what
// the HTML contains, so a slow connection never shows an empty frame), then the demo
// fades in over it.
export default function LazyMount({
  children,
  className = "size-full",
  margin = "400px",
  ready = true,
}: {
  children: React.ReactNode;
  className?: string;
  margin?: string;
  ready?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: margin as `${number}px` });
  const show = near && ready;
  return (
    <div ref={ref} className={className} aria-busy={show ? undefined : true}>
      {show ? <div className="fade-in size-full">{children}</div> : <ScreenSkeleton />}
    </div>
  );
}
