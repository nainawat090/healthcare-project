import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { APPOINTMENTS } from '@/data/dummyData';
import { format, addDays, startOfWeek } from 'date-fns';

const HOURS = ['09:00','09:30','10:00','10:30','11:00','11:30','12:00','13:00','14:00','14:30','15:00','15:30','16:00'];

export default function DoctorSchedule() {
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getAppt = (date, time) =>
    APPOINTMENTS.find(a => a.date === format(date, 'yyyy-MM-dd') && a.time === time);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <Calendar className="w-7 h-7 text-primary-400" /> My Schedule
          </h1>
          <p className="text-gray-500 mt-1">Weekly appointment calendar</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setWeekStart(d => addDays(d, -7))} className="btn-ghost p-2">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-300">
            {format(weekStart, 'dd MMM')} — {format(addDays(weekStart, 4), 'dd MMM yyyy')}
          </span>
          <button onClick={() => setWeekStart(d => addDays(d, 7))} className="btn-ghost p-2">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Calendar grid */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card overflow-x-auto"
      >
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-white/8">
              <th className="text-left py-3 px-4 text-xs text-gray-500 font-medium w-20">Time</th>
              {days.map(d => (
                <th key={d} className="py-3 px-4 text-center">
                  <div className={`text-xs font-medium ${format(d,'yyyy-MM-dd') === format(new Date(),'yyyy-MM-dd') ? 'text-primary-400' : 'text-gray-500'}`}>
                    {format(d, 'EEE')}
                  </div>
                  <div className={`text-lg font-display font-bold ${format(d,'yyyy-MM-dd') === format(new Date(),'yyyy-MM-dd') ? 'text-white' : 'text-gray-600'}`}>
                    {format(d, 'd')}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/4">
            {HOURS.map(hour => (
              <tr key={hour} className="hover:bg-white/1 transition-colors">
                <td className="py-2.5 px-4 text-xs text-gray-600 font-mono">{hour}</td>
                {days.map(day => {
                  const appt = getAppt(day, hour);
                  return (
                    <td key={day} className="py-1.5 px-2">
                      {appt ? (
                        <div className={`rounded-lg px-3 py-2 text-xs cursor-pointer transition-all hover:-translate-y-0.5 ${
                          appt.status === 'confirmed' ? 'bg-primary-500/20 border border-primary-500/30 text-primary-300' :
                          appt.status === 'pending'   ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-300' :
                                                        'bg-dark-600/60 border border-white/8 text-gray-500'
                        }`}>
                          <p className="font-semibold truncate">{appt.patientName.split(' ')[0]}</p>
                          <p className="opacity-70 truncate">{appt.type}</p>
                        </div>
                      ) : (
                        <div className="h-8 rounded-lg border border-dashed border-white/5 hover:border-primary-500/20 transition-colors cursor-pointer" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      {/* Upcoming summary */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
        <h2 className="font-display font-bold text-white text-lg mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-400" /> Upcoming Appointments
        </h2>
        <div className="space-y-3">
          {APPOINTMENTS.filter(a => a.status !== 'completed').map(apt => (
            <div key={apt.id} className="flex items-center gap-4 p-3 bg-dark-600/40 rounded-xl">
              <div className="text-center w-16 flex-shrink-0">
                <p className="text-xs font-bold text-primary-400">{apt.time}</p>
                <p className="text-xs text-gray-500">{apt.date.slice(5)}</p>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{apt.patientName}</p>
                <p className="text-xs text-gray-500">{apt.type}</p>
              </div>
              <span className={apt.status === 'confirmed' ? 'badge-stable' : 'badge-medium'}>{apt.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
