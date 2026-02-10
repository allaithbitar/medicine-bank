import { type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import STRINGS from '@/core/constants/strings.constant';

import { EmployeeRole, type TEmployeeRole } from '../types/employee.types';

type TEmployeeRoleAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<{ id: TEmployeeRole; label: string }, T>>
>;

function EmployeeRoleAutocomplete<T extends boolean>({ ...props }: TEmployeeRoleAutocompleteProps<T>) {
  const options = [
    {
      label: STRINGS.manager,
      id: EmployeeRole.manager,
    },
    {
      label: STRINGS.supervisor,
      id: EmployeeRole.supervisor,
    },
    {
      label: STRINGS.scout,
      id: EmployeeRole.scout,
    },
    {
      label: STRINGS.accountant,
      id: EmployeeRole.accountant,
    },
  ];

  return (
    <FormAutocompleteInput
      label={STRINGS.role}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={options}
      errorText={props.errorText}
      {...props}
    />
  );
}

export default EmployeeRoleAutocomplete;
