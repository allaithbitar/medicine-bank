import useIsOffline from "@/core/hooks/use-is-offline.hook";
import disclosuresApi from "../api/disclosures.api";
import { type TGetDisclosuresDto } from "../types/disclosure.types";

// import { useLocalDisclosuresLoader } from "./local-disclosures-loader.hook";

export const useDisclosuresLoader = (dto: TGetDisclosuresDto = {}) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } =
    disclosuresApi.useGetDisclosuresInfiniteQuery(dto, {
      skip: isOffline,
    });

  // const {
  //   items: offlineData,
  //   totalCount,
  //   ...offlineQueryResult
  // } = useLocalDisclosuresLoader(dto);
  // console.log({ offlineData, onlineData });

  // return {
  //   items: isOffline
  //     ? offlineData
  //     : (onlineData?.pages.map((p) => p.items).flat() ?? []),
  //   totalCount: isOffline ? totalCount : (onlineData?.pages[0].totalCount ?? 0),
  //   hasNextPage: isOffline
  //     ? offlineQueryResult.hasNextPage
  //     : onlineQueryResult.hasNextPage,
  //   fetchNextPage: isOffline
  //     ? offlineQueryResult.fetchNextPage
  //     : onlineQueryResult.fetchNextPage,
  //   isFetchingNextPage: isOffline
  //     ? offlineQueryResult.isFetchingNextPage
  //     : onlineQueryResult.isFetchingNextPage,
  //   isFetching: isOffline
  //     ? offlineQueryResult.isFetching
  //     : onlineQueryResult.isFetching,
  //
  //   isLoading: isOffline
  //     ? offlineQueryResult.isLoading
  //     : onlineQueryResult.isLoading,
  //
  //   error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  // };
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
