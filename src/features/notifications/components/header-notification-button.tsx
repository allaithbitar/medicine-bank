import { IconButton, Badge } from '@mui/material';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import notificationsApi from '@/features/notifications/api/notifications.api';

const HeaderNotificationButton = () => {
  const { data } = notificationsApi.useGetUnreadCountQuery(undefined, { pollingInterval: 30000 });

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
