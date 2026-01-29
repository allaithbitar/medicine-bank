import useIsOffline from '@/core/hooks/use-is-offline.hook';
import autocompleteApi, { type TAutocompleteDto } from '@/features/autocomplete/api/autocomplete.api';
import { useLocalMedicinesAutocompleteLoader } from './local-medicines-autocomplete-loader.hook';
import type { TMedicine } from '../../types/medicines.types';

export const useMedicinesAutocompleteLoader = (dto: TAutocompleteDto<TMedicine>) => {
  const isOffline = useIsOffline();

  const { data: onlineData, ...onlineQueryResult } = autocompleteApi.useMedicinesAutocompleteQuery(dto, {
    skip: isOffline,
  });

  const { data: offlineData, ...offlineQueryResult } = useLocalMedicinesAutocompleteLoader(dto);

  return {
    data: isOffline ? offlineData : onlineData,
    isFetching: isOffline ? offlineQueryResult.isFetching : onlineQueryResult.isFetching,
    isLoading: isOffline ? offlineQueryResult.isLoading : onlineQueryResult.isLoading,
    error: isOffline ? offlineQueryResult.error : onlineQueryResult.error,
  };
};
