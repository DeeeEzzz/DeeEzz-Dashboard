import { useState, useEffect } from 'react';

export interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
}

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch('/api/news');
        if (!res.ok) throw new Error('Failed to fetch news');
        const data: NewsArticle[] = await res.json();
        setArticles(data.filter((a) => a.title && a.title !== '[Removed]'));
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
    const id = setInterval(fetchNews, 300_000); // refresh every 5 min
    return () => clearInterval(id);
  }, []);

  return { articles, loading, error };
}
