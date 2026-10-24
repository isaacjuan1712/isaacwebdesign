"use client";

import { useRef } from "react";
import { useInView } from "motion/react";

// Renders its children only once the area comes within `margin` of the screen.
// Used for decorative, animation-heavy demos far below the fold, so they don't cost
// JavaScript work while the page is loading. The wrapper keeps its size from its
// parent, so nothing shifts when the content appears.
export default function LazyMount({
  children,
  className = "size-full",
  margin = "400px",
}: {
  children: React.ReactNode;
  className?: string;
  margin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const near = useInView(ref, { once: true, margin: margin as `${number}px` });
  return (
    <div ref={ref} className={className}>
      {near ? children : null}
    </div>
  );
}
