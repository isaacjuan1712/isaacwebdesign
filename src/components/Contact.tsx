import { site, whatsappLink } from "@/lib/site";
import ContactForm from "./ContactForm";
import { MailIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import Reveal from "./Reveal";

const channels = [
  { href: whatsappLink, label: "וואטסאפ", value: "שלחו הודעה", icon: WhatsAppIcon, external: true },
  { href: site.phoneHref, label: "טלפון", value: site.phoneDisplay, icon: PhoneIcon, ltr: true },
  { href: `mailto:${site.email}`, label: "אימייל", value: site.email, icon: MailIcon, ltr: true },
];

export default function Contact() {
  return (
    <section id="contact" className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <Reveal>
          <p className="text-sm font-semibold text-flare">04 / צור קשר</p>
          <h2 className="mt-4 font-display text-[clamp(4.5rem,16vw,10rem)] leading-[0.85] font-bold">
            בואו נבנה <span className="text-flare">משהו.</span>
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-16 md:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="text-lg leading-relaxed text-dust">
              ספרו לי על העסק ואחזור אליכם תוך יום. שיחת ההיכרות בחינם, בלי התחייבות.
            </p>
            <ul className="mt-8 border-t border-line">
              {channels.map(({ href, label, value, icon: Icon, external, ltr }) => (
                <li key={label} className="border-b border-line">
                  <a
                    href={href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="group flex items-center gap-4 py-5"
                  >
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-200 group-hover:border-flare group-hover:bg-flare group-hover:text-ink">
                      <Icon />
                    </span>
                    <span>
                      <span className="block text-sm text-dust">{label}</span>
                      <span dir={ltr ? "ltr" : undefined} className="block text-lg font-semibold break-all transition-colors duration-200 group-hover:text-flare">
                        {value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
