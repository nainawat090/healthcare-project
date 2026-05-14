import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Calendar, Clock, ChevronRight, Brain, AlertTriangle } from 'lucide-react';
import { useAuth }       from '@/context/AuthContext';
import StatsCard         from '@/components/ui/StatsCard';
import SeverityBadge     from '@/components/ui/SeverityBadge';
import PatientAvatar     from '@/components/ui/PatientAvatar';
import { PATIENTS, APPOINTMENTS } from '@/data/dummyData';

const AI_SUGGESTIONS = [
  { patient: 'Ravi Kumar',   suggestion: 'Troponin levels elevated — consider STEMI workup', priority: 'CRITICAL' },
  { patient: 'Priya Singh',  suggestion: 'BP consistently >160 — increase antihypertensive', priority: 'HIGH'     },
  { patient: 'Kavya Nair',   suggestion: 'Persistent fever >3 days — consider CBC and culture', priority: 'HIGH'  },
];

export default function DoctorDashboard() {
  const { user } = useAuth();
  const todayAppts = APPOINTMENTS.filter(a => a.status !== 'completed').slice(0, 4);
  const myPatients = PATIENTS.filter(p => p.doctor === 1).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white">
            Welcome, <span className="gradient-text">{user?.name || 'Doctor'}</span>
          </h1>
          <p className="text-gray-500 mt-1">{user?.specialty} · {new Date().toLocaleDateString('en-IN', { weekday:'long', month:'long', day:'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="dot-online" />
          <span className="text-gray-400">On Duty</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="My Patients"         value="8"  icon={Users}         color="primary" delay={0.0} trendValue={2} trend="up" />
        <StatsCard title="Today's Appointments" value="6"  icon={Calendar}     color="green"   delay={0.1} />
        <StatsCard title="High Risk Patients"   value="3"  icon={AlertTriangle} color="emergency" delay={0.2} critical />
        <StatsCard title="Avg Consult Time"     value="18" unit="min" icon={Clock} color="warning" delay={0.3} />
      </div>

      {/* AI Suggestions Banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card border-primary-500/30 bg-gradient-to-r from-primary-500/8 to-cyan-500/5"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">AI Decision Support</h2>
            <p className="text-xs text-gray-500">Suggestions based on patient data — verify clinically</p>
          </div>
        </div>
        <div className="space-y-3">
          {AI_SUGGESTIONS.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-dark-600/40 rounded-xl">
              <SeverityBadge level={s.priority} />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-white">{s.patient}: </span>
                <span className="text-sm text-gray-400">{s.suggestion}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3 italic">*AI suggestions are decision-support only. Clinical judgment of the attending physician always takes precedence.*</p>
      </motion.div>

      {/* Today's schedule + Patient list */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Schedule */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white text-lg">Today's Schedule</h2>
            <Link to="/doctor/schedule" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              Full schedule <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {todayAppts.map(apt => (
              <div key={apt.id} className="flex items-center gap-3 p-3 bg-dark-600/40 rounded-xl hover:bg-dark-600/60 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary-400">{apt.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{apt.patientName}</p>
                  <p className="text-xs text-gray-500">{apt.type}</p>
                </div>
                <span className={apt.status === 'confirmed' ? 'badge-stable' : 'badge-medium'}>{apt.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* My patients */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-white text-lg">My Patients</h2>
            <Link to="/doctor/patients" className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {myPatients.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-dark-600/40 rounded-xl hover:bg-dark-600/60 transition-colors cursor-pointer">
                <PatientAvatar name={p.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">Age {p.age} · {p.blood}</p>
                </div>
                <SeverityBadge level={p.severity} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
