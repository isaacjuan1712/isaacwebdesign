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

## Bilingual verification (2026-10-24, after adding English and the FAQ)

| Check | Hebrew (`/`) | English (`/en`) |
|---|---|---|
| `lang` / `dir`, one `h1`, unique title, meta description, `og:locale`, hreflang (he, en, x-default) | ✅ on all 4 pages | ✅ on all 4 pages |
| axe (WCAG 2.0/2.1 A + AA), 4 pages × 1440 px + 390 px | 0 violations | 0 violations |
| Screenshots 390 px and 320 px, all pages | No sideways scroll, no console errors | No sideways scroll, no console errors |
| Keyboard pass (home, 40 stops) | Visible focus on every stop, order follows RTL | Visible focus on every stop, order follows LTR |
| FAQ accordion | Enter/Space toggle `aria-expanded`; ↑ ↓ Home End move focus; closed answers hidden from Tab and screen readers | Same |
| Language switcher | Reached by Tab, 44×44, `aria-label` in the target language, Enter goes to the same page in English and sets the `locale` cookie | Same, to Hebrew |
| Mobile menu | Focus moves in, trapped, includes the switcher, Esc returns focus | Same |
| Form validation (not submitted) | Hebrew errors linked with `aria-describedby`, count announced, focus on first error | English errors, same behaviour |
| `prefers-reduced-motion` | No loops, no dimmed text, no ink slab, FAQ opens instantly | Same |
| Lighthouse mobile (2 runs) | Perf 89–90, A11y 100, BP 100, SEO 100 | Perf 89–90, A11y 100, BP 100, SEO 100 |

Fixed during this pass: the hero headline's scroll-out fade floor was raised from 0.4 to 0.7, because the orange accent word needs 0.65 to stay above 3:1 (axe flagged it mid-scroll).

## Color contrast audit (2026-10-24)

Every text and UI color pair the site uses, measured against its real background (transparency blended in), in normal and high-contrast mode. Requirements: 4.5:1 for normal text; 3:1 for large text (24px+, or 18.5px+ bold) and for UI components, borders, icons and focus rings. The same results apply to both languages: Hebrew and English use identical colors. axe-core confirmed them on the rendered pages in both languages and in every accessibility-menu mode.

Changes made over the passes so far:

- Input and control borders: `#2e2924` (1.24:1) → `#6a645b` → now `#7a7369` (3.81:1 on dark grey, 4.14:1 on black)
- Placeholders: `dust` at 50% (2.64:1) → 80% (4.7:1)
- Floating WhatsApp button: white icon on `#25d366` (1.98:1) → on `#1da851` (3.10:1)
- Scroll-dimmed headline words: 16% → 40% (cream) / 60% (grey); unreached step headings 35% → 45%; hero scroll-out floor 10% → 70%
- Text on the orange accent is dark (`#0f0d0b`, 5.85:1); no white text on orange is used anywhere

### Normal

