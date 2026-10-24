# יצחק – בניית אתרים לעסקים

The portfolio and service site of Yitzhak, a web developer building sites for local businesses. It's in Hebrew, right-to-left, built with Next.js 16 (App Router), Tailwind CSS 4, Motion and Lenis.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

Other scripts:

| Command | What it does |
|---|---|
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serves the production build |
| `npm run lint` | ESLint |

## Environment variables

| Variable | Required | What it's for |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_KEY` | Yes | Delivers the contact form to your email through [Web3Forms](https://web3forms.com). Public by design. |
| `NEXT_PUBLIC_SITE_URL` | Once you have a domain | The site's public address, for canonical links, `sitemap.xml`, `robots.txt` and share previews. On Vercel it falls back to the production URL automatically. |

`.env*` files are git-ignored, except `.env.example`.

## Deploy on Vercel

1. Push the repository to GitHub.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repository. Vercel detects Next.js; keep the default settings.
3. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_WEB3FORMS_KEY`, and `NEXT_PUBLIC_SITE_URL` once you have a domain.
4. Deploy. After connecting your own domain, set `NEXT_PUBLIC_SITE_URL` to it and redeploy so the sitemap and canonical links use it.

Security headers (CSP, `X-Frame-Options`, `Referrer-Policy` and more) are set in `next.config.ts` and apply on Vercel automatically. If you ever add a new outside service (analytics, maps, embeds), add its domain to the CSP there, or the browser will block it.

## Where things are

| What | Where |
|---|---|
| Name, phone, email, WhatsApp message | `src/lib/site.ts` |
| Home page sections | `src/components/` (`Hero`, `About`, `Process`, `Included`, `Contact`) |
| Privacy policy (מדיניות פרטיות) | `src/app/privacy/page.tsx` → `/privacy` |
| Accessibility statement (הצהרת נגישות) | `src/app/accessibility/page.tsx` → `/accessibility` |
| "Last updated" dates on the legal pages | `legalDates` in `src/lib/site.ts` |
| 404 page | `src/app/not-found.tsx` |
| SEO: `robots.txt`, `sitemap.xml`, icons, share image | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/*.png` |
| Security headers | `next.config.ts` |
| Launch audit and its status | `AUDIT.md` |
| Fonts, images, packages and their licenses | `LICENSES.md` |

The privacy policy and accessibility statement are drafts. Have a lawyer review them before taking on paying clients.
