# HakkiEye 👁

> **The eye that never misses** — A free, multilingual PWA that helps Indian users verify their CCTV installation against their vendor quotation.

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## What it does

HakkiEye is a **mirror, not a judge**. It guides you step-by-step through checking:
- 📷 Camera picture quality (resolution vs quoted MP)
- 💾 HDD storage size (actual GB vs quoted)
- 📅 HDD age (are there recordings before your install date?)
- 🔢 Number of cameras (active vs quoted)

It generates a calm, factual **Installation Certificate** with a unique ID — like a pre-delivery car inspection report. No accusations. No data collected. Everything stays on your device.

## Architecture

```
src/
├── i18n/strings.js          ← All text in all 9 languages
├── context/AppContext.jsx    ← Global state (useReducer)
├── screens/                 ← 6 screens / routes
├── components/              ← Reusable UI components
├── hooks/                   ← useTranslation, useAuditLogic
├── utils/                   ← fraudDetection, pdfGenerator, whatsappShare
├── services/                ← auditService (localStorage today, API-ready tomorrow)
└── config/features.js       ← Phase 2 feature flags (all false)
```

## 🚀 Live Demo

Visit the deployed app: **[https://hakkieye.netlify.app/](https://hakkieye.netlify.app/)**

## Quick setup (3 commands)

```bash
git clone https://github.com/sandeephakki/cctvvalidation.git
cd cctvvalidation
npm install
npm run dev
```

Then open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deploy to Netlify

The app is automatically configured for Netlify deployment via `netlify.toml`. 
Deployed at: **[https://hakkieye.netlify.app/](https://hakkieye.netlify.app/)**

1. Push to GitHub
2. Connect repo to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Done — deploys automatically on every push

## Languages

Phase 1 ships with **English** (complete). All 8 other languages have the architecture in place — strings are keyed and ready. See `TRANSLATE.md` to contribute a translation.

| Language  | Status |
|-----------|--------|
| English   | ✅ Complete |
| Kannada   | 🔵 Architecture ready — community contribution welcome |
| Hindi     | 🔵 Architecture ready |
| Marathi   | 🔵 Architecture ready |
| Tamil     | 🔵 Architecture ready |
| Telugu    | 🔵 Architecture ready |
| Gujarati  | 🔵 Architecture ready |
| Punjabi   | 🔵 Architecture ready |
| Bengali   | 🔵 Architecture ready |

## Adding real app screenshots (Phase 1.5)

1. Take annotated screenshots from XMEye / iCSee / Tapo / Imou etc.
2. Place in `public/screenshots/{cameratype}/`
3. Update `GuidedCheckScreen.jsx` to use `<img>` instead of the SVG placeholder

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | React 18 |
| Build | Vite 5 |
| PWA | vite-plugin-pwa |
| Routing | React Router DOM 6 |
| State | React Context + useReducer |
| Styling | CSS Modules + CSS variables |
| PDF | jsPDF |
| Icons | Lucide React |
| Font | Noto Sans (Google Fonts) |

## Privacy

- **No data ever leaves the device** — no server, no API, no database
- No user accounts, no login, no analytics, no tracking
- localStorage used only for language preference
- Fully offline after first load

## Licence

MIT — free to use, free to modify, free to deploy.

Built with ❤️ by [Sandeep Hakki](https://github.com/your-username) — Bangalore, India.
