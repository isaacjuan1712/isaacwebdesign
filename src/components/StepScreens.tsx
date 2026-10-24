"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useI18n } from "@/i18n/client";
import { CheckIcon } from "./icons";
import { useMotionPause } from "./Providers";

const spring = { type: "spring", duration: 0.5, bounce: 0.2 } as const;

// The phone frame every illustration sits in. Purely decorative.
export function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`relative aspect-[9/18.5] rounded-[2.4rem] border border-line bg-ink p-2.5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ${className}`}>
      <div className="relative size-full overflow-hidden rounded-[1.9rem] bg-ink-2">
        <div className="absolute top-2 left-1/2 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        {children}
      </div>
    </div>
  );
}

// Steps through phases, holding each for durations[i] ms, and loops while the step is
// on screen. When motion is paused or reduced, it jumps to the last phase: the finished
// picture of that step, shown without animating.
function useSequence(durations: readonly number[], active: boolean) {
  // "paused" already includes the OS reduced-motion setting when the visitor hasn't chosen
  const { paused: still } = useMotionPause();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active || still) return;
    const id = window.setTimeout(() => setPhase((p) => (p + 1) % durations.length), durations[phase]);
    return () => window.clearTimeout(id);
  }, [phase, active, still, durations]);

  const last = durations.length - 1;
  return { phase: still ? last : active ? phase : 0, still };
}

// Instant transitions while motion is paused/reduced, the real ones otherwise
const tr = (still: boolean, t: Transition): Transition => (still ? { duration: 0 } : t);

