import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const FINNHUB_KEY = process.env.FINNHUB_API_KEY;
const NEWS_KEY = process.env.NEWS_API_KEY;

app.use(express.json());

// ─── Symbol maps ─────────────────────────────────────────────────────────────

const FINNHUB_SYMBOLS = ['AMD', 'MSFT', 'NVDA', 'PWR', 'TSM', 'IBIT', 'FBTC', 'OUNZ', 'GDX', 'POWR'];
const FINNHUB_CRYPTO  = 'BINANCE:BTCUSDT';

// id → Yahoo Finance symbol
const YAHOO_SYMBOLS = {
  GOLD:   'GC=F',
  SILVER: 'SI=F',
  OIL:    'CL=F',
  DXY:    'DX-Y.NYB',
  DAX:    '^GDAXI',
  SP500:  '^GSPC',
  NASDAQ: '^IXIC',
  DJIA:   '^DJI',
};

// ─── Price history (sparklines) ───────────────────────────────────────────────

const priceHistory = new Map();
const MAX_HIST = 20;

function pushHistory(id, price) {
  if (!price || isNaN(price)) return;
  if (!priceHistory.has(id)) priceHistory.set(id, []);
  const arr = priceHistory.get(id);
  arr.push(price);
  if (arr.length > MAX_HIST) arr.shift();
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const cache = new Map();

function getCached(key) {
  const e = cache.get(key);
  return e && Date.now() - e.ts < e.ttl ? e.data : null;
}

function setCached(key, data, ttl) {
  cache.set(key, { data, ts: Date.now(), ttl });
}

// ─── Fetchers ─────────────────────────────────────────────────────────────────

async function finnhubQuote(symbol) {
  const r = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_KEY}`
  );
  const d = await r.json();
  if (!d.c) return null;
  return { price: d.c, change: d.d, changePct: d.dp, high: d.h, low: d.l };
}

async function yahooQuote(id, yahooSymbol) {
  const r = await fetch(
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=10d`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }
  );
  const d = await r.json();
  const result = d?.chart?.result?.[0];
  if (!result) return null;

  const meta    = result.meta;
  const closes  = (result.indicators?.quote?.[0]?.close ?? []).filter(Boolean);
  const price   = meta.regularMarketPrice;
  const prev    = meta.previousClose ?? meta.chartPreviousClose ?? closes[closes.length - 2];
  const change  = price - prev;
  const changePct = prev ? (change / prev) * 100 : 0;

  // Seed price history with Yahoo's historical closes on first load
  if ((priceHistory.get(id) ?? []).length === 0) {
    closes.forEach(c => pushHistory(id, c));
  }

  return { price, change, changePct, high: meta.regularMarketDayHigh, low: meta.regularMarketDayLow };
}

async function forexData() {
  // Fetch 7-day time series for EUR, GBP, CHF, JPY from Frankfurter
  const end   = new Date();
  const start = new Date(end - 8 * 86400_000);
  const fmt   = d => d.toISOString().split('T')[0];

  const r = await fetch(
    `https://api.frankfurter.app/${fmt(start)}..${fmt(end)}?from=USD&to=EUR,GBP,CHF,JPY`
  );
  const d = await r.json();
  const dates = Object.keys(d.rates).sort();
  if (dates.length < 2) return {};

  const latest = d.rates[dates[dates.length - 1]];
  const prev   = d.rates[dates[dates.length - 2]];

  const result = {};

  for (const [ccy, rate] of Object.entries(latest)) {
    // Convert USD-per-1 → display price
    // JPY: show as USD/JPY (e.g. 158.43) — already in that direction from Frankfurter
    // EUR, GBP, CHF: show as X/USD = 1/rate
    const isJPY = ccy === 'JPY';
    const price    = isJPY ? rate          : 1 / rate;
    const prevRate = prev[ccy];
    const prevPrice = isJPY ? prevRate     : 1 / prevRate;
    const change    = price - prevPrice;
    const changePct = prevPrice ? (change / prevPrice) * 100 : 0;

    // Seed sparkline from time series
    if ((priceHistory.get(ccy) ?? []).length === 0) {
      dates.forEach(dt => {
        const r2 = d.rates[dt]?.[ccy];
        if (r2) pushHistory(ccy, isJPY ? r2 : 1 / r2);
      });
    }

    result[ccy] = { price, change, changePct };
  }

  return result;
}

// ─── Aggregate all market data ────────────────────────────────────────────────

async function fetchAllMarketData() {
  const out = {};

  // Finnhub stocks + ETFs
  await Promise.allSettled(
    FINNHUB_SYMBOLS.map(async sym => {
      const q = await finnhubQuote(sym);
      if (q) {
        pushHistory(sym, q.price);
        out[sym] = { ...q, sparkline: [...(priceHistory.get(sym) ?? [])] };
      }
    })
  );

  // Finnhub BTC
  try {
    const q = await finnhubQuote(FINNHUB_CRYPTO);
    if (q) {
      pushHistory('BTC', q.price);
      out['BTC'] = { ...q, sparkline: [...(priceHistory.get('BTC') ?? [])] };
    }
  } catch {}

  // Yahoo Finance
  await Promise.allSettled(
    Object.entries(YAHOO_SYMBOLS).map(async ([id, yahooSym]) => {
      const q = await yahooQuote(id, yahooSym);
      if (q) {
        pushHistory(id, q.price);
        out[id] = { ...q, sparkline: [...(priceHistory.get(id) ?? [])] };
      }
    })
  );

  // Frankfurter forex
  try {
    const fx = await forexData();
    for (const [ccy, q] of Object.entries(fx)) {
      pushHistory(ccy, q.price);
      out[ccy] = { ...q, sparkline: [...(priceHistory.get(ccy) ?? [])] };
    }
  } catch {}

  return out;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/api/market-data', async (req, res) => {
  try {
    const cached = getCached('market-data');
    if (cached) return res.json(cached);
    const data = await fetchAllMarketData();
    setCached('market-data', data, 30_000);
    res.json(data);
  } catch (err) {
    console.error('Market data error:', err.message);
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

app.get('/api/news', async (req, res) => {
  try {
    const cached = getCached('news');
    if (cached) return res.json(cached);
    if (!NEWS_KEY) return res.status(500).json({ error: 'NEWS_API_KEY not set' });
    const r = await fetch(
      `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=20&apiKey=${NEWS_KEY}`
    );
    const d = await r.json();
    if (d.status !== 'ok') return res.status(502).json({ error: d.message });
    setCached('news', d.articles, 300_000);
    res.json(d.articles);
  } catch (err) {
    console.error('News error:', err.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), finnhub: !!FINNHUB_KEY, newsapi: !!NEWS_KEY });
});

// ─── Serve React app ──────────────────────────────────────────────────────────

app.use(express.static(join(__dirname, '../dist')));
app.get('*', (_req, res) => res.sendFile(join(__dirname, '../dist/index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`DeeEzz Market Dashboard on port ${PORT}`));
