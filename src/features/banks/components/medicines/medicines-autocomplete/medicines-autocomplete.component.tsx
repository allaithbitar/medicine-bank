import { useEffect, useState, useRef, type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import { getErrorMessage } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import { useMedicinesAutocompleteLoader } from '@/features/banks/hooks/medicines/medicines-autocomplete-loader.hook';
import useDebounce from '@/core/hooks/use-debounce.hook';
import type { TMedicinesAutocompleteItem } from '@/features/autocomplete/types/autcomplete.types';

type TMedicinesAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TMedicinesAutocompleteItem, T>>
> & {
  defaultValueId?: string;
  autoSelectFirst?: boolean;
};

function MedicinesAutocomplete<T extends boolean>({
  defaultValueId,
  autoSelectFirst = true,
  ...props
}: TMedicinesAutocompleteProps<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const hasSetDefaultRef = useRef(false);
  const hasAutoSelectedRef = useRef(false);

  const {
    data: { items: medicines = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = useMedicinesAutocompleteLoader({ query: debouncedQuery });

  useEffect(() => {
    hasSetDefaultRef.current = false;
  }, [defaultValueId]);

  useEffect(() => {
    if (defaultValueId && !hasSetDefaultRef.current && medicines.length > 0) {
      const dVal = medicines.find((m) => m.id === defaultValueId);
      if (dVal) {
        props.onChange?.((props.multiple ? [dVal] : dVal) as any);
        hasSetDefaultRef.current = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines, defaultValueId]);

  useEffect(() => {
    if (autoSelectFirst && !props.value && medicines.length > 0 && !hasAutoSelectedRef.current && !defaultValueId) {
      props.onChange?.((props.multiple ? [medicines[0]] : medicines[0]) as any);
      hasAutoSelectedRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines, props.value, autoSelectFirst, defaultValueId]);

  return (
    <FormAutocompleteInput
      label={STRINGS.medicines}
      inputValue={query}
      onInputChange={(_, _query) => setQuery(_query)}
      loading={isFetching || isLoading}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={medicines}
      errorText={error ? getErrorMessage(error) : props.errorText || ''}
      {...props}
    />
  );
}

export default MedicinesAutocomplete;
