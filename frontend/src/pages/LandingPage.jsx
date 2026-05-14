import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  Heart, Brain, Shield, Activity, Clock, Users,
  ChevronRight, Star, Zap, Globe, Lock, BarChart3,
  MessageSquare, Calendar, AlertTriangle, ArrowRight
} from 'lucide-react';

// ── Animation variants ────────────────────────────────────────
const fadeUp   = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const fadeIn   = { hidden: { opacity: 0 },         visible: { opacity: 1 }       };
const stagger  = { visible: { transition: { staggerChildren: 0.1 } }             };

function AnimatedSection({ children, className = '' }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

// ── Stats ──────────────────────────────────────────────────────
const STATS = [
  { value: '98%',  label: 'Diagnostic Accuracy',  icon: Brain   },
  { value: '3.2s', label: 'Avg Triage Time',       icon: Zap     },
  { value: '50K+', label: 'Patients Managed',      icon: Users   },
  { value: '24/7', label: 'AI Availability',       icon: Clock   },
];

// ── Features ───────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Brain,       color: 'from-primary-500 to-cyan-500',  glow: 'shadow-glow',
    title: 'AI Symptom Analysis',
    desc:  'Machine learning classifies symptom severity in real-time — Low, Medium, High, or Critical — helping doctors prioritize care instantly.',
  },
  {
    icon: AlertTriangle, color: 'from-emergency-500 to-rose-400', glow: 'shadow-emergency',
    title: 'Emergency Triage',
    desc:  'Automated priority scoring ensures critical cases are never delayed. Integrated alerts keep staff informed 24/7.',
  },
  {
    icon: Activity,    color: 'from-violet-500 to-purple-400',  glow: '',
    title: 'Live Vitals Monitoring',
    desc:  'Simulated IoT streams push real-time heart rate, SpO₂, BP, and temperature data with anomaly detection alerts.',
  },
  {
    icon: MessageSquare, color: 'from-amber-500 to-orange-400', glow: '',
    title: 'AI Patient Chatbot',
    desc:  'Conversational AI assistant guides patients through symptom input, appointment booking, and report explanation — in English and Hindi.',
  },
  {
    icon: Shield,      color: 'from-green-500 to-teal-400',     glow: '',
    title: 'Digital Health Records',
    desc:  'Complete patient history, lab reports, prescriptions, and imaging securely stored with role-based access control.',
  },
  {
    icon: BarChart3,   color: 'from-blue-500 to-indigo-400',    glow: '',
    title: 'Hospital Analytics',
    desc:  'Comprehensive dashboards show bed occupancy, queue trends, department performance, and staff efficiency metrics.',
  },
];