| Element | Colors (fg on bg) | Ratio | Needs | Result |
|---|---|---|---|---|
| Body text, intros | #a69e92 on #0f0d0b | 7.32:1 | 4.5:1 | ✅ |
| Body text on dark-grey sections | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| Headings | #f2ece1 on #0f0d0b | 16.50:1 | 3:1 | ✅ |
| Headings on dark-grey sections | #f2ece1 on #1a1714 | 15.18:1 | 3:1 | ✅ |
| Header nav links | #a69e92 on #0f0d0b | 7.32:1 | 4.5:1 | ✅ |
| Header nav links: hover | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| Language switcher: current | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| Language switcher: other / hover | #a69e92 on #0f0d0b | 7.32:1 | 4.5:1 | ✅ |
| Language switcher: hover | #ff4d1c on #0f0d0b | 5.85:1 | 4.5:1 | ✅ |
| Header CTA "Let's talk" (text on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 4.5:1 | ✅ |
| Header CTA: hover | #0f0d0b on #f2ece1 | 16.50:1 | 4.5:1 | ✅ |
| Pause button: icon | #f2ece1 on #0f0d0b | 16.50:1 | 3:1 | ✅ |
| Pause button: border | #7a7369 on #0f0d0b | 4.14:1 | 3:1 | ✅ |
| Pause button: hover (icon on cream) | #0f0d0b on #f2ece1 | 16.50:1 | 3:1 | ✅ |
| Pause tooltip text | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| Hero accent word (orange) | #ff4d1c on #0f0d0b | 5.85:1 | 3:1 | ✅ |
| Hero headline at scroll-out floor (0.7) | #f2ece1 @70% on #0f0d0b | 8.31:1 | 3:1 | ✅ |
| Hero accent at scroll-out floor (0.7) | #ff4d1c @70% on #0f0d0b | 3.35:1 | 3:1 | ✅ |
| Hero WhatsApp button (text on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 4.5:1 | ✅ |
| Hero WhatsApp button: hover | #0f0d0b on #f2ece1 | 16.50:1 | 4.5:1 | ✅ |
| Hero outline button: text | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| Hero outline button: border | #7a7369 on #0f0d0b | 4.14:1 | 3:1 | ✅ |
| Stamp ring text | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| Stamp arrow (on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 3:1 | ✅ |
| Ticker band text (on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 3:1 | ✅ |
| About headline: dim words (0.4) | #f2ece1 @40% on #0f0d0b | 3.41:1 | 3:1 | ✅ |
| About headline: dim grey words (0.6) | #a69e92 @60% on #0f0d0b | 3.31:1 | 3:1 | ✅ |
| About tool chips: text | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| About tool chips: border | #7a7369 on #0f0d0b | 4.14:1 | 3:1 | ✅ |
| Process: step heading not yet reached (0.45) | #f2ece1 @45% on #1a1714 | 4.00:1 | 3:1 | ✅ |
| Process: step number (outline) | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| Process: step number (reached, on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 4.5:1 | ✅ |
| Process: "Step 2 of 4" caption | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| Tile titles / text | #f2ece1 on #1a1714 | 15.18:1 | 3:1 | ✅ |
| Tile body text | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| WhatsApp demo: message bubble text | #f2ece1 on #1d5c3a | 6.75:1 | 4.5:1 | ✅ |
| WhatsApp demo: "what your customer sees" caption | #a69e92 on #0f0d0b | 7.32:1 | 4.5:1 | ✅ |
| WhatsApp demo: empty field placeholder | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| WhatsApp demo: send button icon | #0f0d0b on #25d366 | 9.78:1 | 3:1 | ✅ |
| Map: "your business is here" label | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| Map: pin button (orange on map) | #ff4d1c on #1c1916 | 5.28:1 | 3:1 | ✅ |
| FAQ question | #f2ece1 on #0f0d0b | 16.50:1 | 3:1 | ✅ |
| FAQ question: hover | #ff4d1c on #0f0d0b | 5.85:1 | 3:1 | ✅ |
| FAQ answer | #a69e92 on #0f0d0b | 7.32:1 | 4.5:1 | ✅ |
| FAQ +/− icon border (closed) | #7a7369 on #0f0d0b | 4.14:1 | 3:1 | ✅ |
| FAQ +/− icon (closed) | #f2ece1 on #0f0d0b | 16.50:1 | 3:1 | ✅ |
| FAQ −  icon (open, on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 3:1 | ✅ |
| Contact: channel label | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| Contact: channel value | #f2ece1 on #1a1714 | 15.18:1 | 4.5:1 | ✅ |
| Contact: channel value hover | #ff4d1c on #1a1714 | 5.38:1 | 4.5:1 | ✅ |
| Contact: channel icon | #f2ece1 on #1a1714 | 15.18:1 | 3:1 | ✅ |
| Contact: channel icon hover (on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 3:1 | ✅ |
| Form labels and "(required)" | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| Form input text | #f2ece1 on #1a1714 | 15.18:1 | 4.5:1 | ✅ |
| Form placeholders (dust at 80%) | #a69e92 @80% on #1a1714 | 4.76:1 | 4.5:1 | ✅ |
| Form field border (underline) | #7a7369 on #1a1714 | 3.81:1 | 3:1 | ✅ |
| Form field border: focus / error | #ff4d1c on #1a1714 | 5.38:1 | 3:1 | ✅ |
| Form error messages + icon | #ff4d1c on #1a1714 | 5.38:1 | 4.5:1 | ✅ |
| Form success message | #25d366 on #1a1714 | 9.00:1 | 4.5:1 | ✅ |
| Consent text | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| Consent link | #f2ece1 on #1a1714 | 15.18:1 | 4.5:1 | ✅ |
| Submit button (text on cream) | #0f0d0b on #f2ece1 | 16.50:1 | 4.5:1 | ✅ |
| Submit button: hover (text on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 4.5:1 | ✅ |
| Submit button: disabled (50%) | #0f0d0b on #f2ece1 | 16.50:1 | — | ✅ (Disabled controls are exempt (WCAG 1.4.3)) |
| Footer text and links | #a69e92 on #0f0d0b | 7.32:1 | 4.5:1 | ✅ |
| Footer links: hover | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| Legal pages: body | #a69e92 on #0f0d0b | 7.32:1 | 4.5:1 | ✅ |
| Legal pages: links | #f2ece1 on #0f0d0b | 16.50:1 | 4.5:1 | ✅ |
| Legal pages: link hover | #ff4d1c on #0f0d0b | 5.85:1 | 4.5:1 | ✅ |
| Skip link (on cream) | #0f0d0b on #f2ece1 | 16.50:1 | 4.5:1 | ✅ |
| Focus ring on dark page | #ff4d1c on #0f0d0b | 5.85:1 | 3:1 | ✅ |
| Focus ring on dark-grey sections | #ff4d1c on #1a1714 | 5.38:1 | 3:1 | ✅ |
| Floating WhatsApp: icon (white on green) | #ffffff on #1da851 | 3.10:1 | 3:1 | ✅ |
| Floating WhatsApp: button vs page | #1da851 on #0f0d0b | 6.25:1 | 3:1 | ✅ |
| Accessibility button: icon (on cream) | #0f0d0b on #f2ece1 | 16.50:1 | 3:1 | ✅ |
| Accessibility button vs page | #f2ece1 on #0f0d0b | 16.50:1 | 3:1 | ✅ |
| Accessibility menu: text | #f2ece1 on #1a1714 | 15.18:1 | 4.5:1 | ✅ |
| Accessibility menu: small note | #a69e92 on #1a1714 | 6.74:1 | 4.5:1 | ✅ |
| Accessibility menu: switch off (border) | #7a7369 on #1a1714 | 3.81:1 | 3:1 | ✅ |
| Accessibility menu: switch on (orange track) | #ff4d1c on #1a1714 | 5.38:1 | 3:1 | ✅ |
| Accessibility menu: chosen text size (on orange) | #0f0d0b on #ff4d1c | 5.85:1 | 4.5:1 | ✅ |
| Highlight-links outline (mustard) | #e8b931 on #0f0d0b | 10.54:1 | 3:1 | ✅ |
| Mobile menu links | #f2ece1 on #0f0d0b | 16.50:1 | 3:1 | ✅ |
| Phone illustrations: small green status text (decorative) | #25d366 on #0f0d0b | 9.78:1 | 4.5:1 | ✅ |
| Phone illustrations: mustard labels (decorative) | #e8b931 on #1a1714 | 9.70:1 | 4.5:1 | ✅ |

Normal: 0 failing of 85

### High contrast

| Element | Colors (fg on bg) | Ratio | Needs | Result |
|---|---|---|---|---|
| Body text, intros | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Body text on dark-grey sections | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Headings | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| Headings on dark-grey sections | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| Header nav links | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Header nav links: hover | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Language switcher: current | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Language switcher: other / hover | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Language switcher: hover | #ff4d1c on #000000 | 6.33:1 | 4.5:1 | ✅ |
| Header CTA "Let's talk" (text on orange) | #000000 on #ff4d1c | 6.33:1 | 4.5:1 | ✅ |
| Header CTA: hover | #000000 on #ffffff | 21.00:1 | 4.5:1 | ✅ |
| Pause button: icon | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| Pause button: border | #d9d2c7 on #000000 | 13.99:1 | 3:1 | ✅ |
| Pause button: hover (icon on cream) | #000000 on #ffffff | 21.00:1 | 3:1 | ✅ |
| Pause tooltip text | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Hero accent word (orange) | #ff4d1c on #000000 | 6.33:1 | 3:1 | ✅ |
| Hero headline at scroll-out floor (0.7) | #ffffff @70% on #000000 | 9.96:1 | 3:1 | ✅ |
| Hero accent at scroll-out floor (0.7) | #ff4d1c @70% on #000000 | 3.44:1 | 3:1 | ✅ |
| Hero WhatsApp button (text on orange) | #000000 on #ff4d1c | 6.33:1 | 4.5:1 | ✅ |
| Hero WhatsApp button: hover | #000000 on #ffffff | 21.00:1 | 4.5:1 | ✅ |
| Hero outline button: text | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Hero outline button: border | #d9d2c7 on #000000 | 13.99:1 | 3:1 | ✅ |
| Stamp ring text | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Stamp arrow (on orange) | #000000 on #ff4d1c | 6.33:1 | 3:1 | ✅ |
| Ticker band text (on orange) | #000000 on #ff4d1c | 6.33:1 | 3:1 | ✅ |
| About headline: dim words (0.4) | #ffffff @40% on #000000 | 3.66:1 | 3:1 | ✅ |
| About headline: dim grey words (0.6) | #ece7de @60% on #000000 | 6.15:1 | 3:1 | ✅ |
| About tool chips: text | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| About tool chips: border | #d9d2c7 on #000000 | 13.99:1 | 3:1 | ✅ |
| Process: step heading not yet reached (0.45) | #ffffff @45% on #000000 | 4.41:1 | 3:1 | ✅ |
| Process: step number (outline) | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Process: step number (reached, on orange) | #000000 on #ff4d1c | 6.33:1 | 4.5:1 | ✅ |
| Process: "Step 2 of 4" caption | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Tile titles / text | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| Tile body text | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| WhatsApp demo: message bubble text | #ffffff on #1d5c3a | 7.94:1 | 4.5:1 | ✅ |
| WhatsApp demo: "what your customer sees" caption | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| WhatsApp demo: empty field placeholder | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| WhatsApp demo: send button icon | #000000 on #25d366 | 10.59:1 | 3:1 | ✅ |
| Map: "your business is here" label | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Map: pin button (orange on map) | #ff4d1c on #1c1916 | 5.28:1 | 3:1 | ✅ |
| FAQ question | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| FAQ question: hover | #ff4d1c on #000000 | 6.33:1 | 3:1 | ✅ |
| FAQ answer | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| FAQ +/− icon border (closed) | #d9d2c7 on #000000 | 13.99:1 | 3:1 | ✅ |
| FAQ +/− icon (closed) | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| FAQ −  icon (open, on orange) | #000000 on #ff4d1c | 6.33:1 | 3:1 | ✅ |
| Contact: channel label | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Contact: channel value | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Contact: channel value hover | #ff4d1c on #000000 | 6.33:1 | 4.5:1 | ✅ |
| Contact: channel icon | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| Contact: channel icon hover (on orange) | #000000 on #ff4d1c | 6.33:1 | 3:1 | ✅ |
| Form labels and "(required)" | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Form input text | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Form placeholders (dust at 80%) | #ece7de @80% on #000000 | 10.72:1 | 4.5:1 | ✅ |
| Form field border (underline) | #d9d2c7 on #000000 | 13.99:1 | 3:1 | ✅ |
| Form field border: focus / error | #ff4d1c on #000000 | 6.33:1 | 3:1 | ✅ |
| Form error messages + icon | #ff4d1c on #000000 | 6.33:1 | 4.5:1 | ✅ |
| Form success message | #25d366 on #000000 | 10.59:1 | 4.5:1 | ✅ |
| Consent text | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Consent link | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Submit button (text on cream) | #000000 on #ffffff | 21.00:1 | 4.5:1 | ✅ |
| Submit button: hover (text on orange) | #000000 on #ff4d1c | 6.33:1 | 4.5:1 | ✅ |
| Submit button: disabled (50%) | #000000 on #ffffff | 21.00:1 | — | ✅ (Disabled controls are exempt (WCAG 1.4.3)) |
| Footer text and links | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Footer links: hover | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Legal pages: body | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Legal pages: links | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Legal pages: link hover | #ff4d1c on #000000 | 6.33:1 | 4.5:1 | ✅ |
| Skip link (on cream) | #000000 on #ffffff | 21.00:1 | 4.5:1 | ✅ |
| Focus ring on dark page | #ff4d1c on #000000 | 6.33:1 | 3:1 | ✅ |
| Focus ring on dark-grey sections | #ff4d1c on #000000 | 6.33:1 | 3:1 | ✅ |
| Floating WhatsApp: icon (white on green) | #ffffff on #1da851 | 3.10:1 | 3:1 | ✅ |
| Floating WhatsApp: button vs page | #1da851 on #000000 | 6.77:1 | 3:1 | ✅ |
| Accessibility button: icon (on cream) | #000000 on #ffffff | 21.00:1 | 3:1 | ✅ |
| Accessibility button vs page | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| Accessibility menu: text | #ffffff on #000000 | 21.00:1 | 4.5:1 | ✅ |
| Accessibility menu: small note | #ece7de on #000000 | 17.05:1 | 4.5:1 | ✅ |
| Accessibility menu: switch off (border) | #d9d2c7 on #000000 | 13.99:1 | 3:1 | ✅ |
| Accessibility menu: switch on (orange track) | #ff4d1c on #000000 | 6.33:1 | 3:1 | ✅ |
| Accessibility menu: chosen text size (on orange) | #000000 on #ff4d1c | 6.33:1 | 4.5:1 | ✅ |
| Highlight-links outline (mustard) | #e8b931 on #000000 | 11.42:1 | 3:1 | ✅ |
| Mobile menu links | #ffffff on #000000 | 21.00:1 | 3:1 | ✅ |
| Phone illustrations: small green status text (decorative) | #25d366 on #000000 | 10.59:1 | 4.5:1 | ✅ |
| Phone illustrations: mustard labels (decorative) | #e8b931 on #000000 | 11.42:1 | 4.5:1 | ✅ |

High contrast: 0 failing of 85


## Depth layer: contrast over the glows (2026-10-24)

The background photos were removed. Depth now comes from CSS only: the site-wide film grain, slow orange radial glows behind the hero headline, the "How it works" heading and the contact section, and faint grid lines in the hero. Measured on the rendered page with all content hidden. Each glow was checked at the start, middle and end of its drift, using the brightest point after a 2px blur, which averages out single grain specks.

| Section | Glow strength | Grey text (4.5) | Cream text | Small orange text (4.5) | Borders (3) |
|---|---|---|---|---|---|
| Hero (+ grid lines at 4%) | 14% | 5.93 | 13.36 | 4.73 | 3.35 |
| How it works | 10% | 5.72 | 12.90 | 4.57 | 3.24 |
| Contact (two glows, 10% + 6%) | 10% / 6% | 5.68 | 12.79 | 4.53 | 3.21 |

The same values hold in Hebrew and English at 1440px and 390px. The glows don't move under reduced motion, freeze when "Stop animations" is on, and are hidden in high-contrast mode, along with the grain.
