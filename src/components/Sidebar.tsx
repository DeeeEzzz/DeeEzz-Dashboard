import { LayoutDashboard, TrendingUp, Newspaper, Settings, Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Markets',   active: true  },
  { icon: Newspaper,       label: 'News',      active: false },
  { icon: TrendingUp,      label: 'Watchlist', active: false },
  { icon: Settings,        label: 'Settings',  active: false },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-gray-950 border-r border-gray-800 transition-all duration-300 shrink-0 ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <TrendingUp size={13} className="text-white" />
              </div>
              <span className="text-white font-bold text-xs tracking-wide truncate">DeeEzz Markets</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800 shrink-0"
          >
            <Menu size={17} />
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={16} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-gray-800">
            <p className="text-gray-600 text-xs text-center">Data: Finnhub · Yahoo · Frankfurter</p>
          </div>
        )}
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <TrendingUp size={13} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">DeeEzz Markets</span>
        </div>
        <div className="flex items-center gap-3">
          <Search size={17} className="text-gray-400" />
          <Bell size={17} className="text-gray-400" />
        </div>
      </header>
    </>
  );
}
