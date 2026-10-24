"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useI18n } from "@/i18n/client";
import { site, whatsappLink } from "@/lib/site";
import { useMotionAllowed } from "@/lib/useMediaQuery";
import ContactForm from "./ContactForm";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";

const ease = [0.23, 1, 0.32, 1] as const;

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const moving = useMotionAllowed();
  const { t, sign } = useI18n();
  const channels = [
    { href: whatsappLink(t.site.whatsappMessage), label: t.contact.whatsapp, value: t.contact.whatsappValue, icon: WhatsAppIcon, external: true },
    { href: site.phoneHref, label: t.contact.phone, value: site.phoneDisplay, icon: PhoneIcon, ltr: true },
    { href: `mailto:${site.email}`, label: t.contact.email, value: site.email, icon: MailIcon, ltr: true },
  ];
  // The headline slides in from the side, tied to how far the section has entered the screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  // The two halves slide in from opposite sides (mirrored in English)
  const headlineX = useTransform(scrollYProgress, [0, 1], [`${14 * sign}%`, "0%"]);
  const accentX = useTransform(scrollYProgress, [0, 1], [`${-20 * sign}%`, "0%"]);

  return (
    <section id="contact" ref={ref} className="relative isolate border-t border-line bg-ink-2">
      {/* Depth: two slow orange glows behind the contact section */}
      <div aria-hidden="true" className="depth">
        <div className="glow" style={{ top: "30%", left: "70%", ["--glow-strength" as string]: 0.1, ["--glow-speed" as string]: "30s" }} />
        <div className="glow" style={{ top: "80%", left: "20%", ["--glow-strength" as string]: 0.06, ["--glow-speed" as string]: "36s" }} />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <h2 className="text-center font-display text-[clamp(2.5rem,16vw,10rem)] leading-[0.85] font-bold">
          <motion.span className="inline-block" style={moving ? { x: headlineX } : undefined}>
            {t.contact.title}
          </motion.span>{" "}
          <motion.span className="inline-block text-flare" style={moving ? { x: accentX } : undefined}>
            {t.contact.titleAccent}
          </motion.span>
        </h2>

        <div className="mt-14 grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
          >
            <motion.p
              className="text-lg leading-relaxed text-dust"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }}
            >
              {t.contact.intro}
            </motion.p>
            <ul className="mt-8 border-t border-line">
              {channels.map(({ href, label, value, icon: Icon, external, ltr }) => (
                <motion.li
                  key={label}
                  className="border-b border-line"
                  variants={{ hidden: { opacity: 0, x: 48 * sign }, show: { opacity: 1, x: 0, transition: { duration: 0.6, ease } } }}
                >
                  <a
                    href={href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex items-center gap-4 py-5"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line transition-[background-color,border-color,color,scale] duration-200 group-hover:border-flare group-hover:bg-flare group-hover:text-ink group-active:scale-95">
                      <Icon />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-dust">{label}</span>
                      <span dir={ltr ? "ltr" : undefined} className="block text-lg font-semibold break-all transition-colors duration-200 group-hover:text-flare">
                        {value}
                      </span>
                      {external && <span className="sr-only"> {t.a11y.newWindow}</span>}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
