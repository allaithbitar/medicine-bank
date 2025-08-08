import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import STRINGS from "@/core/constants/strings.constant";

import type { TEmployeeRole } from "@/features/accounts-forms/types/employee.types";
import { EmployeeStatus } from "../types/employee.types";

type TEmployeeRoleAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<
    typeof FormAutocompleteInput<{ id: TEmployeeRole; label: string }, T>
  >
>;

function EmployeeRoleAutocomplete<T extends boolean>({
  ...props
}: TEmployeeRoleAutocompleteProps<T>) {
  const options = [
    {
      label: STRINGS.manager,
      id: EmployeeStatus.manager,
    },
    {
      label: STRINGS.supervisor,
      id: EmployeeStatus.supervisor,
    },
    {
      label: STRINGS.scout,
      id: EmployeeStatus.scout,
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
