import { RefreshCw, Bell, Search, TrendingUp, TrendingDown } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AssetSection from './components/AssetSection';
import NewsFeed from './components/NewsFeed';
import { useMarketData } from './hooks/useMarketData';
import { useNews } from './hooks/useNews';
import { ASSETS, ASSET_CLASS_ORDER, formatPrice } from './config/assets';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

// ── Top summary metrics ────────────────────────────────────────────────────
const SUMMARY_KEYS = [
  { id: 'BTC',   label: 'Bitcoin',     format: 'usd-large' as const },
  { id: 'GOLD',  label: 'Gold',        format: 'usd-large' as const, suffix: '/oz' },
  { id: 'SP500', label: 'S&P 500',     format: 'index'     as const },
  { id: 'DXY',   label: 'Dollar Index',format: 'forex-2dp' as const },
];

export default function App() {
  const { data, loading, lastUpdate } = useMarketData();
  const { articles, loading: newsLoading } = useNews();

  // Group assets by class
  const grouped = Object.fromEntries(
    ASSET_CLASS_ORDER.map(cls => [
      cls,
      ASSETS.filter(a => a.assetClass === cls),
    ])
  );

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between px-6 h-16 bg-gray-950 border-b border-gray-800 shrink-0">
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight">DeeEzz Market Dashboard</h1>
            <p className="text-gray-500 text-xs">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-gray-600 text-xs flex items-center gap-1.5">
                <RefreshCw size={11} className={loading ? 'animate-spin text-indigo-400' : 'text-gray-600'} />
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-500 w-52 hover:border-indigo-500/40 transition-colors cursor-pointer">
              <Search size={13} />
              <span>Search assets…</span>
            </div>
            <button className="relative p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-indigo-500/40 transition-all">
              <Bell size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto p-4 lg:p-6 space-y-4">

            {/* Summary bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {SUMMARY_KEYS.map(({ id, label, format, suffix }) => {
                const q = data[id];
                const isPos = (q?.changePct ?? 0) >= 0;
                return (
                  <div key={id} className="rounded-xl bg-gray-900 border border-gray-800 px-4 py-3 hover:border-indigo-500/30 transition-colors">
                    <p className="text-gray-500 text-xs font-medium mb-1">{label}</p>
                    <p className="text-white font-bold text-lg font-mono leading-tight">
                      {q ? formatPrice(q.price, format, suffix) : <span className="text-gray-700">—</span>}
                    </p>
                    {q && (
                      <div className={`flex items-center gap-1 mt-1 text-xs font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isPos ? '+' : ''}{q.changePct.toFixed(2)}%
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Asset sections */}
            {ASSET_CLASS_ORDER.map(cls => (
              <AssetSection
                key={cls}
                assetClass={cls}
                assets={grouped[cls]}
                data={data}
              />
            ))}

            {/* News feed */}
            <NewsFeed articles={articles} loading={newsLoading} />

            {/* Footer */}
            <p className="text-gray-700 text-xs text-center pb-4">
              Market data: Finnhub · Yahoo Finance · Frankfurter.app · News: NewsAPI · Refreshes every 30s
            </p>

          </div>
        </main>
      </div>
    </div>
  );
}
