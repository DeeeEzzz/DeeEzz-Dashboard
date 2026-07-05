// ─────────────────────────────────────────────────────────────────────────────
// DeeEzz Market Dashboard — Asset Configuration
//
// TO ADD OR REMOVE ASSETS: edit this file directly in GitHub's web editor
// (click the pencil icon on this file), commit, and the site auto-deploys.
//
// Each asset needs:
//   id          — must match the server's data key (see server/index.js)
//   symbol      — display label shown in the dashboard
//   name        — full name
//   assetClass  — one of the classes below
//   logo        — (optional) URL to a logo image
//   badge       — fallback text shown if logo fails or isn't set
//   badgeColor  — Tailwind bg color class for the badge
//   format      — how the price is formatted (see PriceFormat below)
//   suffix      — (optional) unit suffix, e.g. '/oz' or '/bbl'
// ─────────────────────────────────────────────────────────────────────────────

export type AssetClass = 'crypto' | 'metals' | 'forex' | 'equities' | 'etfs' | 'commodities' | 'indices';
export type PriceFormat = 'usd' | 'usd-large' | 'forex-4dp' | 'forex-2dp' | 'index';

export interface AssetDef {
  id: string;
  symbol: string;
  name: string;
  assetClass: AssetClass;
  logo?: string;
  badge: string;
  badgeColor: string;
  format: PriceFormat;
  suffix?: string;
}

export const ASSET_CLASS_LABELS: Record<AssetClass, string> = {
  crypto:      'Cryptocurrency',
  metals:      'Precious Metals',
  forex:       'Foreign Exchange',
  equities:    'Equities',
  etfs:        'ETFs',
  commodities: 'Commodities',
  indices:     'Market Indices',
};

export const ASSET_CLASS_ORDER: AssetClass[] = [
  'crypto', 'metals', 'forex', 'equities', 'etfs', 'commodities', 'indices',
];

