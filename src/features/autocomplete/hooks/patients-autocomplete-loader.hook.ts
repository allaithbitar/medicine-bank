import useIsOffline from '@/core/hooks/use-is-offline.hook';
import autocompleteApi, { type TAutocompleteDto } from '../api/autocomplete.api';
import { useLocalPatientsAutocompleteLoader } from './local-patients-autocomplete-loader.hook';

export const usePatientsAutocompleteLoader = (dto: TAutocompleteDto) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = autocompleteApi.usePatientsAutocompleteQuery(dto, {
    skip: isOffline,
  });

  const { data: offlineData, ...offlineQueryResult } = useLocalPatientsAutocompleteLoader(dto);

  return {
    data: isOffline ? offlineData : onlineData,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};