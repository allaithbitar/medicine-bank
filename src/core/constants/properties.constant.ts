export const DEFAULT_GRID_SIZES = { xs: 12, md: 6, lg: 4, xl: 3 } as const;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE_NUMBER = 0;

export const FRIDAY = 5;

export const TIME_PERIOD_TYPE = {
  THIS_WEEK: "THIS_WEEK",
  THIS_MONTH: "THIS_MONTH",
  THIS_YEAR: "THIS_YEAR",
  CUSTOM: "CUSTOM",
} as const;

export const SATISTICS_TYPE = {
  SUMMARY: "SUMMARY",
  DETAILED: "DETAILED",
} as const;

export const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024; // aka 10 mb
