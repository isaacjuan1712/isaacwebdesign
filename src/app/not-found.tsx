import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "הדף לא נמצא",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <section className="mx-auto max-w-6xl px-4 pt-20 pb-32 sm:px-6 md:pt-28">
          <p className="font-display text-[clamp(6rem,30vw,16rem)] leading-[0.8] font-bold text-flare" aria-hidden="true">
            404
          </p>
          <h1 className="mt-6 font-display text-6xl leading-[0.95] font-bold sm:text-7xl">הדף הזה לא קיים</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-dust">
            אולי הקישור השתנה, או שנפלה טעות בכתובת. אפשר לחזור לעמוד הבית ולהמשיך משם.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex min-h-11 items-center rounded-full bg-flare px-7 py-4 text-lg font-semibold text-ink transition-[scale,background-color] duration-150 ease-out hover:bg-bone active:scale-[0.97]"
          >
            חזרה לעמוד הבית
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
