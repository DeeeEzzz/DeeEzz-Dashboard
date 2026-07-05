# DeeEzz Dashboard

A modern, dark-themed financial portfolio dashboard built with **React + TypeScript + Tailwind CSS**, auto-deployed to [deeezz.com](https://www.deeezz.com) via GitHub Actions.

---

## What's in the box

| Feature | Details |
|---|---|
| Portfolio overview | Total value, unrealized P&L, daily change, position count |
| Performance chart | Interactive 24-month line chart vs. S&P 500 benchmark |
| Asset allocation | Donut chart with percentage breakdown |
| Holdings table | Avg cost, current price, gain/loss per position |
| Watchlist | Live-style price table with 7-day sparklines |
| Transaction feed | Recent buys, sells, and dividends |
| Responsive layout | Collapsible sidebar on desktop, top bar on mobile |

---

## Tech stack

- [Vite](https://vitejs.dev/) — fast build tool
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [Recharts](https://recharts.org/) — chart library
- [Lucide React](https://lucide.dev/) — icon set
- [GitHub Actions](https://github.com/features/actions) — CI/CD
- [Hostinger](https://www.hostinger.com/) — hosting via FTP deploy

---

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build    # production build → dist/
npm run preview  # preview the build locally
```

---

## How the deployment pipeline works

```
You push to main
       │
       ▼
GitHub Actions triggers
       │
       ├─ Installs Node 22
       ├─ Runs npm ci
       ├─ Runs npm run build  →  dist/ folder
       │
       └─ FTP-Deploy-Action uploads dist/ → public_html/ on Hostinger
                                           (your domain serves it)
```

Every push to `main` automatically updates your live site at **www.deeezz.com**.

---

## One-time setup: connect GitHub → Hostinger

You only need to do this once.

### Step 1 — Get your Hostinger FTP credentials

1. Log in to **hPanel** at [hpanel.hostinger.com](https://hpanel.hostinger.com)
2. Go to **Files → FTP Accounts**
3. Note (or create) an FTP account — you need:
   - **FTP server** (e.g. `ftp.deeezz.com` or your server's IP)
   - **FTP username**
   - **FTP password**

### Step 2 — Add secrets to GitHub

1. Go to your repo on GitHub → **Settings → Secrets and variables → Actions**
2. Add three **Repository secrets**:

| Secret name | Value |
|---|---|
| `FTP_SERVER` | e.g. `ftp.deeezz.com` |
| `FTP_USERNAME` | your FTP username |
| `FTP_PASSWORD` | your FTP password |

### Step 3 — Push to main and watch it deploy

```bash
git push origin main
```

Go to **Actions** tab on GitHub to watch the workflow run. When it turns green, visit **www.deeezz.com** — your dashboard is live.

---

## Project structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Nav sidebar (desktop) + top bar (mobile)
│   ├── StatCard.tsx         # Summary metric cards
│   ├── PerformanceChart.tsx # Line chart (portfolio vs benchmark)
│   ├── AllocationChart.tsx  # Donut chart
│   ├── HoldingsTable.tsx    # Portfolio positions table
│   ├── Watchlist.tsx        # Market watchlist with sparklines
│   └── TransactionFeed.tsx  # Recent activity feed
├── data/
│   └── mockData.ts          # All mock data — replace with real API calls
├── App.tsx                  # Root layout
├── main.tsx                 # React entry point
└── index.css                # Tailwind import
.github/
└── workflows/
    └── deploy.yml           # CI/CD: build + FTP deploy on push to main
```

---

## Next steps / ideas

- [ ] Connect a real market data API (e.g. [Polygon.io](https://polygon.io), [Alpha Vantage](https://www.alphavantage.co/), or [Yahoo Finance via RapidAPI](https://rapidapi.com/))
- [ ] Add a dark/light mode toggle
- [ ] Persist portfolio data in a backend (e.g. Supabase or PlanetScale)
- [ ] Add authentication so only you can see your real data
- [ ] Add more chart types (candlestick, bar, area)
- [ ] Enable push notifications for price alerts
