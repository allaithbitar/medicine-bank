import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { ApiErrorResponse } from '../types/common.types';
import STRINGS from '../constants/strings.constant';
import { add, parseISO } from 'date-fns';

export const isFetchBaseQueryError = (obj: any): obj is FetchBaseQueryError => {
  return !!obj['status'];
};

export const isApiError = (obj: any): obj is ApiErrorResponse => {
  return obj && 'errorMessage' in obj;
};

export const getErrorMessage = (
  error: FetchBaseQueryError | SerializedError | Error | ApiErrorResponse | string | object
) => {
  if (!error) return 'something_went_wrong';
  if (typeof error === 'string') {
    return error;
  }
  if (error instanceof Error) {
    return error.message;
  }

  if (isFetchBaseQueryError(error)) {
    error = error.data as Error;
  }

  if (isApiError(error)) {
    return error.errorMessage.ar;
  }
  return 'something_went_wrong';
};

export const formatDateTime = (date: string | Date, withTime = true, overrideOptions?: Intl.DateTimeFormatOptions) =>
  Intl.DateTimeFormat('ar-SY', {
    ...(!overrideOptions && {
      dateStyle: 'full',
      ...(withTime && {
        timeStyle: 'short',
      }),
    }),
    ...overrideOptions,
  }).format(typeof date === 'string' ? new Date(date) : date);

export function isNullOrUndefined<T>(obj: T | undefined | null): obj is null | undefined {
  return obj === null || typeof obj === 'undefined';
}

export const formatDateToISO = (d?: Date | null) => {
  if (!d) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const getStringsLabel = ({ key, val }: { key: string; val: string }) => {
  const labelKey = `${key}_${val}` as keyof typeof STRINGS;
  return STRINGS[labelKey] ?? val;
};

export const addTimeZoneOffestToIsoDate = (isoDate: string) => {
  const alreadyHaveTimezoneOffset = !isoDate.includes('000Z');
  const timezoneOffset = new Date().getTimezoneOffset();
  return add(parseISO(isoDate), {
    hours: alreadyHaveTimezoneOffset ? 0 : -timezoneOffset / 60,
  });
};
export const ACTION_COLOR_MAP: Record<string, string> = {
  INSERT: '#43a047',
  UPDATE: '#fb8c00',
  DELETE: '#e53935',
  DEFAULT: '#90a4ae',
};

export const getVoiceSrc = ({ baseUrl, filePath }: { baseUrl: string; filePath: string }) =>
  `${baseUrl}/public/audio/${filePath}`;

export const sanitizePhoneForTel = (raw: string) => raw.replace(/[^\d+]/g, '');

export const downloadAnyFile = (file: File) => {
  const url = window.URL.createObjectURL(file);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
};
