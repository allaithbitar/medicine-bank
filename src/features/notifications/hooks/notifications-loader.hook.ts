import useIsOffline from '@/core/hooks/use-is-offline.hook';
import notificationsApi from '../api/notifications.api';
import type { TNotificationsPayload } from '../types/notifications.type';

export const useNotificationsLoader = ({ pageSize, ...params }: { pageSize?: number } & TNotificationsPayload) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = notificationsApi.useGetNotificationsInfiniteQuery(
    { pageSize, ...params },
    {
      skip: isOffline,
      refetchOnMountOrArgChange: true,
    }
  );

  return {
    items: onlineData?.pages.map((p) => p.items).flat() ?? [],
    totalCount: onlineData?.pages[0].totalCount ?? 0,
    hasNextPage: onlineQueryResult.hasNextPage,
    fetchNextPage: onlineQueryResult.fetchNextPage,
    isFetchingNextPage: onlineQueryResult.isFetchingNextPage,
    isFetching: onlineQueryResult.isFetching,
    isLoading: onlineQueryResult.isLoading,
    error: onlineQueryResult.error,
  };
};
