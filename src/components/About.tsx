"use client";

import { motion } from "motion/react";
import ScrollWords from "./ScrollWords";

const ease = [0.23, 1, 0.32, 1] as const;

const facts = [
  { title: "תשובה מהירה", text: "שולחים הודעה, ובדרך כלל מקבלים תשובה עוד באותו יום." },
  { title: "קודם כל נייד", text: "רוב הלקוחות שלכם מגיעים מהטלפון, אז מתחילים משם." },
  { title: "ישירות מולי", text: "בלי סוכנות ובלי מתווכים. אתם מדברים עם מי שכותב את הקוד." },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <ScrollWords
        className="max-w-4xl font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl"
        parts={[{ text: "בן 17, ובונה אתרים לעסקים" }, { text: "שאני עובר לידם כל יום.", muted: true }]}
      />

      <motion.p
        className="mt-8 max-w-2xl text-lg leading-relaxed text-dust sm:text-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease }}
      >
        אני כותב קוד בטכנולוגיות שחברות גדולות משתמשות בהן (<span lang="en">Next.js</span> ו-
        <span lang="en">React</span>), ומביא אותן למספרה, למסעדה ולסטודיו בשכונה. התוצאה: אתר
        שנטען מהר, נראה מצוין בכל מסך, ובנוי כך שגוגל יוכל למצוא אותו.
      </motion.p>

      {/* The rule draws itself across, then each fact rises out of it */}
      <motion.ul
        className="relative mt-16 grid sm:grid-cols-3"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.25 } } }}
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px origin-right bg-line"
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease } } }}
        />
        {facts.map((fact) => (
          <li key={fact.title} className="overflow-hidden border-b border-line py-7 sm:border-b-0 sm:not-last:border-e sm:px-6 sm:first:ps-0">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: "60%" },
                show: { opacity: 1, y: "0%", transition: { duration: 0.7, ease } },
              }}
            >
              <p className="font-display text-4xl font-bold">{fact.title}</p>
              <p className="mt-2 leading-relaxed text-dust">{fact.text}</p>
            </motion.div>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
