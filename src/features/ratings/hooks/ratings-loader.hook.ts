import useIsOffline from '@/core/hooks/use-is-offline.hook';
import ratingsApi from '../api/ratings.api';
import { useLocalRatingsLoader } from './local-ratings-loader.hook';
import type { TGetRatingsDto } from '../types/rating.types';

export const useRatingsLoader = (dto?: TGetRatingsDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = ratingsApi.useGetRatingsQuery(dto, {
    skip: isOffline,
  });

  const { data: offlineData, ...offlineQueryResult } = useLocalRatingsLoader(dto);

  return {
    data: isOffline ? offlineData : onlineData,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
