import useIsOffline from '@/core/hooks/use-is-offline.hook';
import meetingsApi from '../api/meetings.api';
import { useLocalMeetingsLoader } from './local-meetings-loader.hook';
import type { TPaginationDto } from '@/core/types/common.types';

export const useMeetingsLoader = (dto: TPaginationDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = meetingsApi.useGetMeetingsInfiniteQuery(dto, {
    skip: isOffline,
  });

  const { items: offlineData, totalCount, ...offlineQueryResult } = useLocalMeetingsLoader(dto);

  return {
    items: isOffline ? offlineData : (onlineData?.pages.map((p) => p.items).flat() ?? []),
    totalCount: isOffline ? totalCount : (onlineData?.pages[0].totalCount ?? 0),
    hasNextPage: isOffline ? offlineQueryResult.hasNextPage : onlineQueryResult.hasNextPage,
    fetchNextPage: isOffline ? offlineQueryResult.fetchNextPage : onlineQueryResult.fetchNextPage,
    isFetchingNextPage: isOffline ? offlineQueryResult.isFetchingNextPage : onlineQueryResult.isFetchingNextPage,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,

    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,

    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};

