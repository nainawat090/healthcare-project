import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function ProtectedRoute({ roles = [] }) {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Redirect to their own dashboard
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  return <Outlet />;
}
