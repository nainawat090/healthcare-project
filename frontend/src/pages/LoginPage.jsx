import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Heart, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const DEMO_ACCOUNTS = [
  { label: 'Admin',   email: 'admin@hospital.com',     pass: 'Admin@123',   color: 'text-amber-400'   },
  { label: 'Doctor',  email: 'dr.sharma@hospital.com', pass: 'Doctor@123',  color: 'text-violet-400'  },
  { label: 'Patient', email: 'patient@demo.com',        pass: 'Patient@123', color: 'text-primary-400' },
];

export default function LoginPage() {
  const { login, loading } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  const onSubmit = ({ email, password }) => login(email, password);

  const fillDemo = (email, pass) => {
    setValue('email',    email);
    setValue('password', pass);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-dark-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 bg-grid-pattern" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

        <div className="relative">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-white text-2xl">MediAI</span>
          </Link>
        </div>

        <div className="relative space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-display text-4xl font-extrabold text-white leading-tight">
              Healthcare<br />
              <span className="gradient-text">reimagined</span><br />
              with AI
            </h2>
            <p className="text-gray-400 mt-4 leading-relaxed">
              Intelligent patient management, real-time monitoring, and AI-powered diagnostics in one platform.
            </p>
          </motion.div>

          {/* Feature pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-2"
          >
            {['AI Triage', 'Live Vitals', 'Smart Queue', 'EHR Records', 'Chatbot'].map(f => (
              <span key={f} className="bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs px-3 py-1.5 rounded-full">
                {f}
              </span>
            ))}
          </motion.div>
        </div>

        <div className="relative text-xs text-gray-600">
          © 2025 MediAI Healthcare Platform
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="btn-ghost gap-2 mb-8 -ml-2">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h1>
            <p className="text-gray-500">Sign in to your healthcare dashboard</p>
          </div>

          {/* Demo quick-fill */}
          <div className="mb-6 p-4 bg-dark-700/60 border border-white/8 rounded-2xl">
            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Demo Accounts</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_ACCOUNTS.map(({ label, email, pass, color }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => fillDemo(email, pass)}
                  className={`text-xs font-semibold ${color} bg-dark-600 hover:bg-dark-500 border border-white/8 rounded-lg py-2 px-3 transition-colors`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' }
                  })}
                  type="email"
                  placeholder="you@hospital.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && <p className="text-xs text-emergency-400 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-emergency-400 mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
