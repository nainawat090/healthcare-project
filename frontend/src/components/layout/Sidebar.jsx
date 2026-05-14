import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Users, Calendar, FileText, Activity,
  AlertTriangle, BarChart3, MessageSquare, Settings,
  Stethoscope, Heart, ClipboardList, UserCog, LogOut, X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp }  from '@/context/AppContext';
import { initials, avatarGradient } from '@/utils/helpers';

const NAV_ITEMS = {
  patient: [
    { path: '/patient/dashboard',    icon: LayoutDashboard, label: 'Dashboard',     labelHi: 'डैशबोर्ड'      },
    { path: '/patient/vitals',       icon: Activity,        label: 'My Vitals',     labelHi: 'मेरे वाइटल्स'   },
    { path: '/patient/records',      icon: FileText,        label: 'Health Records',labelHi: 'स्वास्थ्य रिकॉर्ड' },
    { path: '/patient/appointments', icon: Calendar,        label: 'Appointments',  labelHi: 'अपॉइंटमेंट'    },
    { path: '/patient/book',         icon: ClipboardList,   label: 'Book Appointment',labelHi: 'बुकिंग'       },
    { path: '/patient/chat',         icon: MessageSquare,   label: 'AI Assistant',  labelHi: 'AI सहायक'      },
  ],
  doctor: [
    { path: '/doctor/dashboard',     icon: LayoutDashboard, label: 'Dashboard',     labelHi: 'डैशबोर्ड'    },
    { path: '/doctor/patients',      icon: Users,           label: 'My Patients',   labelHi: 'मेरे मरीज'   },
    { path: '/doctor/schedule',      icon: Calendar,        label: 'Schedule',      labelHi: 'शेड्यूल'      },
    { path: '/doctor/chat',          icon: MessageSquare,   label: 'AI Support',    labelHi: 'AI सहायता'   },
  ],
  admin: [
    { path: '/admin/dashboard',      icon: LayoutDashboard, label: 'Overview',      labelHi: 'अवलोकन'      },
    { path: '/admin/queue',          icon: ClipboardList,   label: 'Patient Queue', labelHi: 'मरीज कतार'   },
    { path: '/admin/emergency',      icon: AlertTriangle,   label: 'Emergency',     labelHi: 'आपातकाल'     },
    { path: '/admin/analytics',      icon: BarChart3,       label: 'Analytics',     labelHi: 'विश्लेषण'    },
    { path: '/admin/staff',          icon: UserCog,         label: 'Staff',         labelHi: 'स्टाफ'       },
  ],
};

const ROLE_CONFIG = {
  patient: { color: 'text-primary-400',   bg: 'bg-primary-500/20',   label: 'Patient Portal'  },
  doctor:  { color: 'text-violet-400',    bg: 'bg-violet-500/20',    label: 'Doctor Portal'   },
  admin:   { color: 'text-amber-400',     bg: 'bg-amber-500/20',     label: 'Admin Panel'     },
};

export default function Sidebar({ role }) {
  const { user, logout } = useAuth();
  const { sidebarOpen, language, dispatch } = useApp();
  const items  = NAV_ITEMS[role] || [];
  const config = ROLE_CONFIG[role];

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 0, opacity: sidebarOpen ? 1 : 0 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="relative flex-shrink-0 bg-dark-800 border-r border-white/6 overflow-hidden flex flex-col z-30 h-full lg:static fixed"
    >
      <div className="flex flex-col h-full w-[260px]">
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-white/6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center shadow-glow">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg leading-tight">MediAI</span>
              <div className={`text-xs ${config.color} font-medium`}>{config.label}</div>
            </div>
          </div>
          <button onClick={() => dispatch({ type: 'TOGGLE_SIDEBAR' })} className="lg:hidden btn-ghost p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-white/6">
          <div className={`${config.bg} rounded-xl p-3 flex items-center gap-3`}>
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarGradient(user?.name)} flex items-center justify-center text-white text-sm font-bold`}>
              {initials(user?.name)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-gray-100 truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.specialty || user?.role}</div>
            </div>
            <span className="dot-online" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-hidden">
          {items.map(({ path, icon: Icon, label, labelHi }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{language === 'hi' ? labelHi : label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/6 space-y-1">
          <button className="nav-link w-full">
            <Settings className="w-4 h-4" />
            <span>{language === 'hi' ? 'सेटिंग्स' : 'Settings'}</span>
          </button>
          <button onClick={logout} className="nav-link w-full text-emergency-400 hover:text-emergency-300 hover:bg-emergency-500/10">
            <LogOut className="w-4 h-4" />
            <span>{language === 'hi' ? 'लॉग आउट' : 'Log Out'}</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
