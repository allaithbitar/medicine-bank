import { Navigate, Outlet, useLocation } from 'react-router-dom';
import usePermissions from '@/core/hooks/use-permissions.hook';
import useUser from '@/core/hooks/user-user.hook';

const ProtectedRoute = () => {
  const { hasCurrentRouteAccess, isAccountantRole } = usePermissions();
  const location = useLocation();
  const { role: userRole, canBeConsulted } = useUser();

  if (isAccountantRole && !location.pathname.startsWith('/payments')) {
    return <Navigate to="/payments" replace />;
  }

  if (!hasCurrentRouteAccess) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  if (location.pathname === '/adviser_disclosure_consultations' && userRole !== 'scout' && !canBeConsulted) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
