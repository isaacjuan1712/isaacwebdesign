# Licenses and sources

Everything this site ships or depends on, with where it comes from and its license. Last checked: 2026-10-24.

## Fonts

| Font | Use | Source | License |
|---|---|---|---|
| Karantina (weight 700) | Headlines | [Google Fonts](https://fonts.google.com/specimen/Karantina), self-hosted at build time by `next/font` | SIL Open Font License 1.1 |
| Anton (400) | English headlines | [Google Fonts](https://fonts.google.com/specimen/Anton), self-hosted at build time by `next/font` | SIL Open Font License 1.1 |
| Assistant (variable) | Body text, Hebrew and English | [Google Fonts](https://fonts.google.com/specimen/Assistant), self-hosted at build time by `next/font` | SIL Open Font License 1.1 |

No "free for personal use" fonts are used.

## Images and illustrations

| Asset | Source | License |
|---|---|---|
| `src/app/icon.png`, `src/app/apple-icon.png` | Made for this site (the letters "יצ" set in Karantina) | Owner's own work |
| `public/og-he.png`, `public/og-en.png` (share images) | Made for this site (headline set in Karantina / Anton and Assistant) | Owner's own work |
| Phone mock-ups, mini websites, street map, calendar, chat bubbles | Drawn in code (HTML/CSS/SVG) for this site | Owner's own work |
| Film-grain texture (`globals.css`) | Generated in code by an SVG `feTurbulence` filter | Owner's own work |

The site has no photos, stock images or videos.

## Icons

| Icon | Source | License / notes |
|---|---|---|
| WhatsApp logo (`WhatsAppIcon` in `src/components/icons.tsx`) | Path data as published by [Simple Icons](https://simpleicons.org/?q=whatsapp) | Path data is CC0. WhatsApp is a trademark of Meta; it's used only to label links that open WhatsApp, as WhatsApp's brand guidelines allow |
| Mail, phone, check, pin, spark, error, play/pause icons | Drawn for this site as inline SVG | Owner's own work |

## npm packages shipped in the site (production dependencies)

| Package | License | Repository |
|---|---|---|
| `next@16.4.2` | MIT | https://github.com/vercel/next.js |
| `react@19.3.0`, `react-dom@19.3.0`, `scheduler@0.28.0` | MIT | https://github.com/react/react |
| `motion@14.6.0`, `framer-motion@14.6.0`, `motion-dom@14.6.0`, `motion-utils@14.6.0` | MIT | https://github.com/motiondivision/motion |
| `lenis@1.3.26` | MIT | https://github.com/darkroomengineering/lenis |
| `@next/env`, `@next/swc-*` | MIT | https://github.com/vercel/next.js |
| `@swc/helpers@0.5.23` | Apache-2.0 | https://github.com/swc-project/swc |
| `styled-jsx@5.1.6` | MIT | https://github.com/vercel/styled-jsx |
| `postcss@8.5.23` | MIT | https://github.com/postcss/postcss |
| `nanoid@3.3.20` | MIT | https://github.com/ai/nanoid |
| `picocolors@1.1.1`, `semver@7.8.5` | ISC | — |
| `source-map-js@1.2.2` | BSD-3-Clause | https://github.com/7rulnik/source-map-js |
| `tslib@2.8.1` | 0BSD | https://github.com/Microsoft/tslib |
| `client-only@0.0.1` | MIT | — |
| `baseline-browser-mapping@2.11.31`, `detect-libc@2.1.2` | Apache-2.0 | — |
| `caniuse-lite@1.0.30001819` | CC-BY-4.0 | https://github.com/browserslist/caniuse-lite |
| `sharp@0.35.5` | Apache-2.0 | https://github.com/lovell/sharp |
| `@img/sharp-*` (platform binaries with libvips) | Apache-2.0 AND LGPL-3.0-or-later | https://github.com/lovell/sharp |

Development-only tools (not shipped): `tailwindcss` (MIT), `@tailwindcss/turbopack` (MIT), `typescript` (Apache-2.0), `eslint` and `eslint-config-next` (MIT), `@types/*` (MIT).

## License check

`npx license-checker --summary` (2026-10-24), all packages including dev tools: 308 MIT, 21 Apache-2.0, 15 ISC, 7 BSD-2-Clause, 3 MPL-2.0, 2 BSD-3-Clause, 1 each of Python-2.0, CC-BY-4.0, CC0-1.0, BlueOak-1.0.0, 0BSD, plus the two LGPL entries below. "UNLICENSED" is this project itself (private).

- **No GPL or AGPL packages.**
- **LGPL-3.0 (`@img/sharp-*`):** the libvips image library that Next.js uses on the server to optimize images. It's dynamically linked, runs only on the server or at build time, and is never sent to visitors' browsers. It doesn't restrict distributing this site. No action needed.
- **CC-BY-4.0 (`caniuse-lite`):** browser-support data used at build time. The attribution ships inside the package. No action needed.

## Content

All text on the site was written for this site. Nothing is copied from other businesses or websites: no logos, slogans or distinctive designs. The example chat messages, the "your-business.co.il" address and the form placeholders ("ישראל ישראלי", "050-000-0000") are fictional illustrations.
