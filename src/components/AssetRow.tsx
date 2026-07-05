import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { AssetDef } from '../config/assets';
import { formatPrice } from '../config/assets';
import type { MarketQuote } from '../hooks/useMarketData';

interface AssetRowProps {
  asset: AssetDef;
  quote?: MarketQuote;
}

function AssetIcon({ asset }: { asset: AssetDef }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (asset.logo && !imgFailed) {
    return (
      <img
        src={asset.logo}
        alt={asset.symbol}
        onError={() => setImgFailed(true)}
        className="w-8 h-8 rounded-lg object-contain bg-gray-800 p-0.5"
      />
    );
  }
  return (
    <div className={`w-8 h-8 rounded-lg ${asset.badgeColor} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {asset.badge}
    </div>
  );
}

export default function AssetRow({ asset, quote }: AssetRowProps) {
  const isPositive = (quote?.changePct ?? 0) >= 0;
  const sparkData  = (quote?.sparkline ?? []).map(v => ({ v }));
  const hasData    = !!quote?.price;

  return (
    <tr className="hover:bg-gray-800/40 transition-colors cursor-pointer group border-b border-gray-800/60 last:border-0">
      {/* Icon + name */}
      <td className="py-3 pl-5 pr-4">
        <div className="flex items-center gap-3">
          <AssetIcon asset={asset} />
          <div>
            <p className="text-white text-sm font-semibold group-hover:text-indigo-300 transition-colors leading-tight">
              {asset.symbol}
            </p>
            <p className="text-gray-500 text-xs hidden sm:block truncate max-w-[140px]">{asset.name}</p>
          </div>
        </div>
      </td>

      {/* Price */}
      <td className="py-3 text-right">
        {hasData ? (
          <span className="text-white font-mono font-medium text-sm">
            {formatPrice(quote!.price, asset.format, asset.suffix)}
          </span>
        ) : (
          <span className="text-gray-600 text-sm">—</span>
        )}
      </td>

      {/* Change badge */}
      <td className="py-3 text-right hidden sm:table-cell">
        {hasData ? (
          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isPositive ? '+' : ''}{quote!.changePct.toFixed(2)}%
          </div>
        ) : (
          <span className="text-gray-700 text-xs">—</span>
        )}
      </td>

      {/* High / Low */}
      <td className="py-3 text-right hidden lg:table-cell">
        {quote?.high ? (
          <div className="text-xs text-gray-400 space-y-0.5">
            <div className="text-emerald-400/70">{formatPrice(quote.high, asset.format)}</div>
            <div className="text-red-400/70">{formatPrice(quote.low, asset.format)}</div>
          </div>
        ) : <span className="text-gray-700 text-xs">—</span>}
      </td>

      {/* Sparkline */}
      <td className="py-3 pl-3 pr-5 hidden xl:table-cell w-[90px]">
        {sparkData.length > 1 ? (
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
        ) : (
          <div className="w-[80px] h-[32px] flex items-center justify-center">
            <div className="w-10 h-px bg-gray-700" />
          </div>
        )}
      </td>
    </tr>
  );
}
