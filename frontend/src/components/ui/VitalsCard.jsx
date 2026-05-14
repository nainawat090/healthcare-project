import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Wind, Thermometer, Activity, Droplets, Zap } from 'lucide-react';
import { generateVitals, VITAL_RANGES, isVitalAbnormal } from '@/utils/helpers';

const VITAL_CONFIG = [
  { key: 'heartRate',   label: 'Heart Rate',     icon: Heart,       color: 'text-rose-400',   bg: 'bg-rose-500/10',    unit: 'bpm'  },
  { key: 'spo2',        label: 'SpO₂',           icon: Droplets,    color: 'text-blue-400',   bg: 'bg-blue-500/10',    unit: '%'    },
  { key: 'systolic',    label: 'Blood Pressure', icon: Activity,    color: 'text-violet-400', bg: 'bg-violet-500/10',  unit: 'mmHg' },
  { key: 'temperature', label: 'Temperature',    icon: Thermometer, color: 'text-amber-400',  bg: 'bg-amber-500/10',   unit: '°F'   },
  { key: 'respRate',    label: 'Resp. Rate',     icon: Wind,        color: 'text-teal-400',   bg: 'bg-teal-500/10',    unit: '/min' },
  { key: 'diastolic',   label: 'Diastolic',      icon: Zap,         color: 'text-pink-400',   bg: 'bg-pink-500/10',    unit: 'mmHg' },
];

function EcgLine({ abnormal }) {
  return (
    <svg viewBox="0 0 100 30" className="w-16 h-6 opacity-60">
      <polyline
        className={abnormal ? 'stroke-emergency-400' : 'stroke-primary-400'}
        strokeWidth="1.5"
        fill="none"
        points="0,15 10,15 15,15 20,5 25,25 30,15 35,15 45,15 50,8 55,22 60,15 65,15 75,15 80,10 85,20 90,15 100,15"
        style={{ strokeDasharray: 200, strokeDashoffset: 200, animation: 'ecgDraw 2s linear infinite' }}
      />
    </svg>
  );
}

export default function VitalsCard({ patientId, live = false }) {
  const [vitals, setVitals]     = useState(generateVitals(0));
  const [tick, setTick]         = useState(0);
  const [changed, setChanged]   = useState({});

  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      setTick(t => {
        const t2 = t + 1;
        const next = generateVitals(t2);
        setChanged(prev => {
          const c = {};
          VITAL_CONFIG.forEach(({ key }) => { if (next[key] !== prev[key]) c[key] = true; });
          return c;
        });
        setVitals(next);
        return t2;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [live]);

  return (
    <div className="space-y-3">
      {/* Live indicator */}
      {live && (
        <div className="flex items-center gap-2">
          <span className="dot-online" />
          <span className="text-xs text-gray-400 font-medium">Live monitoring active</span>
          <span className="ml-auto text-xs text-gray-600 font-mono">{new Date().toLocaleTimeString()}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {VITAL_CONFIG.map(({ key, label, icon: Icon, color, bg, unit }) => {
          const value    = vitals[key];
          const abnormal = isVitalAbnormal(key, value);
          const isNew    = changed[key];

          return (
            <motion.div
              key={key}
              animate={isNew ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={`vital-card ${abnormal ? 'border-emergency-500/40 bg-emergency-500/5' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${abnormal ? 'text-emergency-400' : color}`} />
                </div>
                {live && <EcgLine abnormal={abnormal} />}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{   opacity: 0, y:  4 }}
                  transition={{ duration: 0.2 }}
                  className={`text-2xl font-display font-bold ${abnormal ? 'text-emergency-400' : 'text-white'}`}
                >
                  {value}
                  <span className="text-xs font-normal text-gray-500 ml-1">{unit}</span>
                </motion.div>
              </AnimatePresence>

              <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
                <span>{label}</span>
                {abnormal && <span className="text-emergency-400 font-semibold">⚠ Alert</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Abnormal summary */}
      {VITAL_CONFIG.some(({ key }) => isVitalAbnormal(key, vitals[key])) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-emergency-500/10 border border-emergency-500/30 rounded-xl p-3 flex items-center gap-3"
        >
          <span className="text-emergency-400 text-lg">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-emergency-400">Abnormal vitals detected</p>
            <p className="text-xs text-gray-400 mt-0.5">Please consult your doctor immediately.</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
