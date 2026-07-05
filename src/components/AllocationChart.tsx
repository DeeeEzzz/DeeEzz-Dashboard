import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { PortfolioHolding } from '../data/mockData';

interface AllocationChartProps {
  holdings: PortfolioHolding[];
  totalValue: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 shadow-xl">
        <p className="text-white font-medium text-sm">{d.symbol}</p>
        <p className="text-gray-400 text-xs">{d.name}</p>
        <p className="text-indigo-400 font-semibold mt-1">${d.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
};

export default function AllocationChart({ holdings, totalValue }: AllocationChartProps) {
  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
      <h3 className="text-white font-semibold text-lg mb-1">Asset Allocation</h3>
      <p className="text-gray-400 text-sm mb-4">By portfolio weight</p>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Pie
              data={holdings}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {holdings.map((entry, index) => (
                <Cell key={index} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {holdings.map((h) => (
            <div key={h.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: h.color }} />
                <span className="text-gray-300 text-sm font-medium">{h.symbol}</span>
              </div>
              <span className="text-gray-400 text-xs">
                {((h.value / totalValue) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
