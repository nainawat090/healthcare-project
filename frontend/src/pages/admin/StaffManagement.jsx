import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCog, Search, Plus, Star, Phone, Mail } from 'lucide-react';
import PatientAvatar from '@/components/ui/PatientAvatar';
import { DOCTORS } from '@/data/dummyData';

export default function StaffManagement() {
  const [search, setSearch] = useState('');

  const filtered = DOCTORS.filter(d =>
    !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <UserCog className="w-7 h-7 text-primary-400" /> Staff Management
          </h1>
          <p className="text-gray-500 mt-1">Doctor roster and availability overview</p>
        </div>
        <button className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Staff
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Doctors',      val: DOCTORS.length,                       color: 'text-white'        },
          { label: 'Available Today',    val: DOCTORS.filter(d => d.available).length, color: 'text-green-400' },
          { label: 'Avg Rating',         val: '4.7★',                                color: 'text-amber-400'   },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card text-center">
            <div className={`font-display text-3xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or specialty..." className="input-field pl-10" />
      </div>

      {/* Doctor cards grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((doc, i) => (
          <motion.div key={doc.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="card-hover"
          >
            <div className="flex items-start gap-4 mb-4">
              <PatientAvatar name={doc.name} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{doc.name}</h3>
                <p className="text-sm text-primary-400">{doc.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs text-gray-400">{doc.rating} · {doc.experience}y exp</span>
                </div>
              </div>
              <div className={`flex-shrink-0 ${doc.available ? 'dot-online' : 'dot-offline'}`} />
            </div>

            <div className="text-xs text-gray-500 mb-3">
              {doc.available
                ? <span className="text-green-400 font-medium">✓ Available — {doc.slots.length} slots today</span>
                : <span className="text-gray-600">Off duty today</span>}
            </div>

            {/* Available slots */}
            {doc.available && doc.slots.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {doc.slots.map(s => (
                  <span key={s} className="text-xs bg-dark-600/60 border border-white/8 text-gray-400 px-2 py-0.5 rounded-lg font-mono">{s}</span>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-3 border-t border-white/5">
              <button className="btn-ghost text-xs py-1.5 gap-1.5 flex-1 justify-center">
                <Mail className="w-3.5 h-3.5" /> Message
              </button>
              <button className="btn-ghost text-xs py-1.5 gap-1.5 flex-1 justify-center">
                <Phone className="w-3.5 h-3.5" /> Call
              </button>
              <button className="btn-primary text-xs py-1.5 px-3">View</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
