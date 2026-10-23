import Reveal from "./Reveal";

// Placeholder projects. Replace with real work: add a screenshot to /public
// and swap the "poster" block for <Image src="/your-shot.png" ... /> from next/image.
const projects = [
  { title: "מספרה שכונתית", type: "אתר תדמית + זימון בוואטסאפ", word: "תספורת", bg: "bg-flare", fg: "text-ink" },
  { title: "מסעדה משפחתית", type: "תפריט דיגיטלי + שעות פתיחה", word: "תפריט", bg: "bg-mustard", fg: "text-ink" },
  { title: "סטודיו לפילאטיס", type: "לוח שיעורים + טופס הרשמה", word: "תנועה", bg: "bg-olive", fg: "text-bone" },
  { title: "חנות פרחים", type: "קטלוג + הזמנה בוואטסאפ", word: "פרחים", bg: "bg-bone", fg: "text-ink" },
];

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:pt-32 md:pb-56">
      <Reveal>
        <p className="text-sm font-semibold text-flare">03 / עבודות</p>
        <h2 className="mt-4 font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">
          על השולחן שלי
        </h2>
      </Reveal>

      {/* Two columns on desktop; the second column is pushed down for a staggered, editorial layout */}
      <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={(i % 2) * 0.08} className={i % 2 === 1 ? "md:translate-y-24" : ""}>
            <article className="group">
              <div className={`relative aspect-[4/5] overflow-hidden rounded-sm ${project.bg}`}>
                <div className="absolute inset-0 flex flex-col justify-between p-6 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
                  <span className={`self-start rounded-full border border-current px-3 py-1 text-sm font-semibold ${project.fg}`}>
                    בקרוב
                  </span>
                  <span className={`font-display text-[clamp(5rem,22vw,9rem)] leading-[0.8] font-bold ${project.fg}`}>
                    {project.word}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-4">
                <h3 className="font-display text-4xl font-bold transition-colors duration-200 group-hover:text-flare">
                  {project.title}
                </h3>
                <span className="font-display text-2xl text-dust">0{i + 1}</span>
              </div>
              <p className="mt-3 text-dust">{project.type}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
