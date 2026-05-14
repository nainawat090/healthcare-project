import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, Star, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { DOCTORS, SYMPTOMS_LIST } from '@/data/dummyData';
import PatientAvatar from '@/components/ui/PatientAvatar';
import toast from 'react-hot-toast';

const STEPS = ['Select Doctor', 'Choose Slot', 'Add Details', 'Confirm'];

const APPOINTMENT_TYPES = ['General Checkup','Follow-up','Emergency Consult','Lab Review','Specialist Consult','Vaccination'];

export default function AppointmentBooking() {
  const [step, setStep]       = useState(0);
  const [doctor, setDoctor]   = useState(null);
  const [slot, setSlot]       = useState(null);
  const [done, setDone]       = useState(false);
  const { register, handleSubmit, watch } = useForm();

  const availDoctors = DOCTORS.filter(d => d.available);
  const selectedSymptoms = watch('symptoms') || [];

  const onSubmit = (data) => {
    setDone(true);
    toast.success('Appointment booked successfully!');
  };

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20 text-center card border-primary-500/30"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-10 h-10 text-primary-400" />
        </motion.div>
        <h2 className="font-display text-2xl font-bold text-white mb-2">Appointment Booked!</h2>
        <p className="text-gray-500 mb-2">Your appointment has been confirmed.</p>
        <div className="bg-dark-600/50 rounded-xl p-4 my-6 text-left space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Doctor:</span><span className="text-white">{doctor?.name}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Slot:</span><span className="text-white">{slot}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Specialty:</span><span className="text-white">{doctor?.specialty}</span></div>
        </div>
        <button onClick={() => { setDone(false); setStep(0); setDoctor(null); setSlot(null); }} className="btn-primary w-full justify-center">
          Book Another
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <Calendar className="w-7 h-7 text-primary-400" /> Book Appointment
        </h1>
        <p className="text-gray-500 mt-1">Schedule a visit with a specialist</p>
      </motion.div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < step  ? 'bg-primary-500 text-white' :
              i === step ? 'bg-primary-500/20 border-2 border-primary-500 text-primary-400' :
                           'bg-dark-600 text-gray-600'
            }`}>{i < step ? '✓' : i + 1}</div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-primary-400 font-medium' : 'text-gray-600'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-primary-500' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 0: Select Doctor */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-semibold text-white">Available Doctors</h2>
              {availDoctors.map(doc => (
                <div key={doc.id}
                  onClick={() => setDoctor(doc)}
                  className={`card-hover cursor-pointer transition-all ${doctor?.id === doc.id ? 'border-primary-500/50 shadow-glow' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <PatientAvatar name={doc.name} size="lg" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{doc.name}</h3>
                      <p className="text-sm text-primary-400">{doc.specialty}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" />{doc.rating}</span>
                        <span>{doc.experience}y experience</span>
                        <span>{doc.slots.length} slots today</span>
                      </div>
                    </div>
                    {doctor?.id === doc.id && <CheckCircle className="w-5 h-5 text-primary-400" />}
                  </div>
                </div>
              ))}
              <button type="button" disabled={!doctor} onClick={() => setStep(1)} className="btn-primary w-full justify-center">
                Continue
              </button>
            </motion.div>
          )}

          {/* Step 1: Choose Slot */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-semibold text-white">Available Time Slots — {doctor?.name}</h2>
              <div className="grid grid-cols-3 gap-3">
                {doctor?.slots.map(s => (
                  <button key={s} type="button" onClick={() => setSlot(s)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-sm font-medium transition-all ${
                      slot === s
                        ? 'bg-primary-500/20 border-primary-500/50 text-primary-400 shadow-glow'
                        : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />{s}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center">Back</button>
                <button type="button" disabled={!slot} onClick={() => setStep(2)} className="btn-primary flex-1 justify-center">Continue</button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Add Details */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-semibold text-white">Appointment Details</h2>

              <div>
                <label className="input-label">Appointment Type</label>
                <select {...register('type')} className="input-field">
                  {APPOINTMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="input-label">Symptoms (select all that apply)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SYMPTOMS_LIST.slice(0, 12).map(s => (
                    <label key={s} className="cursor-pointer">
                      <input {...register('symptoms')} type="checkbox" value={s} className="hidden" />
                      <span className={`text-xs px-3 py-1.5 rounded-full border transition-all block ${
                        selectedSymptoms.includes(s)
                          ? 'bg-primary-500/20 border-primary-500/30 text-primary-400'
                          : 'border-white/10 text-gray-500 hover:border-white/20'
                      }`}>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label">Notes for Doctor (optional)</label>
                <textarea {...register('notes')} rows={3} placeholder="Describe your symptoms in detail..."
                  className="input-field resize-none" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1 justify-center">Back</button>
                <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1 justify-center">Review</button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="font-semibold text-white">Confirm Appointment</h2>
              <div className="card border-primary-500/30 space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500">Doctor</span>
                  <span className="text-white font-medium">{doctor?.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500">Specialty</span>
                  <span className="text-white">{doctor?.specialty}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-gray-500">Time Slot</span>
                  <span className="text-white font-medium">{slot}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Date</span>
                  <span className="text-white">Today</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1 justify-center">Back</button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  <CheckCircle className="w-4 h-4" /> Confirm Booking
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
