import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, ChevronUp, ChevronDown, UserCheck } from 'lucide-react';
import SeverityBadge from '@/components/ui/SeverityBadge';
import PatientAvatar from '@/components/ui/PatientAvatar';
import { QUEUE_DATA }    from '@/data/dummyData';

export default function PatientQueue() {
  const [queue, setQueue]   = useState(QUEUE_DATA);
  const [search, setSearch] = useState('');

  const filtered = queue.filter(q =>
    !search || q.patient.name.toLowerCase().includes(search.toLowerCase())
  );

  const moveUp   = (i) => {
    if (i === 0) return;
    const next = [...queue];
    [next[i-1], next[i]] = [next[i], next[i-1]];
    setQueue(next.map((q, idx) => ({ ...q, position: idx + 1 })));
  };
  const moveDown = (i) => {
    if (i === queue.length - 1) return;
    const next = [...queue];
    [next[i], next[i+1]] = [next[i+1], next[i]];
    setQueue(next.map((q, idx) => ({ ...q, position: idx + 1 })));
  };
  const remove   = (id) => setQueue(q => q.filter(p => p.patient.id !== id).map((p, i) => ({ ...p, position: i + 1 })));

  const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  const sortBySeverity = () => {
    setQueue(q => [...q].sort((a, b) => (SEVERITY_ORDER[a.patient.severity] ?? 9) - (SEVERITY_ORDER[b.patient.severity] ?? 9))
      .map((p, i) => ({ ...p, position: i + 1 })));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-primary-400" /> Patient Queue
          </h1>
          <p className="text-gray-500 mt-1">Manage and prioritize patient intake order</p>
        </div>
        <div className="flex gap-3">
          <button onClick={sortBySeverity} className="btn-secondary text-sm">
            <Filter className="w-4 h-4" /> Sort by Severity
          </button>
          <div className="flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold px-4 py-2 rounded-xl">
            <Users className="w-4 h-4" />
            <span>{queue.length} in queue</span>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search patients..." className="input-field pl-10" />
      </div>

      {/* Queue items */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((q, i) => (
            <motion.div key={q.patient.id}
              layout
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              transition={{ delay: i * 0.04 }}
              className={`card-hover flex flex-col sm:flex-row sm:items-center gap-4 ${
                q.patient.severity === 'CRITICAL' ? 'border-emergency-500/40 shadow-emergency/20' :
                q.patient.severity === 'HIGH'     ? 'border-orange-500/30' : ''
              }`}
            >
              {/* Position */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-xl flex-shrink-0 ${
                q.position === 1 ? 'bg-primary-500 text-white shadow-glow' :
                q.position <= 3  ? 'bg-primary-500/20 text-primary-400' :
                                   'bg-dark-600 text-gray-500'
              }`}>
                {q.position}
              </div>

              {/* Patient info */}
              <PatientAvatar name={q.patient.name} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{q.patient.name}</h3>
                  <SeverityBadge level={q.patient.severity} />
                  {q.patient.severity === 'CRITICAL' && (
                    <span className="text-xs text-emergency-400 font-semibold animate-pulse">⚠️ EMERGENCY</span>
                  )}
                </div>
                <p className="text-xs text-gray-500">Age {q.patient.age} · {q.patient.blood} · Arrived {q.arrivalTime}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {q.symptoms.map(s => (
                    <span key={s} className="text-xs bg-dark-600/60 text-gray-400 border border-white/8 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {/* Wait time */}
              <div className="text-center flex-shrink-0">
                <div className="text-2xl font-display font-bold text-white">{q.waitTime}</div>
                <div className="text-xs text-gray-500">min wait</div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col gap-1">
                  <button onClick={() => moveUp(i)}   className="btn-ghost p-1.5"><ChevronUp   className="w-3.5 h-3.5" /></button>
                  <button onClick={() => moveDown(i)} className="btn-ghost p-1.5"><ChevronDown className="w-3.5 h-3.5" /></button>
                </div>
                <button
                  onClick={() => remove(q.patient.id)}
                  className="btn-primary text-xs py-2 px-3 gap-1.5 whitespace-nowrap"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Admit
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">Queue is empty</p>
        </div>
      )}
    </div>
  );
}
