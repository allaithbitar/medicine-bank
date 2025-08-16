import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import STRINGS from "@/core/constants/strings.constant";
import {
  DisclosureVisitResult,
  type TDisclosureVisitResult,
} from "../types/disclosure.types";

type TResultAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<
    typeof FormAutocompleteInput<
      { id: TDisclosureVisitResult; label: string },
      T
    >
  >
>;

function DisclosureVisitResultAutocomplete<T extends boolean>({
  ...props
}: TResultAutocompleteProps<T>) {
  const options = [
    {
      label: STRINGS.not_completed,
      id: DisclosureVisitResult.not_completed,
    },
    {
      label: STRINGS.cant_be_completed,
      id: DisclosureVisitResult.cant_be_completed,
    },
    {
      label: STRINGS.completed,
      id: DisclosureVisitResult.completed,
    },
  ];

  return (
    <FormAutocompleteInput
      label={STRINGS.visit_result}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={options}
      errorText={props.errorText}
      {...props}
    />
  );
}

export default DisclosureVisitResultAutocomplete;
