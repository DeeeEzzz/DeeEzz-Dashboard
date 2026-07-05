import { ArrowUpRight, ArrowDownRight, Gift } from 'lucide-react';
import type { Transaction } from '../data/mockData';

interface TransactionFeedProps {
  transactions: Transaction[];
}

const typeConfig = {
  buy: { label: 'Buy', icon: ArrowDownRight, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  sell: { label: 'Sell', icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10' },
  dividend: { label: 'Dividend', icon: Gift, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
};

export default function TransactionFeed({ transactions }: TransactionFeedProps) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-lg">Recent Transactions</h3>
        <button className="text-indigo-400 text-sm hover:text-indigo-300 font-medium transition-colors">View All</button>
      </div>
      <div className="space-y-3">
        {transactions.map((tx) => {
          const cfg = typeConfig[tx.type];
          const Icon = cfg.icon;
          return (
            <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-800/60 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${cfg.bg}`}>
                  <Icon size={16} className={cfg.color} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm">{tx.symbol}</span>
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-sm ${tx.type === 'sell' ? 'text-red-400' : tx.type === 'dividend' ? 'text-indigo-400' : 'text-emerald-400'}`}>
                  {tx.type === 'sell' ? '-' : '+'}${tx.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
                {tx.shares > 0 && (
                  <p className="text-gray-500 text-xs">{tx.shares} sh @ ${tx.price.toFixed(2)}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
