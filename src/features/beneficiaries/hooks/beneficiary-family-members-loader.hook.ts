import useIsOffline from '@/core/hooks/use-is-offline.hook';
import beneficiaryApi from '../api/beneficiary.api';
import { useLocalBeneficiaryFamilyMembersLoader } from './local-beneficiary-family-members-loader.hook';
import type { TGetFamilyMembersDto } from '../types/beneficiary.types';

export const useBeneficiaryFamilyMembersLoader = (dto: TGetFamilyMembersDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = beneficiaryApi.useGetFamilyMembersInfiniteQuery(dto, {
    skip: isOffline,
  });

  const { items: offlineData, totalCount, ...offlineQueryResult } = useLocalBeneficiaryFamilyMembersLoader(dto);

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
