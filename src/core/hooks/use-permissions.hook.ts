import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  checkRouteAccess,
  getUserAllowedRoutes,
  getRoutePermission,
  checkActionPermission,
} from '@/core/config/permissions.config';
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

  const canAdd = useMemo(
    () => (routePath: string) => checkActionPermission(routePath, 'canAdd', currentUserRole),
    [currentUserRole]
  );
  const canEdit = useMemo(
    () => (routePath: string) => checkActionPermission(routePath, 'canEdit', currentUserRole),
    [currentUserRole]
  );
  const canRate = useMemo(
    () => (routePath: string) => checkActionPermission(routePath, 'canRate', currentUserRole),
    [currentUserRole]
  );
  const showFilters = useMemo(
    () => (routePath: string) => checkActionPermission(routePath, 'showFilters', currentUserRole),
    [currentUserRole]
  );
  const currentCanAdd = useMemo(
    () => checkActionPermission(location.pathname, 'canAdd', currentUserRole),
    [location.pathname, currentUserRole]
  );
  const currentCanEdit = useMemo(
    () => checkActionPermission(location.pathname, 'canEdit', currentUserRole),
    [location.pathname, currentUserRole]
  );
  const currentCanRate = useMemo(
    () => checkActionPermission(location.pathname, 'canRate', currentUserRole),
    [location.pathname, currentUserRole]
  );
  const currentShowFilters = useMemo(
    () => checkActionPermission(location.pathname, 'showFilters', currentUserRole),
    [location.pathname, currentUserRole]
  );

  return {
    hasRouteAccess,
    hasCurrentRouteAccess,
    allowedRoutes,
    getPermission,
    currentUserRole,
    canAdd,
    canEdit,
    canRate,
    showFilters,
    currentCanAdd,
    currentCanEdit,
    currentCanRate,
    currentShowFilters,
  };
};

export default usePermissions;
