# HakkiEye v3 👁

> **Scan. See. Know.** — Connect to your CCTV DVR/NVR by IP, read what's physically installed, generate a clean factual certificate.

## What it does
Connect to your DVR/NVR on your local WiFi → auto-reads device info, camera resolutions, and storage → generates a sharable Installation Certificate with a unique ID. Mirror principle: shows facts only, no comparisons, no verdicts.

## Setup (3 commands)
```bash
git clone https://github.com/sandeephakki/cctvvalidation.git && cd cctvvalidation
npm install
cp .env.example .env  # Add your worker URL
npm run dev
```

## Worker setup
```bash
npm install -g wrangler
wrangler login
wrangler deploy worker/index.js --name hakkieye-proxy
wrangler secret put ALLOWED_ORIGIN   # Enter your Netlify URL
```

## Deploy
Netlify: connect GitHub repo → Build: `npm run build` → Publish: `dist`

## Privacy
Credentials (IP, username, password) exist in React state only during the scan. They are wiped (`CLEAR_CREDENTIALS`) before the certificate screen. Never written to localStorage. Never in the certificate, PDF, or WhatsApp text.

## Contribute a translation
See `TRANSLATE.md` — Phase 2.

## Licence
MIT — Sandeep Hakki 2026