// ── Roles ───────────────────────────────────────────────────────
const ROLES = [
  {
    role: 'Patient', icon: Heart, color: 'text-primary-400', bg: 'from-primary-500/20 to-cyan-500/10', border: 'border-primary-500/30',
    features: ['AI symptom checker', 'Appointment booking', 'Health records access', 'Live vitals dashboard', 'AI chatbot support'],
  },
  {
    role: 'Doctor', icon: Users, color: 'text-violet-400', bg: 'from-violet-500/20 to-purple-500/10', border: 'border-violet-500/30',
    features: ['Patient management', 'AI decision support', 'Schedule management', 'High-risk alerts', 'Clinical analytics'],
  },
  {
    role: 'Admin', icon: Shield, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30',
    features: ['Full hospital overview', 'Queue management', 'Emergency triage', 'Staff management', 'Advanced reporting'],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-white/6">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-white text-xl">MediAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            {['Features','How It Works','Roles','Demo'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(' ','-')}`} className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"    className="btn-ghost text-sm px-4 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-20 w-64 h-64 bg-cyan-500/6 rounded-full blur-2xl pointer-events-none" />

        {/* Floating medical icons */}
        {[
          { icon: Heart,    pos: 'top-32 left-16',   delay: 0   },
          { icon: Activity, pos: 'top-48 right-24',  delay: 1   },
          { icon: Brain,    pos: 'bottom-24 left-24',delay: 0.5 },
          { icon: Shield,   pos: 'bottom-16 right-16',delay: 1.5},
        ].map(({ icon: Icon, pos, delay }) => (
          <motion.div key={pos}
            animate={{ y: [-8, 8, -8] }}
            transition={{ repeat: Infinity, duration: 4 + delay, delay, ease: 'easeInOut' }}
            className={`absolute ${pos} hidden xl:block opacity-20`}
          >
            <div className="w-12 h-12 rounded-2xl bg-primary-500/20 border border-primary-500/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-400" />
            </div>
          </motion.div>
        ))}

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Tag */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium px-4 py-2 rounded-full mb-8"
          >
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Healthcare Platform
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 text-balance"
          >
            Smarter Healthcare,{' '}
            <span className="gradient-text">Powered by AI</span>
          </motion.h1>

          <motion.p variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.2, duration: 0.6 }}
            className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Automate patient workflows, reduce wait times, and improve clinical outcomes
            with intelligent triage, real-time monitoring, and AI-assisted diagnosis.
          </motion.p>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register" className="btn-primary text-base px-8 py-3.5 group">
              Start Free Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3.5">
              View Live Dashboard
            </Link>
          </motion.div>

          {/* Demo credentials */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3 justify-center text-xs text-gray-600"
          >
            {[
              { role: 'Admin',   email: 'admin@hospital.com',     pass: 'Admin@123'   },
              { role: 'Doctor',  email: 'dr.sharma@hospital.com', pass: 'Doctor@123'  },
              { role: 'Patient', email: 'patient@demo.com',       pass: 'Patient@123' },
            ].map(c => (
              <div key={c.role} className="bg-dark-700/60 border border-white/6 rounded-lg px-3 py-2">
                <span className="text-gray-500">{c.role}: </span>
                <span className="font-mono text-gray-400">{c.email}</span>
                <span className="text-gray-600"> / </span>
                <span className="font-mono text-gray-400">{c.pass}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6 border-y border-white/5">
        <AnimatedSection className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }) => (
            <motion.div key={label} variants={fadeUp} className="text-center">
              <Icon className="w-6 h-6 text-primary-400 mx-auto mb-3" />
              <div className="font-display text-4xl font-extrabold text-white mb-1">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </motion.div>
          ))}
        </AnimatedSection>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">Everything a Modern Hospital Needs</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From AI triage to live monitoring — all modules work together to transform patient care.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, glow, title, desc }) => (
              <motion.div key={title} variants={fadeUp}
                className="card group cursor-default hover:border-white/15 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 ${glow} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── Roles ── */}
      <section id="roles" className="py-24 px-6 bg-dark-800/30">
        <AnimatedSection className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <h2 className="section-title mb-4">Built for Every Role</h2>
            <p className="text-gray-400 text-lg">Role-based dashboards tailored to patients, doctors, and administrators.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {ROLES.map(({ role, icon: Icon, color, bg, border, features }) => (
              <motion.div key={role} variants={fadeUp}
                className={`rounded-2xl p-6 bg-gradient-to-br ${bg} border ${border}`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-dark-700/60 flex items-center justify-center mb-5`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className={`font-display font-bold text-xl mb-4 ${color}`}>{role} Portal</h3>
                <ul className="space-y-2.5">
                  {features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <ChevronRight className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/login" className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${color} hover:gap-3 transition-all`}>
                  Access Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp}
            className="card border-primary-500/30 bg-gradient-to-br from-primary-500/10 to-cyan-500/5 shadow-glow-lg"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-glow animate-float">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <h2 className="font-display text-4xl font-extrabold text-white mb-4">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Explore the full platform with demo credentials. No setup required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login" className="btn-primary text-base px-8 py-3.5">
                Launch Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://github.com"
                className="btn-secondary text-base px-8 py-3.5"
                target="_blank" rel="noreferrer"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>
        </AnimatedSection>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/6 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary-500" fill="currentColor" />
            <span>MediAI — AI-Powered Healthcare Platform</span>
          </div>
          <span>Built for hackathons, portfolios &amp; real-world impact</span>
        </div>
      </footer>
    </div>
  );
}
