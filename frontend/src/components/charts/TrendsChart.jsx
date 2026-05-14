import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import { TRENDS_DATA } from '@/data/dummyData';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-600 border border-white/10 rounded-xl p-3 shadow-card text-xs">
      <p className="font-semibold text-gray-300 mb-2">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-400 capitalize">{p.dataKey}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function TrendsChart({ data = TRENDS_DATA }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="gradPatients" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#14b8a3" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#14b8a3" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="gradEmergencies" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="gradAppointments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis  tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#64748b', paddingTop: 12 }}
          formatter={v => <span style={{ color: '#94a3b8' }}>{v}</span>}
        />
        <Area type="monotone" dataKey="patients"     stroke="#14b8a3" strokeWidth={2} fill="url(#gradPatients)"     dot={{ r: 3, fill: '#14b8a3' }} />
        <Area type="monotone" dataKey="emergencies"  stroke="#f43f5e" strokeWidth={2} fill="url(#gradEmergencies)"  dot={{ r: 3, fill: '#f43f5e' }} />
        <Area type="monotone" dataKey="appointments" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradAppointments)" dot={{ r: 3, fill: '#8b5cf6' }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
