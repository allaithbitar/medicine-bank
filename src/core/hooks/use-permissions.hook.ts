import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { checkRouteAccess, getUserAllowedRoutes, getRoutePermission } from '@/core/config/permissions.config';
import useUser from './user-user.hook';

export const usePermissions = () => {
  const user = useUser();
  const location = useLocation();
  const currentUserRole = user.role;

  const hasRouteAccess = useMemo(
    () => (routePath: string) => checkRouteAccess(routePath, currentUserRole),
    [currentUserRole]
  );

  const hasCurrentRouteAccess = useMemo(
    () => checkRouteAccess(location.pathname, currentUserRole),
    [location.pathname, currentUserRole]
  );

  const allowedRoutes = useMemo(() => getUserAllowedRoutes(currentUserRole), [currentUserRole]);

  const getPermission = useMemo(() => (routePath: string) => getRoutePermission(routePath), []);

  return {
    hasRouteAccess,
    hasCurrentRouteAccess,
    allowedRoutes,
    getPermission,
    currentUserRole,
  };
};

export default usePermissions;
