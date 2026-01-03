import { useState, type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import { getErrorMessage } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import autocompleteApi from '@/features/autocomplete/api/autocomplete.api';
import useDebounce from '@/core/hooks/use-debounce.hook';
import type { TAutocompleteItem } from '@/core/types/common.types';

type TAreasAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TAutocompleteItem, T>>
> & {
  cityId?: string;
};

function AreasAutocomplete<T extends boolean>({ cityId, ...props }: TAreasAutocompleteProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const {
    data: { items: areas = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = autocompleteApi.useAreasAutocompleteQuery({
    cityId: cityId,
    query: debouncedQuery,
  });

  return (
    <FormAutocompleteInput
      label={STRINGS.area}
      inputValue={query}
      onInputChange={(_, _query) => setQuery(_query)}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={areas}
      errorText={error ? getErrorMessage(error) : props.errorText || ''}
      {...props}
    />
  );
}

export default AreasAutocomplete;
