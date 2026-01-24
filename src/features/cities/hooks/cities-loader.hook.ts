import useIsOffline from '@/core/hooks/use-is-offline.hook';
import citiesApi from '../../banks/api/cities-api/cities.api';
import { useLocalCitiesLoader } from './local-cities-loader.hook';

export const useCitiesLoader = ({ pageSize, ...params }: { pageSize?: number; name?: string | null }) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = citiesApi.useGetCitiesInfiniteQuery(params, {
    skip: isOffline,
  });

  const {
    items: offlineData,
    totalCount,
    ...offlineQueryResult
  } = useLocalCitiesLoader({ pageSize, name: params.name });

  return {
    items: isOffline
      ? offlineData
      : (onlineData?.pages.map((p) => p.items).flat() ?? []),
    totalCount: isOffline ? totalCount : (onlineData?.pages[0].totalCount ?? 0),
    hasNextPage: isOffline
      ? offlineQueryResult.hasNextPage
      : onlineQueryResult.hasNextPage,
    fetchNextPage: isOffline
      ? offlineQueryResult.fetchNextPage
      : onlineQueryResult.fetchNextPage,
    isFetchingNextPage: isOffline
      ? offlineQueryResult.isFetchingNextPage
      : onlineQueryResult.isFetchingNextPage,
    isFetching: isOffline
      ? offlineQueryResult.isFetching
      : onlineQueryResult.isFetching,

    isLoading: isOffline
      ? offlineQueryResult.isLoading
      : onlineQueryResult.isLoading,

    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};