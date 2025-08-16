import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import STRINGS from "@/core/constants/strings.constant";
import {
  DisclosureStatus,
  type TDisclosureStatus,
} from "../types/disclosure.types";

type TStatusAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<
    typeof FormAutocompleteInput<{ id: TDisclosureStatus; label: string }, T>
  >
>;

function DisclosureStatusAutocomplete<T extends boolean>({
  ...props
}: TStatusAutocompleteProps<T>) {
  const options = [
    {
      label: STRINGS.active,
      id: DisclosureStatus.active,
    },
    {
      label: STRINGS.finished,
      id: DisclosureStatus.finished,
    },
    {
      label: STRINGS.canceled,
      id: DisclosureStatus.canceled,
    },
  ];

  return (
    <FormAutocompleteInput
      label={STRINGS.status}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={options}
      errorText={props.errorText}
      {...props}
    />
  );
}

export default DisclosureStatusAutocomplete;
