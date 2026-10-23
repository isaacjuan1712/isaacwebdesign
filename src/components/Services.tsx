import { ArrowIcon } from "./icons";
import Reveal from "./Reveal";

const services = [
  {
    title: "אתרים לעסקים",
    text: "אתר מעוצב שמציג את העסק, השירותים, שעות הפתיחה והמיקום. מהיר, מותאם לנייד, ומוכן לגוגל.",
  },
  {
    title: "חיבור לוואטסאפ",
    text: "כפתור וואטסאפ צף עם הודעה מוכנה מראש, כדי שלקוח יפנה אליכם בלחיצה אחת.",
  },
  {
    title: "טפסי יצירת קשר",
    text: "טופס פניות שנוחת ישר במייל שלכם, עם הגנה מספאם. אף ליד לא הולך לאיבוד.",
  },
];

export default function Services() {
  return (
    <section id="services" className="border-t border-line bg-ink-2">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
        <Reveal>
          <p className="text-sm font-semibold text-flare">02 / שירותים</p>
          <h2 className="mt-4 font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">
            מה אני עושה
          </h2>
        </Reveal>

        <ol className="mt-14 border-t border-line">
          {services.map((service, i) => (
            <li key={service.title} className="border-b border-line">
              <Reveal delay={i * 0.06}>
                {/* Hover: an orange panel sweeps in from the right (scaleX = transform only) */}
                <div className="group relative grid gap-3 overflow-hidden px-2 py-8 sm:grid-cols-[5rem_1fr_1.2fr_auto] sm:items-center sm:gap-8 md:py-10">
                  <span className="absolute inset-0 origin-right scale-x-0 bg-flare transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <span className="relative font-display text-3xl font-bold text-flare transition-colors duration-300 group-hover:text-ink">
                    0{i + 1}
                  </span>
                  <h3 className="relative font-display text-5xl font-bold transition-colors duration-300 group-hover:text-ink md:text-6xl">
                    {service.title}
                  </h3>
                  <p className="relative leading-relaxed text-dust transition-colors duration-300 group-hover:text-ink sm:text-lg">
                    {service.text}
                  </p>
                  <ArrowIcon className="relative hidden size-8 text-dust transition-[translate,color] duration-300 group-hover:-translate-x-2 group-hover:text-ink sm:block" />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
