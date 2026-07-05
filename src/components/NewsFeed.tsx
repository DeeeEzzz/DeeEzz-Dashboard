import { ExternalLink, Clock } from 'lucide-react';
import type { NewsArticle } from '../hooks/useNews';

interface NewsFeedProps {
  articles: NewsArticle[];
  loading: boolean;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function SkeletonCard() {
  return (
    <div className="flex gap-3 px-4 py-3 animate-pulse">
      <div className="w-14 h-14 rounded-lg bg-gray-800 shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-800 rounded w-4/5" />
        <div className="h-2 bg-gray-800 rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

export default function NewsFeed({ articles, loading }: NewsFeedProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-gray-950 border-b border-gray-800 shrink-0">
        <h3 className="text-white font-semibold text-sm">Market News</h3>
        <span className="text-xs text-gray-500 flex items-center gap-1.5">
          <Clock size={11} />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </span>
      </div>

      {/* Articles */}
      <div className="divide-y divide-gray-800/60">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : articles
              .filter(a => a.title && a.title !== '[Removed]')
              .slice(0, 30)
              .map((article, i) => (
                <a
                  key={i}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 px-4 py-3 hover:bg-gray-800/50 transition-colors group"
                >
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt=""
                      className="w-14 h-14 rounded-lg object-cover shrink-0 bg-gray-800"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-800 shrink-0 flex items-center justify-center">
                      <ExternalLink size={14} className="text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-medium leading-snug line-clamp-3 group-hover:text-indigo-300 transition-colors">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-indigo-400 text-xs font-medium truncate">{article.source.name}</span>
                      <span className="text-gray-600 text-xs">·</span>
                      <span className="text-gray-600 text-xs">{timeAgo(article.publishedAt)}</span>
                    </div>
                  </div>
                </a>
              ))}
      </div>
    </div>
  );
}
