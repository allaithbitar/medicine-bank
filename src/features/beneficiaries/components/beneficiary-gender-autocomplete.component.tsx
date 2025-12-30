import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import STRINGS from "@/core/constants/strings.constant";
import { Genders, type TGender } from "../types/beneficiary.types";

type TStatusAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<
    typeof FormAutocompleteInput<{ id: TGender; label: string }, T>
  >
>;

function BeneficiaryGenderAutocomplete<T extends boolean>({
  ...props
}: TStatusAutocompleteProps<T>) {
  const options = [
    {
      label: STRINGS.male,
      id: Genders.male,
    },
    {
      label: STRINGS.female,
      id: Genders.female,
    },
  ];

  return (
    <FormAutocompleteInput
      label={STRINGS.gender}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={options}
      errorText={props.errorText}
      {...props}
    />
  );
}

export default BeneficiaryGenderAutocomplete;
