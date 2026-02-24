export const DEFAULT_GRID_SIZES = { xs: 12, md: 6, lg: 4, xl: 3 } as const;

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGE_NUMBER = 0;

export const FRIDAY = 5;

export const TIME_PERIOD_TYPE = {
  THIS_WEEK: 'THIS_WEEK',
  THIS_MONTH: 'THIS_MONTH',
  THIS_YEAR: 'THIS_YEAR',
  CUSTOM: 'CUSTOM',
} as const;

export const SATISTICS_TYPE = {
  SUMMARY: 'SUMMARY',
  DETAILED: 'DETAILED',
} as const;

export const MAX_AUDIO_SIZE_BYTES = 10 * 1024 * 1024; // aka 10 mb

export const CHART_COLORS = {
  0: '#7EA8D9',
  1: '#5E9E83',
  2: '#BFA8E6',
  3: '#E8A09A',
  4: '#8A9199',
  5: '#90C3B3',
  6: '#D7CFEA',
  7: '#F6D8C2',
} as const;
