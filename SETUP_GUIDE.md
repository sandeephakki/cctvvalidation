# HakkiEye v3.0.0 - Complete Setup & Deployment Documentation

## 📋 Project Overview

**HakkiEye** is a Progressive Web App (PWA) that helps Indian users verify their CCTV installation against vendor quotations. This document provides a complete step-by-step guide for setting up, developing, and deploying this project.

---

## 🛠️ Prerequisites

Before starting, ensure you have the following installed on your machine:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Verify: `node --version` & `npm --version`

2. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

3. **GitHub Account**
   - Sign up: https://github.com/

4. **Netlify Account** (Free tier recommended)
   - Sign up: https://app.netlify.com/

5. **Cloudflare Account** (Free tier recommended)
   - Sign up: https://dash.cloudflare.com/
   - For Cloudflare Workers deployment

6. **Code Editor** (VS Code recommended)
   - Download: https://code.visualstudio.com/

---

## 🎯 What Services Are Used & For What?

| Service | Purpose | Tier | Link |
|---------|---------|------|------|
| **GitHub** | Code repository & version control | Free | https://github.com/sandeephakki/cctvvalidation |
| **Netlify** | Frontend PWA hosting | Free (100GB/month bandwidth) | https://app.netlify.com/projects/hakkyeye |
| **Cloudflare Workers** | Backend proxy API | Free (100k requests/day) | https://dash.cloudflare.com/ |
| **Node.js + npm** | Runtime & package manager | Free (Open Source) | https://nodejs.org/ |
| **React** | Frontend framework | Free (Open Source) | https://react.dev/ |
| **Vite** | Build tool & dev server | Free (Open Source) | https://vitejs.dev/ |

---

## 📚 Step-by-Step Setup & Execution

### **PHASE 1: Initial Project Setup**

#### Step 1.1: Clone the Repository
```bash
git clone https://github.com/sandeephakki/cctvvalidation.git
cd cctvvalidation
```

#### Step 1.2: Install Dependencies
```bash
npm install
```
This installs all packages listed in `package.json`:
- React 18.2.0
- React Router DOM 6.22.0
- Vite 5.1.4
- Vite PWA Plugin 0.19.2
- jsPDF 2.5.1
- Lucide React Icons 0.383.0

---

### **PHASE 2: Local Development**

#### Step 2.1: Run Development Server
```bash
npm run dev
```
- **Output**: App runs on `http://localhost:5174/` (or next available port)
- **Features**: Hot reload, instant file changes visible
- **Ctrl + C** to stop the server

#### Step 2.2: Test the App Locally
- Open browser to displayed URL
- Test all features locally
- Check console for errors (`F12` → Console tab)

---

### **PHASE 3: Build for Production**

#### Step 3.1: Create Production Build
```bash
npm run build
```
- **Output**: Optimized `dist/` folder created
- **Build includes**:
  - Minified JS & CSS
  - Service Worker for PWA
  - Manifest for offline capability
  - Static assets optimized

#### Step 3.2: Preview Production Build Locally
```bash
npm run preview
```
- Tests production build locally before deployment
- Verifies everything works in production mode

---

### **PHASE 4: GitHub Setup & Version Control**

#### Step 4.1: Initialize Git (if not already done)
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
```

#### Step 4.2: Connect to GitHub Repository
```bash
git remote add origin https://github.com/sandeephakki/cctvvalidation.git
git push -u origin main
```

#### Step 4.3: Ongoing Development Workflow
```bash
# After making changes:
git add .
git commit -m "Describe your changes"
git push origin main
```

**Git serves as**: Version control, backup, and trigger for automated deployments

---

### **PHASE 5: Netlify Deployment (Frontend PWA)**

#### Step 5.1: Configure Netlify
Create `netlify.toml` in project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Step 5.2: Deploy to Netlify (Option A - UI)
1. Go to: https://app.netlify.com/projects/hakkyeye/deploys
2. Click **"Trigger deploy"** → **"Deploy site"**
3. Wait for build to complete
4. App live at: **https://hakkieye.netlify.app/**

#### Step 5.3: Deploy to Netlify (Option B - CLI)
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir dist
```

**What Netlify does**:
- Hosts the React PWA frontend
- Automatic HTTPS
- CDN global distribution
- Free SSL certificate

---

### **PHASE 6: Cloudflare Worker Deployment (Backend Proxy)**

The Cloudflare Worker acts as a secure proxy between the frontend and DVR devices.

#### Step 6.1: Install Wrangler CLI
```bash
npm install -g @cloudflare/wrangler
# OR
npx wrangler login
```

#### Step 6.2: Authenticate with Cloudflare
```bash
wrangler login
```
- Opens browser with OAuth login
- Authorizes Wrangler to deploy Workers
- One-time setup

#### Step 6.3: Deploy Worker Proxy
```bash
wrangler deploy worker/index.js --name hakkieye-proxy
```
- Deploys the proxy to Cloudflare Workers
- Worker endpoint: `https://hakkieye-proxy.<account>.workers.dev/`

#### Step 6.4: Set Security Secret
```bash
wrangler secret put ALLOWED_ORIGIN
# Paste: https://hakkieye.netlify.app/
```

