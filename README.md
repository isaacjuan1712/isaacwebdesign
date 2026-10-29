# יצחק – בניית אתרים לעסקים

The portfolio and service site of Yitzhak (Isaac), a web developer building sites for local businesses. It's bilingual: Hebrew (right-to-left, at `/`) and English (left-to-right, at `/en`). Built with Next.js 16 (App Router), Tailwind CSS 4, Motion and Lenis.

## Editing the texts

Every word on the site, in both languages, lives in two files:

- `src/messages/he.json`: Hebrew
- `src/messages/en.json`: English

Edit the text between the quotes and save. Keep the keys (the part before the colon) the same in both files; the build fails if one language is missing a key. Inside texts you can use `<b>bold</b>`, and on the legal pages `{name}`, `{email}` and `{phone}` become your details. In Hebrew texts, wrap English words in `<en>…</en>` so screen readers pronounce them correctly.

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

`.env*` files are git-ignored, except `.env.example`.

The site's public address (`https://isaacwebdesign.vercel.app`) is not an environment variable: it's `siteUrl` in `src/lib/site.ts`, the one value behind canonical links, hreflang, `sitemap.xml`, `robots.txt`, share previews and structured data.

## Deploy on Vercel

1. Push the repository to GitHub.
2. On [vercel.com](https://vercel.com), choose **Add New → Project** and import the repository. Vercel detects Next.js; keep the default settings.
3. Under **Settings → Environment Variables**, add `NEXT_PUBLIC_WEB3FORMS_KEY`.
4. Deploy. If you later connect your own domain, change `siteUrl` in `src/lib/site.ts` to it and redeploy so the sitemap and canonical links use it.

Security headers (CSP, `X-Frame-Options`, `Referrer-Policy` and more) are set in `next.config.ts` and apply on Vercel automatically. If you ever add a new outside service (analytics, maps, embeds), add its domain to the CSP there, or the browser will block it.

## Where things are

| What | Where |
|---|---|
| All texts, both languages (including legal pages and "last updated" dates) | `src/messages/he.json`, `src/messages/en.json` |
| Phone, email, WhatsApp number | `src/lib/site.ts` |
| Home page sections | `src/components/` (`Hero`, `About`, `Process`, `Included`, `Contact`) |
| Privacy policy | `/privacy` and `/en/privacy` (texts under `"privacy"` in the JSON files) |
| Accessibility statement | `/accessibility` and `/en/accessibility` (texts under `"accessibility"`) |
| Pages and layout | `src/app/[locale]/` |
| Language routing (Hebrew at `/`, English at `/en`, remembered choice) | `src/proxy.ts` |
| 404 page | `src/app/[locale]/not-found.tsx` |
| SEO: `robots.txt`, `sitemap.xml` (both languages, with hreflang), icons | `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/*.png` |
| Share images | `public/og-he.png`, `public/og-en.png` |
| Accessibility menu and header pause button | `src/components/A11yMenu.tsx`, `src/components/Header.tsx` |
| Saved visitor preferences (text size, contrast, paused motion...) | `src/lib/a11y.ts`, styles at the end of `src/app/globals.css` |
| "How it works" phone animations | `src/components/StepScreens.tsx` |
| Security headers | `next.config.ts` |
| Launch audit and its status | `AUDIT.md` |
| Fonts, images, packages and their licenses | `LICENSES.md` |

The privacy policy and accessibility statement are drafts. Have a lawyer review them before taking on paying clients.
