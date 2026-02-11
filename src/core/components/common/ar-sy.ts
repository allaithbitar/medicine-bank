import STRINGS from '@/core/constants/strings.constant';
import { ar } from 'date-fns/locale/ar';

const monthNames = {
  wide: [
    'كانون (2)',
    'شباط',
    'آذار',
    'نيسان',
    'أيار',
    'حزيران',
    'تموز',
    'آب',
    'أيلول',
    'تشرين (1)',
    'تشرين (2)',
    'كانون (1)',
  ],
};

export const arSY = {
  ...ar,
  localize: {
    ...ar.localize,
    month: (index: number, options?: { width?: string }) => {
      const width = options?.width || 'wide';
      const arr = monthNames[width as keyof typeof monthNames] ?? monthNames.wide;
      return arr[index];
    },
  },
};

export const arabicLocaleText = {
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
