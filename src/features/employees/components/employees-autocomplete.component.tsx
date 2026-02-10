import { useState, type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import { getErrorMessage } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import useDebounce from '@/core/hooks/use-debounce.hook';
import type { TAutocompleteItem } from '@/core/types/common.types';
import { useEmployeesAutocompleteLoader } from '@/features/autocomplete/hooks/employees-autocomplete-loader.hook';
import { EmployeeRole, type TEmployeeRole } from '../types/employee.types';

type TEmployeesAutocomplete<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TAutocompleteItem, T>>
> & {
  roles?: TEmployeeRole[];
};

function EmployeesAutocomplete<T extends boolean>({
  roles = [EmployeeRole.manager, EmployeeRole.supervisor, EmployeeRole.scout],
  ...props
}: TEmployeesAutocomplete<T>) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);
  const {
    data: { items: employees = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = useEmployeesAutocompleteLoader({
    role: roles,
    query: debouncedQuery,
  });

  return (
    <FormAutocompleteInput
      inputValue={query}
      onInputChange={(_, val) => setQuery(val)}
      label={STRINGS.employee}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={employees}
      errorText={error ? getErrorMessage(error) : props.errorText || ''}
      {...props}
    />
  );
}

export default EmployeesAutocomplete;
