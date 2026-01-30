type TUserRole = 'manager' | 'supervisor' | 'scout';
//cant find better way to implement if u know be my guest
export type TRoutePermission = {
  path: string;
  allowedRoles: TUserRole[];
  canAdd?: TUserRole[];
  canEdit?: TUserRole[];
  canRate?: TUserRole[];
  showFilters?: TUserRole[];
};

export type TActionType = 'canAdd' | 'canEdit' | 'canRate' | 'showFilters';

export const ROUTE_PERMISSIONS: TRoutePermission[] = [
  { path: '/', allowedRoles: ['manager', 'supervisor', 'scout'] },
  { path: '/notifications', allowedRoles: ['manager', 'supervisor', 'scout'] },

  {
    path: '/employees',
    allowedRoles: ['manager', 'supervisor', 'scout'],
    canAdd: ['manager'],
    canEdit: ['manager'],
  },
  { path: '/employees/action', allowedRoles: ['manager'] },

  {
    path: '/disclosures',
    allowedRoles: ['manager', 'supervisor', 'scout'],
    canAdd: ['manager', 'supervisor', 'scout'],
    canEdit: ['manager', 'scout'],
    showFilters: ['manager', 'supervisor', 'scout'],
  },
  { path: '/disclosures/action', allowedRoles: ['manager', 'supervisor', 'scout'] },
  {
    path: '/disclosures/:disclosureId',
    allowedRoles: ['manager', 'supervisor', 'scout'],
    canEdit: ['manager', 'scout'],
  },
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
    allowedRoles: ['manager', 'scout'],
  },
  {
    path: '/disclosures/:disclosureId/consulting_adviser/action',
    allowedRoles: ['manager', 'scout'],
  },
  { path: '/disclosures/:disclosureId/audit', allowedRoles: ['manager', 'supervisor'] },
  {
    path: '/disclosures/:disclosureId/audit/details',
    allowedRoles: ['manager', 'supervisor'],
  },

  {
    path: '/adviser_disclosure_consultations',
    allowedRoles: ['manager', 'scout'],
    canRate: ['manager'],
  },
  {
    path: '/consulting-adviser/:id',
    allowedRoles: ['manager', 'scout'],
    canRate: ['manager'],
  },

  {
    path: '/beneficiaries',
    allowedRoles: ['manager', 'supervisor'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },
  {
    path: '/beneficiaries/:id',
    allowedRoles: ['manager', 'supervisor'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },
  {
    path: '/beneficiaries/action',
    allowedRoles: ['manager', 'supervisor'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },
  {
    path: '/beneficiaries/:id/medicine/action',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },
  {
    path: '/beneficiaries/:id/family/action',
    allowedRoles: ['manager', 'supervisor', 'scout'],
  },

  {
    path: '/cities',
    allowedRoles: ['manager', 'supervisor'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },
  { path: '/cities/action', allowedRoles: ['manager', 'supervisor'] },
  {
    path: '/work-areas',
    allowedRoles: ['manager', 'supervisor'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },
  { path: '/work-areas/action', allowedRoles: ['manager', 'supervisor'] },
  {
    path: '/ratings',
    allowedRoles: ['manager', 'supervisor'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },
  { path: '/ratings/action', allowedRoles: ['manager', 'supervisor'] },
  {
    path: '/priority-degrees',
    allowedRoles: ['manager', 'supervisor'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },
  { path: '/priority-degrees/action', allowedRoles: ['manager', 'supervisor'] },

  {
    path: '/medicines',
    allowedRoles: ['manager', 'supervisor'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },
  { path: '/medicines/action', allowedRoles: ['manager', 'supervisor'] },

  {
    path: '/meetings',
    allowedRoles: ['manager', 'supervisor', 'scout'],
    canAdd: ['manager'],
    canEdit: ['manager'],
  },
  { path: '/meetings/action', allowedRoles: ['manager'] },

  {
    path: '/calendar',
    allowedRoles: ['manager', 'supervisor', 'scout'],
    canAdd: ['manager', 'supervisor'],
    canEdit: ['manager', 'supervisor'],
  },

  {
    path: '/system-broadcast',
    allowedRoles: ['manager', 'supervisor', 'scout'],
    canAdd: ['manager'],
    canEdit: ['manager'],
    showFilters: ['manager'],
  },
  { path: '/system-broadcast/action', allowedRoles: ['manager'] },

  { path: '/sync', allowedRoles: ['manager', 'supervisor', 'scout'] },
];

export const checkRouteAccess = (routePath: string, userRole: TUserRole | undefined) => {
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

export const checkActionPermission = (routePath: string, action: TActionType, userRole: TUserRole | undefined) => {
  if (!userRole) return false;
  const permission = getRoutePermission(routePath);
  if (!permission) return false;
  const allowedRoles = permission[action];
  if (!allowedRoles) return false;

  return allowedRoles.includes(userRole);
};
