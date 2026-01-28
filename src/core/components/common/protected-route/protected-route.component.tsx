import { Navigate, Outlet, useLocation } from 'react-router-dom';
import usePermissions from '@/core/hooks/use-permissions.hook';

const ProtectedRoute = () => {
  const { hasCurrentRouteAccess } = usePermissions();
  const location = useLocation();

  if (!hasCurrentRouteAccess) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
