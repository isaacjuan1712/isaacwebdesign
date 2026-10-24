import Image, { type StaticImageData } from "next/image";

// A decorative background photo for a section: brand duotone, softened so it reads as
// texture (src/assets/bg); the site-wide film-grain overlay adds the grain on top. Drawn
// at low opacity and faded into the section color at the top and
// bottom. Opacity is capped so that even the image's brightest pixel keeps every text
// and border color above its contrast minimum, including small orange text (see
// AUDIT.md). alt="" and aria-hidden: screen readers skip it. Hidden in high-contrast mode
// (.section-photo in globals.css). The parent section needs `relative isolate` so the
// photo stays behind its content.
export default function SectionPhoto({
  src,
  fade,
  priority = false,
  position = "center",
  opacity = 0.13,
  className = "",
}: {
  src: StaticImageData;
  // The section's background color class, used for the top/bottom fade
  fade: "from-ink" | "from-ink-2";
  // The hero image is fetched with high priority once it's on screen
  priority?: boolean;
  position?: string;
  // 0.16 on black sections, 0.13 on dark-grey ones (see AUDIT.md for the math)
  opacity?: number;
  // e.g. "hidden md:block" to skip the photo on phones (a lazy image that's hidden
  // is never downloaded)
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`section-photo pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <Image
        src={src}
        alt=""
        fill
        // Lazy everywhere (a hidden one is never fetched); the hero one asks for high priority
        loading="lazy"
        fetchPriority={priority ? "high" : "auto"}
        // A soft texture at low opacity: a quarter-width file scaled up looks the same, costs
        // a fraction of the bytes, and stays out of the way of the LCP measurement
        sizes="25vw"
        quality={55}
        className="object-cover"
        style={{ objectPosition: position, opacity }}
      />
      <div className={`absolute inset-x-0 top-0 h-40 bg-gradient-to-b ${fade} to-transparent`} />
      <div className={`absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t ${fade} to-transparent`} />
    </div>
  );
}
