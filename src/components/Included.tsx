"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useI18n } from "@/i18n/client";
import { useMotionAllowed } from "@/lib/useMediaQuery";
import { CheckIcon, MailIcon, PinIcon } from "./icons";
import { useMotionPause } from "./Providers";
import { Phone } from "./StepScreens";

const ease = [0.23, 1, 0.32, 1] as const;

// Steps a demo through `count` phases every `ms` while it's on screen, then loops.
// Holds still when the visitor pauses animations.
function usePhases(active: boolean, count: number, ms: number) {
  const [phase, setPhase] = useState(0);
  const { paused } = useMotionPause();
  useEffect(() => {
    if (!active || paused) return;
    const id = window.setInterval(() => setPhase((p) => (p + 1) % count), ms);
    return () => window.clearInterval(id);
  }, [active, paused, count, ms]);
  return phase;
}

// Every tile tips up into place like a card being stood on the table.
// `playing` tells the demo inside whether it's on screen, so loops pause when it isn't.
function Tile({
  index,
  title,
  text,
  className = "",
  visualClassName = "h-56",
  children,
}: {
  index: number;
  title: string;
  text: string;
  className?: string;
  visualClassName?: string;
  children: (playing: boolean) => React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const playing = useInView(ref, { amount: 0.35 });

  return (
    <motion.article
      ref={ref}
      data-playing={playing}
      className={`flex flex-col overflow-hidden rounded-sm border border-line bg-ink-2 ${className}`}
      style={{ transformPerspective: 1000, originY: 1 }}
      initial={{ opacity: 0, rotateX: 22, y: 40 }}
      whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease }}
    >
      <div className={`relative overflow-hidden border-b border-line ${visualClassName}`}>{children(playing)}</div>
      <div className="p-6">
        <h3 className="font-display text-4xl leading-none font-bold">{title}</h3>
        <p className="mt-2 max-w-md leading-relaxed text-dust">{text}</p>
      </div>
    </motion.article>
  );
}

// 1. A phone that leans toward your mouse, with a page gliding inside it.
function FastVisual() {
  const moving = useMotionAllowed();
  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!moving || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 22);
    rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 18);
  }

  return (
    <div
      className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_60%,rgb(255_77_28/0.16),transparent_60%)] py-8"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
      <motion.div style={{ rotateX, rotateY, transformPerspective: 700 }}>
        <Phone className="w-44">
          <div className="animate-feed space-y-2.5 p-3 pt-9">
            {[0, 1].map((copy) => (
              <div key={copy} className="space-y-2.5">
                <div className="space-y-2 rounded-lg bg-flare p-3 pt-6">
                  <span className="block h-3.5 w-4/5 rounded-sm bg-ink" />
                  <span className="block h-3.5 w-3/5 rounded-sm bg-ink" />
                </div>
                <div className="space-y-1.5">
                  <span className="block h-1.5 w-full rounded-full bg-dust/40" />
                  <span className="block h-1.5 w-2/3 rounded-full bg-dust/40" />
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <span className="aspect-square rounded-md bg-mustard" />
                  <span className="aspect-square rounded-md bg-olive" />
                </div>
                <span className="block h-12 rounded-md border border-line bg-ink" />
              </div>
            ))}
          </div>
        </Phone>
      </motion.div>
    </div>
  );
}

