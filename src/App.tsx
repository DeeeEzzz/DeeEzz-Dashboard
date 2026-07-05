import { TrendingDown, TrendingUp, RefreshCw } from 'lucide-react';
import AssetSection from './components/AssetSection';
import NewsFeed from './components/NewsFeed';
import { useMarketData } from './hooks/useMarketData';
import { useNews } from './hooks/useNews';
import { ASSETS, ASSET_CLASS_ORDER, formatPrice } from './config/assets';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

const SUMMARY_KEYS = [
  { id: 'BTC',   label: 'Bitcoin',  format: 'usd-large' as const },
  { id: 'GOLD',  label: 'Gold',     format: 'usd-large' as const, suffix: '/oz' },
  { id: 'SP500', label: 'S&P 500',  format: 'index'     as const },
  { id: 'EUR',   label: 'EUR/USD',  format: 'forex-4dp' as const },
];

export default function App() {
  const { data, loading, lastUpdate } = useMarketData();
  const { articles, loading: newsLoading } = useNews();

  const grouped = Object.fromEntries(
    ASSET_CLASS_ORDER.map(cls => [cls, ASSETS.filter(a => a.assetClass === cls)])
  );

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="flex items-center px-6 h-20 bg-gray-950 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-5">
          {/* Logo wordmark */}
          <img
            src="/logo.png"
            alt="DeeEzz Market Dashboard"
            className="h-14 w-auto object-contain"
          />
          {/* Divider + subtitle */}
          <div className="border-l border-gray-700 pl-5">
            <p className="text-gray-300 text-sm font-semibold tracking-wide">Market Dashboard</p>
            <p className="text-gray-600 text-xs mt-0.5">
              {today}
              {lastUpdate && (
                <span className="ml-2 inline-flex items-center gap-1">
                  <RefreshCw size={9} className={loading ? 'animate-spin text-indigo-400' : 'text-gray-600'} />
                  <span className={loading ? 'text-indigo-400' : 'text-gray-600'}>
                    {lastUpdate.toLocaleTimeString()}
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>
      </header>

      {/* ── Two-column body: 1/3 news · 2/3 prices ─────────────────────────── */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row min-h-0">

        {/* ── Right (2/3): prices — order-1 so it appears first on mobile ── */}
        <div className="order-1 lg:order-2 lg:w-2/3 lg:overflow-y-auto">
          <div className="p-4 lg:p-5 space-y-3">

            {/* Summary boxes */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {SUMMARY_KEYS.map(({ id, label, format, suffix }) => {
                const q = data[id];
                const isPos = (q?.changePct ?? 0) >= 0;
                return (
                  <div key={id} className="rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 hover:border-indigo-500/30 transition-colors">
                    <p className="text-gray-500 text-xs font-medium mb-0.5">{label}</p>
                    <p className="text-white font-bold text-lg font-mono leading-tight">
                      {q ? formatPrice(q.price, format, suffix) : <span className="text-gray-700 text-base">—</span>}
                    </p>
                    {q && (
                      <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                        {isPos ? '+' : ''}{q.changePct.toFixed(2)}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Asset sections */}
            {ASSET_CLASS_ORDER.map(cls => (
              <AssetSection key={cls} assetClass={cls} assets={grouped[cls]} data={data} />
            ))}

            <p className="text-gray-700 text-xs text-center pb-2">
              Finnhub · Yahoo Finance · Frankfurter.app · NewsAPI · 30s refresh
            </p>
          </div>
        </div>

        {/* ── Left (1/3): news — order-2 so it appears below prices on mobile */}
        <aside className="order-2 lg:order-1 lg:w-1/3 lg:shrink-0 lg:border-r border-t lg:border-t-0 border-gray-800 lg:overflow-y-auto">
          <NewsFeed articles={articles} loading={newsLoading} />
        </aside>

      </div>
    </div>
  );
}
