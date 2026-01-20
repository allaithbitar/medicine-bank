import useIsOffline from '@/core/hooks/use-is-offline.hook';
import autocompleteApi, { type TAutocompleteDto } from '../api/autocomplete.api';
import { useLocalAreasAutocompleteLoader } from './local-areas-autocomplete-loader.hook';

export const useAreasAutocompleteLoader = (dto: TAutocompleteDto & { cityId?: string }) => {
  const isOffline = useIsOffline();

  const { data: offlineData, ...offlineQueryResult } = useLocalAreasAutocompleteLoader(dto);

  return autocompleteApi.useAreasAutocompleteQuery(dto, {
    skip: isOffline,
  });

  return {
    data: isOffline ? offlineData : onlineData,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};

