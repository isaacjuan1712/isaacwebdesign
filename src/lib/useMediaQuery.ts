"use client";

import { useSyncExternalStore } from "react";
import { getPrefs, isPaused, subscribePrefs } from "./a11y";

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

// True when movement is welcome: "Stop animations" is off (the visitor's choice, or the
// OS reduced-motion setting when they haven't chosen). False on the server.
export const useMotionAllowed = () =>
  useSyncExternalStore(subscribePrefs, () => !isPaused(getPrefs()), () => false);
