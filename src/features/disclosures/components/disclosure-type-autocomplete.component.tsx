import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import STRINGS from "@/core/constants/strings.constant";
import {
  DisclosureType,
  type TDisclosureType,
} from "../types/disclosure.types";

type TStatusAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<
    typeof FormAutocompleteInput<{ id: TDisclosureType; label: string }, T>
  >
>;

function DisclosureTypeAutocomplete<T extends boolean>({
  ...props
}: TStatusAutocompleteProps<T>) {
  const options = [
    {
      label: STRINGS.new,
      id: DisclosureType.new,
    },
    {
      label: STRINGS.help,
      id: DisclosureType.help,
    },
    {
      label: STRINGS.return,
      id: DisclosureType.return,
    },
  ];

  return (
    <FormAutocompleteInput
      label={STRINGS.type}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={options}
      errorText={props.errorText}
      {...props}
    />
  );
}

export default DisclosureTypeAutocomplete;
