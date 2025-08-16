import { type ComponentProps } from "react";
import FormAutocompleteInput from "@/core/components/common/inputs/form-autocomplete-input.component";
import { getErrorMessage } from "@/core/helpers/helpers";
import STRINGS from "@/core/constants/strings.constant";
import { Stack, Typography } from "@mui/material";
import ratingsApi from "../api/ratings.api";
import type { TRating } from "../types/rating.types";

type TPriorityDegreesAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TRating, T>>
>;

function RatingsAutocomplete<T extends boolean>({
  ...props
}: TPriorityDegreesAutocompleteProps<T>) {
  const {
    data = [],
    isFetching,
    isLoading,
    error,
  } = ratingsApi.useGetRatingsQuery({});

  return (
    <FormAutocompleteInput
      label={STRINGS.rating}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => `${option.name} - ( ${option.code} )`}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={data}
      errorText={error ? getErrorMessage(error) : props.errorText || ""}
      renderOption={(props, option) => {
        console.log({ props });

        return (
          <Stack
            component="li"
            {...props}
            direction="row"
            gap={1}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              textAlign: "start",
              alignItems: "start !important",
              color: "unset",
            }}
          >
            <Typography variant="body1">
              {option.name} - ( {option.code} )
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {option.description}
            </Typography>
          </Stack>
        );
      }}
      {...props}
    />
  );
}

export default RatingsAutocomplete;
