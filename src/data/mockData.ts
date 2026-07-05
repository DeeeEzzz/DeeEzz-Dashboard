export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: string;
  marketCap: string;
  sparkline: number[];
}

export interface PortfolioHolding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPct: number;
  color: string;
}

export interface PerformancePoint {
  date: string;
  portfolio: number;
  benchmark: number;
}

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'dividend';
  symbol: string;
  name: string;
  shares: number;
  price: number;
  total: number;
  date: string;
}

export const portfolioHoldings: PortfolioHolding[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 25, avgCost: 158.40, currentPrice: 189.25, value: 4731.25, gain: 771.25, gainPct: 19.51, color: '#6366f1' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 15, avgCost: 310.20, currentPrice: 378.85, value: 5682.75, gain: 1029.75, gainPct: 22.11, color: '#8b5cf6' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 10, avgCost: 420.50, currentPrice: 875.40, value: 8754.00, gain: 4549.00, gainPct: 108.18, color: '#a78bfa' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 8, avgCost: 128.75, currentPrice: 162.30, value: 1298.40, gain: 268.40, gainPct: 26.05, color: '#c4b5fd' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 12, avgCost: 138.90, currentPrice: 178.25, value: 2139.00, gain: 472.20, gainPct: 28.34, color: '#ddd6fe' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', shares: 20, avgCost: 315.60, currentPrice: 358.20, value: 7164.00, gain: 852.00, gainPct: 13.50, color: '#ede9fe' },
];

export const watchlist: Asset[] = [
  { symbol: 'SPY', name: 'S&P 500 ETF', price: 524.85, change: 3.42, changePct: 0.66, volume: '72.4M', marketCap: '485.2B', sparkline: [518, 519, 521, 520, 522, 521, 524, 525] },
  { symbol: 'QQQ', name: 'Nasdaq 100 ETF', price: 445.20, change: 4.85, changePct: 1.10, volume: '38.6M', marketCap: '212.8B', sparkline: [436, 438, 440, 439, 442, 441, 444, 445] },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.20, changePct: -2.05, volume: '98.2M', marketCap: '791.3B', sparkline: [260, 258, 255, 257, 253, 251, 249, 248] },
  { symbol: 'META', name: 'Meta Platforms', price: 512.40, change: 8.90, changePct: 1.77, volume: '18.4M', marketCap: '1.31T', sparkline: [500, 502, 505, 503, 507, 508, 511, 512] },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 198.75, change: 1.25, changePct: 0.63, volume: '9.8M', marketCap: '575.6B', sparkline: [195, 196, 197, 197, 198, 198, 199, 199] },
  { symbol: 'BTC-USD', name: 'Bitcoin', price: 67420.00, change: 1250.00, changePct: 1.89, volume: '24.5B', marketCap: '1.32T', sparkline: [64000, 64800, 65500, 65200, 66000, 66800, 67100, 67420] },
];

function generatePerformanceData(): PerformancePoint[] {
  const points: PerformancePoint[] = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let portfolio = 100;
  let benchmark = 100;
  for (let i = 0; i < 24; i++) {
    portfolio *= 1 + (Math.random() * 0.06 - 0.01);
    benchmark *= 1 + (Math.random() * 0.04 - 0.005);
    points.push({
      date: `${months[i % 12]} '${i < 12 ? '24' : '25'}`,
      portfolio: parseFloat(portfolio.toFixed(2)),
      benchmark: parseFloat(benchmark.toFixed(2)),
    });
  }
  return points;
}

export const performanceData = generatePerformanceData();

export const recentTransactions: Transaction[] = [
  { id: '1', type: 'buy', symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 5, price: 875.40, total: 4377.00, date: 'Jul 3, 2025' },
  { id: '2', type: 'sell', symbol: 'TSLA', name: 'Tesla Inc.', shares: 10, price: 255.80, total: 2558.00, date: 'Jul 1, 2025' },
  { id: '3', type: 'dividend', symbol: 'AAPL', name: 'Apple Inc.', shares: 0, price: 0, total: 23.75, date: 'Jun 28, 2025' },
  { id: '4', type: 'buy', symbol: 'META', name: 'Meta Platforms', shares: 3, price: 508.20, total: 1524.60, date: 'Jun 25, 2025' },
  { id: '5', type: 'buy', symbol: 'MSFT', name: 'Microsoft Corp.', shares: 5, price: 372.40, total: 1862.00, date: 'Jun 20, 2025' },
];

export const totalPortfolioValue = portfolioHoldings.reduce((sum, h) => sum + h.value, 0);
export const totalPortfolioGain = portfolioHoldings.reduce((sum, h) => sum + h.gain, 0);
export const totalPortfolioCost = totalPortfolioValue - totalPortfolioGain;
export const totalGainPct = (totalPortfolioGain / totalPortfolioCost) * 100;
