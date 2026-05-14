import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { TrendsChart }       from '@/components/charts/TrendsChart';
import { DepartmentBarChart, DepartmentPieChart } from '@/components/charts/DepartmentChart';
import { ANALYTICS_OVERVIEW, TRENDS_DATA } from '@/data/dummyData';
import StatsCard from '@/components/ui/StatsCard';
import { Users, Calendar, AlertTriangle, Clock } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell
} from 'recharts';

const WEEKLY_DATA = [
  { day: 'Mon', patients: 38, emergency: 4 },
  { day: 'Tue', patients: 52, emergency: 7 },
  { day: 'Wed', patients: 45, emergency: 3 },
  { day: 'Thu', patients: 61, emergency: 9 },
  { day: 'Fri', patients: 49, emergency: 5 },
  { day: 'Sat', patients: 34, emergency: 6 },
  { day: 'Sun', patients: 28, emergency: 2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-600 border border-white/10 rounded-xl p-3 text-xs shadow-card">
      <p className="font-semibold text-gray-300 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const s = ANALYTICS_OVERVIEW;
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-primary-400" /> Analytics & Reports
          </h1>
          <p className="text-gray-500 mt-1">Hospital performance metrics and insights</p>
        </div>
        <button className="btn-secondary text-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Patients"    value="1,248" icon={Users}         color="primary"   trendValue={12} trend="up"   delay={0} />
        <StatsCard title="Avg Wait Time"     value="23"  unit="min" icon={Clock} color="warning"  trendValue={8}  trend="down" delay={0.1} />
        <StatsCard title="Appointments"      value="420"   icon={Calendar}      color="green"     trendValue={15} trend="up"   delay={0.2} />
        <StatsCard title="Emergency Cases"   value="67"    icon={AlertTriangle} color="emergency" trendValue={5}  trend="up"   delay={0.3} critical />
      </div>

      {/* Trend + Weekly */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
          <h2 className="font-display font-bold text-white text-lg mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" /> Monthly Trends
          </h2>
          <TrendsChart />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
          <h2 className="font-display font-bold text-white text-lg mb-5">This Week</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={WEEKLY_DATA} margin={{ top: 5, right: 10, bottom: 0, left: -20 }} barSize={16} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="patients"  fill="#14b8a3" radius={[4,4,0,0]} name="Patients"  />
              <Bar dataKey="emergency" fill="#f43f5e" radius={[4,4,0,0]} name="Emergency" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Department breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <h2 className="font-display font-bold text-white text-lg mb-5">Patients by Department</h2>
          <DepartmentPieChart />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
          <h2 className="font-display font-bold text-white text-lg mb-5">Department Bar</h2>
          <DepartmentBarChart />
        </motion.div>
      </div>
    </div>
  );
}
