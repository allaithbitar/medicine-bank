import { useState, type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import { getErrorMessage } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import useDebounce from '@/core/hooks/use-debounce.hook';
import { usePatientsAutocompleteLoader } from '@/features/autocomplete/hooks/patients-autocomplete-loader.hook';

type TBeneficiariesAutocomplete<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<{ id: string; name: string }, T>>
>;

function BeneficiariesAutocomplete<T extends boolean>({ ...props }: TBeneficiariesAutocomplete<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const {
    data: { items: employees = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = usePatientsAutocompleteLoader({
    query: debouncedQuery,
  });

  return (
    <FormAutocompleteInput
      inputValue={query}
      onInputChange={(_, val) => setQuery(val)}
      label={STRINGS.beneficiary}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={employees}
      errorText={error ? getErrorMessage(error) : props.errorText || ''}
      {...props}
    />
  );
}

export default BeneficiariesAutocomplete;
