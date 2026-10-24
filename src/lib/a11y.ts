// Visitor display preferences: the header's pause button and the accessibility menu.
// Saved in localStorage, applied as data-attributes on <html> (styled in globals.css):
//   data-motion="paused|playing"  data-text-size="0|1|2"  data-contrast="high"
//   data-links="highlight"        data-font="readable"
// prePaintScript (below) applies them before the first paint, so nothing flickers.

export type Prefs = {
  textSize: 0 | 1 | 2; // 100% / 115% / 130%
  contrast: boolean;
  links: boolean;
  readable: boolean;
  // null = the visitor hasn't chosen: follow the system "reduce motion" setting
  paused: boolean | null;
};

export const TEXT_SIZES = [100, 115, 130] as const;
const KEY = "a11y-prefs";
export const defaultPrefs: Prefs = { textSize: 0, contrast: false, links: false, readable: false, paused: null };

function read(): Prefs {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (stored && typeof stored === "object") return { ...defaultPrefs, ...stored };
  } catch {
    // Storage blocked or corrupted: use the defaults
  }
  return defaultPrefs;
}

const systemReducesMotion = () => {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
};

// Whether motion should be paused right now (an explicit choice wins over the system setting)
export const isPaused = (prefs: Prefs) => prefs.paused ?? systemReducesMotion();

function apply(prefs: Prefs) {
  const d = document.documentElement.dataset;
  d.motion = isPaused(prefs) ? "paused" : "playing";
  d.textSize = String(prefs.textSize);
  d.contrast = prefs.contrast ? "high" : "normal";
  d.links = prefs.links ? "highlight" : "normal";
  d.font = prefs.readable ? "readable" : "normal";
}

// A tiny store so React components re-render when a preference changes
let current: Prefs | null = null;
const listeners = new Set<() => void>();

export function getPrefs(): Prefs {
  if (!current) current = read();
  return current;
}
export const getServerPrefs = () => defaultPrefs;

export function setPrefs(update: Partial<Prefs>) {
  current = { ...getPrefs(), ...update };
  try {
    localStorage.setItem(KEY, JSON.stringify(current));
  } catch {}
  apply(current);
  listeners.forEach((notify) => notify());
}

export function resetPrefs() {
  current = defaultPrefs;
  try {
    localStorage.removeItem(KEY);
  } catch {}
  apply(current);
  listeners.forEach((notify) => notify());
}

export function subscribePrefs(notify: () => void) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}

// Inlined in <head> by the root layout. Same logic as read() + apply(), as plain ES5,
// because it runs before React and before any bundle has loaded.
export const prePaintScript = `(function(){try{var p={};try{p=JSON.parse(localStorage.getItem("${KEY}"))||{}}catch(e){}
var r=false;try{r=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
var d=document.documentElement.dataset;
d.motion=(p.paused===true||(p.paused==null&&r))?"paused":"playing";
d.textSize=String(p.textSize||0);d.contrast=p.contrast?"high":"normal";
d.links=p.links?"highlight":"normal";d.font=p.readable?"readable":"normal";}catch(e){}})();`;
