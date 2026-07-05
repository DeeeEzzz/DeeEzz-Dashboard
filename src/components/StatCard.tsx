import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  accent?: string;
}

export default function StatCard({ title, value, subValue, positive, icon, accent = 'from-indigo-500 to-purple-600' }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 p-6 hover:border-indigo-500/50 transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
          {subValue !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${positive ? 'text-emerald-400' : 'text-red-400'}`}>
              {positive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{subValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${accent} opacity-80`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
