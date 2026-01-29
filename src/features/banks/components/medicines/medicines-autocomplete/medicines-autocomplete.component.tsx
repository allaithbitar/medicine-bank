import { useEffect, useState, type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import { getErrorMessage } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import { useMedicinesAutocompleteLoader } from '@/features/banks/hooks/medicines/medicines-autocomplete-loader.hook';
import useDebounce from '@/core/hooks/use-debounce.hook';
import type { TMedicinesAutocompleteItem } from '@/features/autocomplete/types/autcomplete.types';

type TMedicinesAutocompleteProps = Partial<
  ComponentProps<typeof FormAutocompleteInput<TMedicinesAutocompleteItem, false>>
> & {
  defaultValueId?: string;
};

const MedicinesAutocomplete = ({ defaultValueId, ...props }: TMedicinesAutocompleteProps) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const {
    data: { items: medicines = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = useMedicinesAutocompleteLoader({ query: debouncedQuery });

  useEffect(() => {
    if (defaultValueId) {
      const dVal = medicines.find((c) => c.id === defaultValueId);
      if (dVal) {
        props.onChange?.((props.multiple ? [dVal] : dVal) as any);
      }
    }
    if (medicines.length > 0 && !props?.value) {
      props.onChange?.((props.multiple ? [medicines[0]] : medicines[0]) as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medicines]);

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
};

export default MedicinesAutocomplete;
