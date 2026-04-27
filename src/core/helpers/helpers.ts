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
  if (!error) return STRINGS.something_went_wrong;

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

  return STRINGS.something_went_wrong;
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

export const getFileExtension = (filePath?: string | null, mimeType?: string) => {
  if (filePath) {
    const idx = filePath.lastIndexOf('.');
    if (idx !== -1 && idx < filePath.length - 1) return filePath.substring(idx);
  }
  if (mimeType && mimeType.includes('/')) return `.${mimeType.split('/')[1]}`;
  return '.webm';
};

export const sanitizeFilename = (raw: string) => {
  const cleaned = raw.replace(/[\\/:*?"<>|]/g, '').trim();
  return cleaned || 'audio';
};

export const buildAudioDownloadFilename = ({
  beneficiaryName,
  scoutName,
  filePath,
  mimeType,
}: {
  beneficiaryName?: string | null;
  scoutName?: string | null;
  filePath?: string | null;
  mimeType?: string;
}) => {
  const safeBeneficiary = beneficiaryName ? sanitizeFilename(beneficiaryName) : '';
  const safeScout = scoutName ? sanitizeFilename(scoutName) : '';
  const baseName = [safeBeneficiary, safeScout].filter(Boolean).join('-') || 'audio';
  const ext = getFileExtension(filePath, mimeType);
  return `${baseName}${ext}`;
};

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

export const formatDateFromNow = (date: Date | string) => {
  const WEEK_IN_MILLIS = 6.048e8,
    DAY_IN_MILLIS = 8.64e7,
    HOUR_IN_MILLIS = 3.6e6,
    MIN_IN_MILLIS = 6e4,
    SEC_IN_MILLIS = 1e3;

  const formatter = new Intl.RelativeTimeFormat('ar', { style: 'short' });
  const millis = typeof date === 'string' ? new Date(date).getTime() : date.getTime(),
    diff = millis - new Date().getTime();
  if (Math.abs(diff) > WEEK_IN_MILLIS) return formatter.format(Math.trunc(diff / WEEK_IN_MILLIS), 'week');
  else if (Math.abs(diff) > DAY_IN_MILLIS) return formatter.format(Math.trunc(diff / DAY_IN_MILLIS), 'day');
  else if (Math.abs(diff) > HOUR_IN_MILLIS)
    return formatter.format(Math.trunc((diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS), 'hour');
  else if (Math.abs(diff) > MIN_IN_MILLIS)
    return formatter.format(Math.trunc((diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS), 'minute');
  else return formatter.format(Math.trunc((diff % MIN_IN_MILLIS) / SEC_IN_MILLIS), 'second');
};
export const arabicToWesternDigits = (input: string): string => {
  return input.replace(/[\u0660-\u0669]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x0660 + 0x0030);
  });
};
export const westernToArabicDigits = (input: string): string => {
  return input.replace(/[0-9]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x0030 + 0x0660);
  });
};
