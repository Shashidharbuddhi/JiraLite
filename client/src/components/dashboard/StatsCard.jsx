import AnimatedCounter from '../common/AnimatedCounter';

const StatsCard = ({ title, value, icon: Icon, tone = 'blue' }) => {
  const tones = {
    blue: 'text-blue-600',
    green: 'text-emerald-500',
    amber: 'text-amber-500',
    slate: 'text-slate-500'
  };
  const dotColors = {
    blue: 'bg-blue-600',
    green: 'bg-emerald-500',
    amber: 'bg-amber-500',
    slate: 'bg-slate-400'
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-px hover:shadow-card-hover dark:border-[#1e293b] dark:bg-[#111827]">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <span className={`h-1.5 w-1.5 rounded-full ${dotColors[tone]}`} />
      </div>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold text-slate-900">
          <AnimatedCounter value={value} />
        </p>
        <Icon className={`h-5 w-5 ${tones[tone]} opacity-60`} />
      </div>
    </div>
  );
};

export default StatsCard;
