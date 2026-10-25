"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useI18n } from "@/i18n/client";
import { format, type Messages } from "@/i18n/config";
import { whatsappLink } from "@/lib/site";
import { CheckIcon } from "./icons";
import Magnetic from "./Magnetic";

type Status = "idle" | "sending" | "success" | "error";
type FieldName = "name" | "phone" | "email" | "message";
type Errors = Partial<Record<FieldName, ErrorKey>>;

// NEXT_PUBLIC_ variables are baked into the browser bundle at build time.
// That's fine here: a Web3Forms access key is public by design (it can only send to your inbox).
const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

// Upper limits keep submissions sane and stop someone pasting a novel into the form
const MAX = { name: 80, phone: 20, email: 120, message: 2000 } as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type ErrorKey = keyof Messages["form"]["errors"];

// Checks one field and returns the key of its error message, or undefined when it's fine
function validate(name: FieldName, raw: string): ErrorKey | undefined {
  const value = raw.trim();
  switch (name) {
    case "name":
      if (!value) return "nameEmpty";
      if (value.length < 2) return "nameShort";
      return;
    case "phone": {
      if (!value) return "phoneEmpty";
      const digits = value.replace(/\D/g, "");
      if (!/^[\d\s+()-]+$/.test(value) || digits.length < 9 || digits.length > 13) return "phoneInvalid";
      return;
    }
    case "email":
      if (value && !EMAIL_PATTERN.test(value)) return "emailInvalid";
      return;
    case "message":
      if (!value) return "messageEmpty";
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
  required,
  error,
  children,
}: {
  id: FieldName;
  required?: boolean;
  error?: ErrorKey;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <motion.div variants={rise}>
      <label htmlFor={id} className="block text-sm font-semibold text-dust">
        {t.form[id].label} <span className="font-normal">{required ? t.form.required : t.form.optional}</span>
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm font-semibold text-flare">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="mt-0.5 size-4 shrink-0">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
          </svg>
          {t.form.errors[error]}
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
  const { t, path } = useI18n();
  const f = t.form;

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
      setSummary(invalid.length === 1 ? f.summaryOne : format(f.summaryMany, { n: invalid.length }));
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
    // Send trimmed values only, cut to MAX in case maxLength was removed in devtools.
    // Nothing is stored on this site: Web3Forms emails it to the owner.
    const payload = new FormData();
    payload.append("access_key", accessKey);
    // Fixed subject and sender name per language, so inquiries are easy to filter in Gmail
    payload.append("subject", f.emailSubject);
    payload.append("from_name", f.fromName);
    payload.append("botcheck", String(data.get("botcheck") ?? ""));
    for (const name of ["name", "phone", "email", "message"] as const) {
      payload.append(name, String(data.get(name) ?? "").trim().slice(0, MAX[name]));
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
      aria-label={f.label}
      className="space-y-8"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }}
    >
      {/* Honeypot: hidden from people and screen readers; bots fill it and Web3Forms drops the submission */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <div className="grid gap-8 sm:grid-cols-2">
        <Field id="name" required error={errors.name}>
          <input {...fieldProps("name")} autoComplete="name" aria-required="true" placeholder={f.name.placeholder} />
        </Field>
        <Field id="phone" required error={errors.phone}>
          {/* dir="ltr" keeps phone digits in the expected order inside an RTL page */}
          <input
            {...fieldProps("phone")}
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            aria-required="true"
            placeholder={f.phone.placeholder}
            className={`${fieldProps("phone").className} text-end`}
          />
        </Field>
      </div>

      <Field id="email" error={errors.email}>
        <input
          {...fieldProps("email")}
          type="email"
          dir="ltr"
          autoComplete="email"
          placeholder={f.email.placeholder}
          className={`${fieldProps("email").className} text-end`}
        />
      </Field>

      <Field id="message" required error={errors.message}>
        <textarea
          {...fieldProps("message")}
          rows={3}
          aria-required="true"
          placeholder={f.message.placeholder}
          className={`${fieldProps("message").className} resize-none`}
        />
      </Field>

      <motion.div variants={rise} className="space-y-5">
        <p className="text-sm leading-relaxed text-dust">
          {f.consentBefore}{" "}
          <Link href={path("/privacy")} className="font-semibold text-bone underline underline-offset-4 hover:text-flare">
            {f.consentLink}
          </Link>
          {f.consentAfter}
        </p>
        <Magnetic className="flex sm:inline-flex">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-bone px-8 py-4 text-lg font-semibold text-ink transition-[scale,background-color,opacity] duration-150 ease-out hover:bg-flare active:scale-[0.97] disabled:cursor-wait disabled:opacity-50 sm:w-auto"
          >
            {status === "sending" ? f.sending : f.submit}
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
              {f.success}
            </motion.p>
          )}
          {status === "error" && (
            <motion.p key="err" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold text-flare">
              {f.errorBefore}{" "}
              <a href={whatsappLink(t.site.whatsappMessage)} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {f.errorLink}
                <span className="sr-only"> {t.a11y.newWindow}</span>
              </a>
              .
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}
