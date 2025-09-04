import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import workAreasApi from "@/features/banks/api/work-areas/work-areas.api";
import type { TArea } from "@/features/banks/types/work-areas.types";
import STRINGS from "@/core/constants/strings.constant";

type TAreasAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TArea, T>>
> & {
  cityId?: string;
};

function AreasAutocomplete<T extends boolean>({
  cityId,
  ...props
}: TAreasAutocompleteProps<T>) {
  const {
    data: { items: areas = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = workAreasApi.useGetWorkAreasQuery({ cityId: cityId });

  return (
    <FormAutocompleteInput
      label={STRINGS.area}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => option.name}
      getOptionKey={(option) => option.id}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={areas}
      errorText={error ? getErrorMessage(error) : props.errorText || ""}
      {...props}
    />
  );
}

export default AreasAutocomplete;
