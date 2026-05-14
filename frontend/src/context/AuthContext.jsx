import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

// Demo users for frontend-only mode
const DEMO_USERS = {
  'admin@hospital.com':      { id: 1, name: 'Admin User',     role: 'admin',   avatar: null, password: 'Admin@123' },
  'dr.sharma@hospital.com':  { id: 2, name: 'Dr. Raj Sharma', role: 'doctor',  avatar: null, password: 'Doctor@123', specialty: 'Cardiology' },
  'dr.gupta@hospital.com':   { id: 3, name: 'Dr. Priya Gupta',role: 'doctor',  avatar: null, password: 'Doctor@123', specialty: 'General Medicine' },
  'patient@demo.com':        { id: 4, name: 'Arjun Mehta',    role: 'patient', avatar: null, password: 'Patient@123', age: 32, blood: 'O+' },
};

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem('hms_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); }
      catch { localStorage.removeItem('hms_user'); }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      // Demo mode: check against hardcoded users
      const demo = DEMO_USERS[email.toLowerCase()];
      if (demo && demo.password === password) {
        const { password: _, ...safeUser } = demo;
        setUser(safeUser);
        localStorage.setItem('hms_user', JSON.stringify(safeUser));
        toast.success(`Welcome back, ${safeUser.name}!`);
        // Redirect based on role
        navigate(`/${safeUser.role}/dashboard`);
        return { success: true };
      }

      // Real API call (when backend is running)
      const { data } = await api.post('/auth/login', { email, password });
      const userData = { ...data.user, token: data.access_token };
      setUser(userData);
      localStorage.setItem('hms_user', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
      toast.success(`Welcome back, ${userData.name}!`);
      navigate(`/${userData.role}/dashboard`);
      return { success: true };

    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid credentials. Try demo accounts below.';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', formData);
      toast.success('Registration successful! Please log in.');
      navigate('/login');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.detail || 'Registration failed.';
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hms_user');
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully');
    navigate('/login');
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
