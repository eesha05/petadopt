import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-slate-700 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If user's role is not allowed, redirect to their role dashboard or home
    if (user?.role === 'admin') return <Navigate to="/dashboard/admin" replace />;
    if (user?.role === 'shelter') return <Navigate to="/dashboard/shelter" replace />;
    if (user?.role === 'adopter') return <Navigate to="/dashboard/adopter" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
