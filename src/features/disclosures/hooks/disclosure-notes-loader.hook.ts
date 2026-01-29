import useIsOffline from '@/core/hooks/use-is-offline.hook';
import type { TGetDisclosureNotesDto } from '../types/disclosure.types';
import disclosuresApi from '../api/disclosures.api';
import { useLocalDisclosureNotesLoader } from './local-disclosure-notes-loader.hook';

export const useDisclosureNotesLoader = (dto: TGetDisclosureNotesDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = disclosuresApi.useGetDisclosureNotesInfiniteQuery(dto, {
    skip: isOffline,
  });

  const { items: offlineData, totalCount, ...offlineQueryResult } = useLocalDisclosureNotesLoader(dto);

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
