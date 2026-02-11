import { Card, Stack, Button } from '@mui/material';
import { useCallback } from 'react';
import STRINGS from '@/core/constants/strings.constant';
import VirtualizedList from '@/core/components/common/virtualized-list/virtualized-list.component';
import NotificationCard from '../components/notification-card';
import { useNotificationsLoader } from '../hooks/notifications-loader.hook';
import useUser from '@/core/hooks/user-user.hook';
import LoadingOverlay from '@/core/components/common/loading-overlay/loading-overlay';
import notificationsApi from '../api/notifications.api';
import { useModal } from '@/core/components/common/modal/modal-provider.component';
import { notifySuccess, notifyError } from '@/core/components/common/toast/toast';
import CustomAppBarComponent from '@/core/components/common/custom-app-bar/custom-app-bar.component';

const NotificationsPage = () => {
  const { id } = useUser();
  const { items, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage, totalCount } = useNotificationsLoader({
    to: id,
  });

  const [markAllRead, { isLoading: isMarkingAll }] = notificationsApi.useMarkAllNotificationsReadMutation();
  const [deleteRead, { isLoading: isDeleting }] = notificationsApi.useDeleteReadNotificationsMutation();

  const { openModal } = useModal();

  const handleMarkAllRead = useCallback(() => {
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        message: STRINGS.mark_all_read,
        onConfirm: async () => {
          try {
            await markAllRead().unwrap();
            notifySuccess(STRINGS.edited_successfully);
          } catch (error) {
            notifyError(error);
          }
        },
      },
    });
  }, [openModal, markAllRead]);

  const handleDeleteRead = useCallback(() => {
    openModal({
      name: 'CONFIRM_MODAL',
      props: {
        message: STRINGS.delete_read_notifications,
        onConfirm: async () => {
          try {
            await deleteRead().unwrap();
            notifySuccess(STRINGS.edited_successfully);
          } catch (error) {
            notifyError(error);
          }
        },
      },
    });
  }, [openModal, deleteRead]);

  return (
    <Stack gap={1} sx={{ height: '100%', position: 'relative' }}>
      <Card sx={{ flexShrink: 0 }}>
        <CustomAppBarComponent title={STRINGS.notifications} />
        <Stack direction="row" gap={1}>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={handleMarkAllRead}
            disabled={isMarkingAll || items.length === 0}
          >
            {STRINGS.mark_all_read}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="small"
            color="error"
            onClick={handleDeleteRead}
            disabled={isDeleting || items.length === 0}
          >
            {STRINGS.delete_read_notifications}
          </Button>
        </Stack>
        {isLoading && <LoadingOverlay />}
      </Card>
      <Stack sx={{ height: '100%', overflow: 'auto' }}>
        <VirtualizedList
          totalCount={totalCount}
          items={items}
          onEndReach={hasNextPage && !isFetchingNextPage ? fetchNextPage : undefined}
          isLoading={isFetchingNextPage}
        >
          {({ item: notification }) => <NotificationCard notification={notification} />}
        </VirtualizedList>
      </Stack>
    </Stack>
  );
};

export default NotificationsPage;
