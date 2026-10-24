import Link from "next/link";
import { cacheLife } from "next/cache";
import { format, localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";
import { legalPages, sections } from "@/lib/site";
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

export default async function Footer() {
  const { locale, t } = await getDictionary();
  const home = localizePath(locale, "/");

  return (
    <footer className="border-t border-line">
      <FooterReveal>
        <div className="mx-auto max-w-6xl px-4 pt-10 pb-28 sm:px-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <Link
              href={home}
              aria-label={format(t.site.homeLabel, { name: t.site.name })}
              className="flex min-h-11 items-center self-start font-display text-4xl font-bold md:self-auto"
            >
              {t.site.name}
              <span className="text-flare">.</span>
            </Link>
            <nav aria-label={t.nav.footerLabel} className="flex flex-wrap gap-x-6 text-dust">
              {sections.map((id) => (
                <a key={id} href={`${home}#${id}`} className={linkClass}>
                  {t.nav[id]}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-6 flex flex-col gap-2 border-t border-line pt-6 text-sm text-dust md:flex-row md:items-center md:justify-between">
            <p>
              © <CurrentYear /> {t.site.name}
            </p>
            <nav aria-label={t.nav.legalLabel} className="flex flex-wrap gap-x-6">
              {legalPages.map((page) => (
                <Link key={page} href={localizePath(locale, `/${page}`)} className={`${linkClass} underline underline-offset-4`}>
                  {t.footer[page]}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </FooterReveal>
    </footer>
  );
}
