"use client";

import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { useI18n } from "@/i18n/client";

const ease = [0.23, 1, 0.32, 1] as const;

// Accessible accordion (WAI-ARIA pattern): each question is a real <button> inside an
// <h3>, with aria-expanded and aria-controls pointing at its answer panel.
// Enter/Space toggle (native button behavior); ↑ ↓ Home End move between questions.
// The panel opens with a grid-rows transition (.faq-panel in globals.css), which is
// instant under reduced motion; a closed panel is visibility:hidden, so its text can't
// be tabbed into or read out.
export default function Faq() {
  const { t } = useI18n();
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  const listRef = useRef<HTMLDivElement>(null);

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    const buttons = [...(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-faq-button]") ?? [])];
    const last = buttons.length - 1;
    const target = { ArrowDown: index === last ? 0 : index + 1, ArrowUp: index === 0 ? last : index - 1, Home: 0, End: last }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    buttons[target]?.focus();
  }

  return (
    <section id="faq" className="border-t border-line bg-ink">
      <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 md:py-32">
        <div className="mb-14 text-center">
          <h2 className="font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">{t.faq.title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-dust sm:text-xl">{t.faq.intro}</p>
        </div>

        {/* Each row's rule draws itself in, then the question slides up after it */}
        <motion.div
          ref={listRef}
          className="border-t border-line"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {t.faq.items.map((item, i) => {
            const isOpen = open === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <motion.div
                key={item.q}
                className="relative"
                variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } } }}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    data-faq-button
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    onKeyDown={(e) => onKeyDown(e, i)}
                    className="group flex min-h-11 w-full cursor-pointer items-center justify-between gap-6 py-6 text-start text-xl font-semibold transition-colors duration-200 hover:text-flare sm:text-2xl"
                  >
                    {item.q}
                    {/* Plus that turns into a minus: the vertical bar folds away */}
                    <span
                      aria-hidden="true"
                      className={`relative flex size-10 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color] duration-200 ${isOpen ? "border-flare bg-flare text-ink" : "border-edge text-bone"}`}
                    >
                      <span className="absolute h-0.5 w-3.5 rounded-full bg-current" />
                      <span
                        className={`absolute h-3.5 w-0.5 rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${isOpen ? "scale-y-0 rotate-90" : ""}`}
                      />
                    </span>
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} data-open={isOpen} className="faq-panel">
                  <div className="overflow-hidden">
                    <p className="faq-answer max-w-prose pb-7 text-lg leading-relaxed text-dust">{item.a}</p>
                  </div>
                </div>
                <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-line" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
