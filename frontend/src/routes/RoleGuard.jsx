import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export function RoleGuard({ allowedRoles, children }) {
  const { auth, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!auth?.user || !allowedRoles.includes(auth.user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
