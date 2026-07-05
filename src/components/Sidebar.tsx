import { LayoutDashboard, TrendingUp, Briefcase, BookOpen, Settings, Bell, Search, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: TrendingUp, label: 'Markets', active: false },
  { icon: Briefcase, label: 'Portfolio', active: false },
  { icon: BookOpen, label: 'Watchlist', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-gray-950 border-r border-gray-800 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <TrendingUp size={14} className="text-white" />
              </div>
              <span className="text-white font-bold text-sm tracking-wide">DeeEzz</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
          >
            <Menu size={18} />
          </button>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  item.active
                    ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon size={17} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {!collapsed && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                DE
              </div>
              <div>
                <p className="text-white text-xs font-semibold">DeeEzz</p>
                <p className="text-gray-500 text-xs">Pro Account</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <TrendingUp size={14} className="text-white" />
          </div>
          <span className="text-white font-bold text-sm">DeeEzz</span>
        </div>
        <div className="flex items-center gap-3">
          <Search size={18} className="text-gray-400" />
          <Bell size={18} className="text-gray-400" />
        </div>
      </header>
    </>
  );
}
