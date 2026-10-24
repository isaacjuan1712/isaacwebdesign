"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import { getPrefs, getServerPrefs, isPaused, setPrefs, subscribePrefs } from "@/lib/a11y";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import A11yMenu from "./A11yMenu";
import CursorFollower from "./CursorFollower";

// One Lenis instance for the page, so other components (the mobile menu) can pause it.
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

// The visitor's "pause animations" choice, shared by the header button and the
// accessibility menu. Looping CSS animations read it from <html data-motion="paused">
// (set by src/lib/a11y.ts); JS-driven loops read it from this context.
const PauseContext = createContext({ paused: false, toggle: () => {} });
export const useMotionPause = () => useContext(PauseContext);

// All display preferences (text size, contrast, ...), for the accessibility menu.
// The server snapshot is the defaults, so the first client render matches the HTML.
export const usePrefs = () => useSyncExternalStore(subscribePrefs, getPrefs, getServerPrefs);

const getPausedSnapshot = () => isPaused(getPrefs());

// reducedMotion="user": when the OS asks for reduced motion, motion skips
// transform animations (movement) and keeps only gentle opacity fades.
export default function Providers({ children }: { children: React.ReactNode }) {
  const paused = useSyncExternalStore(subscribePrefs, getPausedSnapshot, () => false);
  const toggle = useCallback(() => setPrefs({ paused: !isPaused(getPrefs()) }), []);

  // Inertial smooth scroll for mouse wheels. Touch keeps native scrolling (Lenis'
  // default); paused motion or reduced motion keeps the browser's plain scroll.
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -72 } });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, [paused]);

  return (
    <PauseContext.Provider value={{ paused, toggle }}>
      <MotionConfig reducedMotion="user">
        {children}
        <A11yMenu />
        <CursorFollower />
      </MotionConfig>
    </PauseContext.Provider>
  );
}
