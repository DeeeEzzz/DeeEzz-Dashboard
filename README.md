# DeeEzz Dashboard

A modern, dark-themed financial portfolio dashboard. Built with **React + TypeScript + Tailwind CSS** on the frontend and **Node.js + Express** on the backend, deployed to [deeezz.com](https://www.deeezz.com) via Hostinger's GitHub auto-deployment.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Node.js + Express |
| Hosting | Hostinger (Node.js) |
| Deploy | Hostinger GitHub auto-deploy on push to `main` |

---

## Project structure

```
/
├── src/                    ← React frontend source
│   ├── components/         ← UI components
│   ├── data/               ← Mock data (replace with real API calls)
│   ├── App.tsx
│   └── main.tsx
├── server/
│   └── index.js            ← Express server (serves frontend + API routes)
├── public/
├── index.html
├── vite.config.ts
└── package.json
```

---

## Local development

```bash
npm install
npm run build    # builds React app into dist/
npm start        # starts Express server on http://localhost:3000
```

For frontend live-reload during development:
```bash
npm run dev      # Vite dev server on http://localhost:5173
```

---

## API routes

| Route | Description |
|---|---|
| `GET /api/health` | Server health check |
| `GET /api/quotes` | Market quotes (stub — real data coming soon) |
| `GET /api/news` | Financial news feed (stub — real data coming soon) |

All other routes serve the React app (SPA fallback).

---

## Deployment

Hostinger auto-deploys on every push to `main`:

1. `npm install`
2. `npm run build` — compiles React → `dist/`
3. `npm start` — Express serves `dist/` + API routes

No GitHub Actions or FTP needed — Hostinger handles it natively.

---

## Next steps

- [ ] Connect a real market data API (Polygon.io, Finnhub)
- [ ] Add a financial news feed (NewsAPI, Benzinga)
- [ ] Add user authentication
- [ ] Store portfolio data in MySQL (included in Hostinger plan)
- [ ] Add price alerts
