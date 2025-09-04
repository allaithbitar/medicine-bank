import citiesApi from "@/features/banks/api/cities-api/cities.api";
import type { TCity } from "@/features/banks/types/city.types";
import { useEffect, type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";

type TCitiesAutocompleteProps = Partial<
  ComponentProps<typeof FormAutocompleteInput<TCity, false>>
> & {
  defaultValueId?: string;
};

const CitiesAutocomplete = ({
  defaultValueId,
  ...props
}: TCitiesAutocompleteProps) => {
  const {
    data: { items: cities = [] } = { items: [] },
    isFetching,
    isLoading,
    error,
  } = citiesApi.useGetCitiesQuery({ name: "" });

  useEffect(() => {
    if (defaultValueId) {
      const dVal = cities.find((c) => c.id === defaultValueId);
      if (dVal) {
        props.onChange?.(dVal);
      }
    }
    if (cities.length > 0 && !props?.value) {
      props.onChange?.(cities[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  return (
    <FormAutocompleteInput
      label={STRINGS.city}
      loading={isFetching || isLoading}
      getOptionKey={(option) => option.id}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={cities}
      errorText={error ? getErrorMessage(error) : props.errorText || ""}
      {...props}
    />
  );
};

export default CitiesAutocomplete;
