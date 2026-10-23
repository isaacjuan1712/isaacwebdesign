"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { whatsappLink } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

// NEXT_PUBLIC_ variables are baked into the browser bundle at build time.
// That's fine here: a Web3Forms access key is public by design (it can only send to your inbox).
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

const inputClass =
  "w-full border-0 border-b-2 border-line bg-transparent px-0 py-3 text-lg text-bone outline-none transition-colors placeholder:text-dust/50 focus:border-flare focus-visible:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-dust">{label}</span>
      {children}
    </label>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const form = event.currentTarget;

    if (!accessKey) {
      console.error("Missing NEXT_PUBLIC_WEB3FORMS_KEY. Add it to .env.local");
      setStatus("error");
      return;
    }

    setStatus("sending");
    const data = new FormData(form);
    data.append("access_key", accessKey);
    data.append("subject", "פנייה חדשה מהאתר");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Honeypot: hidden from people, bots tick it and Web3Forms drops the submission */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-8 sm:grid-cols-2">
        <Field label="שם מלא *">
          <input name="name" required autoComplete="name" className={inputClass} placeholder="ישראל ישראלי" />
        </Field>
        <Field label="טלפון *">
          {/* dir="ltr" keeps phone digits in the expected order inside an RTL page */}
          <input
            name="phone"
            type="tel"
            required
            dir="ltr"
            autoComplete="tel"
            className={`${inputClass} text-end`}
            placeholder="050-000-0000"
          />
        </Field>
      </div>

      <Field label="אימייל">
        <input
          name="email"
          type="email"
          dir="ltr"
          autoComplete="email"
          className={`${inputClass} text-end`}
          placeholder="name@example.com"
        />
      </Field>

      <Field label="ספרו לי על העסק *">
        <textarea
          name="message"
          required
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="איזה עסק יש לכם ומה הייתם רוצים באתר?"
        />
      </Field>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-bone px-8 py-4 text-lg font-semibold text-ink transition-[translate,background-color] duration-200 hover:-translate-y-0.5 hover:bg-flare active:scale-95 disabled:cursor-wait disabled:opacity-50 sm:w-auto"
      >
        {status === "sending" ? "שולח..." : "שליחה"}
      </button>

      {/* aria-live makes screen readers announce the result */}
      <div aria-live="polite" className="min-h-7">
        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold text-whatsapp">
              ✓ תודה! קיבלתי את ההודעה ואחזור אליכם בהקדם.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold text-flare">
              משהו השתבש בשליחה. נסו שוב, או{" "}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                שלחו לי וואטסאפ
              </a>
              .
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
