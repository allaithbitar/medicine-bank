import useIsOffline from '@/core/hooks/use-is-offline.hook';
import autocompleteApi, { type TAutocompleteDto } from '../api/autocomplete.api';
import { useLocalCitiesAutocompleteLoader } from './local-cities-autocomplete-loader.hook';

export const useCitiesAutocompleteLoader = (dto: TAutocompleteDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = autocompleteApi.useCitiesAutocompleteQuery(dto, {
    skip: isOffline,
  });

  const { data: offlineData, ...offlineQueryResult } = useLocalCitiesAutocompleteLoader(dto);

  return {
    data: isOffline ? offlineData : onlineData,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
