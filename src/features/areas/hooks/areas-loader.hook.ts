import useIsOffline from '@/core/hooks/use-is-offline.hook';
import workAreasApi from '../../banks/api/work-areas/work-areas.api';
import { useLocalAreasLoader } from './local-areas-loader.hook';
import type { TPaginationDto } from '@/core/types/common.types';

export const useAreasLoader = (
  dto: {
    name?: string;
    cityId?: string;
  } & TPaginationDto
) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = workAreasApi.useGetWorkAreasInfiniteQuery(dto, {
    skip: isOffline || !dto.cityId,
  });

  const { items: offlineData, totalCount, ...offlineQueryResult } = useLocalAreasLoader(dto);

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
