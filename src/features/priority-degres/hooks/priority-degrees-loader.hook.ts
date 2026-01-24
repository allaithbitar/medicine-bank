import useIsOffline from '@/core/hooks/use-is-offline.hook';
import priorityDegreesApi from '../api/priority-degrees.api';
import { useLocalPriorityDegreesLoader } from './local-priority-degrees-loader.hook';
import type { TGetPriorityDegreesDto } from '../types/priority-degree.types';

export const usePriorityDegreesLoader = (dto: TGetPriorityDegreesDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = priorityDegreesApi.useGetPriorityDegreesQuery(dto, {
    skip: isOffline,
  });

  const { data: offlineData, ...offlineQueryResult } = useLocalPriorityDegreesLoader(dto);

  return {
    data: isOffline ? offlineData : onlineData,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
