import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Included from "@/components/Included";
import Marquee from "@/components/Marquee";
import Process from "@/components/Process";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Header />
      {/* overflow-x-clip: tilted bands and side-sliding headlines never cause sideways scroll,
          and unlike overflow-hidden it keeps position: sticky working */}
      <main className="overflow-x-clip">
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
