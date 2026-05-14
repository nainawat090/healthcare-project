import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Eye, FileText, Activity } from 'lucide-react';
import SeverityBadge from '@/components/ui/SeverityBadge';
import PatientAvatar from '@/components/ui/PatientAvatar';
import { PATIENTS } from '@/data/dummyData';

export default function DoctorPatients() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = PATIENTS.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Users className="w-7 h-7 text-primary-400" /> My Patients
          </h1>
          <p className="text-gray-500 mt-1">All patients under your care</p>
        </div>
      </motion.div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search patients..." className="input-field pl-10" />
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-white/8">
                {['Patient','Age','Blood','Severity','Status','Actions'].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/4">
              {filtered.map((p, i) => (
                <motion.tr key={p.id}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="hover:bg-white/2 transition-colors cursor-pointer"
                  onClick={() => setSelected(p)}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <PatientAvatar name={p.name} size="sm" />
                      <div>
                        <p className="font-medium text-white">{p.name}</p>
                        <p className="text-xs text-gray-600">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-400">{p.age}</td>
                  <td className="py-3 px-4 text-gray-400 font-mono">{p.blood}</td>
                  <td className="py-3 px-4"><SeverityBadge level={p.severity} /></td>
                  <td className="py-3 px-4">
                    <span className={`capitalize text-xs font-medium ${
                      p.status === 'emergency' ? 'text-emergency-400' :
                      p.status === 'in_care'   ? 'text-primary-400' :
                      p.status === 'waiting'   ? 'text-yellow-400' : 'text-gray-500'
                    }`}>{p.status.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="btn-ghost p-1.5" onClick={e => { e.stopPropagation(); setSelected(p); }}>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="btn-ghost p-1.5"><FileText className="w-3.5 h-3.5" /></button>
                      <button className="btn-ghost p-1.5"><Activity className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Patient detail modal */}
      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="card max-w-md w-full shadow-card-hover"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <PatientAvatar name={selected.name} size="xl" />
              <div>
                <h2 className="font-display font-bold text-white text-xl">{selected.name}</h2>
                <p className="text-sm text-gray-500">Age {selected.age} · {selected.gender === 'M' ? 'Male' : 'Female'}</p>
                <SeverityBadge level={selected.severity} className="mt-1" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Blood Group', val: selected.blood   },
                { label: 'Phone',       val: selected.phone   },
                { label: 'Email',       val: selected.email, span: true },
                { label: 'Status',      val: selected.status.replace('_',' '), capitalize: true },
              ].map(({ label, val, span, capitalize }) => (
                <div key={label} className={`bg-dark-600/50 rounded-xl p-3 ${span ? 'col-span-2' : ''}`}>
                  <p className="text-xs text-gray-500 mb-1">{label}</p>
                  <p className={`text-sm font-medium text-white ${capitalize ? 'capitalize' : ''}`}>{val}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="btn-primary text-sm flex-1 justify-center">
                <FileText className="w-4 h-4" /> View Records
              </button>
              <button onClick={() => setSelected(null)} className="btn-secondary text-sm px-4">Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
