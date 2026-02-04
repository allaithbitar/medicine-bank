import { FormControl, FormHelperText } from '@mui/material';
import { MobileDateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import type { ComponentProps } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

import { isValid, parseISO } from 'date-fns';
import type { TSharedFormComponentProps, TSharedFormComponentValidation } from '@/core/types/input.type';
import RequiredLabel from './required-label.component';
import STRINGS from '@/core/constants/strings.constant';
import { ar } from 'date-fns/locale';

type Props = Omit<ComponentProps<typeof MobileDateTimePicker>, 'value' | 'onChange'> &
  TSharedFormComponentProps<string> &
  TSharedFormComponentValidation;

const arabicLocaleText = {
  cancelButtonLabel: STRINGS.Calender_cancel,
  nextStepButtonLabel: STRINGS.calendar_next,
  clearButtonLabel: STRINGS.calendar_clear,
  okButtonLabel: STRINGS.calendar_ok,
  todayButtonLabel: STRINGS.calendar_today,
  openPickerLabel: STRINGS.calendar_open_picker,
  dateTimePickerToolbarTitle: STRINGS.calendar_select_date_time,
  clockLabelText: (view: any) =>
    view === 'hours'
      ? STRINGS.calendar_choose_hour
      : view === 'minutes'
        ? STRINGS.calendar_choose_min
        : STRINGS.calendar_choose_Time,
  dateTimePickerToolbarFormat: 'yyyy-MM-dd hh:mm aa',
};

const FormDateTimeInput = ({ label, helperText, value, required, onChange, errorText, ...props }: Props) => {
  return (
    <FormControl fullWidth>
      <RequiredLabel required={required}>{label ?? STRINGS.date_time}</RequiredLabel>
      <LocalizationProvider adapterLocale={ar} localeText={arabicLocaleText} dateAdapter={AdapterDateFns}>
        <MobileDateTimePicker
          format={'yyyy-MM-dd hh:mm aa'}
          value={!!value && isValid(new Date(value)) ? parseISO(value) : null}
          onChange={(val) => onChange?.(val?.toISOString() ?? '')}
          slots={{
            leftArrowIcon: ChevronRight,
            rightArrowIcon: ChevronLeft,
          }}
          {...props}
        />
      </LocalizationProvider>
      {(errorText || helperText) && <FormHelperText color="error">{errorText || helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormDateTimeInput;
