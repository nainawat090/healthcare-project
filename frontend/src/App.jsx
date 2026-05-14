import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider }  from '@/context/AppContext';
import ProtectedRoute   from '@/components/layout/ProtectedRoute';
import DashboardLayout  from '@/components/layout/DashboardLayout';

// Public pages
import LandingPage       from '@/pages/LandingPage';
import LoginPage         from '@/pages/LoginPage';
import RegisterPage      from '@/pages/RegisterPage';

// Patient pages
import PatientDashboard  from '@/pages/patient/PatientDashboard';
import PatientRecords    from '@/pages/patient/PatientRecords';
import PatientAppointments from '@/pages/patient/PatientAppointments';
import PatientVitals     from '@/pages/patient/PatientVitals';

// Doctor pages
import DoctorDashboard   from '@/pages/doctor/DoctorDashboard';
import DoctorPatients    from '@/pages/doctor/DoctorPatients';
import DoctorSchedule    from '@/pages/doctor/DoctorSchedule';

// Admin pages
import AdminDashboard    from '@/pages/admin/AdminDashboard';
import PatientQueue      from '@/pages/admin/PatientQueue';
import EmergencyTriage   from '@/pages/admin/EmergencyTriage';
import Analytics         from '@/pages/admin/Analytics';
import StaffManagement   from '@/pages/admin/StaffManagement';

// Shared pages
import AppointmentBooking from '@/pages/AppointmentBooking';
import ChatbotPage        from '@/pages/ChatbotPage';
import NotFoundPage       from '@/pages/NotFoundPage';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AnimatePresence mode="wait">
          <Routes>
            {/* ── Public ── */}
            <Route path="/"         element={<LandingPage />} />
            <Route path="/login"    element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* ── Patient ── */}
            <Route element={<ProtectedRoute roles={['patient']} />}>
              <Route element={<DashboardLayout role="patient" />}>
                <Route path="/patient/dashboard"     element={<PatientDashboard />} />
                <Route path="/patient/records"       element={<PatientRecords />} />
                <Route path="/patient/appointments"  element={<PatientAppointments />} />
                <Route path="/patient/vitals"        element={<PatientVitals />} />
                <Route path="/patient/book"          element={<AppointmentBooking />} />
                <Route path="/patient/chat"          element={<ChatbotPage />} />
              </Route>
            </Route>

            {/* ── Doctor ── */}
            <Route element={<ProtectedRoute roles={['doctor']} />}>
              <Route element={<DashboardLayout role="doctor" />}>
                <Route path="/doctor/dashboard"  element={<DoctorDashboard />} />
                <Route path="/doctor/patients"   element={<DoctorPatients />} />
                <Route path="/doctor/schedule"   element={<DoctorSchedule />} />
                <Route path="/doctor/chat"       element={<ChatbotPage />} />
              </Route>
            </Route>

            {/* ── Admin ── */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route element={<DashboardLayout role="admin" />}>
                <Route path="/admin/dashboard"   element={<AdminDashboard />} />
                <Route path="/admin/queue"        element={<PatientQueue />} />
                <Route path="/admin/emergency"   element={<EmergencyTriage />} />
                <Route path="/admin/analytics"   element={<Analytics />} />
                <Route path="/admin/staff"        element={<StaffManagement />} />
              </Route>
            </Route>

            {/* ── Catch-all ── */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*"    element={<Navigate to="/404" replace />} />
          </Routes>
        </AnimatePresence>
      </AppProvider>
    </AuthProvider>
  );
}
