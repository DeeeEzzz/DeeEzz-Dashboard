import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ─── API routes (stubs — real data coming soon) ───────────────────────────────

app.get('/api/quotes', (_req, res) => {
  res.json({ status: 'ok', message: 'Market quotes API — coming soon' });
});

app.get('/api/news', (_req, res) => {
  res.json({ status: 'ok', message: 'Financial news API — coming soon' });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Serve React frontend ─────────────────────────────────────────────────────

app.use(express.static(join(__dirname, '../dist')));

// SPA fallback — any unmatched route serves index.html
app.get('*', (_req, res) => {
  res.sendFile(join(__dirname, '../dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`DeeEzz Dashboard running on port ${PORT}`);
});
