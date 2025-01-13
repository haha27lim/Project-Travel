import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { currentUser, showAdminBoard } = useAuth();
  const location = useLocation();

  if (!currentUser) {

    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (requireAdmin && !showAdminBoard) {

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

