import { motion } from 'framer-motion';
import { Activity, Download, RefreshCw } from 'lucide-react';
import VitalsCard from '@/components/ui/VitalsCard';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useState, useEffect } from 'react';
import { generateVitals } from '@/utils/helpers';

function buildHistory(n = 20) {
  return Array.from({ length: n }, (_, i) => ({ ...generateVitals(i), time: `${String(9 + Math.floor(i/4)).padStart(2,'0')}:${String((i % 4) * 15).padStart(2,'0')}` }));
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-600 border border-white/10 rounded-xl p-3 text-xs shadow-card">
      <p className="text-gray-300 mb-1">{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex gap-2 items-center py-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-400">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const CHART_CONFIGS = [
  { key: 'heartRate',   name: 'Heart Rate',     color: '#f43f5e', unit: 'bpm',  yDomain: [50, 140] },
  { key: 'spo2',        name: 'SpO₂',           color: '#3b82f6', unit: '%',    yDomain: [90, 100] },
  { key: 'systolic',    name: 'Blood Pressure',  color: '#8b5cf6', unit: 'mmHg', yDomain: [80, 180] },
  { key: 'temperature', name: 'Temperature',     color: '#f59e0b', unit: '°F',   yDomain: [96, 103] },
];

export default function PatientVitals() {
  const [history, setHistory] = useState(buildHistory());

  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prev => {
        const last = prev[prev.length - 1];
        const now  = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return [...prev.slice(-29), { ...generateVitals(prev.length), time: now }];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-primary-400" /> Vitals Monitor
          </h1>
          <p className="text-gray-500 mt-1">Real-time IoT health monitoring dashboard</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary text-sm" onClick={() => setHistory(buildHistory())}>
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button className="btn-primary text-sm">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </motion.div>

      {/* Current vitals */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
        <h2 className="font-display font-bold text-white text-lg mb-5">Current Readings</h2>
        <VitalsCard patientId={101} live />
      </motion.div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {CHART_CONFIGS.map(({ key, name, color, unit, yDomain }, i) => (
          <motion.div key={key}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm text-white">{name}</h3>
              <span className="text-xs text-gray-500 font-mono">{unit}</span>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={history} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis domain={yDomain} tick={{ fill: '#475569', fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey={key} name={name} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        ))}
      </div>

      {/* History table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
        <h2 className="font-display font-bold text-white text-lg mb-4">Readings History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-white/8">
                {['Time','Heart Rate','SpO₂','BP','Temp','Resp Rate','Status'].map(h => (
                  <th key={h} className="text-left pb-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {history.slice(-10).reverse().map((v, i) => (
                <tr key={i} className="hover:bg-white/2 transition-colors">
                  <td className="py-2.5 pr-4 text-gray-400 font-mono text-xs">{v.time}</td>
                  <td className="py-2.5 pr-4 text-gray-200">{v.heartRate} <span className="text-gray-600">bpm</span></td>
                  <td className="py-2.5 pr-4 text-gray-200">{v.spo2}<span className="text-gray-600">%</span></td>
                  <td className="py-2.5 pr-4 text-gray-200">{v.systolic}/{v.diastolic} <span className="text-gray-600">mmHg</span></td>
                  <td className="py-2.5 pr-4 text-gray-200">{v.temperature}<span className="text-gray-600">°F</span></td>
                  <td className="py-2.5 pr-4 text-gray-200">{v.respRate}<span className="text-gray-600">/min</span></td>
                  <td className="py-2.5"><span className="badge-stable">Normal</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
