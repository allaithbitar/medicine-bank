import { useEffect, useState, useRef, type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import { getErrorMessage } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import useDebounce from '@/core/hooks/use-debounce.hook';
import type { TAutocompleteItem } from '@/core/types/common.types';
import useAreasAutocompleteLoader from '@/features/autocomplete/hooks/areas-autocomplete-loader.hook';

type TAreasAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TAutocompleteItem, T>>
> & {
  cityId?: string;
  defaultValueId?: string;
  autoSelectFirst?: boolean;
};

function AreasAutocomplete<T extends boolean>({
  cityId,
  defaultValueId,
  autoSelectFirst = true,
  ...props
}: TAreasAutocompleteProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const hasSetDefaultRef = useRef(false);
  const hasAutoSelectedRef = useRef(false);

  const {
    data: { items: areas = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = useAreasAutocompleteLoader({
    cityId: cityId,
    query: debouncedQuery,
  });

  useEffect(() => {
    hasSetDefaultRef.current = false;
  }, [defaultValueId]);

  useEffect(() => {
    if (defaultValueId && !hasSetDefaultRef.current && areas.length > 0) {
      const dVal = areas.find((a) => a.id === defaultValueId);
      if (dVal) {
        props.onChange?.((props.multiple ? [dVal] : dVal) as any);
        hasSetDefaultRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, defaultValueId]);

  useEffect(() => {
    if (autoSelectFirst && !props.value && areas.length > 0 && !hasAutoSelectedRef.current && !defaultValueId) {
      props.onChange?.((props.multiple ? [areas[0]] : areas[0]) as any);
      hasAutoSelectedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, props.value, autoSelectFirst, defaultValueId]);

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
