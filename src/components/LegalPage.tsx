import Footer from "./Footer";
import Header from "./Header";
import WhatsAppButton from "./WhatsAppButton";

// Shared shell for the text pages (privacy policy, accessibility statement):
// same header and footer as the home page, and a readable column of text.
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <article className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 md:pt-24">
          <h1 className="font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">{title}</h1>
          <p className="mt-4 text-sm text-dust">{updated}</p>
          <div className="legal mt-12">{children}</div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
