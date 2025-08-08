import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";
import type { TEmployee } from "../types/employee.types";
import employeesApi from "../api/employees.api";

type TEmployeesAutocomplete<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TEmployee, T>>
>;

function EmployeesAutocomplete<T extends boolean>({
  ...props
}: TEmployeesAutocomplete<T>) {
  const {
    data: { items: employees = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = employeesApi.useGetEmployeesQuery({});

  return (
    <FormAutocompleteInput
      label={STRINGS.employee}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={employees}
      errorText={error ? getErrorMessage(error) : props.errorText || ""}
      {...props}
    />
  );
}

export default EmployeesAutocomplete;
