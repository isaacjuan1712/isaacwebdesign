const items = ["אתרים לעסקים", "חיבור לוואטסאפ", "טפסי פניות", "מותאם לנייד", "מהיר בגוגל"];

// A ticker band. The list is rendered twice so the loop is seamless:
// the track slides by exactly half its width, then restarts.
export default function Marquee() {
  return (
    <div aria-hidden="true" className="overflow-hidden border-y border-line bg-flare py-3 text-ink">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-6 px-6 font-display text-4xl font-bold whitespace-nowrap">
                {item}
                <span className="text-2xl">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
