import { FormControl, FormHelperText } from '@mui/material';
import { MobileDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { ComponentProps } from 'react';

import { isValid, parseISO } from 'date-fns';
import type { TSharedFormComponentProps, TSharedFormComponentValidation } from '@/core/types/input.type';
import RequiredLabel from './required-label.component';

type Props = Omit<ComponentProps<typeof MobileDateTimePicker>, 'value' | 'onChange'> &
  TSharedFormComponentProps<string> &
  TSharedFormComponentValidation;

const FormDateTimeInput = ({ label, helperText, value, required, onChange, errorText, ...props }: Props) => {
  return (
    <FormControl fullWidth>
      <RequiredLabel required={required}>{label ?? 'Date Time'}</RequiredLabel>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDateTimePicker
          format={'yyyy-MM-dd hh:mm aa'}
          value={!!value && isValid(new Date(value)) ? parseISO(value) : null}
          onChange={(val) => onChange?.(val?.toISOString() ?? '')}
          {...props}
        />
      </LocalizationProvider>
      {(errorText || helperText) && <FormHelperText color="error">{errorText || helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormDateTimeInput;
