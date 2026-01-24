import { type ComponentProps } from 'react';
import FormAutocompleteInput from '@/core/components/common/inputs/form-autocomplete-input.component';
import { getErrorMessage } from '@/core/helpers/helpers';
import STRINGS from '@/core/constants/strings.constant';
import type { TPriorityDegree } from '../types/priority-degree.types';
import { Box, Stack } from '@mui/material';
import { usePriorityDegreesLoader } from '../hooks/priority-degrees-loader.hook';

type TPriorityDegreesAutocompleteProps<T extends boolean> = Partial<
  ComponentProps<typeof FormAutocompleteInput<TPriorityDegree, T>>
>;

function PriorityDegreesAutocomplete<T extends boolean>({ ...props }: TPriorityDegreesAutocompleteProps<T>) {
  const { data = [], isFetching, isLoading, error } = usePriorityDegreesLoader({});

  return (
    <FormAutocompleteInput
      label={STRINGS.priority_degree}
      loading={isFetching || isLoading}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      options={data}
      errorText={error ? getErrorMessage(error) : props.errorText || ''}
      renderOption={(props, option) => (
        <Stack component="li" {...props} direction="row" gap={1}>
          {option.name}
          <Box
            sx={{
              width: 20,
              aspectRatio: '1/1',
              bgcolor: option.color,
              borderRadius: '100%',
            }}
          />
        </Stack>
      )}
      {...props}
    />
  );
}

export default PriorityDegreesAutocomplete;
