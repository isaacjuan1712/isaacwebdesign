import { whatsappLink } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

// Floating button that stays on screen while scrolling.
// `end-5` = the "end" side, which in RTL is the bottom-left corner.
// The bottom offset respects the iPhone home-indicator safe area.
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שלחו הודעה בוואטסאפ"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      className="group fixed end-5 z-40 flex size-15 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg shadow-black/40 transition-transform duration-200 hover:scale-110 active:scale-95"
    >
      <span aria-hidden="true" className="absolute inset-0 animate-ping-soft rounded-full bg-whatsapp" />
      <WhatsAppIcon className="relative size-8 transition-transform duration-300 group-hover:-rotate-12" />
    </a>
  );
}