// 2. The real pre-written message from this site. Press send and watch it go.
function WhatsAppVisual() {
  const [sent, setSent] = useState(false);
  const { t } = useI18n();
  const w = t.included.whatsapp;

  return (
    <div className="flex h-full flex-col bg-ink">
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-flare text-sm font-bold text-ink">
          {t.site.name[0]}
        </span>
        <span className="text-sm font-semibold">{t.site.name}</span>
        <span className="ms-auto text-xs text-dust">{w.preview}</span>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 p-4">
        <AnimatePresence initial={false} mode="popLayout">
          {sent ? (
            <motion.div
              key="bubble"
              layoutId="wa-message"
              className="max-w-[80%] self-start rounded-2xl rounded-tr-sm bg-[#1d5c3a] px-4 py-2.5 text-sm leading-relaxed"
              transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
            >
              {t.site.whatsappMessage}
              <span className="mt-1 flex justify-end gap-0.5 text-[#53bdeb]">
                <CheckIcon className="size-3.5" />
                <CheckIcon className="-ms-2.5 size-3.5" />
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="flex items-end gap-2">
          <div className="min-h-11 flex-1 rounded-3xl border border-line bg-ink-2 px-4 py-2.5 text-sm leading-relaxed">
            <AnimatePresence initial={false} mode="popLayout">
              {sent ? (
                <motion.span key="empty" className="text-dust" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {w.placeholder}
                </motion.span>
              ) : (
                <motion.span key="draft" layoutId="wa-message" className="block" transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}>
                  {t.site.whatsappMessage}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => setSent((s) => !s)}
            aria-label={sent ? w.reset : w.send}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-whatsapp text-ink transition-transform duration-150 ease-out active:scale-[0.92]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`size-5 transition-transform duration-300 ${sent ? "rotate-180" : "-scale-x-100 ltr:scale-x-100"}`}>
              {sent ? <path d="M12 4a8 8 0 1 0 8 8h-2a6 6 0 1 1-1.76-4.24L14 10h6V4l-2.35 2.35A7.97 7.97 0 0 0 12 4Z" /> : <path d="M3.4 20.4 21 12 3.4 3.6 3.4 10l12.6 2-12.6 2z" />}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. A form that fills itself in, sends, and lands in your inbox.
function FormVisual({ playing }: { playing: boolean }) {
  const phase = usePhases(playing, 4, 1300);
  const { t, sign } = useI18n();
  const fields = t.included.form.fields;

  return (
    <div aria-hidden="true" className="flex h-full flex-col justify-center gap-3 px-6">
      {fields.map((value, i) => (
        <div key={value} className="border-b-2 border-line pb-1.5">
          <motion.span
            className="block text-sm"
            dir={i === 1 ? "ltr" : undefined}
            animate={{ opacity: phase >= 1 && phase < 3 ? 1 : 0 }}
            transition={{ duration: 0.25, delay: phase === 1 ? i * 0.18 : 0 }}
            style={{ textAlign: i === 1 ? (sign === 1 ? "right" : "left") : undefined }}
          >
            {value}
          </motion.span>
        </div>
      ))}
      <div className="relative mt-2 h-10">
        <motion.span
          className="absolute inset-y-0 start-0 flex items-center rounded-full bg-bone px-5 text-sm font-semibold text-ink"
          animate={{ scale: phase === 2 ? 0.94 : 1, opacity: phase === 3 ? 0 : 1 }}
          transition={{ duration: 0.15 }}
        >
          {t.included.form.send}
        </motion.span>
        <AnimatePresence>
          {phase === 2 && (
            <motion.span
              key="mail"
              className="absolute start-6 top-1 text-flare"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 1, 0], x: [0, -60 * sign, -140 * sign, -220 * sign], y: [0, -30, -50, -70], rotate: [0, -8, -14, -20] }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
            >
              <MailIcon className="size-7" />
            </motion.span>
          )}
          {phase === 3 && (
            <motion.span
              key="ok"
              className="absolute inset-y-0 start-0 flex items-center gap-2 text-sm font-semibold text-whatsapp"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.35, ease }}
            >
              <CheckIcon className="size-4" />
              {t.included.form.sent}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// 4. A drawn street map. The pin drops in, and drops again when you tap it.
function MapVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.5 });
  const [drops, setDrops] = useState(0);
  const { t } = useI18n();

  return (
    <div ref={ref} className="relative h-full bg-[#1c1916]">
      <svg viewBox="0 0 300 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true" className="absolute inset-0 size-full">
        <rect x="190" y="20" width="90" height="70" rx="6" className="fill-olive/50" />
        <path d="M-10 160 C 80 140, 140 190, 310 150" className="fill-none stroke-[#2b4a5c]" strokeWidth="16" />
        <g className="fill-none stroke-line" strokeWidth="7" strokeLinecap="round">
          <path d="M-10 70 H310" />
          <path d="M60 -10 V230" />
          <path d="M160 -10 V230" />
          <path d="M-10 115 L 300 40" />
        </g>
        <g className="fill-none stroke-[#3b342d]" strokeWidth="3">
          <path d="M-10 30 H310" />
          <path d="M110 -10 V230" />
          <path d="M240 100 V230" />
          <path d="M-10 200 H310" />
        </g>
      </svg>

      <button
        type="button"
        onClick={() => setDrops((d) => d + 1)}
        aria-label={t.included.map.pin}
        className="absolute top-[44%] left-[45%] -translate-x-1/2 -translate-y-full cursor-pointer p-2"
      >
        <span className="absolute bottom-1 left-1/2 size-8 -translate-x-1/2 translate-y-1/2">
          <span className="absolute inset-0 animate-ping-soft rounded-full bg-flare/60" />
        </span>
        <motion.span
          key={drops}
          className="relative block text-flare drop-shadow-[0_6px_6px_rgb(0_0_0/0.5)]"
          initial={{ y: -90, opacity: 0 }}
          animate={seen ? { y: 0, opacity: 1 } : undefined}
          transition={{ type: "spring", duration: 0.7, bounce: 0.45 }}
        >
          <PinIcon className="size-11" />
        </motion.span>
      </button>

      <span className="absolute end-4 bottom-4 rounded-full bg-ink/90 px-3 py-1.5 text-xs font-semibold">{t.included.map.here}</span>
    </div>
  );
}

