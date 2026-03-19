# 🚀 Quick Start Guide (5 Minutes)

## For Someone New to This Project

### What is HakkiEye?
✅ **A free PWA app** that verifies CCTV installations in India

---

## ⚡ Quick Start (Copy-Paste Ready)

### 1️⃣ Clone & Install (2 minutes)
```bash
git clone https://github.com/sandeephakki/cctvvalidation.git
cd cctvvalidation
npm install
```

### 2️⃣ Run Locally (1 minute)
```bash
npm run dev
```
✅ Opens automatically at `http://localhost:5174/`

### 3️⃣ Test Features
- Click around the app
- Test all screens
- Open DevTools (`F12`) to check console for errors

### 4️⃣ Build for Production (1 minute)
```bash
npm run build
```
✅ Creates `dist/` folder ready to deploy

---

## 📚 What Services Do What?

```
┌─────────────────────────────────────────────┐
│           HAKKIEYE ARCHITECTURE             │
├─────────────────────────────────────────────┤
│                                             │
│  Frontend: React + Vite                    │
│  ├─ Hosted on: Netlify                     │
│  ├─ URL: https://hakkieye.netlify.app/     │
│  └─ Cost: FREE ($0)                        │
│                                             │
│  Backend Proxy: Cloudflare Worker          │
│  ├─ Deploys to: Cloudflare Workers         │
│  ├─ Purpose: Secure HTTPS bridge           │
│  └─ Cost: FREE (100k requests/day)         │
│                                             │
│  Version Control: Git                      │
│  ├─ Hosted on: GitHub                      │
│  ├─ URL: github.com/sandeephakki/...       │
│  └─ Cost: FREE                             │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📊 All Services (FREE Tier)

| What | Where | Free Limit | Setup Time |
|------|-------|-----------|-----------|
| **Code** | GitHub | Unlimited | 5 min |
| **Frontend** | Netlify | 100 GB/month | 5 min |
| **Backend** | Cloudflare Workers | 100k requests/day | 10 min |
| **Build Tool** | Vite (npm) | Unlimited | 2 min |

---

## 🔧 Common Commands

```bash
# Development
npm run dev          # Start dev server (hot reload)
npm run build        # Build for production
npm run preview      # Preview production build

# Git
git add .            # Stage changes
git commit -m "msg"  # Commit with message
git push origin main # Push to GitHub

# Deployment (Manual)
# Netlify: https://app.netlify.com → Trigger deploy
# Worker: npx wrangler deploy worker/index.js --name hakkieye-proxy
```

---

## 📁 Key Folders

```
src/
├── screens/     → 6 main app pages
├── components/  → Reusable React components
├── services/    → API calls & business logic
├── utils/       → Helper functions
└── styles/      → CSS files

worker/
└── index.js     → Cloudflare Worker proxy code

dist/           → Production build (auto-generated)
```

---

## ✅ Deployment Checklist

- [ ] Run locally: `npm run dev`
- [ ] Build: `npm run build`
- [ ] Push to GitHub: `git push origin main`
- [ ] Deploy Frontend: https://app.netlify.com (click "Trigger deploy")
- [ ] Deploy Worker: `npx wrangler deploy worker/index.js --name hakkieye-proxy`

---

## 🆘 Help!

**App won't start?**
```bash
npm install          # Reinstall dependencies
npm run dev          # Try again
```

**Port already in use?**
- Vite auto-uses next port (5174, 5175, etc.)

**Changes not showing?**
- Check console: `F12` → Console tab
- Refresh browser: `Cmd+R` (Mac) or `Ctrl+R` (Windows)

**Need more details?**
→ Read `SETUP_GUIDE.md` in the project root

---

## 📞 Links

- **GitHub**: https://github.com/sandeephakki/cctvvalidation
- **Live App**: https://hakkieye.netlify.app/
- **Netlify Dashboard**: https://app.netlify.com/projects/hakkyeye

---

**Total Cost**: 💰 $0/month (Forever Free!)
