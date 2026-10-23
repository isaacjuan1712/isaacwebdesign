import Reveal from "./Reveal";

const facts = [
  { title: "תשובה תוך יום", text: "שולחים הודעה, מקבלים תשובה. בלי לחכות שבוע." },
  { title: "קודם כל נייד", text: "רוב הלקוחות שלכם מגיעים מהטלפון, אז מתחילים משם." },
  { title: "ישירות מולי", text: "בלי סוכנות ובלי מתווכים. אתם מדברים עם מי שכותב את הקוד." },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32">
      <Reveal>
        <p className="text-sm font-semibold text-flare">01 / עליי</p>
        <h2 className="mt-4 max-w-4xl font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">
          בן 17, ובונה אתרים לעסקים <span className="text-dust">שאני עובר לידם כל יום.</span>
        </h2>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-dust sm:text-xl">
          אני כותב קוד בטכנולוגיות שחברות גדולות משתמשות בהן (Next.js ו-React), ומביא אותן
          למספרה, למסעדה ולסטודיו בשכונה. התוצאה: אתר שנטען מהר, נראה מצוין בכל מסך, ומופיע
          בגוגל.
        </p>
      </Reveal>

      <ul className="mt-16 grid border-t border-line sm:grid-cols-3">
        {facts.map((fact, i) => (
          <li key={fact.title} className="border-b border-line py-7 sm:border-b-0 sm:not-last:border-e sm:px-6 sm:first:ps-0">
            <Reveal delay={i * 0.06}>
              <p className="font-display text-4xl font-bold">{fact.title}</p>
              <p className="mt-2 leading-relaxed text-dust">{fact.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
