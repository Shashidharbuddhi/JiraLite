import AnimatedCounter from '../common/AnimatedCounter';
import Card from '../common/Card';

const StatsCard = ({ title, value, icon: Icon, tone = 'blue' }) => {
  const tones = {
    blue: { icon: 'bg-blue-50 text-blue-700', bar: 'bg-blue-600' },
    green: { icon: 'bg-emerald-50 text-emerald-700', bar: 'bg-emerald-500' },
    amber: { icon: 'bg-amber-50 text-amber-700', bar: 'bg-amber-500' },
    slate: { icon: 'bg-slate-100 text-slate-700', bar: 'bg-slate-500' }
  };
  const activeTone = tones[tone] || tones.blue;
  const progress = Math.min(100, Math.max(8, Number(value) * 12));

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-bold text-slate-950">
            <AnimatedCounter value={value} />
          </p>
        </div>
        <div className={`rounded-2xl p-3 ${activeTone.icon}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${activeTone.bar}`} style={{ width: `${progress}%` }} />
      </div>
    </Card>
  );
};

export default StatsCard;
