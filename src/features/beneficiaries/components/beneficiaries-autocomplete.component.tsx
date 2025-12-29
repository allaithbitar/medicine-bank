import { useState, type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";
import beneficiaryApi from "../api/beneficiary.api";
import useDebounce from "@/core/hooks/use-debounce.hook";

type TBeneficiariesAutocomplete<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<{ id: string; name: string }, T>>
>;

function BeneficiariesAutocomplete<T extends boolean>({
  ...props
}: TBeneficiariesAutocomplete<T>) {
  const [query, setQuery] = useState("");
  const debouncedSearchTerm = useDebounce<string>(query, 300);
  const {
    data: { items: employees = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = beneficiaryApi.useGetAutocompletePatientsQuery({
    query: debouncedSearchTerm,
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
      errorText={error ? getErrorMessage(error) : props.errorText || ""}
      {...props}
    />
  );
}

export default BeneficiariesAutocomplete;
