import { TrendingUp, TrendingDown } from 'lucide-react';
import type { PortfolioHolding } from '../data/mockData';

interface HoldingsTableProps {
  holdings: PortfolioHolding[];
}

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-lg">Holdings</h3>
        <button className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors">
          + Buy
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left pb-3 font-medium">Asset</th>
              <th className="text-right pb-3 font-medium">Shares</th>
              <th className="text-right pb-3 font-medium hidden sm:table-cell">Avg Cost</th>
              <th className="text-right pb-3 font-medium">Current</th>
              <th className="text-right pb-3 font-medium">Value</th>
              <th className="text-right pb-3 font-medium hidden md:table-cell">Gain/Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {holdings.map((h) => {
              const isPositive = h.gain >= 0;
              return (
                <tr key={h.symbol} className="hover:bg-gray-800/50 transition-colors cursor-pointer group">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                        style={{ background: h.color }}
                      >
                        {h.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-white font-semibold group-hover:text-indigo-300 transition-colors">{h.symbol}</p>
                        <p className="text-gray-500 text-xs hidden sm:block">{h.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-right text-gray-300">{h.shares}</td>
                  <td className="py-3.5 text-right text-gray-400 hidden sm:table-cell">${h.avgCost.toFixed(2)}</td>
                  <td className="py-3.5 text-right text-white font-medium">${h.currentPrice.toFixed(2)}</td>
                  <td className="py-3.5 text-right text-white font-semibold">
                    ${h.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 text-right hidden md:table-cell">
                    <div className={`flex flex-col items-end ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                      <div className="flex items-center gap-1 text-xs font-semibold">
                        {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                        {isPositive ? '+' : ''}{h.gainPct.toFixed(2)}%
                      </div>
                      <span className="text-xs opacity-75">
                        {isPositive ? '+' : ''}${h.gain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
