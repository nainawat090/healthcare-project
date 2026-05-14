import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Heart, Mail, Lock, User, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const { register: registerUser, loading } = useAuth();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { role: 'patient' } });

  const onSubmit = (data) => registerUser(data);
  const role = watch('role');

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Link to="/" className="btn-ghost gap-2 mb-8 -ml-2">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-gray-500">Join MediAI Healthcare Platform</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role selection */}
          <div>
            <label className="input-label">Account Type</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'patient', label: 'Patient', color: 'text-primary-400' },
                { val: 'doctor',  label: 'Doctor',  color: 'text-violet-400'  },
                { val: 'admin',   label: 'Admin',   color: 'text-amber-400'   },
              ].map(({ val, label, color }) => (
                <label key={val} className={`cursor-pointer border rounded-xl p-3 text-center text-sm font-semibold transition-all
                  ${role === val ? `${color} bg-dark-600 border-white/20` : 'text-gray-500 border-white/8 hover:border-white/15'}`}>
                  <input {...register('role')} type="radio" value={val} className="hidden" />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="input-label">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input {...register('name', { required: 'Name is required' })}
                placeholder="Dr. Raj Sharma" className="input-field pl-10" />
            </div>
            {errors.name && <p className="text-xs text-emergency-400 mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
              })} type="email" placeholder="you@hospital.com" className="input-field pl-10" />
            </div>
            {errors.email && <p className="text-xs text-emergency-400 mt-1">{errors.email.message}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="input-label">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input {...register('phone')} placeholder="+91 98765 43210" className="input-field pl-10" />
            </div>
          </div>

          {/* Doctor-specific */}
          {role === 'doctor' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <label className="input-label">Specialty</label>
              <select {...register('specialty')} className="input-field">
                <option value="">Select specialty</option>
                {['Cardiology','General Medicine','Neurology','Pediatrics','Orthopedics','Dermatology','Gynecology','Psychiatry'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Patient-specific */}
          {role === 'patient' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="grid grid-cols-2 gap-4"
            >
              <div>
                <label className="input-label">Age</label>
                <input {...register('age')} type="number" min="0" max="120" placeholder="25" className="input-field" />
              </div>
              <div>
                <label className="input-label">Blood Group</label>
                <select {...register('blood_group')} className="input-field">
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}

          {/* Password */}
          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Min 6 characters' }
              })} type="password" placeholder="Min 6 characters" className="input-field pl-10" />
            </div>
            {errors.password && <p className="text-xs text-emergency-400 mt-1">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base mt-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
