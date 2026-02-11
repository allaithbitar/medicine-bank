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
  const isManagerRole = user.role === 'manager';
  const isScoutRole = user.role === 'scout';
  const isSupervisorRole = user.role === 'supervisor';

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
  const canArchive = useMemo(
    () => (routePath: string) => checkActionPermission(routePath, 'canArchive', currentUserRole),
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
  const currentCanEditDisclosure = useMemo(
    () => checkActionPermission(location.pathname, 'canEditDisclosure', currentUserRole),
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
  const currentCanArchive = useMemo(
    () => checkActionPermission(location.pathname, 'canArchive', currentUserRole),
    [location.pathname, currentUserRole]
  );
  const currentCanCompleteAppointment = useMemo(
    () => checkActionPermission(location.pathname, 'canCompleteAppointment', currentUserRole),
    [location.pathname, currentUserRole]
  );
  const currentCanReceiveDisclosure = useMemo(
    () => checkActionPermission(location.pathname, 'canReceiveDisclosure', currentUserRole),
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
    canArchive,
    currentCanAdd,
    currentCanEdit,
    currentCanRate,
    currentShowFilters,
    currentCanArchive,
    isSupervisorRole,
    isManagerRole,
    isScoutRole,
    currentCanReceiveDisclosure,
    currentCanCompleteAppointment,
    currentCanEditDisclosure,
  };
};

export default usePermissions;
