import About from "@/components/About";
import Contact from "@/components/Contact";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Included from "@/components/Included";
import Marquee from "@/components/Marquee";
import Process from "@/components/Process";
import WhatsAppButton from "@/components/WhatsAppButton";
import { localizePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/server";
import { site, siteUrl } from "@/lib/site";

export default async function Home() {
  const { locale, t } = await getDictionary();

  // Structured data so search engines understand who runs the site and what's offered
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: t.site.serviceName,
    description: t.meta.description,
    url: `${siteUrl}${localizePath(locale, "/")}`.replace(/\/$/, ""),
    telephone: site.phoneInternational,
    email: site.email,
    areaServed: { "@type": "Country", name: "Israel" },
    inLanguage: locale,
    founder: { "@type": "Person", name: t.site.fullName, jobTitle: t.site.role },
  };

  // The FAQ as structured data, so search engines can show the questions and answers
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escaping "<" keeps the JSON from ever closing the script tag early
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }}
      />
      <Header />
      {/* overflow-x-clip: tilted bands and side-sliding headlines never cause sideways scroll,
          and unlike overflow-hidden it keeps position: sticky working */}
      <main id="main" tabIndex={-1} className="overflow-x-clip focus:outline-none">
        <Hero />
        <Marquee />
        <About />
        <Process />
        <Included />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
