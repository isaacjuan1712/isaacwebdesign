"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import CursorFollower from "./CursorFollower";

// One Lenis instance for the page, so other components (the mobile menu) can pause it.
let lenis: Lenis | null = null;
export const getLenis = () => lenis;

// The visitor's "pause animations" choice. Looping CSS animations read it from
// <html data-motion="paused">; JS-driven loops read it from this context.
const PauseContext = createContext({ paused: false, toggle: () => {} });
export const useMotionPause = () => useContext(PauseContext);

const STORAGE_KEY = "motion-paused";

// The choice lives in localStorage (so it survives the next visit) plus an in-memory
// copy for browsers that block storage. useSyncExternalStore keeps React in sync with it.
let pausedNow: boolean | null = null;
const listeners = new Set<() => void>();
function readPaused() {
  if (pausedNow === null) {
    try {
      pausedNow = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      pausedNow = false; // storage blocked (private mode): default to playing
    }
  }
  return pausedNow;
}
function writePaused(value: boolean) {
  pausedNow = value;
  try {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  } catch {}
  listeners.forEach((notify) => notify());
}
function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

// reducedMotion="user": when the OS asks for reduced motion, motion skips
// transform animations (movement) and keeps only gentle opacity fades.
export default function Providers({ children }: { children: React.ReactNode }) {
  const paused = useSyncExternalStore(subscribe, readPaused, () => false);
  const toggle = useCallback(() => writePaused(!readPaused()), []);

  useEffect(() => {
    document.documentElement.dataset.motion = paused ? "paused" : "playing";
  }, [paused]);

  // Inertial smooth scroll for mouse wheels. Touch keeps native scrolling (Lenis'
  // default), and reduced motion keeps the browser's plain scroll entirely.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -72 } });
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return (
    <PauseContext.Provider value={{ paused, toggle }}>
      <MotionConfig reducedMotion="user">
        {children}
        <CursorFollower />
      </MotionConfig>
    </PauseContext.Provider>
  );
}
