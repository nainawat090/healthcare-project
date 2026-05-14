import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatsCard — animated KPI card for dashboards
 * Props: title, value, unit, icon, trend, trendValue, color, delay
 */
export default function StatsCard({ title, value, unit = '', icon: Icon, trend = 'up', trendValue, color = 'primary', delay = 0, critical = false }) {
  const colors = {
    primary:   { bg: 'bg-primary-500/15', text: 'text-primary-400',   border: 'border-primary-500/20', glow: 'shadow-glow'      },
    emergency: { bg: 'bg-emergency-500/15',text: 'text-emergency-400', border: 'border-emergency-500/20',glow: 'shadow-emergency' },
    warning:   { bg: 'bg-warning-500/15', text: 'text-warning-400',   border: 'border-warning-500/20', glow: ''                 },
    violet:    { bg: 'bg-violet-500/15',  text: 'text-violet-400',    border: 'border-violet-500/20',  glow: ''                 },
    green:     { bg: 'bg-green-500/15',   text: 'text-green-400',     border: 'border-green-500/20',   glow: ''                 },
  };
  const c = colors[color] || colors.primary;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-emergency-400' : 'text-gray-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`card-hover ${critical ? `border-emergency-500/40 ${c.glow}` : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} ${c.border} border flex items-center justify-center`}>
          {Icon && <Icon className={`w-5 h-5 ${c.text}`} />}
        </div>
        {trendValue !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            <span>{trendValue}%</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-end gap-1">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.5 }}
            className="text-3xl font-display font-bold text-white"
          >
            {value}
          </motion.span>
          {unit && <span className="text-sm text-gray-500 mb-1">{unit}</span>}
        </div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
      </div>

      {critical && (
        <div className="mt-3 flex items-center gap-1.5">
          <span className="dot-critical" />
          <span className="text-xs text-emergency-400 font-medium">Needs attention</span>
        </div>
      )}
    </motion.div>
  );
}
