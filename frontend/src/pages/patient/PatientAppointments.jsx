import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Clock, User, CheckCircle, XCircle, Loader } from 'lucide-react';
import { APPOINTMENTS } from '@/data/dummyData';
import { fmtDate } from '@/utils/helpers';

const STATUS_CONFIG = {
  confirmed:  { label: 'Confirmed',  cls: 'badge-stable',  icon: CheckCircle, color: 'text-green-400'   },
  pending:    { label: 'Pending',    cls: 'badge-medium',  icon: Loader,      color: 'text-yellow-400'  },
  completed:  { label: 'Completed',  cls: 'badge-low',     icon: CheckCircle, color: 'text-teal-400'    },
  cancelled:  { label: 'Cancelled',  cls: 'badge-high',    icon: XCircle,     color: 'text-orange-400'  },
};

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

export default function PatientAppointments() {
  const [tab, setTab] = useState('All');

  const filtered = APPOINTMENTS.filter(a => {
    if (tab === 'Upcoming')  return ['confirmed','pending'].includes(a.status);
    if (tab === 'Completed') return a.status === 'completed';
    if (tab === 'Cancelled') return a.status === 'cancelled';
    return true;
  });

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-primary-400" /> My Appointments
          </h1>
          <p className="text-gray-500 mt-1">Manage all your scheduled appointments</p>
        </div>
        <Link to="/patient/book" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Book Appointment
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total',    val: APPOINTMENTS.length,                             color: 'text-white'        },
          { label: 'Upcoming', val: APPOINTMENTS.filter(a => a.status !== 'completed').length, color: 'text-primary-400' },
          { label: 'Completed',val: APPOINTMENTS.filter(a => a.status === 'completed').length, color: 'text-green-400'   },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card text-center">
            <div className={`font-display text-3xl font-bold ${s.color}`}>{s.val}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-dark-700/50 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? 'bg-primary-500 text-white shadow-glow' : 'text-gray-500 hover:text-gray-300'
            }`}
          >{t}</button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map((apt, i) => {
          const sc = STATUS_CONFIG[apt.status];
          const StatusIcon = sc.icon;
          return (
            <motion.div key={apt.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="card-hover flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Date block */}
              <div className="w-16 h-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex flex-col items-center justify-center text-center flex-shrink-0">
                <span className="text-lg font-display font-bold text-primary-400 leading-tight">{fmtDate(apt.date).split(' ')[0]}</span>
                <span className="text-xs text-gray-500">{fmtDate(apt.date).split(' ')[1].slice(0,3)}</span>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white">{apt.type}</h3>
                  <span className={sc.cls}>{sc.label}</span>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />{apt.doctorName}</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{apt.time}</span>
                </div>
                {apt.notes && <p className="text-xs text-gray-600 mt-1.5">{apt.notes}</p>}
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {apt.status === 'confirmed' && (
                  <button className="btn-danger text-xs py-1.5 px-3 gap-1.5">Cancel</button>
                )}
                <button className="btn-secondary text-xs py-1.5 px-3">Details</button>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No appointments found</p>
            <Link to="/patient/book" className="btn-primary text-sm mt-4 inline-flex">
              <Plus className="w-4 h-4" /> Book Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
