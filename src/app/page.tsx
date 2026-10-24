import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Included from "@/components/Included";
import Marquee from "@/components/Marquee";
import Process from "@/components/Process";
import WhatsAppButton from "@/components/WhatsAppButton";
import { site, siteUrl } from "@/lib/site";

// Structured data so search engines understand who runs the site and what's offered
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "יצחק, בניית אתרים לעסקים",
  description: site.description,
  url: siteUrl,
  telephone: "+972534281220",
  email: site.email,
  areaServed: { "@type": "Country", name: "Israel" },
  inLanguage: "he",
  founder: { "@type": "Person", name: site.name, jobTitle: site.role },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        // Escaping "<" keeps the JSON from ever closing the script tag early
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
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
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
