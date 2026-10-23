"use client";

import { useSyncExternalStore } from "react";

// Live media query match. The server snapshot is always `false`, so the first client
// render matches the HTML and the real value arrives right after hydration.
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

// True when scroll-linked and pointer-driven movement is welcome.
export const useMotionAllowed = () => useMediaQuery("(prefers-reduced-motion: no-preference)");