export const ASSETS: AssetDef[] = [

  // ── Cryptocurrency ────────────────────────────────────────────────────────
  {
    id: 'BTC', symbol: 'BTC', name: 'Bitcoin',
    assetClass: 'crypto',
    logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    badge: '₿', badgeColor: 'bg-orange-500',
    format: 'usd-large',
  },

  // ── Precious Metals ───────────────────────────────────────────────────────
  {
    id: 'GOLD', symbol: 'XAU', name: 'Gold',
    assetClass: 'metals',
    badge: 'Au', badgeColor: 'bg-yellow-500',
    format: 'usd-large', suffix: '/oz',
  },
  {
    id: 'SILVER', symbol: 'XAG', name: 'Silver',
    assetClass: 'metals',
    badge: 'Ag', badgeColor: 'bg-gray-400',
    format: 'usd', suffix: '/oz',
  },

  // ── Foreign Exchange ──────────────────────────────────────────────────────
  {
    id: 'EUR', symbol: 'EUR/USD', name: 'Euro',
    assetClass: 'forex',
    badge: '€', badgeColor: 'bg-blue-600',
    format: 'forex-4dp',
  },
  {
    id: 'GBP', symbol: 'GBP/USD', name: 'British Pound',
    assetClass: 'forex',
    badge: '£', badgeColor: 'bg-blue-800',
    format: 'forex-4dp',
  },
  {
    id: 'CHF', symbol: 'CHF/USD', name: 'Swiss Franc',
    assetClass: 'forex',
    badge: '₣', badgeColor: 'bg-red-600',
    format: 'forex-4dp',
  },
  {
    id: 'JPY', symbol: 'USD/JPY', name: 'Japanese Yen',
    assetClass: 'forex',
    badge: '¥', badgeColor: 'bg-red-500',
    format: 'forex-2dp',
  },
  {
    id: 'DXY', symbol: 'DXY', name: 'US Dollar Index',
    assetClass: 'forex',
    badge: '$', badgeColor: 'bg-green-700',
    format: 'forex-2dp',
  },

  // ── Equities ──────────────────────────────────────────────────────────────
  {
    id: 'AMD', symbol: 'AMD', name: 'Advanced Micro Devices',
    assetClass: 'equities',
    logo: 'https://financialmodelingprep.com/image-stock/AMD.png',
    badge: 'AMD', badgeColor: 'bg-red-700',
    format: 'usd',
  },
  {
    id: 'MSFT', symbol: 'MSFT', name: 'Microsoft',
    assetClass: 'equities',
    logo: 'https://financialmodelingprep.com/image-stock/MSFT.png',
    badge: 'MS', badgeColor: 'bg-blue-600',
    format: 'usd',
  },
  {
    id: 'NVDA', symbol: 'NVDA', name: 'NVIDIA',
    assetClass: 'equities',
    logo: 'https://financialmodelingprep.com/image-stock/NVDA.png',
    badge: 'NV', badgeColor: 'bg-green-600',
    format: 'usd',
  },
  {
    id: 'PWR', symbol: 'PWR', name: 'Quanta Services',
    assetClass: 'equities',
    logo: 'https://financialmodelingprep.com/image-stock/PWR.png',
    badge: 'PWR', badgeColor: 'bg-orange-600',
    format: 'usd',
  },
  {
    id: 'TSM', symbol: 'TSM', name: 'Taiwan Semiconductor',
    assetClass: 'equities',
    logo: 'https://financialmodelingprep.com/image-stock/TSM.png',
    badge: 'TSM', badgeColor: 'bg-blue-700',
    format: 'usd',
  },

  // ── ETFs ──────────────────────────────────────────────────────────────────
  {
    id: 'IBIT', symbol: 'IBIT', name: 'iShares Bitcoin Trust',
    assetClass: 'etfs',
    logo: 'https://logo.clearbit.com/blackrock.com',
    badge: 'IBIT', badgeColor: 'bg-orange-700',
    format: 'usd',
  },
  {
    id: 'FBTC', symbol: 'FBTC', name: 'Fidelity Bitcoin ETF',
    assetClass: 'etfs',
    logo: 'https://logo.clearbit.com/fidelity.com',
    badge: 'FBTC', badgeColor: 'bg-emerald-700',
    format: 'usd',
  },
  {
    id: 'OUNZ', symbol: 'OUNZ', name: 'VanEck Merk Gold ETF',
    assetClass: 'etfs',
    logo: 'https://logo.clearbit.com/vaneck.com',
    badge: 'OUNZ', badgeColor: 'bg-yellow-600',
    format: 'usd',
  },
  {
    id: 'GDX', symbol: 'GDX', name: 'VanEck Gold Miners ETF',
    assetClass: 'etfs',
    logo: 'https://logo.clearbit.com/vaneck.com',
    badge: 'GDX', badgeColor: 'bg-yellow-700',
    format: 'usd',
  },
  {
    id: 'POWR', symbol: 'POWR', name: 'iShares U.S. Power Infrastructure ETF',
    assetClass: 'etfs',
    logo: 'https://logo.clearbit.com/blackrock.com',
    badge: 'POWR', badgeColor: 'bg-orange-700',
    format: 'usd',
  },

  // ── Commodities ───────────────────────────────────────────────────────────
  {
    id: 'OIL', symbol: 'WTI', name: 'Crude Oil (WTI)',
    assetClass: 'commodities',
    badge: '🛢', badgeColor: 'bg-stone-600',
    format: 'usd', suffix: '/bbl',
  },

  // ── Market Indices ────────────────────────────────────────────────────────
  {
    id: 'DAX', symbol: 'DAX', name: 'DAX 40',
    assetClass: 'indices',
    badge: 'DE', badgeColor: 'bg-yellow-600',
    format: 'index',
  },
  {
    id: 'SP500', symbol: 'S&P 500', name: 'S&P 500',
    assetClass: 'indices',
    badge: 'US', badgeColor: 'bg-blue-700',
    format: 'index',
  },
  {
    id: 'NASDAQ', symbol: 'NASDAQ', name: 'NASDAQ Composite',
    assetClass: 'indices',
    badge: 'NQ', badgeColor: 'bg-indigo-600',
    format: 'index',
  },
  {
    id: 'DJIA', symbol: 'DJIA', name: 'Dow Jones Industrial',
    assetClass: 'indices',
    badge: 'DJ', badgeColor: 'bg-blue-900',
    format: 'index',
  },

];

// ─── Price formatter ──────────────────────────────────────────────────────────

export function formatPrice(price: number | undefined, format: PriceFormat, suffix = ''): string {
  if (!price || isNaN(price)) return '—';
  const s = suffix;
  switch (format) {
    case 'usd':
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${s}`;
    case 'usd-large':
      return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${s}`;
    case 'forex-4dp':
      return price.toFixed(4);
    case 'forex-2dp':
      return price.toFixed(2);
    case 'index':
      return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
