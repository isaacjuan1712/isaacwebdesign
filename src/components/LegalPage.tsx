import Rich from "@/i18n/Rich";
import { getDictionary } from "@/i18n/server";
import { site } from "@/lib/site";
import Footer from "./Footer";
import Header from "./Header";
import WhatsAppButton from "./WhatsAppButton";

type Block = { h2?: string; p?: string; ul?: string[] };

// Shared shell for the text pages (privacy policy, accessibility statement): same header
// and footer as the home page, and a readable column of text built from the "blocks"
// in he.json / en.json. Each block is a heading (h2), a paragraph (p) or a list (ul).
export default async function LegalPage({ page }: { page: "privacy" | "accessibility" }) {
  const { t } = await getDictionary();
  const content = t[page];
  const blocks = content.blocks as Block[];

  // What {name}, {email} and {phone} turn into inside the texts
  const values = {
    name: t.site.name,
    email: (
      <a href={`mailto:${site.email}`} dir="ltr">
        {site.email}
      </a>
    ),
    phone: (
      <a href={site.phoneHref} dir="ltr">
        {site.phoneDisplay}
      </a>
    ),
  };

  return (
    <>
      <Header path={`/${page}`} />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <article className="mx-auto max-w-3xl px-4 pt-16 pb-24 sm:px-6 md:pt-24">
          <h1 className="text-center font-display text-6xl leading-[0.95] font-bold sm:text-7xl md:text-8xl">{content.title}</h1>
          <p className="mt-4 text-center text-sm text-dust">{content.updated}</p>
          <div className="legal mt-12">
            {blocks.map((block, i) => {
              if (block.h2) return <h2 key={i}>{block.h2}</h2>;
              if (block.ul)
                return (
                  <ul key={i}>
                    {block.ul.map((item, j) => (
                      <li key={j}>
                        <Rich text={item} values={values} />
                      </li>
                    ))}
                  </ul>
                );
              return (
                <p key={i}>
                  <Rich text={block.p ?? ""} values={values} />
                </p>
              );
            })}
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
