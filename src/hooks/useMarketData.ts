import { useState, useEffect, useCallback } from 'react';

export interface MarketQuote {
  price: number;
  change: number;
  changePct: number;
  high?: number;
  low?: number;
  sparkline: number[];
}

export type MarketData = Record<string, MarketQuote>;

export function useMarketData(pollMs = 30_000) {
  const [data, setData]       = useState<MarketData>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/market-data');
      if (!res.ok) throw new Error('fetch failed');
      const json: MarketData = await res.json();
      setData(json);
      setLastUpdate(new Date());
    } catch {
      // keep previous data on failure
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch_();
    const id = setInterval(fetch_, pollMs);
    return () => clearInterval(id);
  }, [fetch_, pollMs]);

  return { data, loading, lastUpdate };
}
