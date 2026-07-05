import { TrendingUp, TrendingDown } from 'lucide-react';
import type { Asset } from '../data/mockData';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface WatchlistProps {
  assets: Asset[];
}

export default function Watchlist({ assets }: WatchlistProps) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-lg">Watchlist</h3>
        <button className="text-indigo-400 text-sm hover:text-indigo-300 font-medium transition-colors">+ Add Symbol</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left pb-3 font-medium">Symbol</th>
              <th className="text-right pb-3 font-medium">Price</th>
              <th className="text-right pb-3 font-medium hidden sm:table-cell">Change</th>
              <th className="text-right pb-3 font-medium hidden md:table-cell">Volume</th>
              <th className="text-center pb-3 font-medium hidden lg:table-cell w-24">7D Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {assets.map((asset) => {
              const isPositive = asset.change >= 0;
              const sparkData = asset.sparkline.map((v) => ({ v }));
              return (
                <tr key={asset.symbol} className="hover:bg-gray-800/50 transition-colors cursor-pointer group">
                  <td className="py-3 pr-4">
                    <div>
                      <p className="text-white font-semibold group-hover:text-indigo-300 transition-colors">{asset.symbol}</p>
                      <p className="text-gray-500 text-xs">{asset.name}</p>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className="text-white font-medium">
                      {asset.price >= 1000
                        ? `$${(asset.price / 1000).toFixed(1)}K`
                        : `$${asset.price.toFixed(2)}`}
                    </span>
                  </td>
                  <td className="py-3 text-right hidden sm:table-cell">
                    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${
                      isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {isPositive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {isPositive ? '+' : ''}{asset.changePct.toFixed(2)}%
                    </div>
                  </td>
                  <td className="py-3 text-right text-gray-400 hidden md:table-cell">{asset.volume}</td>
                  <td className="py-3 hidden lg:table-cell w-24">
                    <ResponsiveContainer width={80} height={32}>
                      <LineChart data={sparkData}>
                        <Line
                          type="monotone"
                          dataKey="v"
                          stroke={isPositive ? '#10b981' : '#ef4444'}
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
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
