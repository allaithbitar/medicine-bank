import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TGetMedicinesDto } from '../../types/medicines.types';
import medicinesApi from '../../api/medicines-api/medicines-api';
import { useLocalMedicinesLoader } from './local-medicines-loader.hook';

export const useMedicinesLoader = (dto: TGetMedicinesDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = medicinesApi.useGetMedicinesInfiniteQuery(dto, {
    skip: isOffline,
  });

  const { items: offlineData, totalCount, ...offlineQueryResult } = useLocalMedicinesLoader(dto);

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
