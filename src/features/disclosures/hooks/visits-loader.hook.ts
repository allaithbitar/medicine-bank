import useIsOffline from "@/core/hooks/use-is-offline.hook";
import disclosuresApi from "../api/disclosures.api";
import { type TGetDisclosureVisitsDto } from "../types/disclosure.types";

import { useLocalVisitsLoader } from "./local-visits-loader.hook";

export const useVisitsLoader = (dto: TGetDisclosureVisitsDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } =
    disclosuresApi.useGetDisclosureVisitsInfiniteQuery(dto, {
      skip: isOffline,
    });

  const {
    items: offlineData,
    totalCount,
    ...offlineQueryResult
  } = useLocalVisitsLoader(dto);

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
