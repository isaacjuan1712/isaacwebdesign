import Link from "next/link";
import { cacheLife } from "next/cache";
import { legalLinks, navLinks, site } from "@/lib/site";
import FooterReveal from "./FooterReveal";

// With cacheComponents on, a bare `new Date()` fails the build: Next.js can't tell
// whether the page should be static. "use cache" + cacheLife("days") says
// "compute it once, keep it static, refresh daily", so the year stays correct.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const linkClass = "flex min-h-11 min-w-11 items-center justify-center transition-colors hover:text-bone";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <FooterReveal>
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-28 sm:px-6 md:pb-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <Link href="/" aria-label={`${site.name}, לעמוד הבית`} className="flex min-h-11 items-center self-start font-display text-4xl font-bold md:self-auto">
              {site.name}
              <span className="text-flare">.</span>
            </Link>
            <nav aria-label="ניווט תחתון" className="flex flex-wrap gap-x-6 text-dust">
              {navLinks.map((link) => (
                <a key={link.href} href={link.href} className={linkClass}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 text-sm text-dust md:flex-row md:items-center md:justify-between">
            <p>
              © <CurrentYear /> {site.name}
            </p>
            <nav aria-label="מידע משפטי" className="flex flex-wrap gap-x-6">
              {legalLinks.map((link) => (
                <Link key={link.href} href={link.href} className={`${linkClass} underline underline-offset-4`}>
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