// 5. A calendar strip: a few days fill in, then the site is live. Not months.
function DaysVisual({ playing }: { playing: boolean }) {
  const phase = usePhases(playing, 7, 650);
  const LIVE_DAY = 3;
  const { t } = useI18n();
  const filled = Math.min(phase, LIVE_DAY + 1);

  return (
    <div aria-hidden="true" className="flex h-full items-center px-6">
      <div className="grid w-full grid-cols-7 gap-1.5 sm:gap-2 md:grid-cols-14">
        {Array.from({ length: 14 }, (_, day) => (
          <div key={day} className="relative aspect-square rounded-md border border-line">
            <motion.span
              className={`absolute inset-0 rounded-md ${day === LIVE_DAY ? "bg-whatsapp" : "bg-flare"}`}
              initial={false}
              animate={day < filled ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
              transition={day < filled ? { type: "spring", duration: 0.4, bounce: 0.3 } : { duration: 0.2 }}
            />
            {day === LIVE_DAY && (
              <motion.span
                className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-full bg-bone px-2.5 py-1 text-xs font-bold whitespace-nowrap text-ink"
                initial={false}
                animate={filled > LIVE_DAY ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                transition={{ duration: 0.3, ease }}
              >
                {t.included.days.live}
              </motion.span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Included() {
  const { t } = useI18n();
  const i = t.included;
  return (
    <section id="included" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <motion.h2
        className="text-center font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl"
        initial={{ opacity: 0, scale: 1.12 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, ease }}
      >
        {i.title} <span className="text-flare">{i.titleAccent}</span>
      </motion.h2>
      <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-dust sm:text-xl">
        {i.intro}
      </p>

      <div className="mt-14 grid gap-4 md:grid-cols-6">
        <Tile index={0} title={i.fast.title} text={i.fast.text} className="md:col-span-2 md:row-span-2" visualClassName="h-80 md:h-auto md:flex-1">
          {() => <FastVisual />}
        </Tile>
        <Tile index={1} title={i.whatsapp.title} text={i.whatsapp.text} className="md:col-span-4" visualClassName="h-64">
          {() => <WhatsAppVisual />}
        </Tile>
        <Tile index={2} title={i.form.title} text={i.form.text} className="md:col-span-2">
          {(playing) => <FormVisual playing={playing} />}
        </Tile>
        <Tile index={3} title={i.map.title} text={i.map.text} className="md:col-span-2">
          {() => <MapVisual />}
        </Tile>
        <Tile index={4} title={i.days.title} text={i.days.text} className="md:col-span-6" visualClassName="h-44 md:h-36">
          {(playing) => <DaysVisual playing={playing} />}
        </Tile>
      </div>
    </section>
  );
}
