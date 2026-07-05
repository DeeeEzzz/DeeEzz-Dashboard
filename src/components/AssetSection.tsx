import AssetRow from './AssetRow';
import type { AssetClass, AssetDef } from '../config/assets';
import { ASSET_CLASS_LABELS } from '../config/assets';
import type { MarketData } from '../hooks/useMarketData';

interface AssetSectionProps {
  assetClass: AssetClass;
  assets: AssetDef[];
  data: MarketData;
}

export default function AssetSection({ assetClass, assets, data }: AssetSectionProps) {
  if (assets.length === 0) return null;

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <h3 className="text-white font-semibold text-sm tracking-wide">{ASSET_CLASS_LABELS[assetClass]}</h3>
        <span className="text-gray-600 text-xs">{assets.length} assets</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-600 text-xs uppercase tracking-wider border-b border-gray-800/60">
            <th className="text-left px-5 py-2 font-medium">Asset</th>
            <th className="text-right px-4 py-2 font-medium">Price</th>
            <th className="text-right px-4 py-2 font-medium hidden sm:table-cell">Change</th>
            <th className="text-right px-4 py-2 font-medium hidden lg:table-cell">Hi / Lo</th>
            <th className="text-right pr-5 py-2 font-medium hidden xl:table-cell">Trend</th>
          </tr>
        </thead>
        <tbody>
          {assets.map(asset => (
            <AssetRow key={asset.id} asset={asset} quote={data[asset.id]} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
