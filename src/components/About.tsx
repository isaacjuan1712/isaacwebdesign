"use client";

import { motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import Rich from "@/i18n/Rich";
import ScrollWords from "./ScrollWords";

const ease = [0.23, 1, 0.32, 1] as const;

// A short professional profile: what I build, my tools, how I work, what clients get.
export default function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <ScrollWords
        className="mx-auto max-w-4xl text-center font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl"
        parts={[{ text: a.headline }, { text: a.headlineMuted, muted: true }]}
      />

      <motion.p
        className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-dust sm:text-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
      >
        <Rich text={a.body} />
      </motion.p>

      {/* The tools, as small "chips" that pop in one after another */}
      <motion.div
        className="mt-8 flex flex-wrap items-center justify-center gap-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        <span className="me-1 text-sm font-semibold text-dust">{a.toolsLabel}</span>
        <ul className="contents">
          {a.tools.map((tool) => (
            <motion.li
              key={tool}
              className="rounded-full border border-edge px-3.5 py-1.5 text-sm font-semibold text-bone"
              variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { type: "spring", duration: 0.45, bounce: 0.3 } } }}
            >
              <Rich text={tool} />
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Four roomy blocks that rise in one after another: one column on phones, two from
          768px. Paragraphs are capped at ~60 characters with a 1.7 line height. */}
      <motion.ul
        className="mt-16 grid gap-6 sm:gap-8 md:mt-20 md:grid-cols-2 md:gap-x-12 md:gap-y-10 lg:gap-x-16 lg:gap-y-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }}
      >
        {a.points.map((point) => (
          <motion.li
            key={point.title}
            className="rounded-sm border border-line bg-ink-2 p-7 sm:p-9 lg:p-10"
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
            }}
          >
            <h3 className="font-display text-4xl leading-none font-bold sm:text-5xl">{point.title}</h3>
            <p className="mt-5 max-w-[60ch] text-lg leading-[1.7] text-dust sm:mt-6">
              <Rich text={point.text} />
            </p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
