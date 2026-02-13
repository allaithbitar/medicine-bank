import { memo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { doesRouteRequireOnline } from '@/core/config/permissions.config';
import DisabledOnOffline from '@/core/components/common/disabled-on-offline/disabled-on-offline.component';

const OfflineAwareRoute = () => {
  const location = useLocation();
  const requiresOnline = doesRouteRequireOnline(location.pathname);
  if (!requiresOnline) {
    return <Outlet />;
  }
  return (
    <DisabledOnOffline>
      <Outlet />
    </DisabledOnOffline>
  );
};

export default memo(OfflineAwareRoute);