**What the Worker does**:
- Acts as HTTPS proxy to DVR devices
- Enforces CORS security
- Validates requests
- Prevents direct device exposure
- Free tier: 100,000 requests/day

---

## 📁 Project Structure

```
hakkieye/
├── src/
│   ├── screens/          # 6 main app screens
│   │   ├── ConnectScreen.jsx
│   │   ├── ScanningScreen.jsx
│   │   ├── ResultsScreen.jsx
│   │   ├── CertificateScreen.jsx
│   │   └── ShareScreen.jsx
│   ├── components/       # Reusable React components
│   ├── services/         # API & business logic
│   ├── utils/            # Helper functions
│   ├── styles/           # CSS modules & global styles
│   ├── context/          # React Context for state
│   └── main.jsx         # Entry point
├── public/              # Static assets (icons, manifests)
├── worker/              # Cloudflare Worker code
│   └── index.js        # Proxy logic
├── dist/               # Production build (generated by `npm run build`)
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite configuration
├── index.html          # HTML entry point
├── netlify.toml        # Netlify build config
└── .gitignore         # Files to exclude from Git
```

---

## 🚀 Complete Deployment Checklist

### Local Development
- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Test all features at `http://localhost:5174/`

### GitHub
- [ ] Create GitHub account
- [ ] Create public repository
- [ ] Push code: `git push origin main`
- [ ] Verify at: https://github.com/sandeephakki/cctvvalidation

### Netlify (Frontend)
- [ ] Create Netlify account
- [ ] Configure `netlify.toml`
- [ ] Trigger deployment via Netlify dashboard OR CLI
- [ ] App live at: **https://hakkieye.netlify.app/**
- [ ] Set `ALLOWED_ORIGIN` environment variable

### Cloudflare Workers (Backend)
- [ ] Create Cloudflare account
- [ ] Run `wrangler login`
- [ ] Deploy: `wrangler deploy worker/index.js --name hakkieye-proxy`
- [ ] Set secret: `wrangler secret put ALLOWED_ORIGIN`
- [ ] Worker live at: `https://hakkieye-proxy.<account>.workers.dev/`

---

## 🔄 Development Workflow for Team Members

### First Time Setup
```bash
# 1. Clone repo
git clone https://github.com/sandeephakki/cctvvalidation.git
cd cctvvalidation

# 2. Install dependencies
npm install

# 3. Start development
npm run dev

# 4. Open browser
# http://localhost:5174/
```

### During Development
```bash
# After making changes
git add .
git commit -m "Feature: description of what you changed"
git push origin main

# Changes auto-deploy to Netlify (if auto-deploy is enabled)
# OR manually trigger: https://app.netlify.com/projects/hakkyeye/deploys
```

### Building for Production
```bash
npm run build      # Creates optimized dist/ folder
npm run preview    # Test production build locally
```

---

## 🔐 Security & Best Practices

### Environment Variables
- **ALLOWED_ORIGIN**: Set to Netlify URL for CORS security
- Never commit secrets to Git
- Use Cloudflare Workers secrets for sensitive data

### .gitignore Excludes
```
node_modules/
dist/
.env
.DS_Store
*.log
```

### CORS Security (Cloudflare Worker)
- Only allows requests from `https://hakkieye.netlify.app/`
- Blocks direct DVR access
- Returns 400/405 errors for invalid requests

---

## 📊 Cost Breakdown (All Free Tier)

| Service | Cost | Limit |
|---------|------|-------|
| GitHub | $0 | Unlimited repos |
| Netlify | $0 | 100 GB bandwidth/month |
| Cloudflare Workers | $0 | 100,000 requests/day |
| **Total** | **$0/month** | — |

---

## 🆘 Troubleshooting

### Port 5173 Already in Use
```bash
# Vite automatically uses 5174
npm run dev
# App will open on http://localhost:5174/
```

### GitHub Push Fails
```bash
# Check remote URL
git remote -v

# Update if needed
git remote set-url origin https://github.com/sandeephakki/cctvvalidation.git

# Push again
git push origin main
```

### Netlify Deploy Fails
1. Check build logs: https://app.netlify.com/projects/hakkyeye/deploys
2. Verify `netlify.toml` exists
3. Ensure `dist/` builds: `npm run build`

### Cloudflare Worker Authentication
```bash
# Re-authenticate if needed
wrangler logout
wrangler login
```

---

## 📞 Useful Links

- **GitHub Repository**: https://github.com/sandeephakki/cctvvalidation
- **Live Frontend**: https://hakkieye.netlify.app/
- **Netlify Dashboard**: https://app.netlify.com/projects/hakkyeye/deploys
- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **Netlify Docs**: https://docs.netlify.com/
- **Cloudflare Workers Docs**: https://developers.cloudflare.com/workers/

---

## 📝 Summary

This project uses:
- **React + Vite** for fast, modern frontend development
- **Netlify** for free PWA hosting with HTTPS
- **Cloudflare Workers** for free backend proxy with security
- **GitHub** for free version control and code backup
- **All services on free tier** — no hidden charges

**To hand this to someone new:**
1. Share this document
2. Give access to GitHub repository
3. They follow "First Time Setup" section
4. Everything else is automated (Netlify CI/CD)

---

**Project Status**: ✅ Production Ready | 🚀 Deployed | 💰 100% Free
