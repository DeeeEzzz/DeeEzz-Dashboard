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

// ─── Simple in-memory cache ───────────────────────────────────────────────────

const cache = new Map();

function getCached(key) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.ts < entry.ttl) return entry.data;
  return null;
}

function setCached(key, data, ttl) {
  cache.set(key, { data, ts: Date.now(), ttl });
}

// ─── Finnhub: batch stock quotes ──────────────────────────────────────────────

app.get('/api/quotes', async (req, res) => {
  try {
    const symbols = (req.query.symbols || 'AAPL,MSFT,NVDA,GOOGL,AMZN,SPY,QQQ,TSLA,META,JPM').split(',');
    const cacheKey = `quotes:${symbols.join(',')}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    if (!FINNHUB_KEY) return res.status(500).json({ error: 'FINNHUB_API_KEY not configured' });

    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const r = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol.trim()}&token=${FINNHUB_KEY}`);
        const data = await r.json();
        return {
          symbol: symbol.trim(),
          price: data.c,
          change: data.d,
          changePct: data.dp,
          high: data.h,
          low: data.l,
          open: data.o,
          prevClose: data.pc,
        };
      })
    );

    setCached(cacheKey, results, 30_000); // 30s cache
    res.json(results);
  } catch (err) {
    console.error('Quotes error:', err);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// ─── NewsAPI: business headlines ─────────────────────────────────────────────

app.get('/api/news', async (req, res) => {
  try {
    const cached = getCached('news');
    if (cached) return res.json(cached);

    if (!NEWS_KEY) return res.status(500).json({ error: 'NEWS_API_KEY not configured' });

    const r = await fetch(
      `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=20&apiKey=${NEWS_KEY}`
    );
    const data = await r.json();

    if (data.status !== 'ok') {
      return res.status(502).json({ error: data.message || 'NewsAPI error' });
    }

    setCached('news', data.articles, 300_000); // 5 min cache
    res.json(data.articles);
  } catch (err) {
    console.error('News error:', err);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// ─── Finnhub: market news ────────────────────────────────────────────────────

app.get('/api/market-news', async (req, res) => {
  try {
    const cached = getCached('market-news');
    if (cached) return res.json(cached);

    if (!FINNHUB_KEY) return res.status(500).json({ error: 'FINNHUB_API_KEY not configured' });

    const r = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${FINNHUB_KEY}`);
    const data = await r.json();

    setCached('market-news', data, 300_000); // 5 min cache
    res.json(data);
  } catch (err) {
    console.error('Market news error:', err);
    res.status(500).json({ error: 'Failed to fetch market news' });
  }
});

// ─── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    finnhub: !!FINNHUB_KEY,
    newsapi: !!NEWS_KEY,
  });
});

// ─── Serve React frontend ─────────────────────────────────────────────────────

app.use(express.static(join(__dirname, '../dist')));

app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DeeEzz Dashboard running on port ${PORT}`);
});
