import { useEffect, useState, useRef, type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import { getErrorMessage } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import useDebounce from '@/core/hooks/use-debounce.hook';
import type { TAutocompleteItem } from '@/core/types/common.types';
import { useCitiesAutocompleteLoader } from '@/features/autocomplete/hooks/cities-autocomplete-loader.hook';

type TCitiesAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TAutocompleteItem, T>>
> & {
  defaultValueId?: string;
  autoSelectFirst?: boolean;
};

function CitiesAutocomplete<T extends boolean>({
  defaultValueId,
  autoSelectFirst = true,
  ...props
}: TCitiesAutocompleteProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const hasSetDefaultRef = useRef(false);
  const hasAutoSelectedRef = useRef(false);

  const {
    data: { items: cities = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = useCitiesAutocompleteLoader({ query: debouncedQuery });

  useEffect(() => {
    hasSetDefaultRef.current = false;
  }, [defaultValueId]);

  useEffect(() => {
    if (defaultValueId && !hasSetDefaultRef.current && cities.length > 0) {
      const dVal = cities.find((c) => c.id === defaultValueId);
      if (dVal) {
        props.onChange?.((props.multiple ? [dVal] : dVal) as any);
        hasSetDefaultRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities, defaultValueId]);

  useEffect(() => {
    if (autoSelectFirst && !props.value && cities.length > 0 && !hasAutoSelectedRef.current && !defaultValueId) {
      props.onChange?.((props.multiple ? [cities[0]] : cities[0]) as any);
      hasAutoSelectedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities, props.value, autoSelectFirst, defaultValueId]);

  return (
    <FormAutocompleteInput
      label={STRINGS.city}
      inputValue={query}
      onInputChange={(_, _query) => setQuery(_query)}
      loading={isFetching || isLoading}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={cities}
      errorText={error ? getErrorMessage(error) : props.errorText || ''}
      {...props}
    />
  );
}

export default CitiesAutocomplete;
