import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
