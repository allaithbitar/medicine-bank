import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TGetBeneficiaryMedicinesDto } from '../types/beneficiary.types';
import beneficiaryApi from '../api/beneficiary.api';
import { useLocalBeneficiaryMedicinesLoader } from './local-beneficiary-medicines-loader.hook';

export const useBeneficiaryMedicinesLoader = (dto: TGetBeneficiaryMedicinesDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = beneficiaryApi.useGetBeneficiaryMedicinesInfiniteQuery(dto, {
    skip: isOffline,
  });

  const { items: offlineData, totalCount, ...offlineQueryResult } = useLocalBeneficiaryMedicinesLoader(dto);

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
