import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";
import type { TPriorityDegree } from "../types/priority-degree.types";
import prioriryDegreesApi from "../api/priority-degrees.api";
import { Box, Stack } from "@mui/material";

type TPriorityDegreesAutocompleteProps = Partial<
  ComponentProps<typeof FormAutocompleteInput<TPriorityDegree, false>>
>;

const PriorityDegreesAutocomplete = ({
  ...props
}: TPriorityDegreesAutocompleteProps) => {
  const {
    data = [],
    isFetching,
    isLoading,
    error,
  } = prioriryDegreesApi.useGetPriorityDegreesQuery({});

  return (
    <FormAutocompleteInput
      label={STRINGS.priority_degree}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={data}
      errorText={error ? getErrorMessage(error) : props.errorText || ""}
      renderOption={(props, option) => (
        <Stack component="li" {...props} direction="row" gap={1}>
          {option.name}
          <Box
            sx={{
              width: 20,
              aspectRatio: "1/1",
              bgcolor: option.color,
              borderRadius: "100%",
            }}
          />
        </Stack>
      )}
      {...props}
    />
  );
};

export default PriorityDegreesAutocomplete;
