import { TrendingUp, TrendingDown, RefreshCw, Bell, Search } from 'lucide-react';
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

      {/* ── Full-width header ─────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 h-14 bg-gray-950 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <TrendingUp size={13} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">DeeEzz Market Dashboard</h1>
            <p className="text-gray-600 text-xs hidden sm:block">{today}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdate && (
            <span className="hidden sm:flex items-center gap-1.5 text-gray-600 text-xs">
              <RefreshCw size={10} className={loading ? 'animate-spin text-indigo-400' : ''} />
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <div className="hidden md:flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-1.5 text-xs text-gray-500 w-44 hover:border-indigo-500/40 transition-colors cursor-pointer">
            <Search size={12} />
            <span>Search…</span>
          </div>
          <button className="p-1.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-all">
            <Bell size={15} />
          </button>
        </div>
      </header>

      {/* ── Two-column body ───────────────────────────────────────────────── */}
      {/*
          Mobile (< lg):  single column, prices on top, news below
          Desktop (lg+):  left = news (fixed width), right = prices (flex-1)
          Each column scrolls independently on desktop.
      */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row min-h-0">

        {/* ── Right: Prices ─────────────────────────────────────────────── */}
        <div className="order-1 lg:order-2 flex-1 lg:overflow-y-auto min-h-0">
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

        {/* ── Left: News ────────────────────────────────────────────────── */}
        <aside className="order-2 lg:order-1 lg:w-[340px] lg:shrink-0 lg:border-r border-t lg:border-t-0 border-gray-800 lg:overflow-y-auto">
          {/* Mobile news label */}
          <div className="lg:hidden px-4 pt-4 pb-1">
            <h3 className="text-white font-semibold text-sm">Market News</h3>
          </div>
          <NewsFeed articles={articles} loading={newsLoading} />
        </aside>

      </div>
    </div>
  );
}
