import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { currentUser, showAdminBoard } = useAuth();

  if (!currentUser) {

    return <Navigate to={`/login`} replace />;
  }

  if (requireAdmin && !showAdminBoard) {

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

