"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useI18n } from "@/i18n/client";
import { site, whatsappLink } from "@/lib/site";
import { useMotionAllowed } from "@/lib/useMediaQuery";
import ContactForm from "./ContactForm";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import Depth from "./Depth";

const ease = [0.23, 1, 0.32, 1] as const;

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const moving = useMotionAllowed();
  const { t, sign } = useI18n();
  // WhatsApp is offered above the form, so the details row under it is phone and email only
  const channels = [
    { href: site.phoneHref, label: t.contact.phone, value: site.phoneDisplay, icon: PhoneIcon },
    { href: `mailto:${site.email}`, label: t.contact.email, value: site.email, icon: MailIcon },
  ];
  // The headline slides in from the side, tied to how far the section has entered the screen
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.55"] });
  // The two halves slide in from opposite sides (mirrored in English)
  const headlineX = useTransform(scrollYProgress, [0, 1], [`${14 * sign}%`, "0%"]);
  const accentX = useTransform(scrollYProgress, [0, 1], [`${-20 * sign}%`, "0%"]);

  return (
    <section id="contact" ref={ref} className="relative isolate border-t border-line bg-ink-2">
      {/* Depth: a strong glow behind the big headline, a faint one low on the start side */}
      <Depth glows={[{ top: "11rem", left: "50%", strength: 0.24 }, { top: "85%", left: "85%", strength: 0.07, size: "min(80vw, 48rem)" }]} />
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <h2 className="text-center font-display text-[clamp(2.5rem,16vw,10rem)] leading-[0.85] font-bold">
          <motion.span className="inline-block" style={moving ? { x: headlineX } : undefined}>
            {t.contact.title}
          </motion.span>{" "}
          <motion.span className="inline-block text-flare" style={moving ? { x: accentX } : undefined}>
            {t.contact.titleAccent}
          </motion.span>
        </h2>

        {/* Call to action: points at the form below, with WhatsApp as the lighter alternative */}
        <motion.div
          className="mx-auto mt-16 max-w-4xl text-center md:mt-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <h3 className="font-display text-5xl leading-[0.95] font-bold text-balance sm:text-7xl md:text-8xl">
            {t.contact.ctaBefore} <span className="whitespace-nowrap text-flare">{t.contact.ctaAccent}</span> {t.contact.ctaAfter}
          </h3>
          <p className="mt-5 flex justify-center">
            <a
              href={whatsappLink(t.contact.ctaWhatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-11 items-center gap-2 text-lg text-dust underline underline-offset-4 transition-colors duration-200 hover:text-bone"
            >
              <WhatsAppIcon className="size-5 shrink-0 text-whatsapp transition-transform duration-300 group-hover:-rotate-12" />
              {t.contact.ctaWhatsapp}
              <span className="sr-only"> {t.a11y.newWindow}</span>
            </a>
          </p>
          <p className="mt-2 text-dust">{t.contact.intro}</p>
        </motion.div>

        {/* One column: the form is the main action, with a quiet row of direct details under it */}
        <div className="mx-auto mt-14 max-w-[640px]">
          <ContactForm />
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 border-t border-line pt-4 text-dust">
            {channels.map(({ href, label, value, icon: Icon }) => (
              <li key={label}>
                <a href={href} className="inline-flex min-h-11 items-center gap-2 transition-colors duration-200 hover:text-bone">
                  <Icon className="size-4 shrink-0" />
                  <span className="sr-only">{label}: </span>
                  <span dir="ltr">{value}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
