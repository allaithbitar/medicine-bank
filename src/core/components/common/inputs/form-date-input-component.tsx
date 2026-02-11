import { FormControl, FormHelperText } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { ComponentProps } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { isValid, parseISO } from 'date-fns';
import type { TSharedFormComponentProps, TSharedFormComponentValidation } from '@/core/types/input.type';
import RequiredLabel from './required-label.component';
import STRINGS from '@/core/constants/strings.constant';
import { arabicLocaleText, arSY } from '../ar-sy';

type Props = Omit<ComponentProps<typeof MobileDatePicker>, 'value' | 'onChange'> &
  TSharedFormComponentProps<string> &
  TSharedFormComponentValidation;

const FormDateInput = ({ label, helperText, value, onChange, required, ...props }: Props) => {
  return (
    <FormControl fullWidth>
      <RequiredLabel required={required}>{label ?? STRINGS.date}</RequiredLabel>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={arSY} localeText={arabicLocaleText}>
        <MobileDatePicker
          format={'yyyy-MM-dd'}
          value={!!value && isValid(new Date(value)) ? parseISO(value) : null}
          onChange={(val) => onChange?.(val?.toISOString() ?? '')}
          slots={{
            leftArrowIcon: ChevronRight,
            rightArrowIcon: ChevronLeft,
          }}
          {...props}
        />
      </LocalizationProvider>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormDateInput;
