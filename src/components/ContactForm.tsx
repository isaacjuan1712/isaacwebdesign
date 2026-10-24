"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { whatsappLink } from "@/lib/site";
import { CheckIcon } from "./icons";
import Magnetic from "./Magnetic";

type Status = "idle" | "sending" | "success" | "error";
type FieldName = "name" | "phone" | "email" | "message";
type Errors = Partial<Record<FieldName, string>>;

// NEXT_PUBLIC_ variables are baked into the browser bundle at build time.
// That's fine here: a Web3Forms access key is public by design (it can only send to your inbox).
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

// Upper limits keep submissions sane and stop someone pasting a novel into the form
const MAX = { name: 80, phone: 20, email: 120, message: 2000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Checks one field and returns a Hebrew error, or undefined when it's fine
function validate(name: FieldName, raw: string): string | undefined {
  const value = raw.trim();
  switch (name) {
    case "name":
      if (!value) return "נא למלא שם.";
      if (value.length < 2) return "השם קצר מדי.";
      return;
    case "phone": {
      if (!value) return "נא למלא מספר טלפון.";
      const digits = value.replace(/\D/g, "");
      if (!/^[\d\s+()-]+$/.test(value) || digits.length < 9 || digits.length > 13)
        return "מספר הטלפון לא נראה תקין. לדוגמה: 050-123-4567.";
      return;
    }
    case "email":
      if (value && !EMAIL_PATTERN.test(value)) return "כתובת האימייל לא נראית תקינה. לדוגמה: name@example.com.";
      return;
    case "message":
      if (!value) return "נא לכתוב כמה מילים על העסק.";
      return;
  }
}

const ease = [0.23, 1, 0.32, 1] as const;

// Fields rise in one after another, as if the form were being written out
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const inputClass =
  "w-full border-0 border-b-2 bg-transparent px-0 py-3 text-lg text-bone outline-none transition-colors placeholder:text-dust/80 focus:border-flare focus-visible:outline-none";

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: FieldName;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div variants={rise}>
      <label htmlFor={id} className="block text-sm font-semibold text-dust">
        {label} {required ? <span className="font-normal">(חובה)</span> : <span className="font-normal">(לא חובה)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-flare">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mt-0.5 size-4 shrink-0">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
          </svg>
          {error}
        </p>
      )}
    </motion.div>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState("");
  // After the first submit attempt, fields re-check themselves as soon as they're fixed
  const [attempted, setAttempted] = useState(false);

  // Props shared by every field: links the error text and marks the field invalid
  function fieldProps(name: FieldName) {
    const error = errors[name];
    return {
      id: name,
      name,
      maxLength: MAX[name],
      "aria-invalid": error ? true : undefined,
      "aria-describedby": error ? `${name}-error` : undefined,
      className: `${inputClass} ${error ? "border-flare" : "border-edge"}`,
      onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (attempted) setErrors((prev) => ({ ...prev, [name]: validate(name, e.target.value) }));
      },
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: validate(name, e.target.value) }));
      },
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // stop the browser from reloading the page
    const form = event.currentTarget;
    const data = new FormData(form);

    const found: Errors = {};
    for (const name of ["name", "phone", "email", "message"] as const) {
      const error = validate(name, String(data.get(name) ?? ""));
      if (error) found[name] = error;
    }
    setAttempted(true);
    setErrors(found);

    const invalid = Object.keys(found) as FieldName[];
    if (invalid.length) {
      setStatus("idle");
      setSummary(invalid.length === 1 ? "יש שדה אחד שצריך לתקן." : `יש ${invalid.length} שדות שצריך לתקן.`);
      form.querySelector<HTMLElement>(`#${invalid[0]}`)?.focus();
      return;
    }
    setSummary("");

    if (!accessKey) {
      console.error("Missing NEXT_PUBLIC_WEB3FORMS_KEY. Add it to .env.local");
      setStatus("error");
      return;
    }

    setStatus("sending");
    // Send trimmed values only. Nothing is stored on this site: Web3Forms emails it to the owner.
    const payload = new FormData();
    payload.append("access_key", accessKey);
    payload.append("subject", "פנייה חדשה מהאתר");
    payload.append("botcheck", String(data.get("botcheck") ?? ""));
    for (const name of ["name", "phone", "email", "message"] as const) {
      payload.append(name, String(data.get(name) ?? "").trim());
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: payload,
      });
      const result = await response.json();
      if (result.success) {
        setStatus("success");
        setAttempted(false);
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      noValidate
      aria-label="טופס יצירת קשר"
      className="space-y-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
    >
      {/* Honeypot: hidden from people and screen readers; bots fill it and Web3Forms drops the submission */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="name" label="שם מלא" required error={errors.name}>
          <input {...fieldProps("name")} autoComplete="name" aria-required="true" placeholder="ישראל ישראלי" />
        </Field>
        <Field id="phone" label="טלפון" required error={errors.phone}>
          {/* dir="ltr" keeps phone digits in the expected order inside an RTL page */}
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            aria-required="true"
            placeholder="050-000-0000"
            className={`${fieldProps("phone").className} text-end`}
          />
        </Field>
      </div>

      <Field id="email" label="אימייל" error={errors.email}>
        <input
          {...fieldProps("email")}
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder="name@example.com"
          className={`${fieldProps("email").className} text-end`}
        />
      </Field>

      <Field id="message" label="ספרו לי על העסק" required error={errors.message}>
        <textarea
          {...fieldProps("message")}
          rows={3}
          aria-required="true"
          placeholder="איזה עסק יש לכם ומה הייתם רוצים באתר?"
          className={`${fieldProps("message").className} resize-none`}
        />
      </Field>

      <motion.div variants={rise} className="space-y-5">
        <p className="text-sm leading-relaxed text-dust">
          בשליחת הטופס אני מאשר/ת את{" "}
          <Link href="/privacy" className="font-semibold text-bone underline underline-offset-4 hover:text-flare">
            מדיניות הפרטיות
          </Link>
          . הפרטים משמשים רק כדי לחזור אליכם לגבי הפנייה.
        </p>
        <Magnetic className="flex sm:inline-flex">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-bone px-8 py-4 text-lg font-semibold text-ink transition-[scale,background-color,opacity] duration-150 ease-out hover:bg-flare active:scale-[0.97] disabled:cursor-wait disabled:opacity-50 sm:w-auto"
          >
            {status === "sending" ? "שולח..." : "שליחה"}
          </button>
        </Magnetic>
      </motion.div>

      {/* aria-live makes screen readers announce validation and send results */}
      <div aria-live="polite" role="status" className="min-h-7">
        {summary && <p className="font-semibold text-flare">{summary}</p>}
        <AnimatePresence mode="wait">
          {status === "success" && (
            <motion.p key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 font-semibold text-whatsapp">
              <CheckIcon className="size-5 shrink-0" />
              תודה! קיבלתי את ההודעה ואחזור אליכם בהקדם.
            </motion.p>
          )}
          {status === "error" && (
            <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold text-flare">
              משהו השתבש בשליחה. נסו שוב, או{" "}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                שלחו לי וואטסאפ
                <span className="sr-only"> (נפתח בחלון חדש)</span>
              </a>
              .
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}
