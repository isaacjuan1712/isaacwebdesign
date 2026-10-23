import { cacheLife } from "next/cache";
import { navLinks, site } from "@/lib/site";
import FooterReveal from "./FooterReveal";

// With cacheComponents on, a bare `new Date()` fails the build: Next.js can't tell
// whether the page should be static. "use cache" + cacheLife("days") says
// "compute it once, keep it static, refresh daily", so the year stays correct.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <FooterReveal>
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 pt-10 pb-28 sm:px-6 md:flex-row md:pb-10 md:items-center md:justify-between">
          <a href="#top" className="font-display text-4xl font-bold">
            {site.name}
            <span className="text-flare">.</span>
          </a>
          <nav aria-label="ניווט תחתון" className="flex flex-wrap gap-x-6 gap-y-2 text-dust">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="py-1 transition-colors hover:text-bone">
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-sm text-dust">
            © <CurrentYear /> {site.name}. כל הזכויות שמורות.
          </p>
        </div>
      </FooterReveal>
    </footer>
  );
}
