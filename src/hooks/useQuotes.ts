import { useState, useEffect, useCallback } from 'react';

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
}

const WATCHLIST_SYMBOLS = ['SPY', 'QQQ', 'TSLA', 'META', 'JPM', 'AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN'];

export function useQuotes(pollInterval = 30_000) {
  const [quotes, setQuotes] = useState<Map<string, Quote>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuotes = useCallback(async () => {
    try {
      const res = await fetch(`/api/quotes?symbols=${WATCHLIST_SYMBOLS.join(',')}`);
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const data: Quote[] = await res.json();
      const map = new Map<string, Quote>();
      data.forEach((q) => map.set(q.symbol, q));
      setQuotes(map);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    const id = setInterval(fetchQuotes, pollInterval);
    return () => clearInterval(id);
  }, [fetchQuotes, pollInterval]);

  return { quotes, loading, error };
}
