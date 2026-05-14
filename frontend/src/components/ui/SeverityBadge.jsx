import { cn } from '@/utils/helpers';

const CONFIG = {
  CRITICAL: { cls: 'badge-critical', dot: 'bg-red-500',    label: 'Critical' },
  HIGH:     { cls: 'badge-high',     dot: 'bg-orange-500', label: 'High'     },
  MEDIUM:   { cls: 'badge-medium',   dot: 'bg-yellow-500', label: 'Medium'   },
  LOW:      { cls: 'badge-low',      dot: 'bg-teal-500',   label: 'Low'      },
};

export default function SeverityBadge({ level, showDot = true, className }) {
  const c = CONFIG[level?.toUpperCase()] || CONFIG.LOW;
  return (
    <span className={cn(c.cls, 'inline-flex items-center gap-1.5', className)}>
      {showDot && <span className={cn('w-1.5 h-1.5 rounded-full inline-block', c.dot)} />}
      {c.label}
    </span>
  );
}
