import { format, formatDistanceToNow, parseISO } from 'date-fns';

// ── Date helpers ──────────────────────────────────────────────
export const fmtDate    = (d) => format(typeof d === 'string' ? parseISO(d) : d, 'dd MMM yyyy');
export const fmtTime    = (d) => format(typeof d === 'string' ? parseISO(d) : d, 'hh:mm a');
export const fmtDateTime= (d) => format(typeof d === 'string' ? parseISO(d) : d, 'dd MMM yyyy, hh:mm a');
export const timeAgo    = (d) => formatDistanceToNow(typeof d === 'string' ? parseISO(d) : d, { addSuffix: true });

// ── Severity helpers ─────────────────────────────────────────
export const SEVERITY = {
  CRITICAL: { label: 'Critical', color: 'badge-critical', dot: 'bg-red-500',    score: 4 },
  HIGH:     { label: 'High',     color: 'badge-high',     dot: 'bg-orange-500', score: 3 },
  MEDIUM:   { label: 'Medium',   color: 'badge-medium',   dot: 'bg-yellow-500', score: 2 },
  LOW:      { label: 'Low',      color: 'badge-low',      dot: 'bg-teal-500',   score: 1 },
};

export const getSeverityInfo = (level) => SEVERITY[level?.toUpperCase()] || SEVERITY.LOW;

// ── Vitals helpers ────────────────────────────────────────────
export const VITAL_RANGES = {
  heartRate:   { min: 60,  max: 100, unit: 'bpm',  label: 'Heart Rate'   },
  systolic:    { min: 90,  max: 140, unit: 'mmHg', label: 'Blood Pressure' },
  diastolic:   { min: 60,  max: 90,  unit: 'mmHg', label: 'Diastolic'    },
  temperature: { min: 97,  max: 99,  unit: '°F',   label: 'Temperature'  },
  spo2:        { min: 95,  max: 100, unit: '%',     label: 'SpO₂'         },
  respRate:    { min: 12,  max: 20,  unit: '/min',  label: 'Resp. Rate'   },
};

export const isVitalAbnormal = (key, value) => {
  const r = VITAL_RANGES[key];
  if (!r) return false;
  return value < r.min || value > r.max;
};

export const vitalStatus = (key, value) => {
  if (!value) return 'unknown';
  return isVitalAbnormal(key, value) ? 'abnormal' : 'normal';
};

// ── Simulated IoT vitals generator ───────────────────────────
export const generateVitals = (seed = 0) => ({
  heartRate:   70  + Math.round(Math.sin(seed * 0.3) * 15 + Math.random() * 8),
  systolic:    120 + Math.round(Math.sin(seed * 0.2) * 20 + Math.random() * 10),
  diastolic:   80  + Math.round(Math.sin(seed * 0.25) * 10 + Math.random() * 5),
  temperature: parseFloat((98.2 + Math.sin(seed * 0.1) * 1.2 + Math.random() * 0.3).toFixed(1)),
  spo2:        97  + Math.round(Math.sin(seed * 0.15) * 2),
  respRate:    16  + Math.round(Math.sin(seed * 0.2) * 3 + Math.random() * 2),
  timestamp:   new Date().toISOString(),
});

// ── String helpers ────────────────────────────────────────────
export const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

export const truncate = (str, len = 50) =>
  str?.length > len ? str.slice(0, len) + '…' : str;

// ── Class name utility ────────────────────────────────────────
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// ── Number formatters ─────────────────────────────────────────
export const fmtNumber = (n) => new Intl.NumberFormat('en-IN').format(n);
export const fmtPercent = (n, dec = 1) => `${n.toFixed(dec)}%`;

// ── Avatar color from name ────────────────────────────────────
const AVATAR_COLORS = [
  'from-teal-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-orange-500 to-amber-500',
  'from-pink-500 to-rose-500',
  'from-blue-500 to-indigo-500',
];
export const avatarGradient = (name = '') => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};
