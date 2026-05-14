import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Activity, MessageSquare, ChevronRight, Heart, Bell } from 'lucide-react';
import { useAuth }       from '@/context/AuthContext';
import StatsCard         from '@/components/ui/StatsCard';
import VitalsCard        from '@/components/ui/VitalsCard';
import SeverityBadge     from '@/components/ui/SeverityBadge';
import { APPOINTMENTS, HEALTH_RECORDS, NOTIFICATIONS } from '@/data/dummyData';
import { fmtDate, fmtTime } from '@/utils/helpers';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

export default function PatientDashboard() {
  const { user } = useAuth();

  const upcoming = APPOINTMENTS.filter(a => a.status !== 'completed').slice(0, 3);
  const records  = HEALTH_RECORDS.filter(r => r.patientId === 101).slice(0, 4);
  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Good morning, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Patient'}</span> 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's your health overview for today</p>
        </div>
        <div className="flex gap-3">
          <Link to="/patient/book" className="btn-primary text-sm">
            <Calendar className="w-4 h-4" /> Book Appointment
          </Link>
          <Link to="/patient/chat" className="btn-secondary text-sm">
            <MessageSquare className="w-4 h-4" /> AI Chat
          </Link>
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Next Appointment"  value="Feb 5"   icon={Calendar}    color="primary"   delay={0.0} />
        <StatsCard title="Health Score"      value="87"    unit="/100" icon={Heart}  color="green"     delay={0.1} trendValue={3} trend="up" />
        <StatsCard title="Pending Reports"   value="2"       icon={FileText}    color="warning"   delay={0.2} />
        <StatsCard title="Active Alerts"     value="0"       icon={Bell}        color="primary"   delay={0.3} />
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Vitals - col span 2 */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2 }}
          className="lg:col-span-2 card"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-400" /> Live Vitals
            </h2>
            <Link to="/patient/vitals" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              Full view <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <VitalsCard patientId={101} live />
        </motion.div>

        {/* Notifications */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }} className="card">
          <h2 className="font-display font-bold text-white text-lg mb-5 flex items-center gap-2">
            <Bell className="w-5 h-5 text-warning-400" /> Notifications
            {unreadNotifs.length > 0 && (
              <span className="badge-medium ml-auto">{unreadNotifs.length} new</span>
            )}
          </h2>
          <div className="space-y-3">
            {NOTIFICATIONS.slice(0, 4).map(n => (
              <div key={n.id} className={`p-3 rounded-xl border ${n.read ? 'border-white/5 bg-dark-600/30' : 'border-primary-500/20 bg-primary-500/5'}`}>
                <p className="text-xs font-semibold text-gray-200">{n.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                <span className="text-xs text-gray-600 mt-1 block">{n.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Upcoming appointments + Recent records */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.35 }} className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white text-lg">Upcoming Appointments</h2>
            <Link to="/patient/appointments" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcoming.map(apt => (
              <div key={apt.id} className="flex items-center gap-4 p-4 bg-dark-600/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-500/15 border border-primary-500/20 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold text-primary-400 leading-tight">{fmtDate(apt.date).split(' ')[0]}</span>
                  <span className="text-xs text-gray-500">{fmtDate(apt.date).split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{apt.type}</p>
                  <p className="text-xs text-gray-500">{apt.doctorName} · {apt.time}</p>
                </div>
                <span className={apt.status === 'confirmed' ? 'badge-stable' : 'badge-medium'}>{apt.status}</span>
              </div>
            ))}
          </div>
          <Link to="/patient/book" className="btn-primary w-full justify-center mt-4 text-sm">
            <Calendar className="w-4 h-4" /> Book New Appointment
          </Link>
        </motion.div>

        {/* Records */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }} className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white text-lg">Recent Health Records</h2>
            <Link to="/patient/records" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {records.map(r => (
              <div key={r.id} className="flex items-start gap-3 p-4 bg-dark-600/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-xl bg-dark-500 flex items-center justify-center text-lg flex-shrink-0">
                  {r.type === 'Lab Report' ? '🧪' : r.type === 'Prescription' ? '💊' : r.type === 'Imaging' ? '🩻' : '📋'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-primary-400 transition-colors">{r.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{r.summary}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs text-gray-600">{fmtDate(r.date)}</span>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-gray-600">{r.doctor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
