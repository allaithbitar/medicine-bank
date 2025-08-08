import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import workAreasApi from "@/features/banks/api/work-areas/work-areas.api";
import type { TArea } from "@/features/banks/types/work-areas.types";
import STRINGS from "@/core/constants/strings.constant";

type TAreasAutocompleteProps = Partial<
  ComponentProps<typeof FormAutocompleteInput<TArea, false>>
> & {
  cityId?: string;
};

const AreasAutocomplete = ({ cityId, ...props }: TAreasAutocompleteProps) => {
  const {
    data: { items: areas = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = workAreasApi.useGetWorkAreasQuery(
    { cityId: cityId as any },
    { skip: !cityId },
  );

  return (
    <FormAutocompleteInput
      label={STRINGS.area}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={areas}
      errorText={error ? getErrorMessage(error) : props.errorText || ""}
      disabled={props.disabled || !cityId}
      {...props}
    />
  );
};

export default AreasAutocomplete;
