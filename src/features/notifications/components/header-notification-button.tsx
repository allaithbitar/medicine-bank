import { IconButton, Badge } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import notificationsApi from '@/features/notifications/api/notifications.api';
import useIsOffline from '@/core/hooks/use-is-offline.hook';

const HeaderNotificationButton = () => {
  const isOffline = useIsOffline();

  const { data } = notificationsApi.useGetUnreadCountQuery(undefined, { pollingInterval: 30000, skip: isOffline });

  const count = data || 0;

  return (
    <IconButton color="primary">
      <Badge badgeContent={count} max={9} color="error">
        <NotificationsNoneIcon />
      </Badge>
    </IconButton>
  );
};

export default HeaderNotificationButton;
