type TUserRole = 'manager' | 'supervisor' | 'scout';

export type TRoutePermission = {
  path: string;
  allowedRoles: TUserRole[];
};

export const ROUTE_PERMISSIONS: TRoutePermission[] = [
  { path: '/', allowedRoles: ['manager', 'supervisor', 'scout'] },
  { path: '/notifications', allowedRoles: ['manager', 'supervisor', 'scout'] },

  { path: '/disclosures', allowedRoles: ['manager', 'supervisor', 'scout'] },
  { path: '/disclosures/action', allowedRoles: ['manager', 'supervisor'] },
  { path: '/disclosures/:disclosureId', allowedRoles: ['manager', 'supervisor', 'scout'] },
  {
    path: '/disclosures/details/action',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },
  {
    path: '/disclosures/visit-rating/action',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },
  { path: '/disclosures/appointment/action', allowedRoles: ['manager', 'supervisor', 'scout'] },
  {
    path: '/disclosures/:disclosureId/note/action',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },
  {
    path: '/disclosures/:disclosureId/consulting_adviser',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },
  {
    path: '/disclosures/:disclosureId/consulting_adviser/action',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },
  { path: '/disclosures/:disclosureId/audit', allowedRoles: ['manager', 'supervisor'] },
  {
    path: '/disclosures/:disclosureId/audit/details',
    allowedRoles: ['manager', 'supervisor'],
  },
  {
    path: '/adviser_disclosure_consultations',
    allowedRoles: ['manager', 'supervisor'],
  },
  {
    path: '/consulting-adviser/:id',
    allowedRoles: ['manager', 'supervisor'],
  },

  { path: '/beneficiaries', allowedRoles: ['manager', 'supervisor', 'scout'] },
  { path: '/beneficiaries/:id', allowedRoles: ['manager', 'supervisor', 'scout'] },
  { path: '/beneficiaries/action', allowedRoles: ['manager', 'supervisor', 'scout'] },
  {
    path: '/beneficiaries/:id/medicine/action',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },
  {
    path: '/beneficiaries/:id/family/action',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },

  { path: '/employees', allowedRoles: ['manager', 'supervisor'] },
  { path: '/employees/action', allowedRoles: ['manager'] },

  { path: '/cities', allowedRoles: ['manager', 'supervisor'] },
  { path: '/cities/action', allowedRoles: ['manager', 'supervisor'] },
  { path: '/work-areas', allowedRoles: ['manager', 'supervisor'] },
  { path: '/work-areas/action', allowedRoles: ['manager', 'supervisor'] },
  { path: '/ratings', allowedRoles: ['manager', 'supervisor'] },
  { path: '/ratings/action', allowedRoles: ['manager', 'supervisor'] },
  { path: '/priority-degrees', allowedRoles: ['manager', 'supervisor'] },
  { path: '/priority-degrees/action', allowedRoles: ['manager', 'supervisor'] },

  { path: '/medicines', allowedRoles: ['manager', 'supervisor'] },
  { path: '/medicines/action', allowedRoles: ['manager'] },
  { path: '/meetings', allowedRoles: ['manager', 'supervisor'] },
  { path: '/meetings/action', allowedRoles: ['manager', 'supervisor'] },

  { path: '/calendar', allowedRoles: ['manager', 'supervisor', 'scout'] },
  { path: '/sync', allowedRoles: ['manager', 'supervisor', 'scout'] },

  { path: '/system-broadcast', allowedRoles: ['manager', 'supervisor', 'scout'] },
  { path: '/system-broadcast/action', allowedRoles: ['manager', 'supervisor'] },
];

export const checkRouteAccess = (routePath: string, userRole: TUserRole | undefined): boolean => {
  if (!userRole) return false;

  const permission = ROUTE_PERMISSIONS.find((p) => {
    if (p.path === routePath) return true;

    const pattern = p.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(routePath);
  });

  if (!permission) return false;

  return permission.allowedRoles.includes(userRole);
};

export const getUserAllowedRoutes = (userRole: TUserRole | undefined): string[] => {
  if (!userRole) return [];

  return ROUTE_PERMISSIONS.filter((p) => p.allowedRoles.includes(userRole)).map((p) => p.path);
};

export const getRoutePermission = (routePath: string): TRoutePermission | undefined => {
  return ROUTE_PERMISSIONS.find((p) => {
    if (p.path === routePath) return true;
    const pattern = p.path.replace(/:[^/]+/g, '[^/]+');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(routePath);
  });
};
