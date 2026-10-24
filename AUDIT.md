# Launch-readiness audit

Audit of the portfolio site (Next.js 16, App Router, static) against the launch checklist: accessibility (WCAG 2.1 AA / IS 5568), privacy, anti-spam, licenses, honest content, security, performance/SEO, deploy readiness.

- **Audited:** 2026-10-24, before any fixes (commit `baa5ab4`).
- **Status column:** `Fixed` = resolved in the launch-ready pass; `OK` = checked, no change needed; `Owner` = needs a decision or action from the site owner.
- **Fixes completed:** 2026-10-24. Verification results are at the bottom.

## Findings

| # | Phase | File | Issue | Severity | Status |
|---|---|---|---|---|---|
| 1 | A11y – structure | `src/app/layout.tsx` | No "דלג לתוכן" skip link; `<main>` has no target id | High | Fixed: skip link is the first focusable element, visible on focus, targets `<main id="main">` |
| 2 | A11y – structure | `src/components/About.tsx` | English words ("Next.js", "React") inside Hebrew text lack `lang="en"` | Low | Fixed: `lang="en"` on English terms (About, privacy and accessibility pages) |
| 3 | A11y – structure | `src/app/layout.tsx` | Only one page/title exists; legal pages and 404 need their own unique titles | Medium | Fixed: title template; home, privacy, accessibility and 404 each have a unique title |
| 4 | A11y – color | `src/components/ContactForm.tsx` | Input borders `#2e2924` on `#1a1714` = 1.24:1 (needs 3:1 for UI components) | High | Fixed: new `--color-edge` #6a645b for input borders (3.03:1); errors turn the border orange |
| 5 | A11y – color | `src/components/ContactForm.tsx` | Placeholder text `dust/50` = 2.64:1 (needs 4.5:1) | High | Fixed: placeholders `dust/80` (≥4.5:1) |
| 6 | A11y – color | `src/components/WhatsAppButton.tsx` | White icon on `#25d366` = 1.98:1 (needs 3:1 for graphics) | High | Fixed: button uses WhatsApp's darker green #1da851, white icon ≥3:1 |
| 7 | A11y – color | `src/components/Hero.tsx` | Outline button border `#2e2924` on `#0f0d0b` = 1.35:1 | Medium | Fixed: outline button uses `--color-edge` |
| 8 | A11y – motion/color | `src/components/ScrollWords.tsx` | About headline words start at 16% opacity: unreadable until scrolled, fails contrast | High | Fixed: dim state now bone 0.4 / dust 0.6, above 3:1 for large text, readable before scrolling |
| 9 | A11y – motion/color | `src/components/Process.tsx` | Unreached steps dimmed to 35% (body text 2.2:1); text only readable after scroll | High | Fixed: only the large heading dims (0.45, above 3:1); body text always at full strength |
| 10 | A11y – motion/color | `src/components/Hero.tsx` | Headline fades to 10% opacity on scroll-out (below 3:1) | Medium | Fixed: scroll-out fade floor raised to 0.4 |
| 11 | A11y – motion | `src/components/Contact.tsx` | Headline starts 30% off-position and is clipped at the edge until scrolled | Low | Fixed: shift reduced to 14% / 20% and completes earlier |
| 12 | A11y – motion | `Marquee.tsx`, `Hero.tsx`, `Included.tsx`, `StepScreens.tsx`, `WhatsAppButton.tsx` | Ticker, spinning stamp, pulsing dots, phone feed, form/calendar demo loops run > 5 s with no pause/stop control | High | Fixed: global pause button in the header (aria-pressed, remembered) stops all CSS and JS loops; reduced motion stops them too |
| 13 | A11y – keyboard | `src/components/Header.tsx` | Mobile menu: focus not moved in, not trapped, not returned to the menu button on close | High | Fixed: focus moves into the menu, Tab is trapped in the header, Esc closes it and returns focus to the menu button, background locked |
| 14 | A11y – keyboard | `Header.tsx`, `Footer.tsx` | Nav/footer links are < 44 px tall (touch target) | Medium | Fixed: nav and footer links have a 44×44 minimum |
| 15 | A11y – images | `src/components/Included.tsx` | Decorative demo visuals (form, calendar) are exposed to screen readers as stray text | Low | Fixed: decorative demo visuals are `aria-hidden` |
| 16 | A11y – forms | `src/components/ContactForm.tsx` | Required fields marked only with `*`; no text "(חובה)" | High | Fixed: labels say "(חובה)" / "(לא חובה)" in words |
| 17 | A11y – forms | `src/components/ContactForm.tsx` | Validation relies on browser bubbles: no `aria-invalid`, no `aria-describedby` Hebrew error messages | High | Fixed: custom validation with Hebrew messages, `aria-invalid`, `aria-describedby`, focus moves to the first error, error count announced in the live region |
| 18 | A11y – statement | — | No "הצהרת נגישות" page, no footer link | High | Fixed: `/accessibility` statement in Hebrew, linked in every footer |
| 19 | A11y – overlay | — | No accessibility overlay/widget installed | — | OK |
| 20 | Privacy | — | No "מדיניות פרטיות" page, no footer link | High | Fixed: `/privacy` policy in Hebrew, linked in every footer |
| 21 | Privacy | `src/components/ContactForm.tsx` | No consent line with a privacy-policy link under the form | High | Fixed: consent line with privacy link under the form, nothing pre-checked |
| 22 | Privacy | `src/components/ContactForm.tsx` | Fields: name, phone, email (optional), message. All used to reply; nothing stored on the site; no analytics or cookies | — | OK |
| 23 | Anti-spam | `src/components/ContactForm.tsx` | Form is inquiry-only, no newsletter or marketing opt-in | — | OK |
| 24 | Licenses | — | No `LICENSES.md` | Medium | Fixed: `LICENSES.md` |
| 25 | Licenses | `package-lock.json` | `license-checker`: `sharp` platform binaries are LGPL-3.0 (server-side image optimizer, dynamically linked, not shipped to browsers); `caniuse-lite` CC-BY-4.0 (build data). No GPL/AGPL. Neither affects distribution | Low | OK |
| 26 | Licenses | `public/*.svg`, `src/app/favicon.ico` | Unused create-next-app SVGs; favicon is the default Vercel/Next mark, not the owner's | Medium | Fixed: starter SVGs and the Vercel favicon removed; own icon, apple-touch-icon and share image added |
| 27 | Honest content | `About.tsx`, `Contact.tsx` | "תשובה תוך יום" / "אחזור אליכם תוך יום" stated as a guarantee | Medium | Fixed: "תשובה מהירה" with "בדרך כלל עוד באותו יום" |
| 28 | Honest content | `About.tsx`, `Marquee.tsx` | "מופיע בגוגל" / "מהיר בגוגל" imply guaranteed Google placement | Medium | Fixed: "מוכן לגוגל" / "בנוי כך שגוגל יוכל למצוא אותו" |
| 29 | Honest content | `Included.tsx` | "באוויר תוך ימים" has no qualifier (timing depends on the client's approvals) | Low | Fixed: qualified as "ברוב המקרים… תלוי בכמה מהר מאשרים את הדמו" |
| 30 | Honest content | — | No fake reviews, clients, statistics or prices | — | OK |
| 31 | Security | git history, `.env.local` | Scanned all commits: no keys, passwords or tokens. `.env*` ignored except `.env.example`. Only `NEXT_PUBLIC_WEB3FORMS_KEY` (public by design) | — | OK |
| 32 | Security | `src/components/ContactForm.tsx` | No `maxLength` on inputs; email format not validated in code | Medium | Fixed: `maxLength` on every field, email and phone format checks, values trimmed, React renders no user HTML |
| 33 | Security | `next.config.ts` | No security headers (CSP, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy) | High | Fixed: CSP, nosniff, Referrer-Policy, X-Frame-Options DENY, Permissions-Policy, HSTS in `next.config.ts`; `X-Powered-By` removed |
| 34 | Security | all components | All `target="_blank"` links already have `rel="noopener noreferrer"` | — | OK |
| 35 | Security | `next.config.ts` | Production browser source maps are off (Next default) | — | OK |
| 36 | Security | `package.json` | `npm audit`: 0 vulnerabilities | — | OK |
| 37 | Perf | `src/app/layout.tsx` | Karantina loads weights 400 and 700; only 700 is used | Low | Fixed: Karantina loads weight 700 only |
| 38 | Perf | — | No raster images on the page; animations use transform/opacity | — | OK |
| 39 | SEO | `src/app/layout.tsx` | Missing Open Graph/Twitter tags and share image, canonical URL, `metadataBase` | High | Fixed: `metadataBase`, canonical per page, Open Graph and Twitter tags, share image |
| 40 | SEO | `src/app` | Missing `robots.txt`, `sitemap.xml`, Hebrew 404 page, apple-touch-icon | High | Fixed: `robots.txt`, `sitemap.xml`, Hebrew 404 page, apple-touch-icon |
| 41 | SEO | `src/app/page.tsx` | No JSON-LD structured data | Medium | Fixed: `ProfessionalService` JSON-LD on the home page |
| 42 | Deploy | `README.md` | Still the create-next-app README | Medium | Fixed: README covers local run, env vars, Vercel deploy, legal pages |
| 43 | Deploy | `.env.example` | Missing the site URL variable needed for canonical/sitemap | Medium | Fixed: `NEXT_PUBLIC_SITE_URL` added with comments |
| 44 | Deploy | `src/lib/site.ts` | WhatsApp `https://wa.me/972534281220`, phone `tel:+972534281220`: correct format | — | OK |

## Standing rule: marketing consent (Communications Law, section 30A)

The site has no newsletter or mailing list, and the contact form is for inquiries only. If a marketing signup is ever added, it must use a **separate, unchecked opt-in checkbox** with explicit wording (for example "אני מסכים/ה לקבל עדכונים ודיוורים בוואטסאפ ובמייל"). It must never be bundled with the contact form's privacy consent, and it must offer a way to unsubscribe in every message.

## Items added during verification

| # | Phase | File | Issue | Severity | Status |
|---|---|---|---|---|---|
| 45 | A11y | `src/components/Hero.tsx` | axe `label-content-name-mismatch` on the rotating stamp link | Serious | Fixed: name now comes from visible-equivalent sr-only text |
| 46 | A11y | `src/components/FooterReveal.tsx` | On short pages (404) the scroll-linked footer reveal never finished, leaving links clipped | High | Fixed: reveal is triggered by visibility, movement only |
| 47 | A11y | `src/app/globals.css` | Phone number wrapped mid-number on the legal pages at 390px | Low | Fixed: `nowrap` on phone/email links |
| 48 | Perf | `src/components/Hero.tsx` | Home LCP 3.3 s / Performance 86: hero text hidden until JS loaded | High | Fixed: hero entrances run in CSS from first paint; Performance 91 |
| 49 | Deploy | `.env.local` | `NEXT_PUBLIC_WEB3FORMS_KEY` is still the placeholder `your-access-key-here`: the form cannot deliver | High | **Owner**: paste the real key locally and in Vercel |
| 50 | Content | `src/lib/site.ts` | Final domain unknown: canonical URLs and sitemap fall back to the Vercel URL | Medium | **Owner**: set `NEXT_PUBLIC_SITE_URL` once the domain exists |

## Verification (2026-10-24, production build)

| Check | Result |
|---|---|
| Screenshots: 4 pages × 1440 / 768 / 390 / 320 px + 200% zoom | No horizontal scroll, no content outside the viewport, 0 console errors |
| axe-core (WCAG 2.0/2.1 A + AA), 4 pages × desktop + phone | **0 violations** |
| Keyboard pass (home, 31 stops) | Order follows RTL reading order; visible focus ring on every stop; skip link moves focus to `<main>` |
| Mobile menu | Focus moves in, trapped, Esc closes, focus returns to the menu button, background scroll locked |
| Form errors | Empty submit: 3 errors announced, focus on the first field, `aria-invalid` + `aria-describedby`; invalid email caught |
| Form delivery | Request reaches Web3Forms and the result is announced in the `aria-live` region; delivery fails only because the access key is the placeholder (item 49). Headless browsers are blocked by Web3Forms' Cloudflare; test from a real browser |
| `prefers-reduced-motion: reduce` | No looping animations, no text below 0.4 opacity, hero shows immediately |
| Pause button | 7 → 0 running looping animations, ticker stops, `aria-pressed="true"` |
| Security headers | All present on every page |
| Lighthouse mobile (3 runs each) | Home: Perf 91, A11y 100, BP 100, SEO 100 · Privacy: 93–94 / 100 / 100 / 100 · Accessibility: 92–94 / 100 / 100 / 100 · CLS 0 everywhere |
| `npm run build` | Passes, no warnings |
| `npm audit` | 0 vulnerabilities |

Known exemption: the "מדיניות הפרטיות" link inside the sentence under the form is shorter than 44 px. Inline text links are exempt from the target-size rule.
