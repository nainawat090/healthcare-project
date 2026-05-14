import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, Globe, Search, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp }  from '@/context/AppContext';
import { NOTIFICATIONS } from '@/data/dummyData';
import { timeAgo } from '@/utils/helpers';

export default function Topbar({ role }) {
  const { user } = useAuth();
  const { language, dispatch, activeEmergencies } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const unread = NOTIFICATIONS.filter(n => !n.read).length;

  const notifIcon = { emergency: '🚨', appointment: '📅', lab: '🧪', system: '⚙️' };

  return (
    <header className="h-16 bg-dark-800/80 backdrop-blur-md border-b border-white/6 flex items-center justify-between px-6 flex-shrink-0 relative z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })}
          className="btn-ghost p-2"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-dark-700/60 border border-white/8 rounded-xl px-4 py-2 w-64 group focus-within:border-primary-500/40">
          <Search className="w-4 h-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
          <input
            type="text"
            placeholder={language === 'hi' ? 'खोजें...' : 'Search patients, records...'}
            className="bg-transparent text-sm text-gray-300 placeholder-gray-600 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Emergency badge */}
        {(activeEmergencies > 0 || role === 'admin') && (
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="hidden sm:flex items-center gap-1.5 bg-emergency-500/15 border border-emergency-500/30 text-emergency-400 text-xs font-semibold px-3 py-1.5 rounded-full"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>2 Emergency</span>
          </motion.div>
        )}

        {/* Language toggle */}
        <button
          onClick={() => dispatch({ type: 'SET_LANGUAGE', payload: language === 'en' ? 'hi' : 'en' })}
          className="btn-ghost p-2 text-xs font-mono font-semibold gap-1"
          title="Toggle Language"
        >
          <Globe className="w-4 h-4" />
          <span className="hidden sm:inline">{language === 'en' ? 'EN' : 'HI'}</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(v => !v)}
            className="btn-ghost p-2 relative"
          >
            <Bell className="w-5 h-5" />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emergency-500 rounded-full animate-ping-slow" />
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0,  scale: 1    }}
                exit={   { opacity: 0, y: 8,  scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-dark-700 border border-white/10 rounded-2xl shadow-card-hover overflow-hidden"
              >
                <div className="flex items-center justify-between p-4 border-b border-white/8">
                  <span className="font-semibold text-sm">Notifications</span>
                  <span className="badge-critical text-xs">{unread} new</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {NOTIFICATIONS.map(n => (
                    <div key={n.id} className={`p-4 border-b border-white/5 hover:bg-white/3 transition-colors cursor-pointer ${!n.read ? 'bg-primary-500/5' : ''}`}>
                      <div className="flex gap-3">
                        <span className="text-lg mt-0.5">{notifIcon[n.type]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-gray-200">{n.title}</span>
                            {!n.read && <span className="w-1.5 h-1.5 bg-primary-400 rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                          <span className="text-xs text-gray-600 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full p-3 text-xs text-primary-400 hover:text-primary-300 font-medium transition-colors">
                  View all notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
          {user?.name?.charAt(0) || 'U'}
        </div>
      </div>
    </header>
  );
}
