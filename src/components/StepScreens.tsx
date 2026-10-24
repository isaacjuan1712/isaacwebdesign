"use client";

import { motion, type Variants } from "motion/react";
import { useI18n } from "@/i18n/client";
import { CheckIcon, WhatsAppIcon } from "./icons";

const ease = [0.23, 1, 0.32, 1] as const;

// The phone frame every illustration sits in. Purely decorative.
export function Phone({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`relative aspect-[9/18.5] rounded-[2.4rem] border border-line bg-ink p-2.5 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.7)] ${className}`}>
      <div className="relative size-full overflow-hidden rounded-[1.9rem] bg-ink-2">
        <div className="absolute top-2 left-1/2 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-ink" />
        {children}
      </div>
    </div>
  );
}

const pop: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", duration: 0.5, bounce: 0.2 } },
};

const list = (stagger: number, delay = 0.1): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

// A tiny "business website" built from blocks. Steps 2-4 reuse it at different stages.
function MiniSite({ animated = true }: { animated?: boolean }) {
  const v = animated ? pop : undefined;
  return (
    <motion.div className="space-y-2.5 p-3" variants={animated ? list(0.11, 0.15) : undefined}>
      <motion.div variants={v} className="flex items-center justify-between">
        <span className="h-2.5 w-12 rounded-full bg-bone" />
        <span className="h-4 w-10 rounded-full bg-flare" />
      </motion.div>
      <motion.div variants={v} className="space-y-2 rounded-lg bg-flare p-3 pt-6">
        <span className="block h-4 w-4/5 rounded-sm bg-ink" />
        <span className="block h-4 w-3/5 rounded-sm bg-ink" />
        <span className="mt-3 block h-5 w-20 rounded-full bg-ink/80" />
      </motion.div>
      <motion.div variants={v} className="space-y-1.5 pt-1">
        <span className="block h-1.5 w-full rounded-full bg-dust/40" />
        <span className="block h-1.5 w-11/12 rounded-full bg-dust/40" />
        <span className="block h-1.5 w-2/3 rounded-full bg-dust/40" />
      </motion.div>
      <motion.div variants={v} className="grid grid-cols-3 gap-1.5">
        <span className="aspect-square rounded-md bg-mustard" />
        <span className="aspect-square rounded-md bg-olive" />
        <span className="aspect-square rounded-md bg-bone/80" />
      </motion.div>
      <motion.div variants={v} className="h-16 rounded-md border border-line bg-ink" />
    </motion.div>
  );
}

function ChatScreen() {
  const { t } = useI18n();
  const [first, reply, second] = t.process.screens.chat;
  // Logical corners (ss = top-start, se = top-end) so the bubble tails mirror in English
  const mine = "self-start rounded-2xl rounded-ss-sm bg-[#1d5c3a] text-bone";
  const theirs = "self-end rounded-2xl rounded-se-sm bg-ink text-bone";
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 bg-ink px-3 pt-9 pb-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-flare text-sm font-bold text-ink">{t.site.name[0]}</span>
        <span>
          <span className="block text-sm font-semibold">{t.site.name}</span>
          <span className="block text-[11px] text-whatsapp">{t.process.screens.online}</span>
        </span>
      </div>
      <motion.div className="flex flex-1 flex-col justify-end gap-2 p-3 pb-5 text-[13px] leading-snug" variants={list(0.55, 0.2)}>
        <motion.p variants={pop} className={`${mine} max-w-[85%] px-3 py-2`}>
          {first}
        </motion.p>
        <motion.p variants={pop} className={`${theirs} max-w-[85%] px-3 py-2`}>
          {reply}
        </motion.p>
        <motion.p variants={pop} className={`${mine} max-w-[85%] px-3 py-2`}>
          {second}
        </motion.p>
        <motion.p variants={pop} className={`${theirs} flex gap-1 px-3.5 py-3`}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-1.5 animate-typing rounded-full bg-dust" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </motion.p>
      </motion.div>
    </div>
  );
}

function DemoScreen() {
  const { t } = useI18n();
  return (
    <div className="pt-8">
      <motion.p variants={pop} className="px-3 text-[11px] font-semibold text-mustard">
        {t.process.screens.demoLabel}
      </motion.p>
      <MiniSite />
    </div>
  );
}

function ApproveScreen() {
  const { t } = useI18n();
  return (
    <div className="relative h-full pt-8">
      <div className="opacity-50">
        <MiniSite animated={false} />
      </div>
      <motion.ul className="absolute inset-x-3 bottom-4 space-y-1.5" variants={list(0.18, 0.15)}>
        {t.process.screens.approveItems.map((item) => (
          <motion.li key={item} variants={pop} className="flex items-center gap-2 rounded-lg bg-ink px-3 py-2 text-xs font-semibold">
            <CheckIcon className="size-4 text-whatsapp" />
            {item}
          </motion.li>
        ))}
      </motion.ul>
      {/* The rubber stamp: lands big and tilted, then settles */}
      <motion.span
        className="absolute top-[30%] left-1/2 -translate-x-1/2 rounded-lg border-4 border-flare px-4 py-1 font-display text-5xl font-bold text-flare"
        variants={{
          hidden: { opacity: 0, scale: 1.8, rotate: -4 },
          show: { opacity: 1, scale: 1, rotate: -12, transition: { delay: 0.75, type: "spring", duration: 0.45, bounce: 0.35 } },
        }}
      >
        {t.process.screens.approved}
      </motion.span>
    </div>
  );
}

function LiveScreen() {
  const { t } = useI18n();
  return (
    <div className="relative h-full pt-8">
      <motion.div variants={pop} className="mx-3 flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[11px]">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping-soft rounded-full bg-whatsapp" />
          <span className="relative size-2 rounded-full bg-whatsapp" />
        </span>
        <span className="font-semibold text-whatsapp">{t.process.screens.live}</span>
        <span dir="ltr" className="ms-auto text-dust">{t.process.screens.liveUrl}</span>
      </motion.div>
      <MiniSite animated={false} />
      <motion.span
        className="absolute end-4 bottom-4 flex size-11 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/40"
        variants={{
          hidden: { opacity: 0, scale: 0.6 },
          show: { opacity: 1, scale: 1, transition: { delay: 0.45, type: "spring", duration: 0.5, bounce: 0.4 } },
        }}
      >
        <WhatsAppIcon className="size-6" />
      </motion.span>
    </div>
  );
}

const screens = [ChatScreen, DemoScreen, ApproveScreen, LiveScreen];

// One illustration per step. `play` starts its internal sequence.
export function StepScreen({ step, play = true }: { step: number; play?: boolean }) {
  const Screen = screens[step];
  return (
    <motion.div
      className="absolute inset-0"
      initial="hidden"
      animate={play ? "show" : "hidden"}
      exit={{ opacity: 0, y: -12, transition: { duration: 0.18, ease } }}
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.25 } } }}
    >
      <Screen />
    </motion.div>
  );
}
