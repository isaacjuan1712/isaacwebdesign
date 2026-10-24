import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return { title: t.notFound.metaTitle };
}

export default async function NotFound() {
  const { locale, t } = await getDictionary();

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-32 sm:px-6 md:pt-28">
          <p className="font-display text-[clamp(6rem,30vw,16rem)] leading-[0.8] font-bold text-flare" aria-hidden="true">
            404
          </p>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] font-bold sm:text-7xl">{t.notFound.title}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-dust">{t.notFound.text}</p>
          <Link
            href={localizePath(locale, "/")}
            className="mt-10 inline-flex min-h-11 items-center rounded-full bg-flare px-7 py-4 text-lg font-semibold text-ink transition-[scale,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.97]"
          >
            {t.notFound.back}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
