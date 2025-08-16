import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";
import beneficiaryApi from "../api/beneficiary.api";
import type { TBenefieciary } from "../types/beneficiary.types";

type TBeneficiariesAutocomplete<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TBenefieciary, T>>
>;

function BeneficiariesAutocomplete<T extends boolean>({
  ...props
}: TBeneficiariesAutocomplete<T>) {
  const {
    data: { items: employees = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = beneficiaryApi.useGetBeneficiariesQuery({});

  return (
    <FormAutocompleteInput
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
