import { motion } from 'framer-motion';
import { Users, AlertTriangle, Calendar, Activity, Clock, BedDouble, Stethoscope, TrendingUp } from 'lucide-react';
import StatsCard             from '@/components/ui/StatsCard';
import SeverityBadge         from '@/components/ui/SeverityBadge';
import PatientAvatar         from '@/components/ui/PatientAvatar';
import { TrendsChart }       from '@/components/charts/TrendsChart';
import { DepartmentPieChart } from '@/components/charts/DepartmentChart';
import { ANALYTICS_OVERVIEW, PATIENTS, QUEUE_DATA } from '@/data/dummyData';
import { fmtNumber } from '@/utils/helpers';

export default function AdminDashboard() {
  const stats = ANALYTICS_OVERVIEW;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white">Hospital Overview</h1>
        <p className="text-gray-500 mt-1">
          Real-time dashboard — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Emergency banner */}
      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.1 }}
        className="bg-emergency-500/10 border border-emergency-500/30 rounded-2xl p-4 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-emergency-500/20 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5 text-emergency-400 animate-pulse" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-emergency-400 text-sm">⚠️ 2 Critical Cases Require Immediate Attention</p>
          <p className="text-xs text-gray-500 mt-0.5">Patient Ravi Kumar (ICU-2) and Meena Kumari (ICU-4) — vitals unstable</p>
        </div>
        <button className="btn-danger text-xs py-2 px-4 flex-shrink-0">View Emergency</button>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Patients"      value={fmtNumber(stats.totalPatients)}  icon={Users}       color="primary"   trendValue={12} trend="up"   delay={0.0} />
        <StatsCard title="Today's Admissions"  value={stats.todayAdmissions}           icon={Calendar}    color="green"     trendValue={8}  trend="up"   delay={0.1} />
        <StatsCard title="Emergency Cases"     value={stats.emergencyCases}            icon={AlertTriangle} color="emergency" trendValue={5} trend="up" delay={0.2} critical />
        <StatsCard title="Avg Wait Time"       value={stats.avgWaitTime}   unit="min"  icon={Clock}       color="warning"   trendValue={3}  trend="down" delay={0.3} />
        <StatsCard title="Bed Occupancy"       value={stats.bedOccupancy}  unit="%"    icon={BedDouble}   color="violet"    trendValue={2}  trend="up"   delay={0.4} />
        <StatsCard title="Appointments Today"  value={stats.appointmentsToday}         icon={Calendar}    color="primary"   trendValue={15} trend="up"   delay={0.5} />
        <StatsCard title="Discharged Today"    value={stats.dischargedToday}           icon={TrendingUp}  color="green"     trendValue={10} trend="up"   delay={0.6} />
        <StatsCard title="Doctors on Duty"     value={stats.doctorsOnDuty}             icon={Stethoscope} color="primary"   delay={0.7} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Trends */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="card lg:col-span-2"
        >
          <h2 className="font-display font-bold text-white text-lg mb-5 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-400" /> Patient Trends (6 months)
          </h2>
          <TrendsChart />
        </motion.div>

        {/* Department pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="card">
          <h2 className="font-display font-bold text-white text-lg mb-5">By Department</h2>
          <DepartmentPieChart />
        </motion.div>
      </div>

      {/* Queue + High risk */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Live queue */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
          <h2 className="font-display font-bold text-white text-lg mb-5 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-400" /> Current Queue
            <span className="ml-auto badge-medium">{QUEUE_DATA.length} waiting</span>
          </h2>
          <div className="space-y-3">
            {QUEUE_DATA.slice(0, 5).map(q => (
              <div key={q.position} className="flex items-center gap-3 p-3 bg-dark-600/40 rounded-xl hover:bg-dark-600/60 transition-colors">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  q.position === 1 ? 'bg-primary-500 text-white' : 'bg-dark-500 text-gray-400'
                }`}>{q.position}</span>
                <PatientAvatar name={q.patient.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{q.patient.name}</p>
                  <p className="text-xs text-gray-500">{q.symptoms.join(', ')}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <SeverityBadge level={q.patient.severity} />
                  <p className="text-xs text-gray-600 mt-1">{q.waitTime}m wait</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* High risk patients */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="card">
          <h2 className="font-display font-bold text-white text-lg mb-5 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-emergency-400" /> High Risk Patients
          </h2>
          <div className="space-y-3">
            {PATIENTS.filter(p => ['CRITICAL','HIGH'].includes(p.severity)).map(p => (
              <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border ${
                p.severity === 'CRITICAL' ? 'bg-emergency-500/8 border-emergency-500/20' : 'bg-orange-500/8 border-orange-500/20'
              }`}>
                <PatientAvatar name={p.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">{p.name}</p>
                  <p className="text-xs text-gray-500">Age {p.age} · {p.blood}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <SeverityBadge level={p.severity} />
                  <p className="text-xs text-gray-600 mt-1 capitalize">{p.status.replace('_',' ')}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
