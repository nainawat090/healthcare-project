import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Download, Eye, Plus } from 'lucide-react';
import { HEALTH_RECORDS } from '@/data/dummyData';
import { fmtDate } from '@/utils/helpers';

const TYPE_ICONS = {
  'Lab Report':  { icon: '🧪', color: 'text-blue-400',   bg: 'bg-blue-500/10'   },
  'Prescription':{ icon: '💊', color: 'text-green-400',  bg: 'bg-green-500/10'  },
  'Imaging':     { icon: '🩻', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  'ECG':         { icon: '❤️', color: 'text-rose-400',   bg: 'bg-rose-500/10'   },
  'Emergency':   { icon: '🚨', color: 'text-red-400',    bg: 'bg-red-500/10'    },
};

const FILTER_TYPES = ['All', 'Lab Report', 'Prescription', 'Imaging', 'ECG', 'Emergency'];

export default function PatientRecords() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('All');
  const [selected, setSelected] = useState(null);

  const filtered = HEALTH_RECORDS.filter(r => {
    const matchType   = filter === 'All' || r.type === filter;
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.summary.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <FileText className="w-7 h-7 text-primary-400" /> Health Records
          </h1>
          <p className="text-gray-500 mt-1">Your complete medical history and documents</p>
        </div>
        <button className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Upload Record
        </button>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search records, reports..." className="input-field pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
          {FILTER_TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`flex-shrink-0 text-sm px-4 py-2.5 rounded-xl border font-medium transition-all ${
                filter === t
                  ? 'bg-primary-500/15 border-primary-500/30 text-primary-400'
                  : 'bg-dark-700/60 border-white/8 text-gray-500 hover:text-gray-300'
              }`}
            >{t}</button>
          ))}
        </div>
      </motion.div>

      {/* Records grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((r, i) => {
          const tc = TYPE_ICONS[r.type] || TYPE_ICONS['Lab Report'];
          return (
            <motion.div key={r.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="card-hover cursor-pointer group"
              onClick={() => setSelected(r)}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${tc.bg} flex items-center justify-center text-2xl flex-shrink-0`}>
                  {tc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">{r.title}</h3>
                    <span className={`text-xs font-medium ${tc.color} flex-shrink-0`}>{r.type}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{r.summary}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xs text-gray-600">{fmtDate(r.date)}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-600">{r.doctor}</span>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {r.tags.map(tag => (
                      <span key={tag} className="text-xs bg-dark-600 text-gray-500 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="btn-ghost text-xs py-1.5 gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button className="btn-ghost text-xs py-1.5 gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium">No records found</p>
          <p className="text-sm mt-1">Try changing your search or filter</p>
        </div>
      )}

      {/* Record detail modal */}
      {selected && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="card max-w-lg w-full shadow-card-hover"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-4">
              <div className={`w-14 h-14 rounded-xl ${TYPE_ICONS[selected.type]?.bg} flex items-center justify-center text-3xl`}>
                {TYPE_ICONS[selected.type]?.icon}
              </div>
              <div className="flex-1">
                <h2 className="font-display font-bold text-white text-xl">{selected.title}</h2>
                <p className="text-sm text-gray-500">{selected.type} · {fmtDate(selected.date)}</p>
              </div>
            </div>
            <div className="bg-dark-600/50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-300 leading-relaxed">{selected.summary}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>Issued by: <span className="text-gray-300">{selected.doctor}</span></span>
              <span>Date: <span className="text-gray-300">{fmtDate(selected.date)}</span></span>
            </div>
            <div className="flex gap-3">
              <button className="btn-primary text-sm flex-1 justify-center">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={() => setSelected(null)} className="btn-secondary text-sm px-4">Close</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
