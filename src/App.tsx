import { DollarSign, TrendingUp, BarChart2, Briefcase, Bell, Search } from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatCard from './components/StatCard';
import PerformanceChart from './components/PerformanceChart';
import AllocationChart from './components/AllocationChart';
import HoldingsTable from './components/HoldingsTable';
import Watchlist from './components/Watchlist';
import TransactionFeed from './components/TransactionFeed';
import NewsFeed from './components/NewsFeed';
import { useQuotes } from './hooks/useQuotes';
import { useNews } from './hooks/useNews';
import {
  portfolioHoldings,
  performanceData,
  recentTransactions,
  totalPortfolioValue,
  totalPortfolioGain,
  totalGainPct,
} from './data/mockData';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

export default function App() {
  const { quotes, loading: quotesLoading } = useQuotes();
  const { articles, loading: newsLoading } = useNews();

  // Compute today's change from live SPY quote if available
  const spy = quotes.get('SPY');
  const todayChange = spy ? `${spy.changePct >= 0 ? '+' : ''}${spy.changePct.toFixed(2)}%` : '+1.14%';
  const todayPositive = spy ? spy.changePct >= 0 : true;

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop header */}
        <header className="hidden lg:flex items-center justify-between px-6 h-16 bg-gray-950 border-b border-gray-800 shrink-0">
          <div>
            <h1 className="text-white font-bold text-xl">Dashboard</h1>
            <p className="text-gray-500 text-xs">{today}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-gray-400 w-56 hover:border-indigo-500/50 transition-colors cursor-pointer">
              <Search size={14} />
              <span>Search assets…</span>
              <kbd className="ml-auto text-xs bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
            <button className="relative p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:border-indigo-500/50 transition-all">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Value"
              value={`$${(totalPortfolioValue / 1000).toFixed(2)}K`}
              subValue={`+${totalGainPct.toFixed(2)}% all time`}
              positive
              icon={<DollarSign size={18} className="text-white" />}
              accent="from-indigo-500 to-purple-600"
            />
            <StatCard
              title="Total Gain"
              value={`+$${(totalPortfolioGain / 1000).toFixed(2)}K`}
              subValue="Unrealized P&L"
              positive
              icon={<TrendingUp size={18} className="text-white" />}
              accent="from-emerald-500 to-teal-600"
            />
            <StatCard
              title="Market Today"
              value={spy ? `$${spy.price.toFixed(2)}` : 'SPY'}
              subValue={`${todayChange} · S&P 500`}
              positive={todayPositive}
              icon={<BarChart2 size={18} className="text-white" />}
              accent="from-blue-500 to-cyan-600"
            />
            <StatCard
              title="Positions"
              value={`${portfolioHoldings.length}`}
              subValue="Active holdings"
              positive
              icon={<Briefcase size={18} className="text-white" />}
              accent="from-violet-500 to-fuchsia-600"
            />
          </div>

          {/* Performance chart + allocation */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <PerformanceChart data={performanceData} />
            </div>
            <AllocationChart holdings={portfolioHoldings} totalValue={totalPortfolioValue} />
          </div>

          {/* Holdings + transactions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <HoldingsTable holdings={portfolioHoldings} />
            </div>
            <TransactionFeed transactions={recentTransactions} />
          </div>

          {/* Watchlist */}
          <Watchlist quotes={quotes} loading={quotesLoading} />

          {/* News feed */}
          <NewsFeed articles={articles} loading={newsLoading} />

        </main>
      </div>
    </div>
  );
}
