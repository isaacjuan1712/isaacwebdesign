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

      {/* The rule draws itself across, then each point rises out of it */}
      <motion.ul
        className="relative mt-16 grid sm:grid-cols-2"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } }}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-right bg-line ltr:origin-left"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease } } }}
        />
        {a.points.map((point) => (
          <li
            key={point.title}
            className="overflow-hidden border-b border-line py-7 sm:px-6 sm:odd:border-e sm:odd:ps-0 sm:even:pe-0"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: "40%" },
                show: { opacity: 1, y: "0%", transition: { duration: 0.7, ease } },
              }}
            >
              <h3 className="font-display text-4xl font-bold">{point.title}</h3>
              <p className="mt-2 leading-relaxed text-dust">
                <Rich text={point.text} />
              </p>
            </motion.div>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
