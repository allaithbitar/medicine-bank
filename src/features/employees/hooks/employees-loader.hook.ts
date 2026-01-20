import useIsOffline from '@/core/hooks/use-is-offline.hook';
import employeesApi from '../api/employees.api';
import type { TSearchEmployeesDto } from '../types/employee.types';
import { useLocalEmployeesLoader } from './local-employees-loader.component';

// import { useLocalDisclosuresLoader } from "./local-disclosures-loader.hook";

export const useEmployeesLoader = (dto: TSearchEmployeesDto = {}) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = employeesApi.useGetEmployeesInfiniteQuery(dto, {
    skip: isOffline,
  });

  const { items: offlineData, totalCount, ...offlineQueryResult } = useLocalEmployeesLoader(dto);

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
