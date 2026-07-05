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
    <div className="flex gap-3 p-3 animate-pulse">
      <div className="w-16 h-16 rounded-lg bg-gray-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-800 rounded w-full" />
        <div className="h-3 bg-gray-800 rounded w-4/5" />
        <div className="h-2 bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function NewsFeed({ articles, loading }: NewsFeedProps) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-lg">Market News</h3>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock size={11} /> Live
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-pulse" />
        </span>
      </div>

      <div className="space-y-1 max-h-[480px] overflow-y-auto pr-1 scrollbar-thin">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : articles.slice(0, 15).map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-3 p-3 rounded-xl hover:bg-gray-800/60 transition-colors group cursor-pointer"
              >
                {article.urlToImage ? (
                  <img
                    src={article.urlToImage}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-800"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-800 shrink-0 flex items-center justify-center">
                    <ExternalLink size={16} className="text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-indigo-400 text-xs font-medium truncate">{article.source.name}</span>
                    <span className="text-gray-600 text-xs">·</span>
                    <span className="text-gray-500 text-xs">{timeAgo(article.publishedAt)}</span>
                  </div>
                </div>
              </a>
            ))}
      </div>
    </div>
  );
}
