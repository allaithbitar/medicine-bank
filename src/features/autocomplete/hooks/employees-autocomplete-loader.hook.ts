import useIsOffline from '@/core/hooks/use-is-offline.hook';
import autocompleteApi, { type TAutocompleteDto } from '../api/autocomplete.api';
import { useLocalEmployeesAutocompleteLoader } from './local-employees-autocomplete-loader.hook';

export const useEmployeesAutocompleteLoader = (dto: TAutocompleteDto & { role?: string[] }) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = autocompleteApi.useEmployeesAutocompleteQuery(dto, {
    skip: isOffline,
  });

  const { data: offlineData, ...offlineQueryResult } = useLocalEmployeesAutocompleteLoader(dto);

  return {
    data: isOffline ? offlineData : onlineData,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};