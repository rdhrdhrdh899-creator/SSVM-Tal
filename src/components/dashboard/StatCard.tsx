import { cn } from '../../lib/utils';
import { useCountUp } from '../../hooks/useCountUp';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon: any;
  trend?: string;
  color?: 'navy' | 'gold' | 'emerald' | 'maroon' | 'blue';
}

export const StatCard = ({ label, value, suffix = '', prefix = '', icon: Icon, trend, color = 'navy' }: StatCardProps) => {
  const count = useCountUp(value, 2000, true);

  const colors = {
    navy: 'bg-navy-50 text-navy-800 border-navy-100 icon-bg:bg-navy-800',
    gold: 'bg-gold-50 text-gold-800 border-gold-200 icon-bg:bg-gold-500',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-100 icon-bg:bg-emerald-500',
    maroon: 'bg-red-50 text-red-800 border-red-100 icon-bg:bg-red-600',
    blue: 'bg-blue-50 text-blue-800 border-blue-100 icon-bg:bg-blue-600',
  };

  const bgClasses = {
    navy: 'bg-navy-800 shadow-navy-800/20',
    gold: 'bg-gold-500 shadow-gold-500/20',
    emerald: 'bg-emerald-500 shadow-emerald-500/20',
    maroon: 'bg-maroon-600 shadow-maroon-600/20',
    blue: 'bg-blue-600 shadow-blue-600/20',
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center group hover:-translate-y-1 transition-all duration-300">
      <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center text-white mr-5 shadow-lg group-hover:scale-110 transition-transform', bgClasses[color])}>
        <Icon size={26} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">{label}</p>
        <div className="flex items-baseline space-x-1">
          <span className="heading-serif text-2xl font-black text-navy-900">{prefix}{count}{suffix}</span>
          {trend && (
            <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-lg', trend.startsWith('+') ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600')}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
