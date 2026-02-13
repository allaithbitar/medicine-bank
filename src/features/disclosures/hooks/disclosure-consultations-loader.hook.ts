import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TGetDisclosureAdviserConsultationParams } from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureConsultationsLoader } from './local-disclosure-consultations-loader.hook';

export const useDisclosureConsultationsLoader = (dto: TGetDisclosureAdviserConsultationParams) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = disclosuresApi.useGetDisclosureAdviserConsultationsInfiniteQuery(
    dto,
    {
      skip: isOffline,
    }
  );

  const { items: offlineData, totalCount, ...offlineQueryResult } = useLocalDisclosureConsultationsLoader(dto);

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
