import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, MapPin, Clock, Heart, Zap } from 'lucide-react';
import PatientAvatar from '@/components/ui/PatientAvatar';
import VitalsCard    from '@/components/ui/VitalsCard';
import { PATIENTS }  from '@/data/dummyData';

const EMERGENCY_CASES = PATIENTS.filter(p => ['CRITICAL','HIGH'].includes(p.severity));

const TRIAGE_PROTOCOL = [
  { color: 'bg-red-500',    label: 'Red — Immediate',   desc: 'Life-threatening, needs immediate care',      count: 2 },
  { color: 'bg-orange-500', label: 'Orange — Urgent',   desc: 'Serious condition, seen within 15 minutes',   count: 3 },
  { color: 'bg-yellow-500', label: 'Yellow — Semi-urgent',desc:'Non-critical, seen within 30 minutes',       count: 4 },
  { color: 'bg-green-500',  label: 'Green — Non-urgent', desc: 'Minor injury or illness, seen within 2 hrs', count: 8 },
];

export default function EmergencyTriage() {
  const [selected, setSelected] = useState(EMERGENCY_CASES[0]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <AlertTriangle className="w-7 h-7 text-emergency-400 animate-pulse" />
            Emergency Triage
          </h1>
          <p className="text-gray-500 mt-1">Critical case management and prioritization</p>
        </div>
        <div className="flex items-center gap-2 bg-emergency-500/15 border border-emergency-500/30 text-emergency-400 px-4 py-2 rounded-xl">
          <span className="dot-critical" />
          <span className="text-sm font-semibold">2 Critical Active</span>
        </div>
      </motion.div>

      {/* Triage color codes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TRIAGE_PROTOCOL.map(t => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card flex items-start gap-3"
          >
            <div className={`w-4 h-10 rounded-full ${t.color} flex-shrink-0 mt-0.5`} />
            <div>
              <p className="text-xs font-bold text-white">{t.label}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t.desc}</p>
              <p className={`text-lg font-display font-bold mt-1 ${t.color.replace('bg-','text-')}`}>{t.count}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Emergency cases */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Case list */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="font-display font-bold text-white text-lg">Active Emergency Cases</h2>
          {EMERGENCY_CASES.map(p => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className={`w-full text-left card transition-all ${
                selected?.id === p.id ? 'border-emergency-500/50 shadow-emergency' : 'hover:border-white/15'
              }`}
            >
              <div className="flex items-center gap-3">
                <PatientAvatar name={p.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">Age {p.age} · {p.blood}</p>
                </div>
                <div className="text-right">
                  <span className={p.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}>{p.severity}</span>
                  <div className={`mt-1 ${p.severity === 'CRITICAL' ? 'dot-critical' : 'dot-online'}`} />
                </div>
              </div>
            </button>
          ))}
        </motion.div>

        {/* Case detail */}
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={selected.id}
            className="lg:col-span-2 space-y-4"
          >
            {/* Patient header */}
            <div className="card border-emergency-500/30">
              <div className="flex items-center gap-4 mb-4">
                <PatientAvatar name={selected.name} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="font-display font-bold text-white text-xl">{selected.name}</h2>
                    <span className={selected.severity === 'CRITICAL' ? 'badge-critical' : 'badge-high'}>{selected.severity}</span>
                  </div>
                  <p className="text-sm text-gray-500">Age {selected.age} · Blood {selected.blood} · {selected.gender === 'M' ? 'Male' : 'Female'}</p>
                </div>
              </div>

              {/* Emergency actions */}
              <div className="grid grid-cols-2 gap-3">
                <button className="btn-danger justify-center">
                  <Phone className="w-4 h-4" /> Alert Doctor
                </button>
                <button className="btn-secondary justify-center">
                  <MapPin className="w-4 h-4" /> Assign Bed
                </button>
                <button className="btn-secondary justify-center">
                  <Heart className="w-4 h-4" /> Lab Orders
                </button>
                <button className="btn-secondary justify-center">
                  <Zap className="w-4 h-4" /> ICU Request
                </button>
              </div>
            </div>

            {/* Live vitals */}
            <div className="card">
              <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
                <span className="dot-critical" /> Live Vitals Monitoring
              </h3>
              <VitalsCard patientId={selected.id} live />
            </div>

            {/* AI triage suggestion */}
            <div className="card border-primary-500/30 bg-primary-500/5">
              <h3 className="font-semibold text-primary-400 mb-3 flex items-center gap-2">
                🤖 AI Triage Recommendation
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Based on presenting symptoms and vitals, this patient shows signs consistent with <strong className="text-white">acute cardiac event</strong>.
                Immediate ECG, troponin levels, and cardiology consult recommended.
                Do NOT leave unattended. IV access and oxygen therapy should be initiated immediately.
              </p>
              <p className="text-xs text-gray-600 mt-3 italic">
                *AI suggestion for reference only. Clinical judgment of attending physician takes precedence.*
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