// A tiny website drawn from blocks, in a given color scheme. `full` adds cards and a footer.
function SiteSketch({ hero = "bg-flare", ink = "bg-ink", swatches, full }: { hero?: string; ink?: string; swatches?: string[]; full?: boolean }) {
  return (
    <div className="space-y-2 p-2.5">
      <div className="flex items-center justify-between">
        <span className="h-2 w-10 rounded-full bg-bone" />
        <span className={`h-3.5 w-9 rounded-full ${hero}`} />
      </div>
      <div className={`space-y-1.5 rounded-lg p-2.5 pt-5 ${hero}`}>
        <span className={`block h-3 w-4/5 rounded-sm ${ink}`} />
        <span className={`block h-3 w-3/5 rounded-sm ${ink}`} />
        <span className={`mt-2 block h-4 w-16 rounded-full ${ink} opacity-80`} />
      </div>
      <div className="space-y-1 pt-0.5">
        <span className="block h-1.5 w-full rounded-full bg-dust/40" />
        <span className="block h-1.5 w-2/3 rounded-full bg-dust/40" />
      </div>
      {full && (
        <>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <span className={`aspect-square rounded-md ${hero} opacity-70`} />
            <span className="aspect-square rounded-md bg-bone/80" />
            <span className={`aspect-square rounded-md ${hero} opacity-40`} />
          </div>
          <div className="h-14 rounded-md border border-line bg-ink-2" />
        </>
      )}
      {swatches && (
        <div className="flex justify-center gap-2 pt-2">
          {swatches.map((s) => (
            <span key={s} className={`size-6 rounded-full border-2 border-bone/40 ${s}`} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Step 1: we talk ─────────────────────────────────────────────────────────
   Messages arrive one by one; before each reply a "typing…" bubble appears and
   the header switches from "online" to "typing…". */
const CHAT = [600, 900, 1400, 900, 1100, 1400, 900, 2600] as const;

function ChatScreen({ active }: { active: boolean }) {
  const { t } = useI18n();
  const s = t.process.screens;
  const { phase, still } = useSequence(CHAT, active);
  const typing = phase === 2 || phase === 5;
  const messages = [
    { id: "m1", mine: true, text: s.chat[0], from: 1 },
    { id: "r1", mine: false, text: s.chat[1], from: 3 },
    { id: "m2", mine: true, text: s.chat[2], from: 4 },
    { id: "r2", mine: false, text: s.chat[3], from: 6 },
  ].filter((m) => phase >= m.from);
  // Logical corners (ss = top-start, se = top-end) so the bubble tails mirror in English
  const bubble = (mine: boolean) =>
    mine ? "self-start rounded-2xl rounded-ss-sm bg-[#1d5c3a]" : "self-end rounded-2xl rounded-se-sm bg-ink";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 bg-ink px-3 pt-9 pb-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-flare text-sm font-bold text-ink">{t.site.name[0]}</span>
        <span>
          <span className="block text-sm font-semibold">{t.site.name}</span>
          <span className="block text-[11px] text-whatsapp">{typing ? s.typing : s.online}</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-2 overflow-hidden p-3 pb-5 text-[13px] leading-snug text-bone">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.p
              key={m.id}
              layout={!still}
              className={`${bubble(m.mine)} max-w-[85%] px-3 py-2`}
              initial={{ opacity: 0, y: 12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={tr(still, spring)}
            >
              {m.text}
            </motion.p>
          ))}
          {typing && (
            <motion.p
              key={`typing-${phase}`}
              layout={!still}
              className={`${bubble(false)} flex gap-1 px-3.5 py-3`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.12 } }}
              transition={tr(still, spring)}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} className="size-1.5 animate-typing rounded-full bg-dust" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Step 2: I build a demo ──────────────────────────────────────────────────
   Wireframe outlines draw themselves, then fill with color, then content appears. */
const BUILD = [400, 1800, 1000, 900, 2600] as const;
const BLOCKS = [
  { x: 12, y: 44, w: 44, h: 10, r: 5, fill: "var(--color-bone)" }, // logo
  { x: 124, y: 42, w: 44, h: 14, r: 7, fill: "var(--color-flare)" }, // nav button
  { x: 12, y: 68, w: 156, h: 100, r: 8, fill: "var(--color-flare)" }, // hero
  { x: 12, y: 182, w: 156, h: 6, r: 3, fill: "var(--color-dust)" }, // text
  { x: 12, y: 194, w: 120, h: 6, r: 3, fill: "var(--color-dust)" },
  { x: 12, y: 214, w: 48, h: 48, r: 6, fill: "var(--color-mustard)" }, // cards
  { x: 66, y: 214, w: 48, h: 48, r: 6, fill: "var(--color-olive)" },
  { x: 120, y: 214, w: 48, h: 48, r: 6, fill: "var(--color-bone)" },
  { x: 12, y: 276, w: 156, h: 62, r: 6, fill: "var(--color-ink)" }, // map / footer
];
const CONTENT = [
  { x: 26, y: 100, w: 104, h: 12 }, // headline
  { x: 26, y: 118, w: 74, h: 12 },
  { x: 26, y: 142, w: 54, h: 14 }, // hero button
];

function BuildScreen({ active }: { active: boolean }) {
  const { t } = useI18n();
  const { phase, still } = useSequence(BUILD, active);

  return (
    <div className="relative h-full pt-7">
      <motion.p
        className="absolute inset-x-3 top-9 text-[11px] font-semibold text-mustard"
        initial={false}
        animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : -4 }}
        transition={tr(still, { duration: 0.3 })}
      >
        {t.process.screens.demoLabel}
      </motion.p>
      <svg viewBox="0 0 180 350" className="size-full" preserveAspectRatio="xMidYMin meet">
        {BLOCKS.map((b, i) => (
          <g key={i}>
            {/* Fill: fades in after the outline has been drawn */}
            <motion.rect
              x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r}
              fill={b.fill}
              initial={false}
              animate={{ opacity: phase >= 2 ? 1 : 0 }}
              transition={tr(still, { duration: 0.45, delay: phase === 2 ? i * 0.06 : 0 })}
            />
            {/* Outline: draws itself like a pen stroke, then softens once filled */}
            <motion.rect
              x={b.x} y={b.y} width={b.w} height={b.h} rx={b.r}
              fill="none"
              stroke="var(--color-bone)"
              strokeWidth={1.2}
              initial={false}
              animate={{ pathLength: phase >= 1 ? 1 : 0, opacity: phase === 0 ? 0 : phase >= 2 ? 0.15 : 0.7 }}
              transition={tr(still, { pathLength: { duration: 0.7, delay: phase === 1 ? i * 0.12 : 0, ease: "easeInOut" }, opacity: { duration: 0.3 } })}
            />
          </g>
        ))}
        {CONTENT.map((c, i) => (
          <motion.rect
            key={`c${i}`}
            x={c.x} y={c.y} width={c.w} height={c.h} rx={i === 2 ? 7 : 2}
            fill="var(--color-ink)"
            initial={false}
            animate={{ opacity: phase >= 3 ? 1 : 0, x: phase >= 3 ? 0 : 6 }}
            transition={tr(still, { duration: 0.35, delay: phase === 3 ? i * 0.1 : 0 })}
          />
        ))}
        {/* A map pin on the footer block, as the last touch of content */}
        <motion.path
          d="M90 296a7 7 0 0 0-7 7c0 5.2 7 12 7 12s7-6.8 7-12a7 7 0 0 0-7-7Z"
          fill="var(--color-flare)"
          initial={false}
          animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : -10 }}
          transition={tr(still, { type: "spring", duration: 0.5, bounce: 0.4, delay: phase === 3 ? 0.3 : 0 })}
        />
      </svg>
    </div>
  );
}

/* ── Step 3: you approve ─────────────────────────────────────────────────────
   A finger swipes through three color palettes, taps one, and the stamp lands. */
const APPROVE = [900, 500, 1000, 1000, 800, 900, 2400] as const;
const PALETTES = [
  { hero: "bg-olive", ink: "bg-bone", swatches: ["bg-olive", "bg-bone", "bg-ink"] },
  { hero: "bg-mustard", ink: "bg-ink", swatches: ["bg-mustard", "bg-ink", "bg-bone"] },
  { hero: "bg-flare", ink: "bg-ink", swatches: ["bg-flare", "bg-ink", "bg-bone"] },
];

function ApproveScreen({ active }: { active: boolean }) {
  const { t, sign } = useI18n();
  const { phase, still } = useSequence(APPROVE, active);
  const index = phase >= 3 ? 2 : phase >= 2 ? 1 : 0;
  const swiping = phase === 2 || phase === 3;
  const picked = phase >= 4;

  return (
    <div className="relative flex h-full flex-col pt-9">
      <p className="px-3 text-[11px] font-semibold text-mustard">{t.process.screens.palettes}</p>
      <div className="relative mt-2 flex-1 overflow-hidden">
        {/* The carousel track: in RTL the next card sits to the left, so it moves right */}
        <motion.div
          className="flex h-full"
          initial={false}
          animate={{ x: `${index * 100 * sign}%` }}
          transition={tr(still, { duration: 0.6, ease: [0.77, 0, 0.175, 1] })}
        >
          {PALETTES.map((p, i) => (
            <div key={i} className="flex h-full w-full shrink-0 items-center px-3">
              <div
                className={`w-full rounded-xl border-2 bg-ink transition-[border-color] duration-300 ${picked && i === 2 ? "border-flare" : "border-line"}`}
              >
                <SiteSketch hero={p.hero} ink={p.ink} swatches={p.swatches} full />
              </div>
            </div>
          ))}
        </motion.div>

        {/* The finger: drags across during each swipe, then taps to pick */}
        <motion.svg
          viewBox="0 0 24 24"
          className="absolute bottom-[30%] left-1/2 -ml-5 size-10 text-bone drop-shadow-[0_4px_6px_rgb(0_0_0/0.6)]"
          initial={false}
          animate={
            !active || phase === 0 || phase >= 5
              ? { opacity: 0, x: 0, scale: 1 }
              : swiping
                ? { opacity: 1, x: [-28 * sign, 28 * sign], scale: 1 }
                : picked
                  ? { opacity: 1, x: 0, scale: [1, 0.8, 1] }
                  : { opacity: 1, x: -28 * sign, scale: 1 }
          }
          transition={tr(still, { duration: swiping ? 0.7 : 0.4, ease: "easeInOut" })}
          fill="currentColor"
        >
          <path d="M9.5 3a1.5 1.5 0 0 1 1.5 1.5V11h.5V8.5a1.5 1.5 0 0 1 3 0V11h.5V9.5a1.5 1.5 0 0 1 3 0V11h.3a1.2 1.2 0 0 1 2.2.7V15a7 7 0 0 1-7 7h-1.2a6 6 0 0 1-4.8-2.4l-3.3-4.4a1.6 1.6 0 0 1 2.4-2.1L8 14.4V4.5A1.5 1.5 0 0 1 9.5 3Z" />
        </motion.svg>

        {/* A check on the chosen palette, then the rubber stamp */}
        <motion.span
          className="absolute end-2 top-[9%] flex size-7 items-center justify-center rounded-full border-2 border-ink bg-flare text-ink"
          initial={false}
          animate={{ opacity: picked ? 1 : 0, scale: picked ? 1 : 0.6 }}
          transition={tr(still, spring)}
        >
          <CheckIcon className="size-4" />
        </motion.span>
        <motion.span
          className="absolute top-[34%] left-1/2 -ml-[4.5rem] w-36 rounded-lg border-4 border-flare bg-ink/70 py-1 text-center font-display text-5xl font-bold text-flare"
          initial={false}
          animate={phase >= 5 ? { opacity: 1, scale: 1, rotate: -12 } : { opacity: 0, scale: 1.8, rotate: -4 }}
          transition={tr(still, phase >= 5 ? { type: "spring", duration: 0.45, bounce: 0.35 } : { duration: 0.15 })}
        >
          {t.process.screens.approved}
        </motion.span>
      </div>
      <div className="flex justify-center gap-1.5 py-3">
        {PALETTES.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${i === index ? "w-4 bg-bone" : "w-1.5 bg-dust/50"}`} />
        ))}
      </div>
    </div>
  );
}

/* ── Step 4: the site goes live ──────────────────────────────────────────────
   The address types itself in, the site loads, the view zooms out as a laptop and
   a tablet slide in beside the phone, and a "new inquiry" notification pops. */
const LIVE = [500, 1700, 900, 1400, 2800] as const;

function LiveScreen({ active }: { active: boolean }) {
  const { t, sign } = useI18n();
  const s = t.process.screens;
  const { phase, still } = useSequence(LIVE, active);
  const zoomed = phase >= 3;

  return (
    <div className="relative h-full overflow-hidden">
      {/* The phone's own screen: browser bar + site. Zooms out into a small phone. */}
      <motion.div
        className="absolute inset-0 pt-8"
        initial={false}
        animate={zoomed ? { scale: 0.36, x: `${-26 * sign}%`, y: "24%" } : { scale: 1, x: 0, y: 0 }}
        transition={tr(still, { duration: 0.9, ease: [0.77, 0, 0.175, 1] })}
      >
        <div
          className={`size-full overflow-hidden bg-ink-2 transition-[border-radius,box-shadow] duration-500 ${zoomed ? "rounded-[2.5rem] shadow-[0_0_0_10px_var(--color-ink)]" : ""}`}
        >
          <div className="mx-3 flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[11px]">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping-soft rounded-full bg-whatsapp" />
              <span className="relative size-2 rounded-full bg-whatsapp" />
            </span>
            <span className="font-semibold text-whatsapp">{s.live}</span>
            {/* The address "types itself": a stepped reveal from left to right (.url-type) */}
            <span dir="ltr" className="ms-auto flex items-center text-dust">
              <span className="url-type" data-phase={phase >= 2 ? "done" : phase === 1 ? "typing" : "empty"}>
                {s.liveUrl}
              </span>
              <span className={`ms-px h-3 w-px bg-bone ${phase === 1 ? "animate-pulse" : "opacity-0"}`} />
            </span>
          </div>
          <motion.div
            initial={false}
            animate={{ opacity: phase >= 2 ? 1 : 0, y: phase >= 2 ? 0 : 8 }}
            transition={tr(still, { duration: 0.4 })}
          >
            <SiteSketch />
          </motion.div>
        </div>
      </motion.div>

      {/* Laptop, sliding in from the start side */}
      <motion.div
        className="absolute inset-x-[10%] top-[16%]"
        initial={false}
        animate={{ opacity: zoomed ? 1 : 0, x: zoomed ? "0%" : `${120 * sign}%` }}
        transition={tr(still, { duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: zoomed ? 0.35 : 0 })}
      >
        <div className="aspect-[16/10] overflow-hidden rounded-t-md border-[3px] border-ink bg-ink-2">
          <div className="flex h-full gap-1.5 p-1.5">
            <div className="flex-1 space-y-1 rounded bg-flare p-1.5 pt-3">
              <span className="block h-1.5 w-4/5 rounded-sm bg-ink" />
              <span className="block h-1.5 w-1/2 rounded-sm bg-ink" />
            </div>
            <div className="grid w-1/3 grid-rows-2 gap-1">
              <span className="rounded bg-mustard" />
              <span className="rounded bg-olive" />
            </div>
          </div>
        </div>
        <div className="-mx-[6%] h-1.5 rounded-b-md bg-ink" />
      </motion.div>

      {/* Tablet, sliding in from the end side */}
      <motion.div
        className="absolute start-[12%] bottom-[12%] w-[34%]"
        initial={false}
        animate={{ opacity: zoomed ? 1 : 0, x: zoomed ? "0%" : `${-160 * sign}%` }}
        transition={tr(still, { duration: 0.7, ease: [0.23, 1, 0.32, 1], delay: zoomed ? 0.5 : 0 })}
      >
        <div className="aspect-[3/4] overflow-hidden rounded-lg border-[3px] border-ink bg-ink-2 p-1">
          <div className="h-1/2 space-y-1 rounded-sm bg-flare p-1 pt-2.5">
            <span className="block h-1.5 w-4/5 rounded-sm bg-ink" />
            <span className="block h-1.5 w-1/2 rounded-sm bg-ink" />
          </div>
          <div className="mt-1 space-y-0.5">
            <span className="block h-1 w-full rounded-full bg-dust/40" />
            <span className="block h-1 w-2/3 rounded-full bg-dust/40" />
          </div>
        </div>
      </motion.div>

      {/* The payoff: a new inquiry notification drops in from the top */}
      <motion.div
        className="absolute inset-x-2.5 top-9 z-20 flex items-start gap-2 rounded-xl border border-line bg-ink/95 p-2.5 shadow-[0_10px_24px_-8px_rgb(0_0_0/0.7)]"
        initial={false}
        animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : "-140%" }}
        transition={tr(still, phase >= 4 ? { type: "spring", duration: 0.6, bounce: 0.3 } : { duration: 0.2 })}
      >
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-flare text-xs font-bold text-ink">{t.site.name[0]}</span>
        <span className="min-w-0 leading-tight">
          <span className="block text-[10px] text-dust">{s.notifyApp}</span>
          <span className="block text-[12px] font-semibold text-bone">{s.notifyTitle}</span>
          <span className="block truncate text-[11px] text-dust">{s.notifyText}</span>
        </span>
      </motion.div>
    </div>
  );
}

const screens = [ChatScreen, BuildScreen, ApproveScreen, LiveScreen];

// One illustration per step. `play` = the step is on screen, so its sequence runs.
export function StepScreen({ step, play = true }: { step: number; play?: boolean }) {
  const Screen = screens[step];
  return (
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      transition={{ duration: 0.25 }}
    >
      <Screen active={play} />
    </motion.div>
  );
}
