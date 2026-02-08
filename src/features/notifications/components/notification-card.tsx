import { memo, useCallback } from 'react';
import { Avatar, Badge, Box, Card, Chip, Divider, Stack, Typography } from '@mui/material';
import { green, orange, blue } from '@mui/material/colors';
import { NotificationsActive, NotificationsNone } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import notificationsApi from '@/features/notifications/api/notifications.api';
import type { TNotification } from '../types/notifications.type';
import { notifyError } from '@/core/components/common/toast/toast';
import { formatDateFromNow } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';

const NotificationCard = ({ notification }: { notification: TNotification }) => {
  const [markRead, { isLoading }] = notificationsApi.useMarkNotificationReadMutation();
  // const [isRead, setIsRead] = useState(notification.readAt !== null);
  const isRead = notification.readAt !== null;
  const navigate = useNavigate();

  const handleCardClick = useCallback(async () => {
    if (!isRead && !isLoading) {
      try {
        await markRead({ id: notification.id }).unwrap();
      } catch (error) {
        notifyError(error);
      }
    }
    if (notification.recordId) {
      if (notification.type === 'disclosure_assigned') {
        navigate(`/disclosures/${notification.recordId}`);
      } else if (notification.type === 'consultation_requested' || notification.type === 'consultation_completed') {
        navigate(`/consulting-adviser/${notification.recordId}`);
      }
    }
  }, [isRead, isLoading, markRead, notification, navigate]);

  const typeConfig =
    notification.type === 'consultation_requested'
      ? {
          color: orange[600],
          bgColor: orange[50],
          borderColor: orange[400],
          label: STRINGS.consultation_requested,
        }
      : notification.type === 'consultation_completed'
        ? {
            color: green[600],
            bgColor: green[50],
            borderColor: green[400],
            label: STRINGS.consultation_completed,
          }
        : {
            color: blue[600],
            bgColor: blue[50],
            borderColor: blue[400],
            label: STRINGS.disclosure_assigned,
          };

  return (
    <Card
      sx={{
        borderLeft: `5px solid ${typeConfig.borderColor}`,
        cursor: 'pointer',
        opacity: isRead ? 0.8 : 1,
        bgcolor: isRead ? 'background.paper' : typeConfig.bgColor,
      }}
      onClick={handleCardClick}
    >
      <Stack gap={2}>
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          sx={{
            bgcolor: isRead ? 'transparent' : `${typeConfig.color}08`,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{
                bgcolor: typeConfig.color,
              }}
            >
              <Badge
                color="error"
                variant="dot"
                invisible={isRead}
                sx={{
                  '& .MuiBadge-badge': {
                    position: 'absolute',
                    top: 5,
                    right: 5,
                  },
                }}
              >
                {isRead ? (
                  <NotificationsNone sx={{ fontSize: 28, color: 'white' }} />
                ) : (
                  <NotificationsActive sx={{ fontSize: 28, color: 'white' }} />
                )}
              </Badge>
            </Avatar>
          </Box>

          <Stack flexGrow={1}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
              <Typography
                variant="subtitle1"
                fontWeight={isRead ? 'normal' : 'bold'}
                sx={{ color: isRead ? 'text.secondary' : 'text.primary' }}
              >
                {STRINGS.notification_from}:{' '}
                <Typography component="span" fontWeight="bold" color="primary.main">
                  {notification.fromEmployee.name}
                </Typography>
              </Typography>
              <Chip
                label={typeConfig.label}
                size="small"
                sx={{
                  bgcolor: typeConfig.color,
                  color: 'white',
                }}
              />
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {STRINGS.notification_to}: {notification.toEmployee.name}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack gap={1}>
          {notification.text && (
            <Typography
              variant="body2"
              sx={{
                fontWeight: isRead ? 'normal' : 'medium',
                color: isRead ? 'text.secondary' : 'text.primary',
              }}
            >
              {notification.text}
            </Typography>
          )}

          {notification.createAt && (
            <Typography alignSelf="end" variant="caption">
              {formatDateFromNow(notification.createAt)}/
            </Typography>
          )}
        </Stack>
      </Stack>
      {isLoading && <LoadingOverlay />}
    </Card>
  );
};

export default memo(NotificationCard);
